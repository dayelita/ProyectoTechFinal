import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const LoginUsuario = () => {
  const [formData, setFormData] = useState({
    correo: '',
    password: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8081';

      // 1. HACER LA PETICIÓN POST AL BACKEND
      const response = await fetch(`${apiUrl}/api/usuarios/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      // 2. SI LAS CREDENCIALES SON INCORRECTAS
      if (!response.ok) {
        throw new Error(data.message || 'Correo o contraseña incorrectos');
      }

      // ==========================================
      // 3. SI EL LOGIN ES EXITOSO: GUARDAR DATOS
      // ==========================================
      localStorage.setItem('token', data.token);
      
      if (data.usuario) {
         // 👇 ESTA ES LA LÍNEA CRÍTICA PARA QUE NO FALLE LA RESERVA 👇
         localStorage.setItem('idUsuario', data.usuario.id); 
         
         localStorage.setItem('nombreUsuario', data.usuario.nombre);
         localStorage.setItem('apellidoUsuario', data.usuario.apellido);
         localStorage.setItem('correoUsuario', data.usuario.correo);
         localStorage.setItem('telefonoUsuario', data.usuario.telefono);
         
         // GUARDAMOS EL ROL DEL USUARIO
         localStorage.setItem('rolUsuario', data.usuario.rol || 'USUARIO'); 
      }

      // ==========================================
      // 4. REDIRIGIR AL HOME AUTOMÁTICAMENTE
      // ==========================================
      navigate('/'); 

    } catch (err) {
      setError(err.message || 'Error al conectar con el servidor.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      style={{ 
        minHeight: '100vh', 
        display: 'flex',
        alignItems: 'center',
        padding: '50px 15px', 
        backgroundImage: `
          linear-gradient(to right, rgba(140, 45, 45, 0.85), rgba(105, 36, 36, 0.81)),
          url('https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1920&q=80')
        `,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="container">
        <div className="row d-flex justify-content-center align-items-center">
          <div className="col-12 col-md-8 col-lg-6 col-xl-5">
            <div className="card" style={{ borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.2)' }}>
              <div className="card-body p-5">
                <h2 className="text-uppercase text-center mb-5" style={{ color: '#722F37', fontWeight: 'bold' }}>
                  Iniciar Sesión
                </h2>

                {error && <div className="alert alert-danger text-center">{error}</div>}

                <form onSubmit={handleSubmit}>
                  
                  <div className="form-outline mb-4">
                    <label className="form-label mb-1" htmlFor="correo" style={{ color: '#722F37', fontWeight: 'bold' }}>Correo Electrónico</label>
                    <input 
                      type="email" 
                      id="correo" 
                      name="correo" 
                      value={formData.correo} 
                      onChange={handleChange} 
                      className="form-control form-control-lg" 
                      required 
                      autoComplete="email"
                    />
                  </div>

                  <div className="form-outline mb-5">
                    <label className="form-label mb-1" htmlFor="password" style={{ color: '#722F37', fontWeight: 'bold' }}>Contraseña</label>
                    <input 
                      type="password" 
                      id="password" 
                      name="password" 
                      value={formData.password} 
                      onChange={handleChange} 
                      className="form-control form-control-lg" 
                      required 
                    />
                  </div>

                  <div className="d-flex justify-content-center">
                    <button 
                      type="submit" 
                      disabled={isLoading}
                      className="btn btn-block btn-lg border-0 shadow-sm"
                      style={{ 
                        width: '100%', 
                        background: '#D4AF37', 
                        color: 'white',
                        fontWeight: 'bold',
                        transition: '0.3s'
                      }}
                    >
                      {isLoading ? 'Verificando datos...' : 'Ingresar'}
                    </button>
                  </div>

                  <p className="text-center text-muted mt-5 mb-0">
                    ¿No tienes una cuenta? <Link to="/registro" className="fw-bold" style={{ color: '#722F37' }}><u>Regístrate aquí</u></Link>
                  </p>

                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginUsuario;