import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const ProtectedRoute = ({ children, rolRequerido }) => {
  // ESTADO NULL = "CARGANDO / VERIFICANDO ", ESTADO TRUE = "APROBADO", FALSE = "RECHAZADO"
  const [autorizado, setAutorizado] = useState(null); 
  const idUsuario = localStorage.getItem('idUsuario');
  const token = localStorage.getItem('token'); // SE EXTRAE EL TOKEN 

  useEffect(() => {
    // SI NO HAY TOKEN NI ID SE EXPULSA 
    if (!token || !idUsuario) {
      setAutorizado(false);
      return;
    }

    // SE PREGUNTA A SPRING ENVIANDO EL TOKEN A LA CABECERA 
    fetch(`http://localhost:8081/api/usuarios/verificar/${idUsuario}`, {
      headers: {
        'Authorization': `Bearer ${token}` // SIN ESTO SE BLOQUEA LA CONSULTA
      }
    })
      .then(response => {
        if (response.status === 401 || response.status === 403) {
            throw new Error("Token expirado o inválido");
        }
        if (!response.ok) throw new Error("Usuario no encontrado en BD");
        return response.json();
      })
      .then(data => {
        const rolRealBaseDatos = data.rol;

        // SI EL LOCAL DICE ROL ADMIN PERO EN LA BASE DE DATOS DICE USUARIO 
        if (localStorage.getItem('rolUsuario') !== rolRealBaseDatos) {
           console.warn("Se detectó manipulación del LocalStorage. Restaurando rol original.");
           localStorage.setItem('rolUsuario', rolRealBaseDatos); // SE CORRIGUE A LA FUERZA
        }

        // SE VERIFICA SEGUN EL ROL EL PERMISO PARA LA RUTA
        if (rolRequerido && rolRealBaseDatos !== rolRequerido) {
          setAutorizado(false); // SI ES CLIENTE INTENTANDO ENTRAR A SECCION DE ADMIN
        } else {
          setAutorizado(true);  // SI EL ROL CUMPLE CON LA RUTA ESPECIFICA PASA
        }
      })
      .catch(error => {
        console.error("Error de seguridad:", error);
        // SE LIMPIA LOS DATOS SI EL TOKEN ES FALSO O EXPIRO
        localStorage.removeItem('token');
        localStorage.removeItem('idUsuario');
        localStorage.removeItem('rolUsuario');
        setAutorizado(false);
      });

  }, [idUsuario, rolRequerido, token]);

  // SE MUESTRA UNA ÁNTALLA DE CARGA MIENSTRAS SE ESPERA RESPUESTA DE SPRING 
  if (autorizado === null) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '80vh', backgroundColor: '#F3E7E4' }}>
        <div className="spinner-border" style={{ color: '#16181D' }} role="status">
          <span className="visually-hidden">Verificando credenciales...</span>
        </div>
      </div>
    );
  }

  // SI SE RECHAZA LO EMPUJA AL LOGIN MOSTRANDO UNA ALERTA 
  if (autorizado === false) {
    Swal.fire({
      icon: 'error',
      title: 'Acceso Denegado',
      text: 'No tienes permisos para ver esta página o tu sesión ha expirado.',
      confirmButtonColor: '#16181D',
      background: '#F3E7E4',
      color: '#16181D'
    });
    return <Navigate to="/login" replace />;
  }

  // SI TODO ESTA BIEN VE LA PAGINA QUE QUIERE VER REALMENTE 
  return children;
};

export default ProtectedRoute;