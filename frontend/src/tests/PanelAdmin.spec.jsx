import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import Inicio from '../pages/Inicio'; 

//  Aislara los componentes hijos para enfocarnos unicamente en el flujo del rol
jest.mock('../components/Banner.jsx', () => () => <div data-testid="banner-mock" />);
jest.mock('../components/Testimonios.jsx', () => () => <div data-testid="testimonios-mock" />);
jest.mock('../components/MapaCasona.jsx', () => () => <div data-testid="mapa-mock" />);

describe('CP-004: Pruebas de Control de Acceso y Panel de Administrador', () => {

  beforeEach(() => {
    // Limpiamos el almacenamiento virtual 
    Storage.prototype.getItem = jest.fn();
  });

  test('1. Cuando el rol NO es ADMIN, debe renderizar la vista pública para clientes', () => {
    // Forzamos a que el LocalStorage devuelva un rol comun o nulo
    Storage.prototype.getItem = jest.fn((key) => {
      if (key === 'rolUsuario') return 'USER';
      return null;
    });

    render(
      <BrowserRouter>
        <Inicio />
      </BrowserRouter>
    );

    // Debe mostrar el titulo publico
    const tituloPublico = screen.getByText(/descubre nuestros espacios/i);
    expect(tituloPublico).toBeInTheDocument();

    // No debe mostrar el badge exclusivo de administrador
    const badgeAdmin = screen.queryByText(/sesión de administrador activa/i);
    expect(badgeAdmin).not.toBeInTheDocument();
  });

  test('2. Cuando el rol SÍ es ADMIN, debe habilitar el panel de gestión y sus herramientas', async () => {
    // Forzamos a que el LocalStorage devuelva explicitamente el rol ADMIN
    Storage.prototype.getItem = jest.fn((key) => {
      if (key === 'rolUsuario') return 'ADMIN';
      return null;
    });

    render(
      <BrowserRouter>
        <Inicio />
      </BrowserRouter>
    );

    // Verifica que el titulo cambie dinamicamente al de administracion
    const tituloAdmin = screen.getByText(/panel de gestión administrativa/i);
    expect(tituloAdmin).toBeInTheDocument();

    // Verifica la presencia del badge de corona de seguridad
    const badgeAdmin = screen.getByText(/sesión de administrador activa/i);
    expect(badgeAdmin).toBeInTheDocument();

    // Captura el boton para abrir el Centro de Operaciones
    const botonAbrirPanel = screen.getByRole('button', { name: /abrir panel de control/i });
    expect(botonAbrirPanel).toBeInTheDocument();

    // Simulamos el clic del administrador para abrir el modal de gestion
    fireEvent.click(botonAbrirPanel);

    // Validamos los modulos del modal discriminando por sus roles de títulos h3/h5 para evitar colisiones por texto repetido
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /centro de gestión jms/i, level: 3 })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: /reservas/i, level: 5 })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: /inventario/i, level: 5 })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: /servicios/i, level: 5 })).toBeInTheDocument();
    });
  });
});