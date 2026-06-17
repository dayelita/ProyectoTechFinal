import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import GestionInventario from '../components/GestionStock'; 

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

// simulara el inventario del backend
beforeAll(() => {
  Storage.prototype.getItem = jest.fn(() => 'token-falso-admin');
  
  // Hacemos un Fetch que responde distinto según la URL
  global.fetch = jest.fn((url, options) => {
    // Pide la lista de todos los productos
    if (url.includes('/api/stock/todos')) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve([
          { id: 101, nombre: 'Silla Tiffany Dorada', categoria: 'Mobiliario', cantidad: 50, precio: 1500 }
        ]),
      });
    }
    // Lo que crea un producto nuevo
    if (url.includes('/api/stock/crear')) {
      return Promise.resolve({ ok: true });
    }
    return Promise.resolve({ ok: true, json: () => Promise.resolve([]) });
  });
});

describe('CP-00X: Pruebas de Gestión de Inventario/Stock - Frontend', () => {

  const renderizar = () => {
    render(
      <BrowserRouter>
        <GestionInventario />
      </BrowserRouter>
    );
  };

  test('1. Debe cargar los artículos del inventario desde el servidor al iniciar', async () => {
    renderizar();
    
    // Validamos que el fetch falso entregó la Silla Tiffany Dorada a la tabla
    await waitFor(() => {
      expect(screen.getByText('Silla Tiffany Dorada')).toBeInTheDocument();
      // Validamos que el formato de moneda chilena se aplique 
      expect(screen.getByText('$1.500')).toBeInTheDocument(); 
    });
  });

  test('2. Debe capturar datos en el formulario y permitir agregar un nuevo artículo', async () => {
    renderizar();

    // Buscamos los inputs por sus Placeholders
    const inputNombre = screen.getByPlaceholderText(/ej. mantel redondo/i);
    // Como hay dos inputs con placeholder "0" (Cantidad y Precio), tomamos ambos en un arreglo
    const inputsNumericos = screen.getAllByPlaceholderText('0');
    const inputCantidad = inputsNumericos[0];
    const inputPrecio = inputsNumericos[1];

    // Simulamos que el admin escribe un nuevo producto
    fireEvent.change(inputNombre, { target: { value: 'Mesa Imperial' } });
    fireEvent.change(inputCantidad, { target: { value: '10' } });
    fireEvent.change(inputPrecio, { target: { value: '5000' } });

    // Hacemos clic en el botón de Agregar
    const botonAgregar = screen.getByRole('button', { name: /➕ agregar/i });
    fireEvent.click(botonAgregar);

    // Validamos que SweetAlert2 lance el mensaje de exito
    await waitFor(() => {
      expect(screen.getByText(/artículo agregado/i)).toBeInTheDocument();
    });
  });

  test('3. Debe filtrar la tabla en tiempo real al usar el buscador', async () => {
    renderizar();
    
    // Esperamos a que cargue la silla del Mock
    await waitFor(() => {
      expect(screen.getByText('Silla Tiffany Dorada')).toBeInTheDocument();
    });

    // Buscamos la barra de búsqueda
    const inputBusqueda = screen.getByPlaceholderText(/buscar artículo por nombre/i);

    // Simulamos buscar algo que NO existe 
    fireEvent.change(inputBusqueda, { target: { value: 'Cuchara' } });

    // Validamos que la tabla se vacíe y muestre el mensaje de Inventario Vacío
    await waitFor(() => {
      expect(screen.getByText(/inventario vacío/i)).toBeInTheDocument();
      expect(screen.queryByText('Silla Tiffany Dorada')).not.toBeInTheDocument();
    });
  });
});