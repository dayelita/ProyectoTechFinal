import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import FormularioLogin from '../components/formularioLogin'; 

describe('CP-001: Pruebas de Autenticación (Login) - Frontend', () => {
  
  const renderizar = () => {
    render(
      <BrowserRouter>
        <FormularioLogin />
      </BrowserRouter>
    );
  };

  test('1. El campo de contraseña debe ocultar el texto por seguridad', () => {
    renderizar();
    
    // Buscamos el input usando exactamente el texto de Label Contraseña
    const inputPassword = screen.getByLabelText(/contraseña/i);
    
    // Verificamos que tenga el type="password"
    expect(inputPassword).toHaveAttribute('type', 'password');
  });

  test('2. Debe capturar el correo y la contraseña ingresados', () => {
    renderizar();
    
    // Buscamos los inputs por sus Labels exactos
    const inputCorreo = screen.getByLabelText(/correo electrónico/i);
    const inputPassword = screen.getByLabelText(/contraseña/i);
    
    // Simulamos la escritura del usuario
    fireEvent.change(inputCorreo, { target: { value: 'admin@casonajms.cl' } });
    fireEvent.change(inputPassword, { target: { value: 'Admin123!' } });
    
    // Validamos que el estado de React se actualizo correctamente
    expect(inputCorreo.value).toBe('admin@casonajms.cl');
    expect(inputPassword.value).toBe('Admin123!');
  });

  test('3. Debe existir el botón principal de acceso', () => {
    renderizar();
    
    // Buscamos el boton por el texto Ingresar que definimos 
    const botonIngresar = screen.getByRole('button', { name: /ingresar/i });
    expect(botonIngresar).toBeInTheDocument();
  });
});