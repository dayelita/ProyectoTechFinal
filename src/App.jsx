import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';


import Servicios from './pages/servicios.jsx';
import Inicio from './pages/inicio.jsx'
import Registro from './pages/registro.jsx'
import Login from './pages/login.jsx'
import Catalogo from './pages/catalogo.jsx'
import StockAdmin from './pages/stockAdmin.jsx'

import AgendaPrincipal from './components/AgendaPrincipal';
import Testimonios from './components/Testimonios.jsx'
import NavBar from "./components/NavBar.jsx"
import Footer from "./components/Footer.jsx"


import './App.css'

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js'




function App() {
  const backgroundUrl = "https://th.bing.com/th/id/R.4772884abefa73d050904fedcc3be520?rik=i%2b7rVZ0wTyPRvg&pid=ImgRaw&r=0";
  

  return (
    <>
    <div className="d-flex flex-column min-vh-100">
      <BrowserRouter>
      <NavBar />

      {/* 2. Este div asegura que el contenido empuje el footer hacia abajo */}
      <div style={{ minHeight: '80vh' }}>
        <Routes>
          {/* 3. Cuando la ruta sea la raíz ("/"), React cargará el componente Inicio en este espacio */}
          <Route path="/" element={<Inicio/>} />
          
          {/* Aquí agregarás las demás rutas más adelante */}
          <Route path="/servicios" element={<Servicios />} /> 
          
          <Route path="/registro" element={<Registro />} />
          <Route path="/login" element={<Login />} />
          <Route path="/catalogo" element={<Catalogo />} />
          <Route path="/stockAdmin" element={<StockAdmin />} />
          <Route path="/agendaCitas" element={<AgendaPrincipal />} />
          <Route path="/testimonios" element={<Testimonios/>} />
           

        </Routes>
      </div>
     
      <Footer />
      </BrowserRouter>
      </div>
    </>
  )
}

export default App
