import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Banner from "../components/Banner.jsx";
import Testimonios from '../components/Testimonios.jsx';

function Inicio() {
  const [isAdmin, setIsAdmin] = useState(false);
  // 👇 Nuevo estado para controlar la ventana emergente del Admin
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
          {/* CARD 1: IGUAL PARA TODOS (Admin y Cliente) */}
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
                <Link to="/catalogo" className="btn text-white mt-auto mx-auto" style={{ backgroundColor: '#722F37', borderRadius: '25px', width: '80%', fontWeight: 'bold' }}>
                  Ver Catálogo
                </Link>
              </div>
            </div>
          </div>

          {/* ========================================== */}
          {/* CARD 2: IGUAL PARA TODOS (Admin y Cliente) */}
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
          {/* CARD 3: CAMBIA SEGÚN EL ROL (El Semáforo)  */}
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
                    Accede a las herramientas de gestión interna, control de inventario y solicitudes de la Casona JMS.
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
            /* VERSIÓN CLIENTE: Tarjeta normal de celebraciones */
            <div className="col-12 col-md-4">
              <div className="card h-100 shadow border-0" style={{ borderRadius: '15px', overflow: 'hidden' }}>
                <img 
                  src="https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=600&q=80" 
                  className="card-img-top" alt="Cumpleaños y Fiestas" style={{ height: '220px', objectFit: 'cover' }}
                />
                <div className="card-body text-center p-4 d-flex flex-column">
                  <h4 className="card-title fw-bold" style={{ color: '#722F37' }}>Celebraciones</h4>
                  <p className="card-text text-muted mb-4">
                    Espacios versátiles para celebrar cumpleaños o aniversarios junto a tus seres queridos.
                  </p>
                  <Link to="/catalogo" className="btn text-white mt-auto mx-auto" style={{ backgroundColor: '#722F37', borderRadius: '25px', width: '80%', fontWeight: 'bold' }}>
                    Más Información
                  </Link>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
      
      <Testimonios/>

      {/* ========================================== */}
      {/* LA VENTANA EMERGENTE (MODAL) DEL ADMIN     */}
      {/* ========================================== */}
      {showAdminModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1050 }}>
          <div className="card p-5 shadow-lg border-0" style={{ width: '600px', maxWidth: '90%', borderRadius: '20px' }}>
            
            <div className="text-center mb-4">
              <h3 className="fw-bold" style={{ color: '#722F37' }}>Centro de Gestión JMS</h3>
              <p className="text-muted">¿Qué módulo deseas administrar hoy?</p>
            </div>

            <div className="row g-3">
              {/* Botón Gigante 1: Agenda */}
              <div className="col-6">
                <Link to="/agendaCitas" className="text-decoration-none">
                  <div className="card h-100 text-center p-4 border-0 shadow-sm" style={{ backgroundColor: '#fdfbf7', borderRadius: '15px', transition: '0.3s' }}>
                    <h1 style={{ fontSize: '3rem' }}>📅</h1>
                    <h5 className="fw-bold mt-2" style={{ color: '#722F37' }}>Agenda y Citas</h5>
                  </div>
                </Link>
              </div>

              {/* Botón Gigante 2: Stock */}
              <div className="col-6">
                <Link to="/stockAdmin" className="text-decoration-none">
                  <div className="card h-100 text-center p-4 border-0 shadow-sm" style={{ backgroundColor: '#fdfbf7', borderRadius: '15px', transition: '0.3s' }}>
                    <h1 style={{ fontSize: '3rem' }}>📦</h1>
                    <h5 className="fw-bold mt-2" style={{ color: '#722F37' }}>Control Stock</h5>
                  </div>
                </Link>
              </div>
            </div>

            <button 
              className="btn btn-outline-secondary mt-4 w-100 fw-bold" 
              style={{ borderRadius: '25px' }}
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