import React, { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import '../styles/navbarStyle.css';

// 🔥 COMPONENTE INVISIBLE PARA FORZAR EL SCROLL AL INICIO
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }, [pathname]);

  return null;
}

export default function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // 🔥 ESTADOS PARA EL USUARIO LOGUEADO
  const [usuario, setUsuario] = useState(null);
  const [rolUsuario, setRolUsuario] = useState(null);
  const [verificando, setVerificando] = useState(false);

  // =========================================================
  // 🔥 VERIFICACIÓN SILENCIOSA CON EL BACKEND
  // =========================================================
  useEffect(() => {
    const id = localStorage.getItem('idUsuario');
    const nombre = localStorage.getItem('nombreUsuario');

    if (id) {
      setUsuario(nombre);
      setVerificando(true);

      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081';
      
      fetch(`${API_URL}/api/usuarios/verificar/${id}`)
        .then(response => {
          if (!response.ok) throw new Error("Sesión inválida o usuario no existe");
          return response.json();
        })
        .then(data => {
          const rolRealBD = data.rol;
          setRolUsuario(rolRealBD); 
          localStorage.setItem('rolUsuario', rolRealBD); 
          setVerificando(false); 
        })
        .catch(error => {
          console.error("Error de seguridad al recargar:", error);
          localStorage.clear();
          setUsuario(null);
          setRolUsuario(null);
          setVerificando(false); 
        });

    } else {
      setUsuario(null);
      setRolUsuario(null);
      setVerificando(false);
    }
  }, [location]);

  // 🔥 FUNCIÓN PARA CERRAR SESIÓN
  const handleLogout = () => {
    Swal.fire({
      title: '¿Cerrar Sesión?',
      text: "Tendrás que volver a ingresar tus datos para agendar horas.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#16181D', // Fondo noche para confirmar
      cancelButtonColor: '#D4AF37', // Dorado para cancelar
      confirmButtonText: 'Sí, salir',
      cancelButtonText: 'Cancelar',
      background: '#F3E7E4', // Fondo crema en la alerta
      color: '#16181D'
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.clear();
        setUsuario(null);
        setRolUsuario(null);
        
        Swal.fire({ 
          icon: 'success', 
          title: 'Sesión Cerrada', 
          timer: 1500, 
          showConfirmButton: false,
          background: '#F3E7E4',
          color: '#16181D'
        }).then(() => {
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
    <>
      <ScrollToTop /> {/* 🔥 Activa el scroll automático en cada cambio de vista */}
      <nav
        className={`navbar navbar-expand-lg navbar-dark sticky-top ${scrolled ? 'navbar-scrolled' : ''}`}
        style={{
          backgroundColor: '#16181D', // 🔥 Azul Noche Profundo
          transition: 'box-shadow 0.3s ease',
          boxShadow: scrolled ? '0 4px 20px rgba(0,0,0,0.4)' : 'none',
        }}
      >
        <div className="container">

          {/* LOGO Y MARCA EN DORADO CON GEORGIA */}
          <NavLink className="navbar-brand d-flex align-items-center gap-2" to="/" style={{ color: '#D4AF37', fontFamily: "'Georgia', serif", fontWeight: 'bold' }}>
            <span style={{ fontSize: '1.4rem' }}>🏡</span>
            <span style={{ letterSpacing: '1px' }}>Espacio Casona JMS</span>
          </NavLink>

          <button className="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
            <div className="navbar-nav ms-auto align-items-lg-center gap-lg-1">

              <NavLink className={({ isActive }) => `nav-link nav-link-custom${isActive ? ' active-link' : ''}`} to="/" end>
                Inicio
              </NavLink>

              {/* LINKS CONDICIONALES PROTEGIDOS */}
              {verificando ? (
                <div className="d-flex align-items-center mx-3">
                  <div className="spinner-border spinner-border-sm" style={{ color: '#D4AF37' }} role="status">
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
                  <NavLink className={({ isActive }) => `nav-link nav-link-custom${isActive ? ' active-link' : ''}`} to="/serviciosAdmin">
                    Gestión Servicios
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

              {/* Separador vertical sutil */}
              <div className="d-none d-lg-block" style={{ width: '1px', height: '24px', backgroundColor: '#F3E7E4', opacity: 0.2, margin: '0 12px' }} />

              {/* BOTONES DE SESIÓN */}
              {usuario ? (
                <div className="d-flex align-items-center gap-3 ms-2">
                  <span className="fw-semibold" style={{ color: '#F3E7E4', fontFamily: "'Segoe UI', sans-serif" }}>
                    👋 Hola, <span style={{ color: '#D4AF37' }}>{usuario}</span>
                  </span>

                  <NavLink to="/perfil" style={{ textDecoration: 'none' }}>
                    <span
                      className="btn btn-sm px-3 py-1 fw-bold d-flex align-items-center"
                      style={{
                        border: '2px solid #D4AF37',
                        color: '#D4AF37',
                        borderRadius: '25px',
                        fontFamily: "'Segoe UI', sans-serif",
                        transition: 'all 0.3s ease',
                        backgroundColor: 'transparent'
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.backgroundColor = '#D4AF37';
                        e.currentTarget.style.color = '#16181D';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = '#D4AF37';
                      }}
                    >
                      {/* 🔥 ÍCONO SVG REEMPLAZANDO EL EMOJI 🔥 */}
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: '6px', marginBottom: '2px' }} xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z"/>
                      </svg>
                      Mi Perfil
                    </span>
                  </NavLink>

                  <button 
                    onClick={handleLogout}
                    className="btn btn-sm px-3 py-1 fw-bold shadow-sm"
                    style={{
                      backgroundColor: '#D4AF37',
                      color: '#16181D',
                      borderRadius: '25px',
                      border: '2px solid #D4AF37',
                      fontFamily: "'Segoe UI', sans-serif",
                      transition: 'all 0.3s ease',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.backgroundColor = '#b8962e';
                      e.currentTarget.style.borderColor = '#b8962e';
                    }} 
                    onMouseLeave={e => {
                      e.currentTarget.style.backgroundColor = '#D4AF37';
                      e.currentTarget.style.borderColor = '#D4AF37';
                    }} 
                  >
                    Cerrar Sesión
                  </button>
                </div>
              ) : (
                <div className="d-flex align-items-center gap-2">
                  <NavLink to="/login" className="nav-link p-0">
                    <span
                      className="btn btn-sm px-4 py-1 fw-bold"
                      style={{
                        border: '2px solid #D4AF37',
                        color: '#D4AF37',
                        borderRadius: '25px',
                        fontFamily: "'Segoe UI', sans-serif",
                        transition: 'all 0.3s ease',
                        backgroundColor: 'transparent'
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.backgroundColor = '#D4AF37';
                        e.currentTarget.style.color = '#16181D';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = '#D4AF37';
                      }}
                    >
                      Iniciar Sesión
                    </span>
                  </NavLink>

                  <NavLink to="/registro" className="nav-link p-0 ms-2">
                    <span
                      className="btn btn-sm px-4 py-1 fw-bold shadow-sm"
                      style={{
                        backgroundColor: '#D4AF37',
                        color: '#16181D',
                        borderRadius: '25px',
                        border: '2px solid #D4AF37',
                        fontFamily: "'Segoe UI', sans-serif",
                        transition: 'all 0.3s ease',
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.backgroundColor = '#b8962e';
                        e.currentTarget.style.borderColor = '#b8962e';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.backgroundColor = '#D4AF37';
                        e.currentTarget.style.borderColor = '#D4AF37';
                      }}
                    >
                      Crear Cuenta
                    </span>
                  </NavLink>
                </div>
              )}

            </div>
          </div>

        </div>
      </nav>
    </>
  );
}