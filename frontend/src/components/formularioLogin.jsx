import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'; // 🔥 Importamos SweetAlert2

const LoginUsuario = () => {
  const [formData, setFormData] = useState({
    correo: '',
    password: ''
  });

  const [isLoading, setIsLoading] = useState(false);
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

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8081';

      const response = await fetch(`${apiUrl}/api/usuarios/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Correo o contraseña incorrectos');
      }

      localStorage.setItem('token', data.token);
      
      if (data.usuario) {
         localStorage.setItem('idUsuario', data.usuario.id); 
         localStorage.setItem('nombreUsuario', data.usuario.nombre);
         localStorage.setItem('apellidoUsuario', data.usuario.apellido);
         localStorage.setItem('correoUsuario', data.usuario.correo);
         localStorage.setItem('telefonoUsuario', data.usuario.telefono);
         localStorage.setItem('rolUsuario', data.usuario.rol || 'USUARIO'); 
      }

      // 🔥 ALERTA DE BIENVENIDA (Se cierra sola) 🔥
      Swal.fire({
        icon: 'success',
        title: `¡Hola de nuevo, ${data.usuario?.nombre || 'Usuario'}!`,
        text: 'Iniciando sesión...',
        timer: 2000, 
        timerProgressBar: true,
        showConfirmButton: false,
        willClose: () => {
          navigate('/'); // Redirige al calendario o home después de cerrarse
        }
      });

    } catch (err) {
      // 🔥 ALERTA DE CREDENCIALES INCORRECTAS 🔥
      Swal.fire({
        icon: 'error',
        title: 'Acceso Denegado',
        text: err.message || 'Error al conectar con el servidor.',
        confirmButtonColor: '#722F37'
      });
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
          url('https://i.pinimg.com/originals/11/67/ce/1167ce7055b195fe92b57ea7d18b0bd2.jpg')
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