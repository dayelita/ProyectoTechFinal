import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';

// =============================================
// DATOS DE RESPALDO (Fallback por si el backend falla)
// =============================================
const SERVICIOS_DEMO = [
  {
    id: 1, categoria: 'Espacios', nombre: 'Salón Principal',
    descripcion: 'Amplio salón interior con capacidad para hasta 200 personas, ideal para banquetes, ceremonias y eventos corporativos. Equipado con iluminación regulable y climatización.',
    capacidad: '200 personas', precio: 'Desde $350.000',
    imagen: 'https://images.unsplash.com/photo-1510076857177-7470076d4098?q=80&w=800&fit=crop',
    badge: 'Más Popular', badgeColor: '#D4AF37',
    detalles: ['Iluminación regulable', 'Climatización central', 'Sistema de sonido', 'Proyector 4K', 'Pista de baile', 'Acceso inclusivo'],
  },
  {
    id: 2, categoria: 'Espacios', nombre: 'Jardines Exteriores',
    descripcion: 'Hermosos jardines de 3.000 m² con árboles centenarios y fuentes de agua. Perfecto para ceremonias al aire libre, cócteles y sesiones fotográficas.',
    capacidad: '300 personas', precio: 'Desde $280.000',
    imagen: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&fit=crop',
    badge: null,
    detalles: ['3.000 m² de terreno', 'Árboles centenarios', 'Fuentes de agua', 'Iluminación exterior', 'Zona de cóctel', 'Estacionamiento privado'],
  },
  {
    id: 3, categoria: 'Servicios', nombre: 'Catering Premium',
    descripcion: 'Servicio de gastronomía de autor con menús personalizados. Cocineros con experiencia en cocina chilena e internacional.',
    capacidad: 'Sin límite', precio: 'Desde $25.000 /persona',
    imagen: 'https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=800&fit=crop',
    badge: 'Exclusivo', badgeColor: '#16181D',
    detalles: ['Menú personalizado', 'Cocina internacional', 'Mozos incluidos', 'Vajilla de lujo'],
  }
];

const categoriasTabs = ['Todos', 'Espacios', 'Servicios', 'Paquetes'];

// =============================================
// PÁGINA PRINCIPAL: CATÁLOGO DE SERVICIOS
// =============================================
export default function Catalogo() {
  const [servicios, setServicios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoriaActiva, setCategoriaActiva] = useState('Todos');
  const [modalServicio, setModalServicio] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081';

  // 🔥 1. Cargar servicios desde el backend al iniciar la página
  useEffect(() => {
    cargarServicios();
  }, []);

  const cargarServicios = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/servicios/todos`);
      if (response.ok) {
        const data = await response.json();
        setServicios(data.length > 0 ? data : SERVICIOS_DEMO);
      } else {
        setServicios(SERVICIOS_DEMO); // Si hay error HTTP (ej. 500)
      }
    } catch (error) {
      console.error("No se pudo conectar al backend. Cargando datos de muestra.");
      setServicios(SERVICIOS_DEMO); // Si el servidor está apagado
    } finally {
      setLoading(false);
    }
  };

  // 🔥 2. Filtrado dinámico según la pestaña seleccionada
  const serviciosFiltrados = categoriaActiva === 'Todos'
    ? servicios
    : servicios.filter(s => s.categoria === categoriaActiva);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#F3E7E4' }}>

      <main style={{ flex: 1 }}>

        {/* HERO SECTION */}
        <div style={{
          background: 'linear-gradient(135deg, #16181D 0%, #1c1f26 60%, #0d0f12 100%)', // 🔥 Azul Noche
          padding: '70px 20px 55px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(212,175,55,0.09) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(212,175,55,0.06) 0%, transparent 40%)',
          }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <p style={{ color: '#D4AF37', letterSpacing: '6px', fontSize: '0.72rem', textTransform: 'uppercase', marginBottom: '14px', fontFamily: 'sans-serif' }}>
              ✦ &nbsp; Espacio Casona JMS &nbsp; ✦
            </p>
            <h1 style={{ color: '#F3E7E4', fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: '400', margin: '0 0 16px', fontFamily: 'Georgia, serif' }}>
              Catálogo de Espacios y Servicios
            </h1>
            <p style={{ color: 'rgba(243, 231, 228, 0.7)', fontSize: '1rem', maxWidth: '480px', margin: '0 auto 36px', lineHeight: 1.7, fontFamily: 'sans-serif' }}>
              Elige el espacio y el servicio perfecto para que tu evento sea exactamente como lo soñaste.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '36px', flexWrap: 'wrap' }}>
              {[['300+', 'Eventos realizados'], ['15', 'Años de experiencia'], ['5★', 'Calificación promedio']].map(([num, label]) => (
                <div key={num} style={{ textAlign: 'center' }}>
                  <div style={{ color: '#D4AF37', fontSize: '1.5rem', fontWeight: '700' }}>{num}</div>
                  <div style={{ color: 'rgba(243, 231, 228, 0.5)', fontSize: '0.72rem', letterSpacing: '1px', textTransform: 'uppercase', fontFamily: 'sans-serif' }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* TABS DE FILTRADO */}
        <div className="container" style={{ paddingTop: '40px', paddingBottom: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
            {categoriasTabs.map(cat => (
              <button
                key={cat}
                onClick={() => setCategoriaActiva(cat)}
                className="fw-semibold"
                style={{
                  padding: '9px 26px',
                  borderRadius: '50px',
                  border: categoriaActiva === cat ? '2px solid #16181D' : '2px solid #16181D',
                  backgroundColor: categoriaActiva === cat ? '#16181D' : 'transparent',
                  color: categoriaActiva === cat ? '#D4AF37' : '#16181D',
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                }}
              >{cat}</button>
            ))}
          </div>
          <p style={{ textAlign: 'center', color: '#666', fontSize: '0.82rem', marginTop: '12px', fontFamily: 'sans-serif' }}>
            {serviciosFiltrados.length} {serviciosFiltrados.length === 1 ? 'opción disponible' : 'opciones disponibles'}
          </p>
        </div>

        {/* GRID DE TARJETAS */}
        <div className="container" style={{ paddingBottom: '64px' }}>
          
          {loading ? (
            <div className="text-center py-5">
               <div className="spinner-border" style={{ color: '#D4AF37' }} role="status"></div>
               <p className="mt-3" style={{ color: '#16181D' }}>Cargando catálogo...</p>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '24px',
            }}>
              {serviciosFiltrados.map(servicio => (
                <div
                  key={servicio.id}
                  onMouseEnter={() => setHoveredCard(servicio.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                  onClick={() => setModalServicio(servicio)}
                  className="card border-0"
                  style={{
                    borderRadius: '15px',
                    overflow: 'hidden',
                    backgroundColor: '#ffffff',
                    transform: hoveredCard === servicio.id ? 'translateY(-5px)' : 'translateY(0)',
                    boxShadow: hoveredCard === servicio.id
                      ? '0 16px 48px rgba(0,0,0,0.15)'
                      : '0 4px 15px rgba(0,0,0,0.05)',
                    transition: 'all 0.28s ease',
                    cursor: 'pointer',
                  }}
                >
                  {/* Imagen de la tarjeta */}
                  <div style={{ position: 'relative', height: '210px', overflow: 'hidden' }}>
                    <img
                      src={servicio.imagen || 'https://via.placeholder.com/800x600?text=Sin+Imagen'} 
                      alt={servicio.nombre}
                      style={{
                        width: '100%', height: '100%', objectFit: 'cover',
                        transform: hoveredCard === servicio.id ? 'scale(1.06)' : 'scale(1)',
                        transition: 'transform 0.4s ease',
                      }}
                    />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(22,24,29,0.7) 0%, transparent 60%)' }} />
                    <span style={{
                      position: 'absolute', top: '12px', left: '12px',
                      backgroundColor: 'rgba(255,255,255,0.9)', color: '#16181D',
                      fontSize: '0.68rem', fontWeight: '700',
                      padding: '3px 11px', borderRadius: '20px',
                      letterSpacing: '0.8px', textTransform: 'uppercase', fontFamily: 'sans-serif',
                    }}>{servicio.categoria}</span>
                    
                    {servicio.badge && (
                      <span style={{
                        position: 'absolute', top: '12px', right: '12px',
                        backgroundColor: servicio.badgeColor || '#D4AF37',
                        color: servicio.badgeColor === '#D4AF37' ? '#16181D' : '#D4AF37',
                        fontSize: '0.68rem', fontWeight: '700',
                        padding: '3px 11px', borderRadius: '20px', fontFamily: 'sans-serif',
                      }}>{servicio.badge}</span>
                    )}
                  </div>

                  {/* Contenido de la tarjeta */}
                  <div className="card-body p-4 d-flex flex-column">
                    <h5 className="mb-2" style={{ color: '#16181D', fontFamily: 'Georgia, serif', fontWeight: 'bold', fontSize: '1.2rem' }}>
                      {servicio.nombre}
                    </h5>
                    <p className="text-muted small mb-3 flex-grow-1" style={{ lineHeight: 1.6 }}>
                      {servicio.descripcion.slice(0, 95)}...
                    </p>
                    <div className="d-flex gap-2 mb-4 flex-wrap">
                      <span className="badge" style={{ backgroundColor: '#F3E7E4', color: '#16181D', fontWeight: '600', fontSize: '0.75rem', padding: '6px 12px', border: '1px solid #ddd' }}>
                        👥 {servicio.capacidad}
                      </span>
                      <span className="badge" style={{ backgroundColor: '#16181D', color: '#D4AF37', fontWeight: '600', fontSize: '0.75rem', padding: '6px 12px' }}>
                        💰 {servicio.precio}
                      </span>
                    </div>
                    <button
                      className="btn w-100 fw-bold mt-auto"
                      style={{
                        backgroundColor: hoveredCard === servicio.id ? '#16181D' : 'transparent',
                        color: hoveredCard === servicio.id ? '#D4AF37' : '#16181D',
                        border: '2px solid #16181D',
                        borderRadius: '10px',
                        fontSize: '0.88rem',
                        transition: 'all 0.25s ease',
                      }}
                    >Ver detalles →</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* BANNER INFERIOR LLAMADO A LA ACCIÓN */}
        <div style={{
          background: 'linear-gradient(135deg, #0d0f12 0%, #16181D 100%)',
          padding: '56px 20px',
          textAlign: 'center',
        }}>
          <div style={{ maxWidth: '560px', margin: '0 auto' }}>
            <p style={{ color: '#D4AF37', letterSpacing: '4px', fontSize: '0.7rem', textTransform: 'uppercase', marginBottom: '10px', fontFamily: 'sans-serif' }}>
              ¿Tienes dudas?
            </p>
            <h2 style={{ color: '#F3E7E4', fontSize: 'clamp(1.4rem, 3vw, 2rem)', fontWeight: '400', margin: '0 0 14px', fontFamily: 'Georgia, serif' }}>
              Agenda una visita sin costo
            </h2>
            <p style={{ color: 'rgba(243, 231, 228, 0.7)', marginBottom: '28px', lineHeight: 1.7, fontSize: '0.95rem', fontFamily: 'sans-serif' }}>
              Recorre nuestros espacios y diseña tu evento perfecto con nuestra coordinadora.
            </p>
            <div className="d-flex gap-3 justify-content-center flex-wrap">
              <NavLink to="/agendaCitas" className="btn fw-bold px-4 py-2" style={{ backgroundColor: '#D4AF37', color: '#16181D', borderRadius: '25px', border: 'none' }}>
                Agendar visita
              </NavLink>
              <a href="https://wa.me/56976011067" target="_blank" rel="noopener noreferrer"
                className="btn fw-semibold px-4 py-2"
                style={{ backgroundColor: 'transparent', color: '#D4AF37', border: '2px solid rgba(212, 175, 55, 0.5)', borderRadius: '25px' }}>
                WhatsApp →
              </a>
            </div>
          </div>
        </div>

      </main>

      {/* MODAL DETALLE FLOTANTE */}
      {modalServicio && (
        <div
          onClick={() => setModalServicio(null)}
          style={{
            position: 'fixed', inset: 0,
            backgroundColor: 'rgba(22,24,29,0.85)', 
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            zIndex: 1050, padding: '20px',
            backdropFilter: 'blur(5px)',
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            className="card border-0 shadow-lg"
            style={{ width: '100%', maxWidth: '580px', maxHeight: '90vh', overflowY: 'auto', borderRadius: '20px', backgroundColor: '#ffffff' }}
          >
            {/* Imagen modal */}
            <div style={{ position: 'relative', height: '230px', flexShrink: 0 }}>
              <img src={modalServicio.imagen || 'https://via.placeholder.com/800x600'} alt={modalServicio.nombre}
                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '20px 20px 0 0' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(22,24,29,0.7) 0%, transparent 60%)', borderRadius: '20px 20px 0 0' }} />
              <button
                onClick={() => setModalServicio(null)}
                style={{
                  position: 'absolute', top: '14px', right: '14px',
                  backgroundColor: 'rgba(22,24,29,0.6)', color: '#F3E7E4',
                  border: 'none', borderRadius: '50%', width: '34px', height: '34px',
                  fontSize: '1rem', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >✕</button>
              {modalServicio.badge && (
                <span style={{
                  position: 'absolute', top: '14px', left: '14px',
                  backgroundColor: modalServicio.badgeColor || '#D4AF37',
                  color: modalServicio.badgeColor === '#D4AF37' ? '#16181D' : '#D4AF37',
                  fontSize: '0.72rem', fontWeight: '700',
                  padding: '4px 13px', borderRadius: '20px', fontFamily: 'sans-serif',
                }}>{modalServicio.badge}</span>
              )}
            </div>

            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-start flex-wrap gap-3 mb-3">
                <div>
                  <span style={{ color: '#D4AF37', fontSize: '0.75rem', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase', fontFamily: 'sans-serif' }}>
                    {modalServicio.categoria}
                  </span>
                  <h4 className="mb-0 mt-1" style={{ color: '#16181D', fontFamily: 'Georgia, serif', fontWeight: 'bold', fontSize: '1.5rem' }}>
                    {modalServicio.nombre}
                  </h4>
                </div>
                <div className="text-end">
                  <div className="fw-bold" style={{ color: '#16181D', fontSize: '1.1rem' }}>{modalServicio.precio}</div>
                  <div className="text-muted small">👥 {modalServicio.capacidad}</div>
                </div>
              </div>

              <p className="text-muted mb-4" style={{ lineHeight: 1.7, fontSize: '0.95rem' }}>{modalServicio.descripcion}</p>

              {/* RENDERIZADO DINÁMICO DE DETALLES */}
              {modalServicio.detalles && modalServicio.detalles.length > 0 && (
                <div style={{ backgroundColor: '#F3E7E4', borderRadius: '12px', padding: '18px', marginBottom: '24px', border: '1px solid rgba(212, 175, 55, 0.3)' }}>
                  <h6 className="fw-bold mb-3" style={{ color: '#16181D', fontSize: '0.85rem', letterSpacing: '1px', textTransform: 'uppercase' }}>
                    ✦ Qué incluye
                  </h6>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    {modalServicio.detalles.map((det, i) => (
                      <div key={i} className="d-flex align-items-center gap-2 small" style={{ color: '#4b5563' }}>
                        <span style={{ color: '#D4AF37', flexShrink: 0, fontWeight: '700', fontSize: '1.1rem' }}>✓</span>
                        {det}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="d-flex gap-2">
                <NavLink to="/agendaCitas" className="btn fw-bold flex-fill"
                  style={{ backgroundColor: '#16181D', color: '#D4AF37', borderRadius: '10px', border: 'none', padding: '12px' }}>
                  Solicitar este servicio
                </NavLink>
                <a href="https://wa.me/56976011067" target="_blank" rel="noopener noreferrer"
                  className="btn fw-semibold flex-fill"
                  style={{ backgroundColor: 'transparent', color: '#16181D', border: '2px solid #16181D', borderRadius: '10px', padding: '12px' }}>
                  WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}