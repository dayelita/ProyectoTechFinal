import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'; // 🔥 Importamos SweetAlert2

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
  const navigate = useNavigate(); // 🔥 Usamos navigate para mandarlo al login

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
      Swal.fire({ icon: 'warning', title: 'Nombre muy corto', text: 'El nombre debe tener al menos 3 caracteres válidos.', confirmButtonColor: '#722F37' });
      setIsLoading(false);
      return; 
    }

    if (formData.apellido.trim().length < 3) {
      Swal.fire({ icon: 'warning', title: 'Apellido muy corto', text: 'El apellido debe tener al menos 3 caracteres válidos.', confirmButtonColor: '#722F37' });
      setIsLoading(false);
      return; 
    }

    if (formData.password !== formData.repetirPassword) {
      Swal.fire({ icon: 'error', title: 'Error en contraseñas', text: 'Las contraseñas no coinciden. Por favor, verifica.', confirmButtonColor: '#722F37' });
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
        confirmButtonColor: '#722F37',
        confirmButtonText: 'Ir a Iniciar Sesión'
      }).then((result) => {
        if (result.isConfirmed) {
          navigate('/login'); // Redirige automático al hacer clic
        }
      });
      
      setFormData({ 
        nombre: '', apellido: '', correo: '', telefono: '', password: '', repetirPassword: '' 
      });

    } catch (err) {
      // 🔥 ALERTA DE ERROR DE SERVIDOR 🔥
      Swal.fire({
        icon: 'error',
        title: 'No se pudo registrar',
        text: err.message || 'No se pudo conectar con el servidor.',
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
          <div className="col-12 col-md-9 col-lg-7 col-xl-6">
            <div className="card" style={{ borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.2)' }}>
              <div className="card-body p-5">
                <h2 className="text-uppercase text-center mb-5" style={{ color: '#722F37' }}>Crear una cuenta</h2>

                <form onSubmit={handleSubmit}>
                  
                  <div className="row mb-4">
                    <div className="col">
                      <div className="form-outline">
                        <label className="form-label mb-1" htmlFor="nombre" style={{ color: '#722F37', fontWeight: 'bold' }}>Tu Nombre</label>
                        <input type="text" id="nombre" name="nombre" value={formData.nombre} onChange={handleChange} className="form-control form-control-lg" required />
                      </div>
                    </div>
                    <div className="col">
                      <div className="form-outline">
                        <label className="form-label mb-1" htmlFor="apellido" style={{ color: '#722F37', fontWeight: 'bold' }}>Tu Apellido</label>
                        <input type="text" id="apellido" name="apellido" value={formData.apellido} onChange={handleChange} className="form-control form-control-lg" required />
                      </div>
                    </div>
                  </div>

                  <div className="form-outline mb-4">
                    <label className="form-label mb-1" htmlFor="correo" style={{ color: '#722F37', fontWeight: 'bold' }}>Tu Correo Electrónico</label>
                    <input type="email" id="correo" name="correo" value={formData.correo} onChange={handleChange} className="form-control form-control-lg" required />
                  </div>

                  <div className="form-outline mb-4">
                    <label className="form-label mb-1" htmlFor="telefono" style={{ color: '#722F37', fontWeight: 'bold' }}>Tu Teléfono</label>
                    <input type="tel" id="telefono" name="telefono" value={formData.telefono} onChange={handleChange} className="form-control form-control-lg" required />
                  </div>

                  <div className="form-outline mb-4">
                    <label className="form-label mb-1" htmlFor="password" style={{ color: '#722F37', fontWeight: 'bold' }}>Contraseña</label>
                    <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} className="form-control form-control-lg" required />
                  </div>

                  <div className="form-outline mb-4">
                    <label className="form-label mb-1" htmlFor="repetirPassword" style={{ color: '#722F37', fontWeight: 'bold' }}>Repite tu contraseña</label>
                    <input type="password" id="repetirPassword" name="repetirPassword" value={formData.repetirPassword} onChange={handleChange} className="form-control form-control-lg" required />
                  </div>

                  <div className="form-check d-flex justify-content-center mb-5">
                    <input className="form-check-input me-2" type="checkbox" id="terms" required />
                    <label className="form-check-label" htmlFor="terms">
                      Acepto todas las condiciones de los <a href="#!" className="text-body" style={{ color: '#722F37' }}><u>Términos de servicio</u></a>
                    </label>
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
                        fontWeight: 'bold'
                      }}
                    >
                      {isLoading ? 'Registrando...' : 'Registrarse'}
                    </button>
                  </div>

                  <p className="text-center text-muted mt-5 mb-0">
                    ¿Ya tienes una cuenta? <Link to="/login" className="fw-bold" style={{ color: '#722F37' }}><u>Inicia sesión aquí</u></Link>
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