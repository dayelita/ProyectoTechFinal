import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import ServiciosAdmin from '../components/ServiciosAdmin'; // Ajusta la ruta si tu componente está en otra carpeta

// Simula la respuesta de Spring Boot con datos del catálogo
beforeAll(() => {
  Storage.prototype.getItem = jest.fn(() => 'token-falso-admin');
  
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve([
        {
          id: 101,
          categoria: 'Espacios',
          nombre: 'Salón VIP Casona',
          descripcion: 'Salón de pruebas para Jest',
          capacidad: '100',
          precio: '$200.000',
          imagen: '',
          badge: 'Nuevo',
          badgeColor: '#D4AF37',
          detalles: ['WiFi', 'Mesas']
        }
      ]),
    })
  );
});

describe('CP-003: Pruebas de Gestión de Catálogo y Servicios - Frontend', () => {

  const renderizar = () => {
    render(
      <BrowserRouter>
        <ServiciosAdmin />
      </BrowserRouter>
    );
  };

  test('1. Debe renderizar el catálogo con los datos obtenidos del servidor', async () => {
    renderizar();
    
    // Esperamos a que el spinner desaparezca y cargue la tarjeta simulada
    await waitFor(() => {
      const tituloServicio = screen.getByText('Salón VIP Casona');
      expect(tituloServicio).toBeInTheDocument();
    });

    // Validamos que el precio se muestre en el badge
    expect(screen.getByText(/💰 \$200.000/i)).toBeInTheDocument();
  });

  test('2. Debe abrir el modal en modo "Crear Nueva Tarjeta"', async () => {
    renderizar();
    
    // Buscamos el boton principal de creación
    let botonCrear;
    await waitFor(() => {
      botonCrear = screen.getByRole('button', { name: /crear nueva tarjeta/i });
      expect(botonCrear).toBeInTheDocument();
    });

    // Hacemos clic para abrir el modal
    fireEvent.click(botonCrear);

    // Validamos que la cabecera del modal cambie al modo creación
    await waitFor(() => {
      const tituloModal = screen.getByRole('heading', { name: /📝 crear nueva tarjeta/i });
      expect(tituloModal).toBeInTheDocument();
    });
  });

  test('3. Debe abrir el modal en modo "Editar" al seleccionar un servicio existente', async () => {
    renderizar();

    // Esperamos que la tarjeta cargue y buscamos su botón de editar
    let botonEditar;
    await waitFor(() => {
      botonEditar = screen.getByRole('button', { name: /✏️ editar/i });
      expect(botonEditar).toBeInTheDocument();
    });

    // Hacemos clic en el boton de la tarjeta
    fireEvent.click(botonEditar);

    // Validamos que la cabecera del modal cambie al modo edición
    await waitFor(() => {
      const tituloModal = screen.getByRole('heading', { name: /✏️ editar tarjeta/i });
      expect(tituloModal).toBeInTheDocument();
    });
  });
});