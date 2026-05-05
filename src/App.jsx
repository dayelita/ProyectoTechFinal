import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// 🔥 El Guardián
import ProtectedRoute from './components/ProtectedRoute.jsx';

// Vistas
import Perfil from './pages/perfil.jsx'; 
import Servicios from './pages/servicios.jsx';
import Inicio from './pages/inicio.jsx'
import Registro from './pages/registro.jsx'
import Login from './pages/login.jsx'
import StockAdmin from './pages/stockAdmin.jsx'

import AgendaCliente from './components/AgendaCliente.jsx'
import AgendaAdmin from './components/AgendaAdmin.jsx'
import AgendaPrincipal from './components/AgendaPrincipal';
import Testimonios from './components/Testimonios.jsx'
import NavBar from "./components/NavBar.jsx"
import Footer from "./components/Footer.jsx"
import MapaCasona from "./components/MapaCasona.jsx"

// 🔥 La Galería de tu compañero (Reemplaza al catálogo viejo)
import GaleriaPrincipal from './components/GaleriaPrincipal.jsx';

import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

function App() {
  return (
    <>
    <div className="d-flex flex-column min-vh-100">
      <BrowserRouter>
      <NavBar />

      <div style={{ minHeight: '80vh' }}>
        <Routes>
          {/* =========================================
              🟢 RUTAS PÚBLICAS
              ========================================= */}
          <Route path="/" element={<Inicio/>} />
          <Route path="/servicios" element={<Servicios />} /> 
          <Route path="/registro" element={<Registro />} />
          <Route path="/login" element={<Login />} />
          <Route path="/testimonios" element={<Testimonios/>} />

          {/* 🔥 Ruta hacia el trabajo de tu compañero */}
          <Route path="/catalogo" element={<GaleriaPrincipal />} />
          <Route path="/galeria" element={<GaleriaPrincipal />} />

          {/* 🔥 Agendas (Tienen su propio candado visual) */}
          <Route path="/agendaCitas" element={<AgendaPrincipal />} />
          <Route path="/agendaCliente" element={<AgendaCliente />} />

          {/* 🔥 RUTA PROTEGIDA: Solo usuarios logueados (sean Admin o Clientes) pueden entrar */}
            <Route 
              path="/perfil" 
              element={
              <ProtectedRoute>
                <Perfil />
              </ProtectedRoute>}/>

              
          {/* =========================================
              🔴 RUTAS DE ADMIN (Protegidas)
              ========================================= */}
          <Route 
            path="/stockAdmin" 
            element={
              <ProtectedRoute rolRequerido="ADMIN">
                <StockAdmin />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/agendaAdmin" 
            element={
              <ProtectedRoute rolRequerido="ADMIN">
                <AgendaAdmin />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </div>
     
      <Footer />
      </BrowserRouter>
      </div>
    </>
  )
}

export default App