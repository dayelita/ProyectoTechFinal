import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Banner from "../components/Banner.jsx";
import Testimonios from '../components/Testimonios.jsx';
import MapaCasona from '../components/MapaCasona.jsx'

function Inicio() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);

  useEffect(() => {
    const rol = localStorage.getItem('rolUsuario');
    setIsAdmin(rol === 'ADMIN');
  }, []);

  return (
    <div style={{ 
      background: 'linear-gradient(135deg, #16181D 0%, #1c1f26 60%, #0d0f12 100%)', 
      minHeight: '100vh', 
      paddingBottom: '50px', 
      overflowX: 'hidden',
      position: 'relative'
    }}>
      
      {/* FONDO DIFUMINADO / DESTELLOS */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(212,175,55,0.09) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(212,175,55,0.06) 0%, transparent 40%)',
        pointerEvents: 'none',
        zIndex: 0
      }} />

      {/* INYECCIÓN DE ANIMACIONES CSS */}
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .reveal-title {
          animation: fadeInUp 0.8s ease-out forwards;
        }

        .reveal-card {
          opacity: 0;
          animation: fadeInUp 0.8s ease-out forwards;
        }

        .delay-1 { animation-delay: 0.2s; }
        .delay-2 { animation-delay: 0.4s; }
        .delay-3 { animation-delay: 0.6s; }

        .hover-lift {
          transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease !important;
        }

        .hover-lift:hover {
          transform: translateY(-10px) scale(1.02) !important;
          box-shadow: 0 20px 40px rgba(0,0,0,0.4) !important;
        }
      `}</style>

      {/* Envolvemos el contenido en un div relativo para que esté sobre el fondo */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <Banner />
        
        <div className="container" style={{ marginTop: '50px' }}>
          
          {/* TÍTULO DINÁMICO */}
          <div className="text-center mb-5 reveal-title">
            <h2 style={{ color: '#F3E7E4', fontFamily: "'Georgia', serif", fontWeight: 'bold', fontSize: '2.5rem' }}>
              {isAdmin ? 'Panel de Gestión Administrativa' : 'Descubre Nuestros Espacios'}
            </h2>
            <div style={{ width: '60px', height: '3px', backgroundColor: '#D4AF37', margin: '15px auto' }}></div>
            {isAdmin && (
              <span className="badge mt-2 shadow-sm" style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: '#D4AF37', padding: '8px 16px', fontSize: '0.9rem', borderRadius: '20px', letterSpacing: '0.5px', border: '1px solid rgba(212,175,55,0.3)' }}>
                👑 Sesión de Administrador Activa
              </span>
            )}
          </div>

          {/* CONTENEDOR DE TARJETAS CENTRADO */}
          <div className="row g-4 justify-content-center mb-5">
            
            {isAdmin ? (
              /* ========================================== */
              /* VISTA ÚNICA EXCLUSIVA PARA EL ADMINISTRADOR*/
              /* ========================================== */
              <div className="col-12 col-md-8 col-lg-6 reveal-card delay-1">
                <div className="card h-100 shadow-lg border-0 hover-lift" style={{ borderRadius: '15px', overflow: 'hidden', border: '2px solid #D4AF37', backgroundColor: '#1c1f26' }}>
                  <img 
                    src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80" 
                    className="card-img-top" alt="Panel de Control" style={{ height: '300px', objectFit: 'cover' }}
                  />
                  <div className="card-body text-center p-5 d-flex flex-column">
                    <h4 className="card-title fw-bold" style={{ color: '#F3E7E4', fontFamily: "'Georgia', serif", fontSize: '1.8rem' }}>Centro de Operaciones</h4>
                    <p className="card-text mb-4" style={{ color: 'rgba(243, 231, 228, 0.7)', fontSize: '1.1rem', lineHeight: '1.6' }}>
                      Bienvenido, Administrador. Desde aquí puedes supervisar el inventario, gestionar las solicitudes de reserva y moderar los contenidos de la plataforma.
                    </p>
                    <button 
                      onClick={() => setShowAdminModal(true)} 
                      className="btn mt-auto mx-auto shadow-sm px-5 py-3" 
                      style={{ backgroundColor: '#D4AF37', color: '#16181D', border: '2px solid #D4AF37', borderRadius: '35px', width: 'fit-content', fontWeight: 'bold', fontSize: '1.2rem', transition: 'all 0.3s ease' }}
                      onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#D4AF37'; }}
                      onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#D4AF37'; e.currentTarget.style.color = '#16181D'; }}
                    >
                      Abrir Panel de Control ⚙️
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* ========================================== */
              /* VISTA DE 3 TARJETAS PARA EL PÚBLICO/CLIENTE*/
              /* ========================================== */
              <>
                <div className="col-12 col-md-4 reveal-card delay-1">
                  <div className="card h-100 shadow-sm hover-lift" style={{ borderRadius: '15px', overflow: 'hidden', backgroundColor: '#1c1f26', border: '1px solid rgba(212, 175, 55, 0.2)' }}>
                    <img 
                      src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=600&q=80" 
                      className="card-img-top" alt="Eventos corporativos" style={{ height: '220px', objectFit: 'cover' }}
                    />
                    <div className="card-body text-center p-4 d-flex flex-column">
                      <h4 className="card-title fw-bold" style={{ color: '#F3E7E4', fontFamily: "'Georgia', serif" }}>Eventos Corporativos</h4>
                      <p className="card-text mb-4" style={{ color: 'rgba(243, 231, 228, 0.7)', fontSize: '0.95rem', lineHeight: '1.6' }}>
                        Salones equipados y un entorno natural ideal para reuniones, capacitaciones y cenas de empresa.
                      </p>
                      <Link to="/galeria" className="btn mt-auto mx-auto shadow-sm" 
                        style={{ backgroundColor: '#D4AF37', color: '#16181D', border: '2px solid #D4AF37', borderRadius: '25px', width: '80%', fontWeight: 'bold', transition: 'all 0.3s ease' }}
                        onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#D4AF37'; }}
                        onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#D4AF37'; e.currentTarget.style.color = '#16181D'; }}
                      >
                        Ver Galería
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="col-12 col-md-4 reveal-card delay-2">
                  <div className="card h-100 shadow-sm hover-lift" style={{ borderRadius: '15px', overflow: 'hidden', backgroundColor: '#1c1f26', border: '1px solid rgba(212, 175, 55, 0.2)' }}>
                    <img 
                      src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=600&q=80" 
                      className="card-img-top" alt="Visitas y Matrimonios" style={{ height: '220px', objectFit: 'cover' }}
                    />
                    <div className="card-body text-center p-4 d-flex flex-column">
                      <h4 className="card-title fw-bold" style={{ color: '#F3E7E4', fontFamily: "'Georgia', serif" }}>Matrimonios y Visitas</h4>
                      <p className="card-text mb-4" style={{ color: 'rgba(243, 231, 228, 0.7)', fontSize: '0.95rem', lineHeight: '1.6' }}>
                        Haz que tu día sea mágico. Agenda una hora presencial para recorrer los jardines y planificar tu boda.
                      </p>
                      <Link to="/agendaCliente" className="btn mt-auto mx-auto shadow-sm" 
                        style={{ backgroundColor: '#D4AF37', color: '#16181D', border: '2px solid #D4AF37', borderRadius: '25px', width: '80%', fontWeight: 'bold', transition: 'all 0.3s ease' }}
                        onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#D4AF37'; }}
                        onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#D4AF37'; e.currentTarget.style.color = '#16181D'; }}
                      >
                        Agendar Hora
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="col-12 col-md-4 reveal-card delay-3">
                  <div className="card h-100 shadow-sm hover-lift" style={{ borderRadius: '15px', overflow: 'hidden', backgroundColor: '#1c1f26', border: '1px solid rgba(212, 175, 55, 0.2)' }}>
                    <img 
                      src="https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=600&q=80" 
                      className="card-img-top" alt="Cumpleaños y Fiestas" style={{ height: '220px', objectFit: 'cover' }}
                    />
                    <div className="card-body text-center p-4 d-flex flex-column">
                      <h4 className="card-title fw-bold" style={{ color: '#F3E7E4', fontFamily: "'Georgia', serif" }}>Servicios Extra</h4>
                      <p className="card-text mb-4" style={{ color: 'rgba(243, 231, 228, 0.7)', fontSize: '0.95rem', lineHeight: '1.6' }}>
                        Espacios versátiles, gastronomía y decoración para celebrar eventos junto a tus seres queridos.
                      </p>
                      <Link to="/servicios" className="btn mt-auto mx-auto shadow-sm" 
                        style={{ backgroundColor: '#D4AF37', color: '#16181D', border: '2px solid #D4AF37', borderRadius: '25px', width: '80%', fontWeight: 'bold', transition: 'all 0.3s ease' }}
                        onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#D4AF37'; }}
                        onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#D4AF37'; e.currentTarget.style.color = '#16181D'; }}
                      >
                        Ver Servicios
                      </Link>
                    </div>
                  </div>
                </div>
              </>
            )}

          </div>
        </div>
        
        {/* Secciones inferiores también con entrada suave */}
        <div className="reveal-card delay-3">
          <Testimonios/>
          <MapaCasona/>   
        </div>
        
        {/* ========================================== */}
        {/* MODAL DEL ADMIN (CON ANIMACIÓN DE ENTRADA) */}
        {/* ========================================== */}
        {showAdminModal && (
          <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(22, 24, 29, 0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1050, backdropFilter: 'blur(5px)', animation: 'fadeIn 0.3s ease' }}>
            <div className="card p-5 shadow-lg border-0" style={{ width: '800px', maxWidth: '95%', borderRadius: '20px', backgroundColor: '#ffffff', animation: 'fadeInUp 0.4s ease-out' }}>
              
              <div className="text-center mb-5">
                <h3 className="fw-bold" style={{ color: '#16181D', fontFamily: "'Georgia', serif" }}>Centro de Gestión JMS</h3>
                <div style={{ width: '50px', height: '2px', backgroundColor: '#D4AF37', margin: '10px auto' }}></div>
                <p className="text-muted mt-2">Selecciona el módulo que deseas administrar hoy</p>
              </div>

              {/* AHORA ES UNA CUADRÍCULA DE 2x2 PARA LOS 4 MÓDULOS */}
              <div className="row g-4">
                
                {/* Módulo 1: Reservas */}
                <div className="col-12 col-md-6">
                  <Link to="/agendaAdmin" className="text-decoration-none">
                    <div className="card h-100 text-center p-4 border-0 hover-lift" style={{ backgroundColor: '#F3E7E4', borderRadius: '15px' }}>
                      <h1 style={{ fontSize: '3rem', margin: 0 }}>📅</h1>
                      <h5 className="fw-bold mt-3" style={{ color: '#16181D', fontFamily: "'Georgia', serif" }}>Reservas</h5>
                    </div>
                  </Link>
                </div>

                {/* Módulo 2: Inventario */}
                <div className="col-12 col-md-6">
                  <Link to="/stockAdmin" className="text-decoration-none">
                    <div className="card h-100 text-center p-4 border-0 hover-lift" style={{ backgroundColor: '#F3E7E4', borderRadius: '15px' }}>
                      <h1 style={{ fontSize: '3rem', margin: 0 }}>📦</h1>
                      <h5 className="fw-bold mt-3" style={{ color: '#16181D', fontFamily: "'Georgia', serif" }}>Inventario</h5>
                    </div>
                  </Link>
                </div>

                {/* Módulo 3: Galería */}
                <div className="col-12 col-md-6">
                  <Link to="/galeria" className="text-decoration-none">
                    <div className="card h-100 text-center p-4 border-0 hover-lift" style={{ backgroundColor: '#F3E7E4', borderRadius: '15px' }}>
                      <h1 style={{ fontSize: '3rem', margin: 0 }}>🖼️</h1>
                      <h5 className="fw-bold mt-3" style={{ color: '#16181D', fontFamily: "'Georgia', serif" }}>Galería</h5>
                    </div>
                  </Link>
                </div>

                {/* Módulo 4: Servicios */}
                <div className="col-12 col-md-6">
                  <Link to="/serviciosAdmin" className="text-decoration-none">
                    <div className="card h-100 text-center p-4 border-0 hover-lift" style={{ backgroundColor: '#F3E7E4', borderRadius: '15px' }}>
                      <h1 style={{ fontSize: '3rem', margin: 0 }}>🛎️</h1>
                      <h5 className="fw-bold mt-3" style={{ color: '#16181D', fontFamily: "'Georgia', serif" }}>Servicios</h5>
                    </div>
                  </Link>
                </div>

              </div>

              <button 
                className="btn mt-5 w-100 fw-bold" 
                style={{ borderRadius: '25px', padding: '12px', backgroundColor: 'transparent', color: '#16181D', border: '2px solid #16181D', transition: 'all 0.3s ease' }}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#16181D'; e.currentTarget.style.color = '#F3E7E4'; }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#16181D'; }}
                onClick={() => setShowAdminModal(false)}
              >
                Cerrar Panel
              </button>
              
            </div>
          </div>
        )}
        
      </div>
    </div>
  );
}

export default Inicio;