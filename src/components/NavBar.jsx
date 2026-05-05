import React, { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import '../styles/navbarStyle.css';

export default function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // 🔥 ESTADOS PARA EL USUARIO LOGUEADO
  const [usuario, setUsuario] = useState(null);
  const [rolUsuario, setRolUsuario] = useState(null);
  const [verificando, setVerificando] = useState(false); // 👈 Nuevo estado para el "Modo Paranoico"

  // =========================================================
  // 🔥 VERIFICACIÓN SILENCIOSA CON EL BACKEND (MODO PARANOICO)
  // =========================================================
  useEffect(() => {
    const id = localStorage.getItem('idUsuario');
    const nombre = localStorage.getItem('nombreUsuario');

    if (id) {
      setUsuario(nombre);
      setVerificando(true); // 👈 Activamos el círculo de carga

      // Ya no confiamos en el localStorage para el rol, le preguntamos directo a Spring Boot
      fetch(`http://localhost:8081/api/usuarios/verificar/${id}`)
        .then(response => {
          if (!response.ok) throw new Error("Sesión inválida o usuario no existe");
          return response.json();
        })
        .then(data => {
          const rolRealBD = data.rol;
          setRolUsuario(rolRealBD); // 👈 Spring Boot dicta el rol real
          localStorage.setItem('rolUsuario', rolRealBD); // Corregimos si el usuario intentó hacer trampa
          setVerificando(false); // 👈 Apagamos el círculo de carga
        })
        .catch(error => {
          console.error("Error de seguridad al recargar:", error);
          localStorage.clear();
          setUsuario(null);
          setRolUsuario(null);
          setVerificando(false); // 👈 Apagamos el círculo de carga en caso de error
        });

    } else {
      setUsuario(null);
      setRolUsuario(null);
      setVerificando(false);
    }
  }, [location]);

  // 🔥 FUNCIÓN PARA CERRAR SESIÓN (Actualizada con recarga completa)
  const handleLogout = () => {
    Swal.fire({
      title: '¿Cerrar Sesión?',
      text: "Tendrás que volver a ingresar tus datos para agendar horas.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#722F37',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, salir',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        // 1. Limpiamos la memoria local y los estados de React
        localStorage.clear();
        setUsuario(null);
        setRolUsuario(null);
        
        // 2. Mostramos la alerta de éxito y esperamos a que termine (1.5 segundos)
        Swal.fire({ 
          icon: 'success', 
          title: 'Sesión Cerrada', 
          timer: 1500, 
          showConfirmButton: false 
        }).then(() => {
          // 3. 🔥 Forzamos una recarga dura para limpiar toda la caché y volver al inicio
          window.location.href = '/'; 
        });
      }
    });
  };

  useEffect(() => {
    const collapseEl = document.getElementById('navbarNavAltMarkup');
    if (collapseEl && collapseEl.classList.contains('show')) {
      const bsCollapse = window.bootstrap?.Collapse?.getInstance(collapseEl);
      bsCollapse?.hide();
    }
  }, [location]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`navbar navbar-expand-lg sticky-top ${scrolled ? 'navbar-scrolled' : ''}`}
      style={{
        backgroundColor: 'blanchedalmond',
        transition: 'box-shadow 0.3s ease',
        boxShadow: scrolled ? '0 2px 12px rgba(114,47,55,0.15)' : 'none',
      }}
    >
      <div className="container">

        <NavLink className="navbar-brand d-flex align-items-center gap-2 fw-bold" to="/" style={{ color: '#722F37' }}>
          <span style={{ fontSize: '1.4rem' }}>🏡</span>
          <span>Espacio Casona JMS</span>
        </NavLink>

        <button className="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
          <div className="navbar-nav ms-auto align-items-lg-center gap-lg-1">

            <NavLink className={({ isActive }) => `nav-link nav-link-custom${isActive ? ' active-link' : ''}`} to="/" end>
              Inicio
            </NavLink>

            {/* 🔥 LINKS CONDICIONALES PROTEGIDOS VISUALMENTE 🔥 */}
            {verificando ? (
              <div className="d-flex align-items-center mx-3">
                <div className="spinner-border spinner-border-sm" style={{ color: '#722F37' }} role="status">
                  <span className="visually-hidden">Verificando...</span>
                </div>
              </div>
            ) : rolUsuario === 'ADMIN' ? (
              <>
                <NavLink className={({ isActive }) => `nav-link nav-link-custom${isActive ? ' active-link' : ''}`} to="/agendaAdmin">
                  Panel Reservas
                </NavLink>
                <NavLink className={({ isActive }) => `nav-link nav-link-custom${isActive ? ' active-link' : ''}`} to="/stockAdmin">
                  Control Stock
                </NavLink>
                <NavLink className={({ isActive }) => `nav-link nav-link-custom${isActive ? ' active-link' : ''}`} to="/galeria">
                  Gestión Galería
                </NavLink>
              </>
            ) : (
              <>
                <NavLink className={({ isActive }) => `nav-link nav-link-custom${isActive ? ' active-link' : ''}`} to="/servicios">
                  Servicios
                </NavLink>
                
                <NavLink className={({ isActive }) => `nav-link nav-link-custom${isActive ? ' active-link' : ''}`} to="/galeria">
                  Galería
                </NavLink>
                <NavLink className={({ isActive }) => `nav-link nav-link-custom${isActive ? ' active-link' : ''}`} to="/agendaCliente">
                  Agenda
                </NavLink>
              </>
            )}

            <div className="d-none d-lg-block" style={{ width: '1px', height: '24px', backgroundColor: '#ccc', margin: '0 8px' }} />

            {/* RENDERIZADO CONDICIONAL DE BOTONES CON TUS ANIMACIONES */}
            {usuario ? (
              <div className="d-flex align-items-center gap-3 ms-2">
                <span className="fw-bold" style={{ color: '#722F37' }}>
                  👋 Hola, {usuario}
                </span>

                {/* BOTÓN DE PERFIL */}
                <NavLink to="/perfil" style={{ textDecoration: 'none' }}>
                  <span
                    className="btn btn-sm px-3 py-1 fw-semibold"
                    style={{
                      border: '2px solid #722F37',
                      color: '#722F37',
                      borderRadius: '20px',
                      transition: 'all 0.25s',
                      backgroundColor: 'transparent'
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.backgroundColor = '#722F37';
                      e.currentTarget.style.color = 'white';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = '#722F37';
                    }}
                  >
                    👤 Mi Perfil
                  </span>
                </NavLink>

                {/* BOTÓN CERRAR SESIÓN */}
                <button 
                  onClick={handleLogout}
                  className="btn btn-sm px-3 py-1 fw-semibold"
                  style={{
                    backgroundColor: '#722F37',
                    color: 'white',
                    borderRadius: '20px',
                    border: 'none',
                    transition: 'all 0.25s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = '#5a2229'} 
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = '#722F37'} 
                >
                  Cerrar Sesión
                </button>
              </div>
            ) : (
              <>
                {/* Botón Login Original con Animación */}
                <NavLink to="/login" className="nav-link">
                  <span
                    className="btn btn-sm px-3 py-1 fw-semibold"
                    style={{
                      border: '2px solid #722F37',
                      color: '#722F37',
                      borderRadius: '20px',
                      transition: 'all 0.25s',
                      backgroundColor: 'transparent'
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.backgroundColor = '#722F37';
                      e.currentTarget.style.color = 'white';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = '#722F37';
                    }}
                  >
                    Iniciar Sesión
                  </span>
                </NavLink>

                {/* Botón Registro Original con Animación */}
                <NavLink to="/registro" className="nav-link">
                  <span
                    className="btn btn-sm px-3 py-1 fw-semibold"
                    style={{
                      backgroundColor: '#722F37',
                      color: 'white',
                      borderRadius: '20px',
                      border: '2px solid #722F37',
                      transition: 'all 0.25s',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.backgroundColor = '#5a2229';
                      e.currentTarget.style.borderColor = '#5a2229';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.backgroundColor = '#722F37';
                      e.currentTarget.style.borderColor = '#722F37';
                    }}
                  >
                    Crear Cuenta
                  </span>
                </NavLink>
              </>
            )}

          </div>
        </div>

      </div>
    </nav>
  );
}