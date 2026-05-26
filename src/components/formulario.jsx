import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'; 

const RegistroUsuario = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    correo: '',
    telefono: '',
    password: '',
    repetirPassword: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate(); 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // --- VALIDACIONES FRONTEND ---
    if (formData.nombre.trim().length < 3) {
      Swal.fire({ icon: 'warning', title: 'Nombre muy corto', text: 'El nombre debe tener al menos 3 caracteres válidos.', confirmButtonColor: '#16181D', background: '#F3E7E4' });
      setIsLoading(false);
      return; 
    }

    if (formData.apellido.trim().length < 3) {
      Swal.fire({ icon: 'warning', title: 'Apellido muy corto', text: 'El apellido debe tener al menos 3 caracteres válidos.', confirmButtonColor: '#16181D', background: '#F3E7E4' });
      setIsLoading(false);
      return; 
    }

    if (formData.password !== formData.repetirPassword) {
      Swal.fire({ icon: 'error', title: 'Error en contraseñas', text: 'Las contraseñas no coinciden. Por favor, verifica.', confirmButtonColor: '#16181D', background: '#F3E7E4' });
      setIsLoading(false);
      return;
    }

    try {
      const { repetirPassword, ...datosBackend } = formData;
      
      const payloadParaServidor = {
        ...datosBackend,
        rol: 'USUARIO'
      };
      
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8081';

      const response = await fetch(`${apiUrl}/api/usuarios`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payloadParaServidor),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Hubo un error al registrar el usuario en el servidor.');
      }

      // 🔥 ALERTA DE ÉXITO PRECIOSA 🔥
      Swal.fire({
        icon: 'success',
        title: '¡Bienvenido a la familia!',
        text: 'Tu cuenta en Casona JMS se creó exitosamente.',
        confirmButtonColor: '#16181D',
        background: '#F3E7E4',
        color: '#16181D',
        confirmButtonText: 'Ir a Iniciar Sesión'
      }).then((result) => {
        if (result.isConfirmed) {
          navigate('/login'); 
        }
      });
      
      setFormData({ 
        nombre: '', apellido: '', correo: '', telefono: '', password: '', repetirPassword: '' 
      });

    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'No se pudo registrar',
        text: err.message || 'No se pudo conectar con el servidor.',
        confirmButtonColor: '#16181D',
        background: '#F3E7E4'
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
        padding: '60px 15px', 
        // 🔥 Nuevo fondo inmersivo elegante 🔥
        backgroundImage: `
          linear-gradient(to right, rgba(22, 24, 29, 0.92), rgba(22, 24, 29, 0.75)),
          url('https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1920&q=80')
        `,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="container">
        <div className="row d-flex justify-content-center align-items-center">
          <div className="col-12 col-md-9 col-lg-7 col-xl-6">
            
            <div className="card border-0" style={{ borderRadius: '20px', boxShadow: '0 20px 50px rgba(0,0,0,0.5)', backgroundColor: '#ffffff' }}>
              <div className="card-body p-5">
                
                <div className="text-center mb-4">
                  <h2 className="fw-bold mb-2" style={{ color: '#16181D', fontFamily: "'Georgia', serif", fontSize: '2.2rem' }}>
                    Crear una cuenta
                  </h2>
                  <div style={{ width: '50px', height: '3px', backgroundColor: '#D4AF37', margin: '0 auto' }}></div>
                </div>

                <form onSubmit={handleSubmit}>
                  
                  <div className="row mb-3">
                    <div className="col-md-6 mb-3 mb-md-0">
                      <label className="form-label" htmlFor="nombre" style={{ color: '#16181D', fontWeight: 'bold', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Nombre</label>
                      <input type="text" id="nombre" name="nombre" value={formData.nombre} onChange={handleChange} 
                        className="form-control" style={{ padding: '12px', borderRadius: '10px', border: '1px solid #ddd', backgroundColor: '#fafafa' }} required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label" htmlFor="apellido" style={{ color: '#16181D', fontWeight: 'bold', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Apellido</label>
                      <input type="text" id="apellido" name="apellido" value={formData.apellido} onChange={handleChange} 
                        className="form-control" style={{ padding: '12px', borderRadius: '10px', border: '1px solid #ddd', backgroundColor: '#fafafa' }} required />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label" htmlFor="correo" style={{ color: '#16181D', fontWeight: 'bold', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Correo Electrónico</label>
                    <input type="email" id="correo" name="correo" value={formData.correo} onChange={handleChange} 
                      className="form-control" style={{ padding: '12px', borderRadius: '10px', border: '1px solid #ddd', backgroundColor: '#fafafa' }} required />
                  </div>

                  <div className="mb-3">
                    <label className="form-label" htmlFor="telefono" style={{ color: '#16181D', fontWeight: 'bold', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Teléfono</label>
                    <input type="tel" id="telefono" name="telefono" value={formData.telefono} onChange={handleChange} 
                      className="form-control" style={{ padding: '12px', borderRadius: '10px', border: '1px solid #ddd', backgroundColor: '#fafafa' }} placeholder="Ej: +56 9..." required />
                  </div>

                  <div className="mb-3">
                    <label className="form-label" htmlFor="password" style={{ color: '#16181D', fontWeight: 'bold', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Contraseña</label>
                    <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} 
                      className="form-control" style={{ padding: '12px', borderRadius: '10px', border: '1px solid #ddd', backgroundColor: '#fafafa' }} placeholder="••••••••" required />
                  </div>

                  <div className="mb-4">
                    <label className="form-label" htmlFor="repetirPassword" style={{ color: '#16181D', fontWeight: 'bold', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Confirmar Contraseña</label>
                    <input type="password" id="repetirPassword" name="repetirPassword" value={formData.repetirPassword} onChange={handleChange} 
                      className="form-control" style={{ padding: '12px', borderRadius: '10px', border: '1px solid #ddd', backgroundColor: '#fafafa' }} placeholder="••••••••" required />
                  </div>

                  <div className="form-check d-flex justify-content-center mb-4">
                    <input className="form-check-input me-2" type="checkbox" id="terms" required style={{ cursor: 'pointer' }} />
                    <label className="form-check-label text-muted small" htmlFor="terms">
                      Acepto las condiciones de los <a href="#!" style={{ color: '#D4AF37', fontWeight: 'bold', textDecoration: 'none' }}>Términos de servicio</a>
                    </label>
                  </div>

                  <button 
                    type="submit" 
                    disabled={isLoading}
                    className="btn w-100 fw-bold shadow-sm"
                    style={{ 
                      padding: '14px',
                      background: '#16181D', 
                      color: '#D4AF37',
                      borderRadius: '30px',
                      fontSize: '1.1rem',
                      transition: 'all 0.3s ease',
                      border: '2px solid #16181D'
                    }}
                    onMouseEnter={e => {
                      if(!isLoading) {
                        e.currentTarget.style.background = '#D4AF37';
                        e.currentTarget.style.color = '#16181D';
                      }
                    }}
                    onMouseLeave={e => {
                      if(!isLoading) {
                        e.currentTarget.style.background = '#16181D';
                        e.currentTarget.style.color = '#D4AF37';
                      }
                    }}
                  >
                    {isLoading ? 'Registrando...' : 'Registrarse'}
                  </button>

                  <p className="text-center text-muted mt-4 mb-0" style={{ fontSize: '0.95rem' }}>
                    ¿Ya tienes una cuenta? <Link to="/login" style={{ color: '#16181D', fontWeight: 'bold', textDecoration: 'none', borderBottom: '2px solid #D4AF37' }}>Inicia sesión aquí</Link>
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

export default RegistroUsuario;