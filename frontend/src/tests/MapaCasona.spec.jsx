import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import MapaCasona from '../components/MapaCasona'; 

describe('CP-00X: Pruebas de Renderizado - Componente MapaCasona', () => {

  const renderizar = () => {
    render(<MapaCasona />);
  };

  test('1. Debe renderizar el título principal de la sección', () => {
    renderizar();
    const titulo = screen.getByRole('heading', { name: /¿cómo llegar?/i });
    expect(titulo).toBeInTheDocument();
  });

  test('2. Debe renderizar el iframe interactivo de Google Maps', () => {
    renderizar();
    // Buscamos el iframe por su titulo de accesibilidad
    const iframeMapa = screen.getByTitle(/ubicación espacio casona jms/i);
    expect(iframeMapa).toBeInTheDocument();
    expect(iframeMapa.tagName).toBe('IFRAME');
  });

  test('3. Debe renderizar las tarjetas informativas (Dirección, Teléfono, Email)', () => {
    renderizar();
    
    // Validamos que los titulos de las minicards estén presentes
    expect(screen.getByRole('heading', { name: /dirección/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /teléfono/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /email/i })).toBeInTheDocument();

    // Validamos que la data real de contacto este renderizada
    expect(screen.getByText(/\+56 9 7601 1067/i)).toBeInTheDocument();
    expect(screen.getByText(/contacto@espaciocasona.cl/i)).toBeInTheDocument();
  });

  test('4. Debe contener el botón externo hacia Google Maps con los atributos correctos', () => {
    renderizar();
    
    // Buscamos el enlace (tag <a>) por su rol y texto
    const botonAbrirMaps = screen.getByRole('link', { name: /abrir en google maps/i });
    
    expect(botonAbrirMaps).toBeInTheDocument();
    
    // Validamos que por seguridad tenga los atributos target y rel correctos
    expect(botonAbrirMaps).toHaveAttribute('target', '_blank');
    expect(botonAbrirMaps).toHaveAttribute('rel', 'noopener noreferrer');
    
    // Validamos que el enlace no este vacio
    expect(botonAbrirMaps).toHaveAttribute('href');
    expect(botonAbrirMaps.getAttribute('href')).toContain('google.com/maps');
  });
});