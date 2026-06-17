import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import Perfil from '../pages/perfil'; 

// Simulamos el entorno de datos para que el useEffect cargue
beforeAll(() => {
  Storage.prototype.getItem = jest.fn((key) => {
    if (key === 'idUsuario') return '1';
    if (key === 'token') return 'token-falso-ok';
    return null;
  });
  Storage.prototype.setItem = jest.fn();
  
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ 
        nombre: 'Usuario', 
        apellido: 'Prueba', 
        correo: 'prueba@casonajms.cl', 
        telefono: '987654321' 
      }),
    })
  );
});

describe('CP-005: Pruebas de Modificación de Perfil - Frontend', () => {
  
  const renderizar = () => {
    render(
      <BrowserRouter>
        <Perfil />
      </BrowserRouter>
    );
  };

  test('1. Debe renderizar la cabecera del perfil correctamente', async () => {
    renderizar();
    await waitFor(() => {
      const titulo = screen.getByRole('heading', { name: /mi perfil/i });
      expect(titulo).toBeInTheDocument();
    });
  });

  test('2. Debe permitir actualizar los campos de datos personales', async () => {
    renderizar();

    // Esperamos a que el formulario se monte y los inputs estén disponibles en el DOM virtual
    await waitFor(() => {
      const inputNombre = document.querySelector('input[name="nombre"]');
      expect(inputNombre).toBeInTheDocument();
    });

    // Capturamos los elementos usando selectores directos por atributo 'name'
    const contenedorNombre = document.querySelector('input[name="nombre"]');
    const contenedorTelefono = document.querySelector('input[name="telefono"]');

    // Simulamos la edicion del usuario
    fireEvent.change(contenedorNombre, { target: { value: 'Marco Actualizado' } });
    fireEvent.change(contenedorTelefono, { target: { value: '+56911223344' } });
    
    // Certificamos el cambio de estado en las cajas de texto de React
    expect(contenedorNombre.value).toBe('Marco Actualizado');
    expect(contenedorTelefono.value).toBe('+56911223344');
  });

  test('3. Debe existir el botón para enviar la actualización', async () => {
    renderizar();
    await waitFor(() => {
      const botonGuardar = screen.getByRole('button', { name: /guardar cambios/i });
      expect(botonGuardar).toBeInTheDocument();
    });
  });
});