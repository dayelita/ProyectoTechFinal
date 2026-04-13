import React from 'react'
import "../styles/navbarStyle.css"
import { Link } from 'react-router-dom';

export default function NavBar() {
  return (
    <div className="navbarStyle">
      <nav className="navbar navbar-expand-lg">
        <div className="container-fluid">
          
          <a className="navbar-brand" href="#">Espacio Casona JMS</a>
          
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          
          <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
            {/* Agregamos 'ms-auto' aquí para empujar todo a la derecha */}
            <div className="navbar-nav ms-auto">
              <Link className="nav-link active" aria-current="page" to="/">Inicio</Link>
              <Link className="nav-link" to="/ayuda">Ayuda</Link>
              <Link className="nav-link" to="/registro">Crear Cuenta</Link>
              <Link className="nav-link" to="/login">Iniciar Sesion</Link>
              <Link className="nav-link" to="/catalogo">Catalogo</Link>

            </div>
          </div>
          
        </div>
      </nav>
    </div>
  );
}
