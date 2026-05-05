import React from 'react';
import AgendaAdmin from './AgendaAdmin';
import AgendaCliente from './AgendaCliente';

export default function AgendaPrincipal() {
  // Miramos la pulsera del usuario
  const rol = localStorage.getItem('rolUsuario');

  // Si es administrador, le mostramos la vista con la tabla y el calendario de lectura
  if (rol === 'ADMIN') {
    return <AgendaAdmin />;
  } 
  // Si es un cliente o visita, le mostramos el calendario para pedir horas
  else {
    return <AgendaCliente />;
  }
}