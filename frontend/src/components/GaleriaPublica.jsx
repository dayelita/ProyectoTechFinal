import React, { useState, useEffect, useCallback } from 'react';

const CATEGORIAS = ['Todos', 'Salones', 'Jardines', 'Matrimonios', 'Eventos', 'Gastronomía'];

// IMAGENES DEMO SERAN REMPLAZADAS SI EL BACKEND ESTA CONECTADO O ENCENDIDO
const IMAGENES_DEMO = [
  { id: 1, url: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800', titulo: 'Salón Principal', categoria: 'Salones', descripcion: 'Salón central con capacidad para 200 personas' },
  { id: 2, url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800', titulo: 'Jardines Exteriores', categoria: 'Jardines', descripcion: 'Amplios jardines para cócteles y fotografías' },
  { id: 3, url: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800', titulo: 'Ceremonia de Matrimonio', categoria: 'Matrimonios', descripcion: 'Espacio acondicionado para ceremonias íntimas' },
  { id: 4, url: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800', titulo: 'Evento Corporativo', categoria: 'Eventos', descripcion: 'Sala de reuniones y capacitaciones' },
  { id: 5, url: 'https://images.unsplash.com/photo-1510076857177-7470076d4098?w=800', titulo: 'Salón de Gala', categoria: 'Salones', descripcion: 'Iluminación especial para celebraciones formales' },
  { id: 6, url: 'https://images.unsplash.com/photo-1525648199074-cee30ba79a4a?w=800', titulo: 'Mesa de Banquete', categoria: 'Gastronomía', descripcion: 'Servicio de catering premium incluido' },
  { id: 7, url: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800', titulo: 'Recepción de Matrimonio', categoria: 'Matrimonios', descripcion: 'Decoración floral y ambientación especial' },
  { id: 8, url: 'https://images.unsplash.com/photo-1531058020387-3be344556be6?w=800', titulo: 'Terraza al Atardecer', categoria: 'Jardines', descripcion: 'Vista panorámica de los viñedos' },
  { id: 9, url: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800', titulo: 'Cena de Gala', categoria: 'Gastronomía', descripcion: 'Menú degustación con maridaje incluido' },
];

export default function GaleriaPublica() {
  const [imagenes, setImagenes] = useState([]);
  const [filtro, setFiltro] = useState('Todos');
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081';

  useEffect(() => {
    cargarImagenes();
  }, []);

  const cargarImagenes = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/galeria/todas`);
      if (response.ok) {
        const data = await response.json();
        setImagenes(data);
      } else {
        // SI NO ESTA DISPONIBLE EL BACKEND HARA UN FALLBACK CON LAS IMAGENES DEMO 
        setImagenes(IMAGENES_DEMO);
      }
    } catch {
      setImagenes(IMAGENES_DEMO);
    } finally {
      setLoading(false);
    }
  };

  const imagenesFiltradas = filtro === 'Todos'
    ? imagenes
    : imagenes.filter(img => img.categoria === filtro);

  const abrirLightbox = (index) => setLightboxIndex(index);
  const cerrarLightbox = () => setLightboxIndex(null);

  const navLightbox = useCallback((dir) => {
    setLightboxIndex(prev => {
      const total = imagenesFiltradas.length;
      return (prev + dir + total) % total;
    });
  }, [imagenesFiltradas.length]);

  useEffect(() => {
    const handleKey = (e) => {
      if (lightboxIndex === null) return;
      if (e.key === 'ArrowRight') navLightbox(1);
      if (e.key === 'ArrowLeft') navLightbox(-1);
      if (e.key === 'Escape') cerrarLightbox();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [lightboxIndex, navLightbox]);

  const imagenActiva = lightboxIndex !== null ? imagenesFiltradas[lightboxIndex] : null;

  return (
    <div style={{ backgroundColor: '#F3E7E4', minHeight: '100vh', paddingBottom: '60px' }}>

      {/* BANNER DE LA GALERIA PUBLICA*/}
      <div
        style={{
          background: 'linear-gradient(135deg, #16181D 0%, #1c1f26 60%, #0d0f12 100%)', // 🔥 Azul Noche
          color: 'white',
          padding: '60px 20px 50px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(212,175,55,0.09) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(212,175,55,0.06) 0%, transparent 40%)',
        }} />
        <div style={{ position: 'relative' }}>
          <p style={{ color: '#D4AF37', fontWeight: 600, letterSpacing: '4px', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '12px', fontFamily: 'sans-serif' }}>
            ✦  Espacio Casona JMS  ✦
          </p>
          <h1 style={{ color: '#F3E7E4', fontSize: 'clamp(2rem, 5vw, 3.2rem)', fontWeight: 400, marginBottom: '15px', fontFamily: 'Georgia, serif' }}>
            Galería de Espacios
          </h1>
          <p style={{ color: 'rgba(243, 231, 228, 0.7)', maxWidth: '520px', margin: '0 auto', lineHeight: 1.6, fontSize: '1.05rem', fontFamily: 'sans-serif' }}>
            Descubre cada rincón de nuestra casona y déjate inspirar para tu próximo evento.
          </p>
        </div>
      </div>

      {/* FILTROS DE LAS IMAGENES */}
      <div style={{ padding: '35px 20px 10px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '35px' }}>
          {CATEGORIAS.map(cat => (
            <button
              key={cat}
              onClick={() => setFiltro(cat)}
              className="fw-semibold"
              style={{
                padding: '9px 26px',
                borderRadius: '50px',
                border: '2px solid #16181D',
                backgroundColor: filtro === cat ? '#16181D' : 'transparent',
                color: filtro === cat ? '#D4AF37' : '#16181D',
                fontSize: '0.88rem',
                cursor: 'pointer',
                transition: 'all 0.25s ease',
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* CONTADOR DE LAS IMAGENES */}
        <p style={{ textAlign: 'center', color: '#666', fontSize: '0.82rem', marginBottom: '30px', fontFamily: 'sans-serif' }}>
          Mostrando <strong style={{ color: '#16181D' }}>{imagenesFiltradas.length}</strong> {imagenesFiltradas.length === 1 ? 'imagen' : 'imágenes'}
        </p>

        {/* CARGADOR DE LA GALERIA */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <div className="spinner-border" style={{ color: '#D4AF37', width: '3rem', height: '3rem' }} role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
            <p style={{ color: '#666', marginTop: '15px' }}>Cargando galería...</p>
          </div>
        ) : (
          <div style={{
            columns: 'auto 300px',
            columnGap: '16px',
          }}>
            {imagenesFiltradas.map((img, index) => (
              <div
                key={img.id}
                onClick={() => abrirLightbox(index)}
                style={{
                  breakInside: 'avoid',
                  marginBottom: '16px',
                  borderRadius: '14px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  position: 'relative',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'scale(1.02)';
                  e.currentTarget.style.boxShadow = '0 16px 48px rgba(0,0,0,0.15)';
                  e.currentTarget.querySelector('.overlay').style.opacity = '1';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.08)';
                  e.currentTarget.querySelector('.overlay').style.opacity = '0';
                }}
              >
                <img
                  src={img.url}
                  alt={img.titulo}
                  style={{ width: '100%', display: 'block', objectFit: 'cover' }}
                  loading="lazy"
                />
                <div
                  className="overlay"
                  style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(to top, rgba(22,24,29,0.85) 0%, transparent 60%)', // 🔥 Sombra Azul Noche
                    opacity: 0,
                    transition: 'opacity 0.3s ease',
                    display: 'flex', flexDirection: 'column',
                    justifyContent: 'flex-end',
                    padding: '20px',
                  }}
                >
                  <span style={{
                    display: 'inline-block', backgroundColor: '#D4AF37', color: '#16181D',
                    fontSize: '0.7rem', fontWeight: 700, padding: '3px 11px',
                    borderRadius: '20px', marginBottom: '8px', width: 'fit-content',
                    textTransform: 'uppercase', letterSpacing: '1px', fontFamily: 'sans-serif'
                  }}>
                    {img.categoria}
                  </span>
                  <h3 style={{ color: '#F3E7E4', margin: 0, fontSize: '1.2rem', fontFamily: 'Georgia, serif' }}>{img.titulo}</h3>
                  {img.descripcion && (
                    <p style={{ color: 'rgba(243, 231, 228, 0.7)', margin: '5px 0 0', fontSize: '0.85rem', fontFamily: 'sans-serif' }}>{img.descripcion}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && imagenesFiltradas.length === 0 && (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <div style={{ fontSize: '3rem', marginBottom: '15px' }}>🖼️</div>
            <h4 style={{ color: '#16181D', fontFamily: 'Georgia, serif' }}>No hay imágenes en esta categoría</h4>
            <p style={{ color: '#666' }}>Prueba seleccionando otra categoría.</p>
          </div>
        )}
      </div>

      {/* VISTA DE LAS IMAGENES */}
      {imagenActiva && (
        <div
          onClick={cerrarLightbox}
          style={{
            position: 'fixed', inset: 0,
            backgroundColor: 'rgba(22,24,29,0.92)', 
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 2000, padding: '20px',
            backdropFilter: 'blur(5px)'
          }}
        >
          {/* BOTON PARA RETROCEDER */}
          <button
            onClick={e => { e.stopPropagation(); navLightbox(-1); }}
            style={navBtnStyle}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#D4AF37'; e.currentTarget.style.color = '#16181D'; }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#F3E7E4'; }}
          >❮</button>

          {/* DETALLES DE LA IMAGEN */}
          <div
            onClick={e => e.stopPropagation()}
            style={{ maxWidth: '1000px', width: '100%', position: 'relative' }}
          >
            <img
              src={imagenActiva.url}
              alt={imagenActiva.titulo}
              style={{ width: '100%', maxHeight: '75vh', objectFit: 'contain', borderRadius: '12px', display: 'block', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}
            />
            <div style={{ padding: '20px 10px 0', color: '#F3E7E4' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <span style={{ color: '#D4AF37', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', fontFamily: 'sans-serif' }}>
                    {imagenActiva.categoria}
                  </span>
                  <h3 style={{ margin: '8px 0 4px', fontSize: '1.5rem', fontFamily: 'Georgia, serif' }}>{imagenActiva.titulo}</h3>
                  {imagenActiva.descripcion && (
                    <p style={{ color: 'rgba(243, 231, 228, 0.7)', margin: 0, fontSize: '0.95rem', fontFamily: 'sans-serif' }}>{imagenActiva.descripcion}</p>
                  )}
                </div>
                <span style={{ color: 'rgba(243, 231, 228, 0.5)', fontSize: '0.9rem', whiteSpace: 'nowrap', marginLeft: '20px', fontFamily: 'sans-serif' }}>
                  {lightboxIndex + 1} / {imagenesFiltradas.length}
                </span>
              </div>
            </div>
          </div>

          {/* BOTON PARA AVANZAR */}
          <button
            onClick={e => { e.stopPropagation(); navLightbox(1); }}
            style={navBtnStyle}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#D4AF37'; e.currentTarget.style.color = '#16181D'; }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#F3E7E4'; }}
          >❯</button>

          {/* BOTON PARA CERRAR */}
          <button
            onClick={cerrarLightbox}
            style={{
              position: 'fixed', top: '25px', right: '30px',
              background: 'rgba(255,255,255,0.1)', border: 'none',
              color: '#F3E7E4', fontSize: '1.5rem', width: '44px', height: '44px',
              borderRadius: '50%', cursor: 'pointer', display: 'flex',
              alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s ease'
            }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#D4AF37'; e.currentTarget.style.color = '#16181D'; e.currentTarget.style.transform = 'scale(1.1)'; }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#F3E7E4'; e.currentTarget.style.transform = 'scale(1)'; }}
          >✕</button>
        </div>
      )}
    </div>
  );
}

const navBtnStyle = {
  background: 'rgba(255,255,255,0.1)',
  border: 'none',
  color: '#F3E7E4',
  fontSize: '1.5rem',
  width: '50px', height: '50px',
  borderRadius: '50%',
  cursor: 'pointer',
  margin: '0 15px',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  flexShrink: 0,
  transition: 'all 0.3s ease',
};