import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

export default function Perfil() {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    correo: '',
    telefono: '',
    password: '',
    confirmPassword: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081';

  // Cargar datos actuales desde localStorage al entrar a la página
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      nombre: localStorage.getItem('nombreUsuario') || '',
      apellido: localStorage.getItem('apellidoUsuario') || '',
      correo: localStorage.getItem('correoUsuario') || '',
      telefono: localStorage.getItem('telefonoUsuario') || '' 
    }));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGuardar = async (e) => {
    e.preventDefault();

    // 1. Validamos contraseñas
    if (formData.password || formData.confirmPassword) {
      if (formData.password !== formData.confirmPassword) {
        Swal.fire({ 
          icon: 'error', 
          title: 'Las contraseñas no coinciden', 
          confirmButtonColor: '#16181D', 
          background: '#F3E7E4', 
          color: '#16181D' 
        });
        return;
      }
    }

    setIsSubmitting(true);
    const idUsuario = localStorage.getItem('idUsuario');

    try {
      // 2. Enviamos la petición a Spring Boot
      const response = await fetch(`${API_URL}/api/usuarios/actualizar/${idUsuario}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre: formData.nombre,
          apellido: formData.apellido,
          correo: formData.correo,
          telefono: formData.telefono,
          password: formData.password 
        })
      });

      if (response.ok) {
        const datosActualizados = await response.json();
        
        // 3. Si Java dice "OK", actualizamos la memoria local
        localStorage.setItem('nombreUsuario', datosActualizados.nombre);
        localStorage.setItem('apellidoUsuario', datosActualizados.apellido);
        localStorage.setItem('correoUsuario', datosActualizados.correo);
        localStorage.setItem('telefonoUsuario', datosActualizados.telefono || '');

        Swal.fire({ 
          icon: 'success', 
          title: '¡Perfil actualizado!', 
          text: 'Tus datos se guardaron correctamente.', 
          confirmButtonColor: '#16181D', 
          background: '#F3E7E4', 
          color: '#16181D' 
        });
        
        // Limpiamos los campos de contraseña
        setFormData({ ...formData, password: '', confirmPassword: '' });
      } else {
        throw new Error('Error al actualizar');
      }

    } catch (error) {
      console.error(error);
      Swal.fire({ 
        icon: 'error', 
        title: 'Ups...', 
        text: 'No pudimos guardar tus cambios. Verifica tu conexión.', 
        confirmButtonColor: '#16181D', 
        background: '#F3E7E4', 
        color: '#16181D' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#F3E7E4', minHeight: '100vh', position: 'relative', paddingBottom: '60px' }}>
      
      {/* Fondo Superior Azul Noche para dar profundidad */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '350px',
        background: 'linear-gradient(135deg, #16181D 0%, #1c1f26 60%, #0d0f12 100%)',
        zIndex: 0
      }}>
        {/* Patrón sutil de fondo */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(212,175,55,0.08) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(212,175,55,0.05) 0%, transparent 40%)',
        }} />
      </div>

      <div className="container" style={{ position: 'relative', zIndex: 1, paddingTop: '80px', maxWidth: '750px' }}>
        
        <div className="card shadow-lg border-0" style={{ borderRadius: '20px', backgroundColor: '#ffffff', overflow: 'hidden' }}>
          
          <div className="card-body p-4 p-md-5">
            
            {/* Cabecera del Perfil */}
            <div className="text-center mb-5">
              <div style={{ 
                width: '85px', height: '85px', backgroundColor: '#16181D', 
                borderRadius: '50%', display: 'flex', alignItems: 'center', 
                justifyContent: 'center', margin: '0 auto 20px', 
                border: '3px solid #D4AF37',
                boxShadow: '0 8px 20px rgba(0,0,0,0.15)'
              }}>
                {/* 🔥 SILUETA SVG DORADA PERFECTA 🔥 */}
                <svg width="45" height="45" viewBox="0 0 24 24" fill="#D4AF37" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z"/>
                </svg>
              </div>
              <h2 className="fw-bold" style={{ color: '#16181D', fontFamily: "'Georgia', serif", fontSize: '2.2rem' }}>Mi Perfil</h2>
              <div style={{ width: '50px', height: '3px', backgroundColor: '#D4AF37', margin: '15px auto' }}></div>
              <p className="text-muted" style={{ fontSize: '1rem' }}>Actualiza tu información personal y de contacto.</p>
            </div>

            <form onSubmit={handleGuardar}>
              
              {/* Sección Datos Personales */}
              <h5 className="fw-bold mb-4" style={{ color: '#16181D', fontFamily: "'Georgia', serif", borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
                Datos Personales
              </h5>
              <div className="row g-4 mb-5">
                <div className="col-md-6">
                  <label className="form-label fw-bold" style={{ color: '#555', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Nombre</label>
                  <input type="text" className="form-control" name="nombre" value={formData.nombre} onChange={handleChange} required 
                    style={{ borderRadius: '10px', padding: '12px', border: '1px solid #ddd', backgroundColor: '#fafafa' }} />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-bold" style={{ color: '#555', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Apellido</label>
                  <input type="text" className="form-control" name="apellido" value={formData.apellido} onChange={handleChange} required 
                    style={{ borderRadius: '10px', padding: '12px', border: '1px solid #ddd', backgroundColor: '#fafafa' }} />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-bold" style={{ color: '#555', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Correo Electrónico</label>
                  <input type="email" className="form-control" name="correo" value={formData.correo} onChange={handleChange} required 
                    style={{ borderRadius: '10px', padding: '12px', border: '1px solid #ddd', backgroundColor: '#fafafa' }} />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-bold" style={{ color: '#555', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Teléfono</label>
                  <input type="tel" className="form-control" name="telefono" value={formData.telefono} onChange={handleChange} placeholder="Ej: +56 9..." 
                    style={{ borderRadius: '10px', padding: '12px', border: '1px solid #ddd', backgroundColor: '#fafafa' }} />
                </div>
              </div>

              {/* Sección Seguridad */}
              <h5 className="fw-bold mb-2 mt-4" style={{ color: '#16181D', fontFamily: "'Georgia', serif", borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
                Seguridad
              </h5>
              <p className="text-muted small mb-4">Solo llena estos campos si deseas cambiar tu contraseña actual.</p>
              <div className="row g-4 mb-5">
                <div className="col-md-6">
                  <label className="form-label fw-bold" style={{ color: '#555', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Nueva Contraseña</label>
                  <input type="password" className="form-control" name="password" value={formData.password} onChange={handleChange} placeholder="••••••••" 
                    style={{ borderRadius: '10px', padding: '12px', border: '1px solid #ddd', backgroundColor: '#fafafa' }} />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-bold" style={{ color: '#555', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Confirmar Contraseña</label>
                  <input type="password" className="form-control" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="••••••••" 
                    style={{ borderRadius: '10px', padding: '12px', border: '1px solid #ddd', backgroundColor: '#fafafa' }} />
                </div>
              </div>

              {/* Botón de Envío */}
              <button 
                type="submit" 
                className="btn w-100 fw-bold py-3 mt-2 shadow-sm" 
                style={{ 
                  backgroundColor: '#16181D', 
                  color: '#D4AF37', 
                  borderRadius: '25px', 
                  transition: 'all 0.3s ease',
                  fontSize: '1.1rem',
                  letterSpacing: '1px'
                }}
                disabled={isSubmitting}
                onMouseEnter={e => {
                  if(!isSubmitting) {
                    e.currentTarget.style.backgroundColor = '#D4AF37';
                    e.currentTarget.style.color = '#16181D';
                  }
                }}
                onMouseLeave={e => {
                  if(!isSubmitting) {
                    e.currentTarget.style.backgroundColor = '#16181D';
                    e.currentTarget.style.color = '#D4AF37';
                  }
                }}
              >
                {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
              </button>
            </form>

          </div>
        </div>
      </div>
    </div>
  );
}