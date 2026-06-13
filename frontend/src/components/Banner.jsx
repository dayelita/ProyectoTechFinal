import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function CarruselInicio() {
  return (
    <div id="carruselCasona" className="carousel slide mb-5" data-bs-ride="carousel" style={{ position: 'relative' }}>
      {/* TEXTO FIJO */}
      <div 
        style={{
          position: 'absolute',
          inset: 0, // ESTE OCUPARA TODO EL ANCHO Y ALTO DEL CARRUSEL 
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 10, // ESTARA ENCIMA DE LAS IMAGENES
          pointerEvents: 'none', // LOS CLICKS IRAN DIRECTO A LAS FLECHAS
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.6) 100%)', // OSCURECERA LAS FOTOS RESALTANDO EL TEXTO 
          textAlign: 'center',
          padding: '0 20px'
        }}
      >
        <p style={{ 
          color: '#D4AF37', 
          letterSpacing: '4px', 
          textTransform: 'uppercase', 
          fontSize: '0.9rem', 
          fontWeight: '600',
          marginBottom: '10px',
          textShadow: '1px 1px 4px rgba(0,0,0,0.8)'
        }}>
          ✦ Espacio Casona JMS ✦
        </p>
        <h1 style={{ 
          color: 'white', 
          fontFamily: 'Georgia, serif', 
          fontSize: 'clamp(2rem, 5vw, 4rem)', // LO HARA RESPONSIVO PARA COMPUTADOR Y CELULARES
          fontWeight: '400',
          lineHeight: '1.2',
          maxWidth: '800px',
          textShadow: '2px 2px 10px rgba(0,0,0,0.8)'
        }}>
          Un lugar ideal para planear tu boda y celebraciones
        </h1>
      </div>

      {/* MOSTRARA VISUALMENTE CON PUNTOS EN QUE IMAGEN ESTARA */}
      <div className="carousel-indicators" style={{ zIndex: 15 }}>
        <button type="button" data-bs-target="#carruselCasona" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
        <button type="button" data-bs-target="#carruselCasona" data-bs-slide-to="1" aria-label="Slide 2"></button>
        <button type="button" data-bs-target="#carruselCasona" data-bs-slide-to="2" aria-label="Slide 3"></button>
      </div>

      {/* IMAGENES DEL CARRUSEL PARA INICIO*/}
      <div className="carousel-inner" style={{ maxHeight: '550px' }}>
        
        {/* IMAGEN  1 */}
        <div className="carousel-item active">
          <img 
            src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=2000" 
            className="d-block w-100" 
            alt="Fachada Casona" 
            style={{ objectFit: 'cover', height: '550px' }} 
          />
        </div>

        {/* IMAGEN 2 */}
        <div className="carousel-item">
          <img 
            src="https://images.unsplash.com/photo-1510076857177-7470076d4098?q=80&w=1920&h=1080&fit=crop" 
            className="d-block w-100" 
            alt="Salón Principal" 
            style={{ objectFit: 'cover', height: '550px' }} 
          />
        </div>

        {/* IMAGEN 3*/}
        <div className="carousel-item">
          <img 
            src="https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1920&h=1080&fit=crop" 
            className="d-block w-100" 
            alt="Jardines" 
            style={{ objectFit: 'cover', height: '550px' }} 
          />
        </div>

      </div>

      {/* PARA RETROCEDER LA IMAGEN */}
      <button className="carousel-control-prev" type="button" data-bs-target="#carruselCasona" data-bs-slide="prev" style={{ zIndex: 15 }}>
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Anterior</span>
      </button>
      
      {/* PARA AVANZAR LA IMAGEN */}
      <button className="carousel-control-next" type="button" data-bs-target="#carruselCasona" data-bs-slide="next" style={{ zIndex: 15 }}>
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Siguiente</span>
      </button>
      
    </div>
  );
}