import React from 'react';
import '../styles/footerStyle.css';
import { Link } from 'react-router-dom';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <footer className="pt-1 pb-4 mt-auto footerStyle">
      
      {/* BOTÓN FLOTANTE SOBREPUESTO */}
      <button 
        className="btn rounded-circle shadow-lg" 
        onClick={scrollToTop}
        title="Volver al inicio"
        style={{ 
          
          position: 'fixed',   // Lo "despega" del footer y lo hace flotar en pantalla
          bottom: '30px',      // Separación desde abajo
          right: '30px',       // Separación desde la derecha
          width: '50px', 
          height: '50px', 
          fontSize: '1.5rem', 
          zIndex: 1000,        // Asegura que flote por encima de imágenes y textos
          display: 'flex',     // Centra la flecha perfectamente
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',       // Flecha blanca para que contraste con el fondo celeste
          background:'#556B2F'
        }}
      >
        ⇧
      </button>

      <div className="container text-center text-md-start mt-4">
        <div className="row text-center text-md-start">
          
          <div className="col-md-3 col-lg-3 col-xl-3 mx-auto mt-3">
            <h5 className="text-uppercase mb-4 font-weight-bold" style={{ color: '#556B2F' }}>
              Espacio Casona JMS
            </h5>
            <p>
              Esta es una descripción breve de tu aplicación. Aquí puedes detallar
              el propósito del sistema o la misión de la empresa.
            </p>
          </div>

          <div className="col-md-2 col-lg-2 col-xl-2 mx-auto mt-3">
            <h5 className="text-uppercase mb-4 font-weight-bold" style={{ color: '#556B2F' }}>
              Enlaces
            </h5>
            <p>
              <Link to="/" className="link" onClick={scrollToTop}>Inicio</Link>
            </p>
            <p>
              <Link to="/ayuda" className="link" onClick={scrollToTop}>Acerca de</Link>
            </p>
            <p>
              <a href="#" className="link" onClick={scrollToTop}>Servicios</a>
            </p>
          </div>

          <div className="col-md-4 col-lg-3 col-xl-3 mx-auto mt-3">
            <h5 className="text-uppercase mb-4 font-weight-bold" style={{ color: '#556B2F' }}>
              Contacto
            </h5>
            <p>
              📍 Parcela casas santa teresa lote 1-A Lonquén, 9790000 Isla de Maipo, Región Metropolitana.
            </p>
            <p>
              ✉️ contacto@espaciocasona.cl
            </p>
            <p>
              📞 +56 9 7601 1067
            </p>
          </div>
        </div>

        <hr className="mb-4" />

        <div className="row align-items-center">
          <div className="col-md-12 text-center">
            <p className="mb-0">
              © {new Date().getFullYear()} Copyright: 
              <a href="#" className="text-decoration-none ms-1" style={{ color: '#556B2F' }}>
                <strong style={{ color: '#556B2F' }}>Espacio Casona JMS</strong>
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;