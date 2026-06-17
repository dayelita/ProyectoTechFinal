import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import Testimonios from '../components/Testimonios'; 

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), 
    removeListener: jest.fn(), 
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

//  Simula el Fetch para traer y enviar testimonios
beforeAll(() => {
  Storage.prototype.getItem = jest.fn();
  Storage.prototype.setItem = jest.fn();

  global.fetch = jest.fn((url) => {
    // Si es para CREAR simula que el backend dice "OK"
    if (url.includes('/api/testimonios/crear')) {
      return Promise.resolve({ ok: true });
    }
    // Si es para LEER manda un testimonio de prueba
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve([
        { 
          estrellas: 5, 
          comentario: "Excelente servicio de prueba", 
          nombre: "Juan Perez", 
          rol: "Cliente Casona JMS" 
        }
      ]),
    });
  });
});

describe('CP-00X: Pruebas de Interacción - Componente Testimonios', () => {

  const renderizar = () => {
    render(
      <BrowserRouter>
        <Testimonios />
      </BrowserRouter>
    );
  };

  test('1. Debe cargar y renderizar los testimonios desde el servidor', async () => {
    renderizar();
    
    // Esperamos a que la peticion fetch dibuje el comentario
    await waitFor(() => {
      expect(screen.getByText(/"Excelente servicio de prueba"/i)).toBeInTheDocument();
      expect(screen.getByText(/Juan Perez/i)).toBeInTheDocument();
    });
  });

  test('2. Debe bloquear la creación de reseñas y mostrar alerta si el usuario NO está logueado', async () => {
    // Forzamos localStorage vacio (sin idUsuario)
    Storage.prototype.getItem = jest.fn(() => null);
    
    renderizar();
    
    const btnEscribir = screen.getByRole('button', { name: /escribir testimonio/i });
    fireEvent.click(btnEscribir);
    
    // Validamos que SweetAlert advierta del inicio de sesion
    await waitFor(() => {
      expect(screen.getByText(/Para dejar una reseña, por favor inicia sesión/i)).toBeInTheDocument();
      const modal = document.querySelector('.modal-t.open');
      expect(modal).toBeNull();
    });
  });

  test('3. Debe abrir el modal y permitir enviar la reseña si el usuario SÍ está logueado', async () => {
    // Forzamos localStorage CON sesión iniciada
    Storage.prototype.getItem = jest.fn((key) => {
      if (key === 'idUsuario') return '10';
      if (key === 'nombreUsuario') return 'Marco';
      if (key === 'apellidoUsuario') return 'Admin';
      return null;
    });

    renderizar();

    // Abre el modal
    const btnEscribir = screen.getByRole('button', { name: /escribir testimonio/i });
    fireEvent.click(btnEscribir);

    // Valida que el modal se abrio identificando al usuario
    await waitFor(() => {
      expect(screen.getByText(/cuéntanos tu experiencia/i)).toBeInTheDocument();
      expect(screen.getByText(/Marco Admin/i)).toBeInTheDocument();
    });

    // Simula que da 5 estrellas
    const contenedorEstrellas = document.querySelector('.star-rating');
    const estrellas = contenedorEstrellas.querySelectorAll('span');
    fireEvent.click(estrellas[4]); 

    // Simula que escribe el comentario
    const cajaTexto = screen.getByPlaceholderText(/¿Qué fue lo que más te gustó/i);
    fireEvent.change(cajaTexto, { target: { value: 'Todo estuvo maravilloso' } });

    // Envia el formulario
    const btnPublicar = screen.getByRole('button', { name: /publicar reseña/i });
    fireEvent.click(btnPublicar);

    // Valida con un mensaje de exito oficial de tu componente
    await waitFor(() => {
      expect(screen.getByText(/¡Gracias por tu reseña!/i)).toBeInTheDocument();
    });
  });
});