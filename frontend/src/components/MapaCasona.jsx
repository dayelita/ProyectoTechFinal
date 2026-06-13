import React from 'react';

const CASONA_LAT = -33.7358;
const CASONA_LNG = -70.9003;

export default function MapaCasona() {
  const embedUrl =
    `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3329.0!2d${CASONA_LNG}!3d${CASONA_LAT}` +
    `!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1` +
    `!3m3!1m2!1s0x0%3A0x0!2zMznCsDQ0JzA4LjkiUyA3MMKwNTQnMDEuMSJX` +
    `!5e0!3m2!1ses!2scl!4v1680000000000!5m2!1ses!2scl` +
    `&q=Parcela+casas+santa+teresa+lote+1-A+Lonquen+Isla+de+Maipo`;

  return (
    
    <section className="mapa-section py-5 position-relative z-index-1">
      <div className="container">

       
        <div className="text-center mb-5 reveal-title">
          <h2 className="fw-bold" style={{ color: '#F3E7E4', fontFamily: "'Georgia', serif", fontSize: '2.5rem' }}>
            📍 ¿Cómo llegar?
          </h2>
          <div style={{ width: '60px', height: '3px', backgroundColor: '#D4AF37', margin: '15px auto' }}></div>
          <p style={{ color: 'rgba(243, 231, 228, 0.7)', fontSize: '1.1rem' }}>
            Parcela Casas Santa Teresa Lote 1-A Lonquén, Isla de Maipo, Región Metropolitana
          </p>
        </div>

        {/* BORDE DEL MAPA*/}
        <div
          className="shadow-lg rounded-4 overflow-hidden reveal-card delay-1"
          style={{ border: '2px solid #D4AF37', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}
        >
          <iframe
            title="Ubicación Espacio Casona JMS"
            src={`https://www.google.com/maps?q=Parcela+casas+santa+teresa+lote+1-A,+Lonquen,+Isla+de+Maipo,+Chile&output=embed&z=15`}
            width="100%"
            height="450"
            style={{ border: 0, display: 'block', filter: 'contrast(1.1) saturate(1.1)' }} // Un ligero filtro para que el mapa se vea más vibrante
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>

        {/* INFO DE CARDS DEBAJO DEL MAPA  */}
        <div className="row g-4 mt-4 text-center">
          
          {/* MINI CARD DE LA UBICACION */}
          <div className="col-12 col-md-4 reveal-card delay-2">
            <div className="p-4 rounded-4 h-100 shadow-sm" style={{ backgroundColor: 'rgba(28, 31, 38, 0.8)', backdropFilter: 'blur(10px)', border: '1px solid rgba(212, 175, 55, 0.2)', borderTop: '3px solid #D4AF37', transition: 'transform 0.3s ease' }}
                 onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-5px)'}
                 onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
              <div style={{ fontSize: '2rem', marginBottom: '10px' }}>📍</div>
              <h6 className="fw-bold" style={{ color: '#F3E7E4', fontFamily: "'Georgia', serif", fontSize: '1.2rem' }}>Dirección</h6>
              <p className="small mb-0" style={{ color: 'rgba(243, 231, 228, 0.7)', fontSize: '0.95rem' }}>
                Parcela Casas Santa Teresa Lote 1-A<br />
                Lonquén, Isla de Maipo<br />
                Región Metropolitana, 9790000
              </p>
            </div>
          </div>
          
          {/* MINI CARD DEL TELEFONO */}
          <div className="col-12 col-md-4 reveal-card delay-3">
            <div className="p-4 rounded-4 h-100 shadow-sm" style={{ backgroundColor: 'rgba(28, 31, 38, 0.8)', backdropFilter: 'blur(10px)', border: '1px solid rgba(212, 175, 55, 0.2)', borderTop: '3px solid #D4AF37', transition: 'transform 0.3s ease' }}
                 onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-5px)'}
                 onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
              <div style={{ fontSize: '2rem', marginBottom: '10px' }}>📞</div>
              <h6 className="fw-bold" style={{ color: '#F3E7E4', fontFamily: "'Georgia', serif", fontSize: '1.2rem' }}>Teléfono</h6>
              <p className="small mb-0" style={{ color: 'rgba(243, 231, 228, 0.7)', fontSize: '0.95rem' }}>+56 9 7601 1067</p>
            </div>
          </div>
          
          {/* MINI CARD DEL MAIL */}
          <div className="col-12 col-md-4 reveal-card delay-3">
            <div className="p-4 rounded-4 h-100 shadow-sm" style={{ backgroundColor: 'rgba(28, 31, 38, 0.8)', backdropFilter: 'blur(10px)', border: '1px solid rgba(212, 175, 55, 0.2)', borderTop: '3px solid #D4AF37', transition: 'transform 0.3s ease' }}
                 onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-5px)'}
                 onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
              <div style={{ fontSize: '2rem', marginBottom: '10px' }}>✉️</div>
              <h6 className="fw-bold" style={{ color: '#F3E7E4', fontFamily: "'Georgia', serif", fontSize: '1.2rem' }}>Email</h6>
              <p className="small mb-0" style={{ color: 'rgba(243, 231, 228, 0.7)', fontSize: '0.95rem' }}>contacto@espaciocasona.cl</p>
            </div>
          </div>

        </div>

        {/* BOTON QUE ABRE GOOGLE MAPS EXTERNO  */}
        <div className="text-center mt-5 reveal-card delay-3">
          <a
            href="https://www.google.com/maps/search/Isla+de+Maipo+Lonquen+Parcela+Santa+Teresa"
            target="_blank"
            rel="noopener noreferrer"
            className="btn px-5 py-3 fw-bold shadow-sm"
            style={{
              backgroundColor: 'transparent',
              color: '#D4AF37',
              borderRadius: '30px',
              border: '2px solid #D4AF37',
              textDecoration: 'none',
              transition: 'all 0.3s ease',
              fontSize: '1.1rem',
              letterSpacing: '0.5px'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.backgroundColor = '#D4AF37';
              e.currentTarget.style.color = '#16181D';
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.boxShadow = '0 10px 20px rgba(212, 175, 55, 0.2)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#D4AF37';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            🗺️ Abrir en Google Maps
          </a>
        </div>

      </div>
    </section>
  );
}