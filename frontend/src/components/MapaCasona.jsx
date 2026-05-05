import React, { useEffect, useRef, useState } from 'react';

// Coordenadas de Espacio Casona JMS - Isla de Maipo, Región Metropolitana
const CASONA_LAT = -33.7358;
const CASONA_LNG = -70.9003;

export default function MapaCasona() {
  // URL del embed de Google Maps apuntando a la dirección exacta
  // Zoom y movimiento habilitados por defecto en el iframe embed
  const embedUrl =
    `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3329.0!2d${CASONA_LNG}!3d${CASONA_LAT}` +
    `!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1` +
    `!3m3!1m2!1s0x0%3A0x0!2zMznCsDQ0JzA4LjkiUyA3MMKwNTQnMDEuMSJX` +
    `!5e0!3m2!1ses!2scl!4v1680000000000!5m2!1ses!2scl` +
    `&q=Parcela+casas+santa+teresa+lote+1-A+Lonquen+Isla+de+Maipo`;

  return (
    <section className="mapa-section py-5" style={{ backgroundColor: '#fdfbf7' }}>
      <div className="container">

        {/* Encabezado */}
        <div className="text-center mb-4">
          <h2 className="fw-bold" style={{ color: '#722F37' }}>
            📍 ¿Cómo llegar?
          </h2>
          <p className="text-muted">
            Parcela Casas Santa Teresa Lote 1-A Lonquén, Isla de Maipo, Región Metropolitana
          </p>
        </div>

        {/* Mapa embebido con borde decorativo*/}
        <div
          className="shadow rounded-4 overflow-hidden"
          style={{ border: '3px solid #722F37' }}
        >
          <iframe
            title="Ubicación Espacio Casona JMS"
            
            src={`https://www.google.com/maps?q=Parcela+casas+santa+teresa+lote+1-A,+Lonquen,+Isla+de+Maipo,+Chile&output=embed&z=15`}
            width="100%"
            height="450"
            style={{ border: 0, display: 'block' }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>

        {/* Info cards debajo del mapa */}
        <div className="row g-3 mt-3 text-center">
          <div className="col-12 col-md-4">
            <div className="p-3 rounded-3 h-100" style={{ backgroundColor: '#fff8f0', border: '1px solid #f0e0cc' }}>
              <div style={{ fontSize: '1.8rem' }}>📍</div>
              <h6 className="fw-bold mt-2" style={{ color: '#722F37' }}>Dirección</h6>
              <p className="text-muted small mb-0">
                Parcela Casas Santa Teresa Lote 1-A<br />
                Lonquén, Isla de Maipo<br />
                Región Metropolitana, 9790000
              </p>
            </div>
          </div>
          <div className="col-12 col-md-4">
            <div className="p-3 rounded-3 h-100" style={{ backgroundColor: '#fff8f0', border: '1px solid #f0e0cc' }}>
              <div style={{ fontSize: '1.8rem' }}>📞</div>
              <h6 className="fw-bold mt-2" style={{ color: '#722F37' }}>Teléfono</h6>
              <p className="text-muted small mb-0">+56 9 7601 1067</p>
            </div>
          </div>
          <div className="col-12 col-md-4">
            <div className="p-3 rounded-3 h-100" style={{ backgroundColor: '#fff8f0', border: '1px solid #f0e0cc' }}>
              <div style={{ fontSize: '1.8rem' }}>✉️</div>
              <h6 className="fw-bold mt-2" style={{ color: '#722F37' }}>Email</h6>
              <p className="text-muted small mb-0">contacto@espaciocasona.cl</p>
            </div>
          </div>
        </div>

        {/* Botón para abrir Google Maps externo*/}
        <div className="text-center mt-4">
          <a
            href="https://www.google.com/maps/search/Isla+de+Maipo+Lonquen+Parcela+Santa+Teresa"
            target="_blank"
            rel="noopener noreferrer"
            className="btn px-4 py-2 fw-bold"
            style={{
              backgroundColor: '#722F37',
              color: 'white',
              borderRadius: '25px',
              textDecoration: 'none',
            }}
          >
            🗺️ Abrir en Google Maps
          </a>
        </div>

      </div>
    </section>
  );
}