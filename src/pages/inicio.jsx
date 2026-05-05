import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Banner from "../components/Banner.jsx";
import Testimonios from '../components/Testimonios.jsx';
import MapaCasona from '../components/MapaCasona.jsx'

function Inicio() {
  const [isAdmin, setIsAdmin] = useState(false);
  // Estado para controlar la ventana emergente del Admin
  const [showAdminModal, setShowAdminModal] = useState(false);

  useEffect(() => {
    const rol = localStorage.getItem('rolUsuario');
    if (rol === 'ADMIN') {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  }, []);

  return (
    <div style={{ backgroundColor: '#fdfbf7', minHeight: '100vh', paddingBottom: '50px' }}>
      
      <Banner />
      
      <div className="container" style={{ marginTop: '50px' }}>
        
        <div className="text-center mb-4">
          <h2 style={{ color: '#722F37', fontWeight: 'bold' }}>
            Descubre Nuestros Espacios
          </h2>
          {isAdmin && <span className="badge bg-dark fs-6 mt-2">👑 Sesión de Administrador Activa</span>}
        </div>

        <div className="row g-4">
          
          {/* ========================================== */}
          {/* CARD 1: Eventos Corporativos (Público)     */}
          {/* ========================================== */}
          <div className="col-12 col-md-4">
            <div className="card h-100 shadow border-0" style={{ borderRadius: '15px', overflow: 'hidden' }}>
              <img 
                src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=600&q=80" 
                className="card-img-top" alt="Eventos corporativos" style={{ height: '220px', objectFit: 'cover' }}
              />
              <div className="card-body text-center p-4 d-flex flex-column">
                <h4 className="card-title fw-bold" style={{ color: '#722F37' }}>Eventos Corporativos</h4>
                <p className="card-text text-muted mb-4">
                  Salones equipados y un entorno natural ideal para reuniones, capacitaciones y cenas de empresa.
                </p>
                <Link to="/galeria" className="btn text-white mt-auto mx-auto" style={{ backgroundColor: '#722F37', borderRadius: '25px', width: '80%', fontWeight: 'bold' }}>
                  Ver Galería
                </Link>
              </div>
            </div>
          </div>

          {/* ========================================== */}
          {/* CARD 2: Matrimonios y Visitas (Público)    */}
          {/* ========================================== */}
          <div className="col-12 col-md-4">
            <div className="card h-100 shadow border-0" style={{ borderRadius: '15px', overflow: 'hidden' }}>
              <img 
                src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=600&q=80" 
                className="card-img-top" alt="Visitas y Matrimonios" style={{ height: '220px', objectFit: 'cover' }}
              />
              <div className="card-body text-center p-4 d-flex flex-column">
                <h4 className="card-title fw-bold" style={{ color: '#722F37' }}>Matrimonios y Visitas</h4>
                <p className="card-text text-muted mb-4">
                  Haz que tu día sea mágico. Agenda una hora presencial para recorrer los jardines y planificar tu boda.
                </p>
                <Link to="/agendaCitas" className="btn text-white mt-auto mx-auto" style={{ backgroundColor: '#722F37', borderRadius: '25px', width: '80%', fontWeight: 'bold' }}>
                  Agendar Hora
                </Link>
              </div>
            </div>
          </div>

          {/* ========================================== */}
          {/* CARD 3: CAMBIA SEGÚN EL ROL (Admin/Cliente)*/}
          {/* ========================================== */}
          {isAdmin ? (
            /* VERSIÓN ADMIN: Abre el panel emergente */
            <div className="col-12 col-md-4">
              <div className="card h-100 shadow border-0" style={{ borderRadius: '15px', overflow: 'hidden', border: '2px solid #722F37' }}>
                <img 
                  src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80" 
                  className="card-img-top" alt="Panel de Control" style={{ height: '220px', objectFit: 'cover' }}
                />
                <div className="card-body text-center p-4 d-flex flex-column bg-light">
                  <h4 className="card-title fw-bold" style={{ color: '#722F37' }}>Panel de Administrador</h4>
                  <p className="card-text text-muted mb-4">
                    Accede a las herramientas de gestión interna, control de inventario y configuración de la Casona JMS.
                  </p>
                  <button 
                    onClick={() => setShowAdminModal(true)} 
                    className="btn text-white mt-auto mx-auto" 
                    style={{ backgroundColor: '#212529', borderRadius: '25px', width: '80%', fontWeight: 'bold' }}
                  >
                    Abrir Panel ⚙️
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* VERSIÓN CLIENTE: Tarjeta normal de servicios */
            <div className="col-12 col-md-4">
              <div className="card h-100 shadow border-0" style={{ borderRadius: '15px', overflow: 'hidden' }}>
                <img 
                  src="https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=600&q=80" 
                  className="card-img-top" alt="Cumpleaños y Fiestas" style={{ height: '220px', objectFit: 'cover' }}
                />
                <div className="card-body text-center p-4 d-flex flex-column">
                  <h4 className="card-title fw-bold" style={{ color: '#722F37' }}>Servicios Extra</h4>
                  <p className="card-text text-muted mb-4">
                    Espacios versátiles, gastronomía y decoración para celebrar eventos junto a tus seres queridos.
                  </p>
                  <Link to="/servicios" className="btn text-white mt-auto mx-auto" style={{ backgroundColor: '#722F37', borderRadius: '25px', width: '80%', fontWeight: 'bold' }}>
                    Ver Servicios
                  </Link>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
      
      <Testimonios/>
      <MapaCasona/>   
      
      {/* ========================================== */}
      {/* LA VENTANA EMERGENTE (MODAL) DEL ADMIN     */}
      {/* ========================================== */}
      {showAdminModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.75)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1050 }}>
          {/* Ancho ampliado a 800px para que los 3 botones encajen perfectamente */}
          <div className="card p-5 shadow-lg border-0" style={{ width: '800px', maxWidth: '95%', borderRadius: '20px' }}>
            
            <div className="text-center mb-4">
              <h3 className="fw-bold" style={{ color: '#722F37' }}>Centro de Gestión JMS</h3>
              <p className="text-muted">¿Qué módulo deseas administrar hoy?</p>
            </div>

            <div className="row g-3">
              {/* Módulo 1: Reservas */}
              <div className="col-12 col-md-4">
                <Link to="/agendaAdmin" className="text-decoration-none">
                  <div className="card h-100 text-center p-4 border-0 shadow-sm" style={{ backgroundColor: '#fdfbf7', borderRadius: '15px', transition: 'transform 0.2s', cursor: 'pointer' }}
                       onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-5px)'}
                       onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                    <h1 style={{ fontSize: '3rem', margin: 0 }}>📅</h1>
                    <h5 className="fw-bold mt-3" style={{ color: '#722F37' }}>Reservas</h5>
                  </div>
                </Link>
              </div>

              {/* Módulo 2: Stock */}
              <div className="col-12 col-md-4">
                <Link to="/stockAdmin" className="text-decoration-none">
                  <div className="card h-100 text-center p-4 border-0 shadow-sm" style={{ backgroundColor: '#fdfbf7', borderRadius: '15px', transition: 'transform 0.2s', cursor: 'pointer' }}
                       onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-5px)'}
                       onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                    <h1 style={{ fontSize: '3rem', margin: 0 }}>📦</h1>
                    <h5 className="fw-bold mt-3" style={{ color: '#722F37' }}>Inventario</h5>
                  </div>
                </Link>
              </div>

              {/* 🔥 Módulo 3: Galería (NUEVO) 🔥 */}
              <div className="col-12 col-md-4">
                <Link to="/galeria" className="text-decoration-none">
                  <div className="card h-100 text-center p-4 border-0 shadow-sm" style={{ backgroundColor: '#fdfbf7', borderRadius: '15px', transition: 'transform 0.2s', cursor: 'pointer' }}
                       onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-5px)'}
                       onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                    <h1 style={{ fontSize: '3rem', margin: 0 }}>🖼️</h1>
                    <h5 className="fw-bold mt-3" style={{ color: '#722F37' }}>Galería</h5>
                  </div>
                </Link>
              </div>
            </div>

            <button 
              className="btn btn-outline-secondary mt-5 w-100 fw-bold" 
              style={{ borderRadius: '25px', padding: '10px' }}
              onClick={() => setShowAdminModal(false)}
            >
              Cerrar Panel
            </button>
            
          </div>
        </div>
      )}
      
    </div>
  );
}

export default Inicio;