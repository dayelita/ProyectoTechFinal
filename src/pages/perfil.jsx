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
        Swal.fire({ icon: 'error', title: 'Las contraseñas no coinciden', confirmButtonColor: '#722F37' });
        return;
      }
    }

    setIsSubmitting(true);
    const idUsuario = localStorage.getItem('idUsuario');

    try {
      // 2. Enviamos la petición a Spring Boot
      const response = await fetch(`http://localhost:8081/api/usuarios/actualizar/${idUsuario}`, {
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
        
        // 3. Si Java dice "OK", actualizamos la memoria local para que se refleje de inmediato
        localStorage.setItem('nombreUsuario', datosActualizados.nombre);
        localStorage.setItem('apellidoUsuario', datosActualizados.apellido);
        localStorage.setItem('correoUsuario', datosActualizados.correo);
        localStorage.setItem('telefonoUsuario', datosActualizados.telefono || '');

        Swal.fire({ icon: 'success', title: '¡Perfil actualizado!', text: 'Tus datos se guardaron correctamente.', confirmButtonColor: '#722F37' });
        
        // Limpiamos los campos de contraseña
        setFormData({ ...formData, password: '', confirmPassword: '' });
      } else {
        throw new Error('Error al actualizar');
      }

    } catch (error) {
      console.error(error);
      Swal.fire({ icon: 'error', title: 'Ups...', text: 'No pudimos guardar tus cambios. Verifica tu conexión.', confirmButtonColor: '#722F37' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#fdfbf7', minHeight: '80vh', padding: '50px 20px' }}>
      <div className="container" style={{ maxWidth: '700px' }}>
        <div className="card shadow-lg border-0" style={{ borderRadius: '15px' }}>
          
          <div className="card-header text-white text-center py-4" style={{ backgroundColor: '#722F37', borderRadius: '15px 15px 0 0' }}>
            <h3 className="mb-0 fw-bold">👤 Mi Perfil</h3>
          </div>

          <div className="card-body p-5">
            <form onSubmit={handleGuardar}>
              <h5 className="fw-bold mb-4" style={{ color: '#722F37' }}>Datos Personales</h5>
              <div className="row g-3 mb-4">
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Nombre</label>
                  <input type="text" className="form-control" name="nombre" value={formData.nombre} onChange={handleChange} required />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Apellido</label>
                  <input type="text" className="form-control" name="apellido" value={formData.apellido} onChange={handleChange} required />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Correo Electrónico</label>
                  <input type="email" className="form-control" name="correo" value={formData.correo} onChange={handleChange} required />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Teléfono</label>
                  <input type="tel" className="form-control" name="telefono" value={formData.telefono} onChange={handleChange} placeholder="Ej: +56 9..." />
                </div>
              </div>

              <hr />

              <h5 className="fw-bold mb-3 mt-4" style={{ color: '#722F37' }}>Seguridad</h5>
              <p className="text-muted small">Solo llena estos campos si deseas cambiar tu contraseña.</p>
              <div className="row g-3 mb-4">
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Nueva Contraseña</label>
                  <input type="password" className="form-control" name="password" value={formData.password} onChange={handleChange} placeholder="••••••••" />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Confirmar Contraseña</label>
                  <input type="password" className="form-control" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="••••••••" />
                </div>
              </div>

              <button 
                type="submit" 
                className="btn w-100 text-white fw-bold py-2 mt-3" 
                style={{ backgroundColor: '#D4AF37', borderRadius: '10px', transition: '0.3s' }}
                disabled={isSubmitting}
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