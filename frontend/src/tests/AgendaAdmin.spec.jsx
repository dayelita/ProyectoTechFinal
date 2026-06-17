import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import AgendaAdmin from '../components/AgendaAdmin'; 

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

// Se Aisla el calendario dejando solo las funciones y dejando aparte el css 
jest.mock('react-big-calendar/lib/css/react-big-calendar.css', () => ({}));
jest.mock('react-big-calendar', () => ({
  Calendar: () => <div data-testid="calendario-mock">Calendario Renderizado</div>,
  dayjsLocalizer: jest.fn()
}));

// Se simula una reserva pendiente de spring boot 
beforeAll(() => {
  Storage.prototype.getItem = jest.fn(() => 'token-falso-admin');
  
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve([
        {
          id: 50,
          estado: 'PENDIENTE',
          title: 'Reserva de Prueba',
          fechaHoraInicio: '2026-12-15T10:00:00',
          fechaHoraFin: '2026-12-15T14:00:00',
          usuario: { nombre: 'María', apellido: 'González', correo: 'maria@casonajms.cl' }
        }
      ]),
    })
  );
});

describe('CP-00X: Pruebas de Gestión de Agenda y Reservas - Frontend', () => {

  const renderizar = () => {
    render(
      <BrowserRouter>
        <AgendaAdmin />
      </BrowserRouter>
    );
  };

  test('1. Debe renderizar la cabecera principal y la sección del calendario', async () => {
    renderizar();
    
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /gestión de reservas/i })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: /vista de ocupación/i })).toBeInTheDocument();
      expect(screen.getByTestId('calendario-mock')).toBeInTheDocument();
    });
  });

  test('2. Debe procesar el JSON y mostrar las solicitudes pendientes en la tabla', async () => {
    renderizar();
    
    await waitFor(() => {
      expect(screen.getByText(/solicitudes por procesar/i)).toBeInTheDocument();
      expect(screen.getByText(/maría gonzález/i)).toBeInTheDocument();
      expect(screen.getByText(/maria@casonajms.cl/i)).toBeInTheDocument();
    });
  });

  test('3. Debe habilitar los botones de acción (Aprobar/Rechazar) y gatillar la confirmación', async () => {
    renderizar();
    
    let botonAprobar, botonRechazar;
    
    await waitFor(() => {
      botonAprobar = screen.getByRole('button', { name: /✓ aprobar/i });
      botonRechazar = screen.getByRole('button', { name: /✕ rechazar/i });
    });
    
    expect(botonAprobar).toBeInTheDocument();
    expect(botonRechazar).toBeInTheDocument();

    fireEvent.click(botonAprobar);

    await waitFor(() => {
      const alertaSweetAlert = screen.getByText(/estás a punto de aprobar esta solicitud/i);
      expect(alertaSweetAlert).toBeInTheDocument();
    });
  });
});