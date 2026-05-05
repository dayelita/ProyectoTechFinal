import React from 'react';
import GaleriaAdmin from '../components/GaleriaAdmin';
import GaleriaPublica from '../components/GaleriaPublica';

export default function GaleriaPrincipal() {
  const rol = localStorage.getItem('rolUsuario');
  return rol === 'ADMIN' ? <GaleriaAdmin /> : <GaleriaPublica />;
}
