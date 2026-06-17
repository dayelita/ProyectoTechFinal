import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import Formulario from '../components/formulario'; 

describe('CP-001: Pruebas de Registro - Frontend', () => {
  
  const renderizar = () => {
    render(
      <BrowserRouter>
        <Formulario />
      </BrowserRouter>
    );
  };

  test('1. Debe cargar el formulario de registro en pantalla', () => {
    renderizar();
    // Verificamos que exista un botón de envio
    const boton = screen.getByRole('button');
    expect(boton).toBeInTheDocument();
  });

  test('2. Los inputs deben capturar el texto ingresado', () => {
    renderizar();
    
    // Buscamos por su Label asociado
    const inputNombre = screen.getByLabelText(/nombre/i);
    const inputCorreo = screen.getByLabelText(/correo electrónico/i);
    
    // Simulamos la escritura
    fireEvent.change(inputNombre, { target: { value: 'Marco Rojas' } });
    fireEvent.change(inputCorreo, { target: { value: 'marco@casonajms.cl' } });
    
    // Validamos la captura
    expect(inputNombre.value).toBe('Marco Rojas');
    expect(inputCorreo.value).toBe('marco@casonajms.cl');
  });});