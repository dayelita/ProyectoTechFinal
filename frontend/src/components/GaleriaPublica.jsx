import React, { useState, useEffect, useCallback } from 'react';

const CATEGORIAS = ['Todos', 'Salones', 'Jardines', 'Matrimonios', 'Eventos', 'Gastronomía'];

// Imágenes de muestra usando Unsplash (el backend real las reemplaza)
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

  useEffect(() => {
    cargarImagenes();
  }, []);

  const cargarImagenes = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8081/api/galeria/todas');
      if (response.ok) {
        const data = await response.json();
        setImagenes(data);
      } else {
        // Fallback a demo si el backend no está disponible
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
    <div style={{ backgroundColor: '#fdfbf7', minHeight: '100vh', paddingBottom: '60px' }}>

      {/* Hero Section */}
      <div
        style={{
          background: 'linear-gradient(135deg, #722F37 0%, #4a1c20 100%)',
          color: 'white',
          padding: '60px 20px 50px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(212,175,55,0.15) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.05) 0%, transparent 40%)',
        }} />
        <div style={{ position: 'relative' }}>
          <p style={{ color: '#D4AF37', fontWeight: 600, letterSpacing: '3px', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '12px' }}>
            Espacio Casona JMS
          </p>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.2rem)', fontWeight: 800, marginBottom: '15px' }}>
            Galería de Espacios
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.75)', maxWidth: '520px', margin: '0 auto', lineHeight: 1.6, fontSize: '1.05rem' }}>
            Descubre cada rincón de nuestra casona y déjate inspirar para tu próximo evento.
          </p>
        </div>
      </div>

      {/* Filtros */}
      <div style={{ padding: '35px 20px 10px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '35px' }}>
          {CATEGORIAS.map(cat => (
            <button
              key={cat}
              onClick={() => setFiltro(cat)}
              style={{
                padding: '8px 22px',
                borderRadius: '50px',
                border: '2px solid',
                borderColor: filtro === cat ? '#722F37' : '#ddd',
                backgroundColor: filtro === cat ? '#722F37' : 'white',
                color: filtro === cat ? 'white' : '#555',
                fontWeight: 600,
                fontSize: '0.9rem',
                cursor: 'pointer',
                transition: 'all 0.25s ease',
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Contador */}
        <p style={{ textAlign: 'center', color: '#999', fontSize: '0.85rem', marginBottom: '30px' }}>
          Mostrando <strong style={{ color: '#722F37' }}>{imagenesFiltradas.length}</strong> {imagenesFiltradas.length === 1 ? 'imagen' : 'imágenes'}
        </p>

        {/* Grid Masonry-style */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '15px' }}>🏡</div>
            <p style={{ color: '#999' }}>Cargando galería...</p>
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
                  e.currentTarget.style.boxShadow = '0 8px 30px rgba(114,47,55,0.25)';
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
                    background: 'linear-gradient(to top, rgba(114,47,55,0.85) 0%, transparent 50%)',
                    opacity: 0,
                    transition: 'opacity 0.3s ease',
                    display: 'flex', flexDirection: 'column',
                    justifyContent: 'flex-end',
                    padding: '20px',
                  }}
                >
                  <span style={{
                    display: 'inline-block', backgroundColor: '#D4AF37', color: '#2a0f12',
                    fontSize: '0.7rem', fontWeight: 700, padding: '3px 10px',
                    borderRadius: '20px', marginBottom: '8px', width: 'fit-content',
                    textTransform: 'uppercase', letterSpacing: '1px',
                  }}>
                    {img.categoria}
                  </span>
                  <h3 style={{ color: 'white', margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>{img.titulo}</h3>
                  {img.descripcion && (
                    <p style={{ color: 'rgba(255,255,255,0.8)', margin: '5px 0 0', fontSize: '0.85rem' }}>{img.descripcion}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && imagenesFiltradas.length === 0 && (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <div style={{ fontSize: '3rem', marginBottom: '15px' }}>📸</div>
            <h4 style={{ color: '#722F37' }}>No hay imágenes en esta categoría</h4>
            <p style={{ color: '#999' }}>Prueba seleccionando otra categoría.</p>
          </div>
        )}
      </div>

      {/* Lightbox */}
      {imagenActiva && (
        <div
          onClick={cerrarLightbox}
          style={{
            position: 'fixed', inset: 0,
            backgroundColor: 'rgba(0,0,0,0.92)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 2000, padding: '20px',
          }}
        >
          {/* Botón Anterior */}
          <button
            onClick={e => { e.stopPropagation(); navLightbox(-1); }}
            style={navBtnStyle}
          >❮</button>

          {/* Imagen y detalle */}
          <div
            onClick={e => e.stopPropagation()}
            style={{ maxWidth: '900px', width: '100%', position: 'relative' }}
          >
            <img
              src={imagenActiva.url}
              alt={imagenActiva.titulo}
              style={{ width: '100%', maxHeight: '75vh', objectFit: 'contain', borderRadius: '12px', display: 'block' }}
            />
            <div style={{ padding: '15px 5px 0', color: 'white' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <span style={{ color: '#D4AF37', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px' }}>
                    {imagenActiva.categoria}
                  </span>
                  <h3 style={{ margin: '5px 0 4px', fontSize: '1.3rem' }}>{imagenActiva.titulo}</h3>
                  {imagenActiva.descripcion && (
                    <p style={{ color: 'rgba(255,255,255,0.65)', margin: 0, fontSize: '0.9rem' }}>{imagenActiva.descripcion}</p>
                  )}
                </div>
                <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.85rem', whiteSpace: 'nowrap', marginLeft: '20px' }}>
                  {lightboxIndex + 1} / {imagenesFiltradas.length}
                </span>
              </div>
            </div>
          </div>

          {/* Botón Siguiente */}
          <button
            onClick={e => { e.stopPropagation(); navLightbox(1); }}
            style={navBtnStyle}
          >❯</button>

          {/* Botón cerrar */}
          <button
            onClick={cerrarLightbox}
            style={{
              position: 'fixed', top: '20px', right: '25px',
              background: 'rgba(255,255,255,0.1)', border: 'none',
              color: 'white', fontSize: '1.5rem', width: '44px', height: '44px',
              borderRadius: '50%', cursor: 'pointer', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
            }}
          >✕</button>
        </div>
      )}
    </div>
  );
}

const navBtnStyle = {
  background: 'rgba(255,255,255,0.1)',
  border: 'none',
  color: 'white',
  fontSize: '1.5rem',
  width: '50px', height: '50px',
  borderRadius: '50%',
  cursor: 'pointer',
  margin: '0 15px',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  flexShrink: 0,
  transition: 'background 0.2s',
};
