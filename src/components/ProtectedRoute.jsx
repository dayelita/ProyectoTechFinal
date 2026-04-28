import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, rolRequerido }) => {
  // 1. Leemos la memoria del navegador para ver quién está tratando de entrar
  const idUsuario = localStorage.getItem('idUsuario');
  const rolUsuario = localStorage.getItem('rolUsuario');

  // 2. Si no hay ID de usuario, es un visitante. Lo mandamos al Login.
  if (!idUsuario) {
    // El "replace" borra el intento de la historia del navegador 
    // para que no puedan volver atrás usando la flecha del navegador.
    return <Navigate to="/login" replace />;
  }

  // 3. Si la ruta exige un rol específico (ej: ADMIN) y el usuario no lo tiene...
  if (rolRequerido && rolUsuario !== rolRequerido) {
    // Lo mandamos a la página de inicio porque no tiene permisos.
    return <Navigate to="/" replace />;
  }

  // 4. Si pasó todos los filtros de seguridad, lo dejamos ver la página (children).
  return children;
};

export default ProtectedRoute;