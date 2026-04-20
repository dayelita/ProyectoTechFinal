import React, { useState } from 'react';
import { Link } from 'react-router-dom';

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
  const [mensaje, setMensaje] = useState(null);
  const [error, setError] = useState(null);

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
    setError(null);
    setMensaje(null);

    // --- VALIDACIONES FRONTEND ---
    if (formData.nombre.trim().length < 3) {
      setError('El nombre debe tener al menos 3 caracteres válidos.');
      setIsLoading(false);
      return; 
    }

    if (formData.apellido.trim().length < 3) {
      setError('El apellido debe tener al menos 3 caracteres válidos.');
      setIsLoading(false);
      return; 
    }

    if (formData.password !== formData.repetirPassword) {
      setError('Las contraseñas no coinciden. Por favor, verifica.');
      setIsLoading(false);
      return;
    }

    try {
      // 1. Separar la contraseña repetida (el backend no la necesita)
      const { repetirPassword, ...datosBackend } = formData;
      
      // ==========================================
      // NUEVO: AGREGAR EL ROL POR DEFECTO
      // ==========================================
      const payloadParaServidor = {
        ...datosBackend,
        rol: 'USUARIO' // Todo el que se registre por aquí será usuario normal
      };
      
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8081';

      // 3. HACER LA PETICIÓN REAL AL BACKEND
      const response = await fetch(`${apiUrl}/api/usuarios`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payloadParaServidor), // Se envía con el rol incluido
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Hubo un error al registrar el usuario en el servidor.');
      }

      setMensaje('¡Cuenta creada exitosamente! Ya puedes iniciar sesión.');
      
      setFormData({ 
        nombre: '', apellido: '', correo: '', telefono: '', password: '', repetirPassword: '' 
      });

    } catch (err) {
      setError(err.message || 'No se pudo conectar con el servidor.');
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
          <div className="col-12 col-md-9 col-lg-7 col-xl-6">
            <div className="card" style={{ borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.2)' }}>
              <div className="card-body p-5">
                <h2 className="text-uppercase text-center mb-5" style={{ color: '#722F37' }}>Crear una cuenta</h2>

                {mensaje && <div className="alert alert-success">{mensaje}</div>}
                {error && <div className="alert alert-danger">{error}</div>}

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