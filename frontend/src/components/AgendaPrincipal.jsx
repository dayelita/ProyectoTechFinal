import React from 'react';
import AgendaAdmin from './AgendaAdmin';
import AgendaCliente from './AgendaCliente';

export default function AgendaPrincipal() {
  // VERA EL ROL DEL USUARIO
  const rol = localStorage.getItem('rolUsuario');

  // MOSTRARA SI ES ADMIN LA AGENDA ADMIN
  if (rol === 'ADMIN') {
    return <AgendaAdmin />;
  } 
  // MOSTRARA SI ES CLIENTE O UN VISITANTE LA AGENDA DE CLIENTE
  else {
    return <AgendaCliente />;
  }
}