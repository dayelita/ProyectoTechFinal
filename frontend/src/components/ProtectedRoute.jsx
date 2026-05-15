import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const ProtectedRoute = ({ children, rolRequerido }) => {
  // Estado null significa "Cargando/Verificando", true es "Aprobado", false es "Rechazado"
  const [autorizado, setAutorizado] = useState(null); 
  const idUsuario = localStorage.getItem('idUsuario');

  useEffect(() => {
    // 1. Si ni siquiera hay ID, es un visitante. Lo rechazamos de inmediato.
    if (!idUsuario) {
      setAutorizado(false);
      return;
    }

    // 2. Si hay ID, le preguntamos la verdad a Spring Boot
    fetch(`http://localhost:8081/api/usuarios/verificar/${idUsuario}`)
      .then(response => {
        if (!response.ok) throw new Error("Usuario no encontrado en BD");
        return response.json();
      })
      .then(data => {
        const rolRealBaseDatos = data.rol;

        // 🔥 TRAMPA DETECTADA: Si el localStorage dice ADMIN pero la BD dice CLIENTE
        if (localStorage.getItem('rolUsuario') !== rolRealBaseDatos) {
           console.warn("Se detectó manipulación del LocalStorage. Restaurando rol original.");
           localStorage.setItem('rolUsuario', rolRealBaseDatos); // Lo corregimos a la fuerza
        }

        // 3. Verificamos si tiene permiso para esta ruta específica
        if (rolRequerido && rolRealBaseDatos !== rolRequerido) {
          setAutorizado(false); // Es cliente intentando entrar a zona Admin
        } else {
          setAutorizado(true);  // Todo en orden, pase adelante
        }
      })
      .catch(error => {
        console.error("Error de seguridad:", error);
        localStorage.clear(); // Borramos datos corruptos para proteger la app
        setAutorizado(false);
      });

  }, [idUsuario, rolRequerido]);

  // 4. Mientras esperamos la respuesta de Spring Boot (fracción de segundo), mostramos una pantalla de carga
  if (autorizado === null) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
        <div className="spinner-border" style={{ color: '#722F37' }} role="status">
          <span className="visually-hidden">Verificando seguridad...</span>
        </div>
      </div>
    );
  }

  // 5. Si fue rechazado, lo mandamos al login y le mostramos una alerta
  if (autorizado === false) {
    Swal.fire({
      icon: 'error',
      title: 'Acceso Denegado',
      text: 'No tienes permisos para ver esta página o tu sesión es inválida.',
      confirmButtonColor: '#722F37'
    });
    return <Navigate to="/login" replace />;
  }

  // 6. Si todo está perfecto, renderizamos la página que pidió ver (children)
  return children;
};

export default ProtectedRoute;