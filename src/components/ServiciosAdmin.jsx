import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

// Datos de prueba (Fallback) idénticos al catálogo público
const SERVICIOS_DEMO = [
  {
    id: 1, categoria: 'Espacios', nombre: 'Salón Principal',
    descripcion: 'Amplio salón interior con capacidad para hasta 200 personas, ideal para banquetes, ceremonias y eventos corporativos. Equipado con iluminación regulable y climatización.',
    capacidad: '200 personas', precio: 'Desde $350.000',
    imagen: 'https://images.unsplash.com/photo-1510076857177-7470076d4098?q=80&w=800&fit=crop',
    badge: 'Más Popular', badgeColor: '#D4AF37',
    detalles: ['Iluminación regulable', 'Climatización central', 'Sistema de sonido', 'Proyector 4K'],
  },
  {
    id: 4, categoria: 'Servicios', nombre: 'Catering Premium',
    descripcion: 'Servicio de gastronomía de autor con menús personalizados. Cocineros con experiencia en cocina chilena e internacional.',
    capacidad: 'Sin límite', precio: 'Desde $25.000 /persona',
    imagen: 'https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=800&fit=crop',
    badge: 'Exclusivo', badgeColor: '#16181D',
    detalles: ['Menú personalizado', 'Cocina internacional', 'Mozos incluidos', 'Vajilla de lujo'],
  }
];

const CATEGORIAS = ['Espacios', 'Servicios', 'Paquetes'];

export default function ServiciosAdmin() {
  const [servicios, setServicios] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Estados para el Modal y Formulario
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(getInitialFormData());
  const [isSubmitting, setIsSubmitting] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081';

  function getInitialFormData() {
    return {
      id: null,
      nombre: '',
      categoria: 'Espacios',
      descripcion: '',
      capacidad: '',
      precio: '',
      imagen: '',
      badge: '',
      badgeColor: '#D4AF37',
      detalles: '' // Lo manejamos como un string separado por comas en el formulario
    };
  }

  useEffect(() => {
    cargarServicios();
  }, []);

  const cargarServicios = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/servicios/todos`);
      if (response.ok) {
        const data = await response.json();
        setServicios(data.length > 0 ? data : SERVICIOS_DEMO);
      } else {
        setServicios(SERVICIOS_DEMO);
      }
    } catch (error) {
      setServicios(SERVICIOS_DEMO);
    } finally {
      setLoading(false);
    }
  };

  // --- ABRIR MODALES ---
  const handleOpenCrear = () => {
    setFormData(getInitialFormData());
    setIsEditing(false);
    setShowModal(true);
  };

  const handleOpenEditar = (servicio) => {
    setFormData({
      ...servicio,
      detalles: Array.isArray(servicio.detalles) ? servicio.detalles.join(', ') : servicio.detalles
    });
    setIsEditing(true);
    setShowModal(true);
  };

  // --- GUARDAR (CREAR O EDITAR) ---
  const handleGuardar = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Convertimos los detalles separados por coma en un array real para el backend
    const detallesArray = formData.detalles.split(',').map(d => d.trim()).filter(d => d !== '');
    
    const payload = {
      ...formData,
      detalles: detallesArray
    };

    try {
      const url = isEditing ? `${API_URL}/api/servicios/editar/${formData.id}` : `${API_URL}/api/servicios/crear`;
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        Swal.fire({ icon: 'success', title: isEditing ? 'Servicio Actualizado' : 'Servicio Creado', timer: 1500, showConfirmButton: false, background: '#F3E7E4', color: '#16181D' });
        cargarServicios();
        setShowModal(false);
      } else {
        throw new Error('Error en la petición');
      }
    } catch (error) {
      // Fallback local visual
      if (isEditing) {
        setServicios(prev => prev.map(s => s.id === formData.id ? payload : s));
      } else {
        setServicios(prev => [{...payload, id: Date.now()}, ...prev]);
      }
      Swal.fire({ icon: 'success', title: isEditing ? 'Actualizado (Local)' : 'Creado (Local)', timer: 1500, showConfirmButton: false, background: '#F3E7E4', color: '#16181D' });
      setShowModal(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- ELIMINAR ---
  const handleEliminar = (id) => {
    Swal.fire({
      title: '¿Eliminar tarjeta?',
      text: 'Esta acción la quitará del catálogo público.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#16181D',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      background: '#F3E7E4',
      color: '#16181D'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(`${API_URL}/api/servicios/eliminar/${id}`, { method: 'DELETE' });
          if (response.ok) {
            Swal.fire({ title: 'Eliminado', icon: 'success', timer: 1500, showConfirmButton: false, background: '#F3E7E4' });
            cargarServicios();
          } else {
            throw new Error('Error al eliminar');
          }
        } catch (error) {
          setServicios(prev => prev.filter(s => s.id !== id));
          Swal.fire({ title: 'Eliminado (Local)', icon: 'success', timer: 1500, showConfirmButton: false, background: '#F3E7E4' });
        }
      }
    });
  };

  return (
    <div style={{ backgroundColor: '#F3E7E4', minHeight: '100vh', paddingBottom: '60px' }}>
      
      {/* HERO SECTION ADMIN */}
      <div
        style={{
          background: 'linear-gradient(135deg, #16181D 0%, #1c1f26 60%, #0d0f12 100%)',
          color: 'white',
          padding: '60px 20px 50px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
          marginBottom: '40px'
        }}
      >
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(212,175,55,0.09) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(212,175,55,0.06) 0%, transparent 40%)',
        }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <p style={{ color: '#D4AF37', fontWeight: 600, letterSpacing: '4px', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '12px', fontFamily: 'sans-serif' }}>
            ✦  Administración  ✦
          </p>
          <h1 style={{ color: '#F3E7E4', fontSize: 'clamp(2rem, 5vw, 3.2rem)', fontWeight: 400, marginBottom: '15px', fontFamily: 'Georgia, serif' }}>
            Gestión del Catálogo
          </h1>
          <p style={{ color: 'rgba(243, 231, 228, 0.7)', maxWidth: '560px', margin: '0 auto', lineHeight: 1.6, fontSize: '1.05rem', fontFamily: 'sans-serif' }}>
            Crea, edita o elimina las tarjetas de servicios que se muestran a los clientes en la plataforma.
          </p>
        </div>
      </div>

      <div className="container" style={{ maxWidth: '1400px' }}>
        
        {/* BARRA DE ACCIÓN */}
        <div className="d-flex justify-content-end mb-4">
          <button 
            onClick={handleOpenCrear}
            className="btn fw-bold shadow-sm"
            style={{ backgroundColor: '#D4AF37', color: '#16181D', borderRadius: '30px', padding: '12px 28px', fontSize: '1rem', border: '2px solid #D4AF37', transition: 'all 0.3s' }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#16181D'; e.currentTarget.style.borderColor = '#16181D'; }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#D4AF37'; e.currentTarget.style.color = '#16181D'; e.currentTarget.style.borderColor = '#D4AF37'; }}
          >
            ➕ Crear Nueva Tarjeta
          </button>
        </div>

        {/* GRID DE PREVISUALIZACIÓN REAL (Igual al público) */}
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border" style={{ color: '#D4AF37' }} role="status"></div>
            <p className="mt-3 text-muted">Cargando catálogo...</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
            {servicios.map(servicio => (
              <div key={servicio.id} className="card border-0 d-flex flex-column" style={{ borderRadius: '15px', overflow: 'hidden', backgroundColor: '#ffffff', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                
                {/* 1. Preview de la Tarjeta (Estilo Público) */}
                <div style={{ position: 'relative', height: '210px', overflow: 'hidden' }}>
                  <img src={servicio.imagen || 'https://via.placeholder.com/800x600?text=Sin+Imagen'} alt={servicio.nombre} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(22,24,29,0.7) 0%, transparent 60%)' }} />
                  
                  <span style={{ position: 'absolute', top: '12px', left: '12px', backgroundColor: 'rgba(255,255,255,0.9)', color: '#16181D', fontSize: '0.68rem', fontWeight: '700', padding: '3px 11px', borderRadius: '20px', letterSpacing: '0.8px', textTransform: 'uppercase' }}>
                    {servicio.categoria}
                  </span>
                  
                  {servicio.badge && (
                    <span style={{ position: 'absolute', top: '12px', right: '12px', backgroundColor: servicio.badgeColor, color: servicio.badgeColor === '#D4AF37' ? '#16181D' : '#D4AF37', fontSize: '0.68rem', fontWeight: '700', padding: '3px 11px', borderRadius: '20px' }}>
                      {servicio.badge}
                    </span>
                  )}
                </div>

                <div className="card-body p-4 flex-grow-1 d-flex flex-column">
                  <h5 className="mb-2" style={{ color: '#16181D', fontFamily: 'Georgia, serif', fontWeight: 'bold', fontSize: '1.2rem' }}>{servicio.nombre}</h5>
                  <p className="text-muted small mb-3 flex-grow-1" style={{ lineHeight: 1.6 }}>{servicio.descripcion}</p>
                  
                  <div className="d-flex gap-2 mb-4 flex-wrap">
                    <span className="badge" style={{ backgroundColor: '#F3E7E4', color: '#16181D', fontWeight: '600', fontSize: '0.75rem', padding: '6px 12px', border: '1px solid #ddd' }}>
                      👥 {servicio.capacidad}
                    </span>
                    <span className="badge" style={{ backgroundColor: '#16181D', color: '#D4AF37', fontWeight: '600', fontSize: '0.75rem', padding: '6px 12px' }}>
                      💰 {servicio.precio}
                    </span>
                  </div>

                  {/* 2. Barra de Acción Exclusiva del Admin */}
                  <div className="d-flex gap-2 mt-auto pt-3" style={{ borderTop: '1px solid #eee' }}>
                    <button onClick={() => handleOpenEditar(servicio)} className="btn btn-sm flex-fill fw-bold" style={{ border: '2px solid #16181D', color: '#16181D', borderRadius: '10px' }}>
                      ✏️ Editar
                    </button>
                    <button onClick={() => handleEliminar(servicio.id)} className="btn btn-sm flex-fill fw-bold" style={{ backgroundColor: '#dc3545', color: 'white', borderRadius: '10px' }}>
                      🗑️ Eliminar
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL DEL FORMULARIO DE SERVICIO */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(22, 24, 29, 0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000, padding: '20px', backdropFilter: 'blur(5px)' }}>
          <div className="card shadow-lg border-0" style={{ width: '100%', maxWidth: '700px', maxHeight: '95vh', overflowY: 'auto', borderRadius: '20px', backgroundColor: '#ffffff' }}>
            
            <div style={{ background: '#16181D', padding: '20px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 10 }}>
              <h4 style={{ color: '#D4AF37', margin: 0, fontWeight: 'bold', fontFamily: "'Georgia', serif" }}>
                {isEditing ? '✏️ Editar Tarjeta' : '📝 Crear Nueva Tarjeta'}
              </h4>
              <button onClick={() => setShowModal(false)} style={{ background: 'transparent', border: 'none', color: 'white', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
            </div>

            <div className="card-body p-4 p-md-5">
              <form onSubmit={handleGuardar}>
                <div className="row g-3">
                  
                  {/* Datos Básicos */}
                  <div className="col-md-8">
                    <label style={labelStyle}>NOMBRE DEL SERVICIO/ESPACIO</label>
                    <input type="text" className="form-control" style={inputStyle} value={formData.nombre} onChange={e => setFormData({...formData, nombre: e.target.value})} required />
                  </div>
                  
                  <div className="col-md-4">
                    <label style={labelStyle}>CATEGORÍA</label>
                    <select className="form-select" style={inputStyle} value={formData.categoria} onChange={e => setFormData({...formData, categoria: e.target.value})}>
                      {CATEGORIAS.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>

                  <div className="col-12">
                    <label style={labelStyle}>DESCRIPCIÓN (Se muestra en la tarjeta)</label>
                    <textarea className="form-control" style={{...inputStyle, resize: 'none'}} rows="2" value={formData.descripcion} onChange={e => setFormData({...formData, descripcion: e.target.value})} required />
                  </div>

                  {/* Etiquetas y Atributos */}
                  <div className="col-md-6">
                    <label style={labelStyle}>CAPACIDAD (Ej: "200 personas")</label>
                    <input type="text" className="form-control" style={inputStyle} value={formData.capacidad} onChange={e => setFormData({...formData, capacidad: e.target.value})} required />
                  </div>
                  <div className="col-md-6">
                    <label style={labelStyle}>PRECIO (Ej: "Desde $350.000")</label>
                    <input type="text" className="form-control" style={inputStyle} value={formData.precio} onChange={e => setFormData({...formData, precio: e.target.value})} required />
                  </div>

                  <div className="col-md-8">
                    <label style={labelStyle}>ETIQUETA (Badge) (Opcional, ej: "Más Popular")</label>
                    <input type="text" className="form-control" style={inputStyle} value={formData.badge} onChange={e => setFormData({...formData, badge: e.target.value})} />
                  </div>
                  <div className="col-md-4">
                    <label style={labelStyle}>COLOR ETIQUETA</label>
                    <select className="form-select" style={inputStyle} value={formData.badgeColor} onChange={e => setFormData({...formData, badgeColor: e.target.value})}>
                      <option value="#D4AF37">Dorado Premium</option>
                      <option value="#16181D">Azul Noche</option>
                      <option value="#722F37">Vino Tinto</option>
                    </select>
                  </div>

                  {/* Multimedia y Detalles extra */}
                  <div className="col-12">
                    <label style={labelStyle}>URL DE LA IMAGEN (Se recomienda Unsplash o tu servidor)</label>
                    <input type="url" className="form-control" style={inputStyle} value={formData.imagen} onChange={e => setFormData({...formData, imagen: e.target.value})} placeholder="https://..." required />
                  </div>

                  <div className="col-12">
                    <label style={labelStyle}>QUÉ INCLUYE (Separar cada detalle con una coma ",")</label>
                    <textarea className="form-control" style={{...inputStyle, resize: 'vertical'}} rows="3" value={formData.detalles} onChange={e => setFormData({...formData, detalles: e.target.value})} placeholder="Ej: Iluminación, Calefacción, Sillas Tiffany, Estacionamiento" />
                    <small className="text-muted mt-1 d-block">Estos elementos aparecerán con un check (✓) dorado cuando el cliente vea los detalles.</small>
                  </div>

                </div>

                <div className="d-flex gap-3 mt-5">
                  <button type="button" onClick={() => setShowModal(false)} className="btn fw-bold flex-fill" style={{ padding: '14px', borderRadius: '30px', border: '2px solid #ddd', backgroundColor: 'transparent', color: '#666' }}>
                    Cancelar
                  </button>
                  <button type="submit" disabled={isSubmitting} className="btn fw-bold flex-fill shadow-sm" style={{ padding: '14px', borderRadius: '30px', backgroundColor: '#16181D', color: '#D4AF37', border: 'none' }}>
                    {isSubmitting ? 'Guardando...' : '💾 Guardar Tarjeta'}
                  </button>
                </div>
              </form>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

// Estilos locales reutilizables
const inputStyle = { padding: '10px 14px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '0.95rem' };
const labelStyle = { display: 'block', marginBottom: '6px', color: '#16181D', fontWeight: 'bold', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' };