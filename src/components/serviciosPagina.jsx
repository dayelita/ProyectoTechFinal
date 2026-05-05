import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

// =============================================
// DATOS DEL CATÁLOGO
// =============================================
const servicios = [
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
    id: 3, categoria: 'Espacios', nombre: 'Terraza Panorámica',
    descripcion: 'Terraza con vista al campo y la cordillera, equipada con toldos retráctiles. Espacio íntimo para grupos pequeños y cenas privadas bajo las estrellas.',
    capacidad: '80 personas', precio: 'Desde $180.000',
    imagen: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=800&fit=crop',
    badge: null,
    detalles: ['Vista panorámica', 'Toldos retráctiles', 'Calefactores exteriores', 'Barra móvil disponible', 'Mobiliario lounge', 'Íntimo y exclusivo'],
  },
  {
    id: 4, categoria: 'Servicios', nombre: 'Catering Premium',
    descripcion: 'Servicio de gastronomía de autor con menús personalizados. Cocineros con experiencia en cocina chilena e internacional. Incluye servicio de mozos.',
    capacidad: 'Sin límite', precio: 'Desde $25.000 /persona',
    imagen: 'https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=800&fit=crop',
    badge: 'Exclusivo', badgeColor: '#722F37',
    detalles: ['Menú personalizado', 'Cocina internacional', 'Mozos incluidos', 'Vajilla de lujo', 'Coordinador de banquetes', 'Opciones veganas'],
  },
  {
    id: 5, categoria: 'Servicios', nombre: 'Decoración Temática',
    descripcion: 'Equipo de decoradores profesionales que transforman cada rincón del espacio según la temática de tu evento. Flores, telas, luminarias y más.',
    capacidad: 'Personalizable', precio: 'Desde $150.000',
    imagen: 'https://images.unsplash.com/photo-1478146059778-26028b07395a?q=80&w=800&fit=crop',
    badge: null,
    detalles: ['Decoradores profesionales', 'Flores naturales', 'Arcos florales', 'Luminarias decorativas', 'Telas y drapeados', 'Visita de diseño incluida'],
  },
  {
    id: 6, categoria: 'Servicios', nombre: 'Fotografía y Video',
    descripcion: 'Equipo de fotógrafos y videógrafos especializados en eventos sociales. Entrega de galería digital y video editado en menos de 30 días.',
    capacidad: 'Full día', precio: 'Desde $200.000',
    imagen: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=800&fit=crop',
    badge: null,
    detalles: ['Cobertura completa', 'Fotografía artística', 'Video cinematográfico', 'Galería digital en 7 días', 'Edición profesional', 'Álbum físico opcional'],
  },
  {
    id: 7, categoria: 'Paquetes', nombre: 'Paquete Matrimonio',
    descripcion: 'Todo lo que necesitas para tu gran día en un solo paquete. Incluye salón, jardines, catering, decoración, fotografía y coordinador de bodas personal.',
    capacidad: 'Hasta 200 personas', precio: 'Desde $2.500.000',
    imagen: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=800&fit=crop',
    badge: 'Todo Incluido', badgeColor: '#722F37',
    detalles: ['Salón + Jardines', 'Catering completo', 'Decoración premium', 'Fotografía y video', 'Coordinador de bodas', 'Suite nupcial', 'Torta de matrimonio', 'Música en vivo'],
  },
  {
    id: 8, categoria: 'Paquetes', nombre: 'Paquete Corporativo',
    descripcion: 'Diseñado para empresas que buscan el escenario perfecto para reuniones, lanzamientos de productos y eventos de team building.',
    capacidad: 'Hasta 150 personas', precio: 'Desde $800.000',
    imagen: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=800&fit=crop',
    badge: null,
    detalles: ['Salón principal', 'Coffee break incluido', 'Almuerzo corporativo', 'Equipo audiovisual', 'WiFi alta velocidad', 'Coordinador de eventos', 'Estacionamiento', 'Factura disponible'],
  },
  {
    id: 9, categoria: 'Paquetes', nombre: 'Paquete Celebración',
    descripcion: 'Para cumpleaños, aniversarios y fiestas familiares. El paquete ideal para crear recuerdos inolvidables con las personas que más amas.',
    capacidad: 'Hasta 100 personas', precio: 'Desde $450.000',
    imagen: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=800&fit=crop',
    badge: 'Familiar', badgeColor: '#D4AF37',
    detalles: ['Salón o terraza', 'Decoración temática', 'Catering básico', 'DJ y sonido', 'Barra de tragos', 'Fotógrafo 4 horas', 'Torta personalizada', 'Coordinador de evento'],
  },
];

const categorias = ['Todos', 'Espacios', 'Servicios', 'Paquetes'];

// =============================================
// PÁGINA PRINCIPAL: CATÁLOGO
// =============================================
export default function Catalogo() {
  const [categoriaActiva, setCategoriaActiva] = useState('Todos');
  const [modalServicio, setModalServicio] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);

  const serviciosFiltrados = categoriaActiva === 'Todos'
    ? servicios
    : servicios.filter(s => s.categoria === categoriaActiva);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#fdfbf7' }}>

      <main style={{ flex: 1 }}>

        {/* HERO */}
        <div style={{
          background: 'linear-gradient(135deg, #722F37 0%, #4a1a20 60%, #2d0f13 100%)',
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
            <h1 style={{ color: 'white', fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: '400', margin: '0 0 16px', fontFamily: 'Georgia, serif' }}>
              Catálogo de Espacios y Servicios
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.72)', fontSize: '1rem', maxWidth: '480px', margin: '0 auto 36px', lineHeight: 1.7, fontFamily: 'sans-serif' }}>
              Elige el espacio y el servicio perfecto para que tu evento sea exactamente como lo soñaste.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '36px', flexWrap: 'wrap' }}>
              {[['300+', 'Eventos realizados'], ['15', 'Años de experiencia'], ['5★', 'Calificación promedio']].map(([num, label]) => (
                <div key={num} style={{ textAlign: 'center' }}>
                  <div style={{ color: '#D4AF37', fontSize: '1.5rem', fontWeight: '700' }}>{num}</div>
                  <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.72rem', letterSpacing: '1px', textTransform: 'uppercase', fontFamily: 'sans-serif' }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* FILTROS */}
        <div className="container" style={{ paddingTop: '40px', paddingBottom: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
            {categorias.map(cat => (
              <button
                key={cat}
                onClick={() => setCategoriaActiva(cat)}
                className="fw-semibold"
                style={{
                  padding: '9px 26px',
                  borderRadius: '50px',
                  border: categoriaActiva === cat ? 'none' : '2px solid #D4AF37',
                  backgroundColor: categoriaActiva === cat ? '#722F37' : 'transparent',
                  color: categoriaActiva === cat ? 'white' : '#722F37',
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                }}
              >{cat}</button>
            ))}
          </div>
          <p style={{ textAlign: 'center', color: '#aaa', fontSize: '0.82rem', marginTop: '12px', fontFamily: 'sans-serif' }}>
            {serviciosFiltrados.length} {serviciosFiltrados.length === 1 ? 'opción disponible' : 'opciones disponibles'}
          </p>
        </div>

        {/* GRID DE CARDS */}
        <div className="container" style={{ paddingBottom: '64px' }}>
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
                  transform: hoveredCard === servicio.id ? 'translateY(-5px)' : 'translateY(0)',
                  boxShadow: hoveredCard === servicio.id
                    ? '0 16px 48px rgba(114,47,55,0.18)'
                    : '0 2px 12px rgba(0,0,0,0.07)',
                  transition: 'all 0.28s ease',
                  cursor: 'pointer',
                }}
              >
                {/* Imagen */}
                <div style={{ position: 'relative', height: '210px', overflow: 'hidden' }}>
                  <img
                    src={servicio.imagen} alt={servicio.nombre}
                    style={{
                      width: '100%', height: '100%', objectFit: 'cover',
                      transform: hoveredCard === servicio.id ? 'scale(1.06)' : 'scale(1)',
                      transition: 'transform 0.4s ease',
                    }}
                  />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.32) 0%, transparent 55%)' }} />
                  <span style={{
                    position: 'absolute', top: '12px', left: '12px',
                    backgroundColor: 'rgba(255,255,255,0.9)', color: '#722F37',
                    fontSize: '0.68rem', fontWeight: '700',
                    padding: '3px 11px', borderRadius: '20px',
                    letterSpacing: '0.8px', textTransform: 'uppercase', fontFamily: 'sans-serif',
                  }}>{servicio.categoria}</span>
                  {servicio.badge && (
                    <span style={{
                      position: 'absolute', top: '12px', right: '12px',
                      backgroundColor: servicio.badgeColor,
                      color: servicio.badgeColor === '#D4AF37' ? '#1a0a0c' : 'white',
                      fontSize: '0.68rem', fontWeight: '700',
                      padding: '3px 11px', borderRadius: '20px', fontFamily: 'sans-serif',
                    }}>{servicio.badge}</span>
                  )}
                </div>

                {/* Body */}
                <div className="card-body p-4">
                  <h5 className="mb-2" style={{ color: '#722F37', fontFamily: 'Georgia, serif', fontWeight: '400', fontSize: '1.15rem' }}>
                    {servicio.nombre}
                  </h5>
                  <p className="text-muted small mb-3" style={{ lineHeight: 1.6 }}>
                    {servicio.descripcion.slice(0, 95)}...
                  </p>
                  <div className="d-flex gap-2 mb-3 flex-wrap">
                    <span className="badge" style={{ backgroundColor: '#FFF8EC', color: '#92600A', fontWeight: '600', fontSize: '0.72rem', padding: '5px 10px' }}>
                      👥 {servicio.capacidad}
                    </span>
                    <span className="badge" style={{ backgroundColor: '#F4E1E6', color: '#722F37', fontWeight: '600', fontSize: '0.72rem', padding: '5px 10px' }}>
                      💰 {servicio.precio}
                    </span>
                  </div>
                  <button
                    className="btn w-100 fw-bold"
                    style={{
                      backgroundColor: hoveredCard === servicio.id ? '#722F37' : 'transparent',
                      color: hoveredCard === servicio.id ? 'white' : '#722F37',
                      border: '2px solid #722F37',
                      borderRadius: '10px',
                      fontSize: '0.88rem',
                      transition: 'all 0.25s ease',
                    }}
                  >Ver detalles →</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* BANNER CTA */}
        <div style={{
          background: 'linear-gradient(135deg, #2d0f13 0%, #722F37 100%)',
          padding: '56px 20px',
          textAlign: 'center',
        }}>
          <div style={{ maxWidth: '560px', margin: '0 auto' }}>
            <p style={{ color: '#D4AF37', letterSpacing: '4px', fontSize: '0.7rem', textTransform: 'uppercase', marginBottom: '10px', fontFamily: 'sans-serif' }}>
              ¿Tienes dudas?
            </p>
            <h2 style={{ color: 'white', fontSize: 'clamp(1.4rem, 3vw, 2rem)', fontWeight: '400', margin: '0 0 14px', fontFamily: 'Georgia, serif' }}>
              Agenda una visita sin costo
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.68)', marginBottom: '28px', lineHeight: 1.7, fontSize: '0.95rem', fontFamily: 'sans-serif' }}>
              Recorre nuestros espacios y diseña tu evento perfecto con nuestra coordinadora.
            </p>
            <div className="d-flex gap-3 justify-content-center flex-wrap">
              <NavLink to="/agendaCitas" className="btn fw-bold px-4 py-2" style={{ backgroundColor: '#D4AF37', color: '#1a0a0b', borderRadius: '25px', border: 'none' }}>
                Agendar visita
              </NavLink>
              <a href="https://wa.me/56976011067" target="_blank" rel="noopener noreferrer"
                className="btn fw-semibold px-4 py-2"
                style={{ backgroundColor: 'transparent', color: 'white', border: '2px solid rgba(255,255,255,0.4)', borderRadius: '25px' }}>
                WhatsApp →
              </a>
            </div>
          </div>
        </div>

      </main>

      {/* MODAL DETALLE */}
      {modalServicio && (
        <div
          onClick={() => setModalServicio(null)}
          style={{
            position: 'fixed', inset: 0,
            backgroundColor: 'rgba(0,0,0,0.65)',
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            zIndex: 1050, padding: '20px',
            backdropFilter: 'blur(4px)',
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            className="card border-0 shadow-lg"
            style={{ width: '100%', maxWidth: '580px', maxHeight: '90vh', overflowY: 'auto', borderRadius: '20px' }}
          >
            {/* Imagen modal */}
            <div style={{ position: 'relative', height: '230px', flexShrink: 0 }}>
              <img src={modalServicio.imagen} alt={modalServicio.nombre}
                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '20px 20px 0 0' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.45) 0%, transparent 50%)', borderRadius: '20px 20px 0 0' }} />
              <button
                onClick={() => setModalServicio(null)}
                style={{
                  position: 'absolute', top: '14px', right: '14px',
                  backgroundColor: 'rgba(0,0,0,0.45)', color: 'white',
                  border: 'none', borderRadius: '50%', width: '34px', height: '34px',
                  fontSize: '1rem', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >✕</button>
              {modalServicio.badge && (
                <span style={{
                  position: 'absolute', top: '14px', left: '14px',
                  backgroundColor: modalServicio.badgeColor,
                  color: modalServicio.badgeColor === '#D4AF37' ? '#1a0a0c' : 'white',
                  fontSize: '0.72rem', fontWeight: '700',
                  padding: '4px 13px', borderRadius: '20px', fontFamily: 'sans-serif',
                }}>{modalServicio.badge}</span>
              )}
            </div>

            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-start flex-wrap gap-3 mb-3">
                <div>
                  <span style={{ color: '#D4AF37', fontSize: '0.7rem', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase', fontFamily: 'sans-serif' }}>
                    {modalServicio.categoria}
                  </span>
                  <h4 className="mb-0 mt-1" style={{ color: '#722F37', fontFamily: 'Georgia, serif', fontWeight: '400', fontSize: '1.4rem' }}>
                    {modalServicio.nombre}
                  </h4>
                </div>
                <div className="text-end">
                  <div className="fw-bold" style={{ color: '#722F37', fontSize: '1.1rem' }}>{modalServicio.precio}</div>
                  <div className="text-muted small">👥 {modalServicio.capacidad}</div>
                </div>
              </div>

              <p className="text-muted mb-4" style={{ lineHeight: 1.7, fontSize: '0.93rem' }}>{modalServicio.descripcion}</p>

              <div style={{ backgroundColor: '#fdf8f8', borderRadius: '12px', padding: '18px', marginBottom: '24px', border: '1px solid #f0e0e0' }}>
                <h6 className="fw-bold mb-3" style={{ color: '#722F37', fontSize: '0.8rem', letterSpacing: '1px', textTransform: 'uppercase' }}>
                  ✦ Qué incluye
                </h6>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  {modalServicio.detalles.map((det, i) => (
                    <div key={i} className="d-flex align-items-center gap-2 small" style={{ color: '#555' }}>
                      <span style={{ color: '#D4AF37', flexShrink: 0, fontWeight: '700' }}>✓</span>
                      {det}
                    </div>
                  ))}
                </div>
              </div>

              <div className="d-flex gap-2">
                <NavLink to="/agendaCitas" className="btn fw-bold flex-fill"
                  style={{ backgroundColor: '#722F37', color: 'white', borderRadius: '10px', border: 'none', padding: '12px' }}>
                  Solicitar este servicio
                </NavLink>
                <a href="https://wa.me/56976011067" target="_blank" rel="noopener noreferrer"
                  className="btn fw-semibold flex-fill"
                  style={{ backgroundColor: 'transparent', color: '#722F37', border: '2px solid #722F37', borderRadius: '10px', padding: '12px' }}>
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