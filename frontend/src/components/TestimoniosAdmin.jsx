import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

export default function TestimoniosAdmin() {
  const [testimonios, setTestimonios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState('Todos');
  const [editandoId, setEditandoId] = useState(null);
  const [filaEditada, setFilaEditada] = useState({});
  const [busqueda, setBusqueda] = useState('');

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081';

  // CONSTRUÑE CABECERA CON EL TOKEN 
  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  useEffect(() => {
    cargarTestimonios();
  }, []);

  const cargarTestimonios = async () => {
    setLoading(true);
    try {
      // SE AGREGA TOKEN A LA PETICION GET (LEEER ) 
      const response = await fetch(`${API_URL}/api/testimonios/admin/todos`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.ok) {
        const data = await response.json();
        setTestimonios(data); 
      }
    } catch (e) {
      console.error("Error cargando testimonios", e);
    } finally {
      setLoading(false);
    }
  };

  const handleEliminar = (id) => {
    Swal.fire({
      title: '¿Eliminar reseña?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#16181D',
      cancelButtonColor: '#D4AF37',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      background: '#F3E7E4',
      color: '#16181D',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // SE AGREGA TOKEN A LA PETICION DELETE (ELIMINAR ) 
          const response = await fetch(`${API_URL}/api/testimonios/eliminar/${id}`, { 
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
          });
          if (response.ok) {
            Swal.fire({ icon: 'success', title: 'Reseña eliminada', timer: 1500, showConfirmButton: false, background: '#F3E7E4', color: '#16181D' });
            cargarTestimonios();
          }
        } catch (e) {
          Swal.fire({ icon: 'error', title: 'Error de conexión', background: '#F3E7E4', color: '#16181D' });
        }
      }
    });
  };

  const iniciarEdicion = (testimonio) => {
    setEditandoId(testimonio.id);
    setFilaEditada({ ...testimonio });
  };

  const guardarEdicion = async () => {
    try {
      //  SE AGREGA LA CABECERA  A LA PETICION PUT (EDITAR ) 
      const response = await fetch(`${API_URL}/api/testimonios/editar/${editandoId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(filaEditada),
      });
      if (response.ok) {
        Swal.fire({ icon: 'success', title: 'Reseña actualizada', timer: 1500, showConfirmButton: false, background: '#F3E7E4', color: '#16181D' });
        setEditandoId(null);
        cargarTestimonios();
      }
    } catch (e) {
      Swal.fire({ icon: 'error', title: 'Error al actualizar', background: '#F3E7E4', color: '#16181D' });
    }
  };

  const toggleAprobado = async (testimonio) => {
    const nuevoEstadoAprobado = testimonio.estado !== 'APROBADO';
    try {
      // SE AGREGA LA CABECERA  A LA PETICION   PUT (MODERAR)
      const response = await fetch(`${API_URL}/api/testimonios/moderar/${testimonio.id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ aprobado: nuevoEstadoAprobado, motivo: 'Acción desde panel admin' }),
      });
      if (response.ok) {
        cargarTestimonios();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const cancelarEdicion = () => {
    setEditandoId(null);
    setFilaEditada({});
  };

  const testimoniosFiltrados = testimonios.filter(t => {
    const coincideBusqueda =
      t.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
      t.comentario?.toLowerCase().includes(busqueda.toLowerCase());
    const coincideFiltro =
      filtro === 'Todos' ||
      (filtro === 'Aprobadas' && t.estado === 'APROBADO') ||
      (filtro === 'Pendientes' && t.estado !== 'APROBADO');
    return coincideBusqueda && coincideFiltro;
  });

  const totalAprobadas = testimonios.filter(t => t.estado === 'APROBADO').length;
  const totalPendientes = testimonios.filter(t => t.estado !== 'APROBADO').length;
  const promedioEstrellas = testimonios.length
    ? (testimonios.reduce((acc, t) => acc + t.estrellas, 0) / testimonios.length).toFixed(1)
    : 0;

  const renderEstrellas = (n, editable = false, onChange) => {
    return [1, 2, 3, 4, 5].map(i => (
      <span
        key={i}
        onClick={editable ? () => onChange(i) : undefined}
        style={{
          color: i <= n ? '#D4AF37' : '#ddd',
          fontSize: editable ? '1.4rem' : '1rem',
          cursor: editable ? 'pointer' : 'default',
          transition: 'color 0.2s',
        }}
      >★</span>
    ));
  };

  return (
    <div style={{ backgroundColor: '#F3E7E4', minHeight: '100vh', paddingBottom: '60px' }}>

      {/* BANNER DE TESTIMONIOS */}
      <div style={{ background: 'linear-gradient(135deg, #16181D 0%, #1c1f26 60%, #0d0f12 100%)', color: 'white', padding: '60px 20px 50px', textAlign: 'center', position: 'relative', overflow: 'hidden', marginBottom: '40px' }}>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <p style={{ color: '#D4AF37', fontWeight: 600, letterSpacing: '4px', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '12px' }}>✦  Administración  ✦</p>
          <h1 style={{ color: '#F3E7E4', fontSize: 'clamp(2rem, 5vw, 3.2rem)', fontFamily: 'Georgia, serif' }}>Gestión de Reseñas</h1>
          <p style={{ color: 'rgba(243,231,228,0.7)' }}>Modera, edita y aprueba los testimonios de clientes.</p>
        </div>
      </div>

      <div className="container">

        {/* MÉTRICAS */}
        <div className="row g-4 mb-5">
          {[
            { label: 'Total Reseñas', value: testimonios.length, icon: '💬', color: '#16181D' },
            { label: 'Aprobadas', value: totalAprobadas, icon: '✅', color: '#0f5132' },
            { label: 'Pendientes', value: totalPendientes, icon: '⏳', color: '#664d03' },
            { label: 'Promedio ★', value: promedioEstrellas, icon: '⭐', color: '#7a4f00' },
          ].map((m, i) => (
            <div key={i} className="col-6 col-md-3">
              <div className="card border-0 shadow-sm h-100 text-center" style={{ borderRadius: '18px', overflow: 'hidden' }}>
                <div style={{ height: '5px', backgroundColor: '#D4AF37' }} />
                <div className="card-body py-4">
                  <div style={{ fontSize: '2rem' }}>{m.icon}</div>
                  <div style={{ fontSize: '2rem', fontWeight: 700, color: m.color }}>{m.value}</div>
                  <div style={{ fontSize: '0.8rem', color: '#666', fontWeight: 600 }}>{m.label}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* FILTROS Y BÚSQUEDA */}
        <div className="row g-3 mb-4 align-items-center">
          <div className="col-md-6">
            <div className="input-group shadow-sm" style={{ borderRadius: '15px', overflow: 'hidden' }}>
              <span className="input-group-text border-0 bg-white text-muted">🔍</span>
              <input type="text" className="form-control border-0 p-3" placeholder="Buscar por nombre..." value={busqueda} onChange={e => setBusqueda(e.target.value)} />
            </div>
          </div>
          <div className="col-md-6">
            <div className="d-flex gap-2 justify-content-md-end">
              {['Todos', 'Aprobadas', 'Pendientes'].map(f => (
                <button key={f} onClick={() => setFiltro(f)} className="btn fw-semibold" style={{ padding: '10px 22px', borderRadius: '50px', border: '2px solid #16181D', backgroundColor: filtro === f ? '#16181D' : 'transparent', color: filtro === f ? '#D4AF37' : '#16181D' }}>
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* TABLA */}
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border" style={{ color: '#D4AF37' }} role="status" />
          </div>
        ) : (
          <div className="card shadow-lg border-0" style={{ borderRadius: '20px', overflow: 'hidden' }}>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead style={{ backgroundColor: '#16181D', color: '#F3E7E4' }}>
                    <tr>
                      <th className="ps-4 py-3">ID</th>
                      <th className="py-3">Cliente</th>
                      <th className="py-3">Calificación</th>
                      <th className="py-3">Comentario</th>
                      <th className="py-3 text-center">Estado</th>
                      <th className="py-3 text-center pe-4">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white">
                    {testimoniosFiltrados.length === 0 && (
                      <tr>
                        <td colSpan="6" className="text-center py-5">
                          <h5 className="fw-bold mt-2">Sin reseñas</h5>
                        </td>
                      </tr>
                    )}
                    {testimoniosFiltrados.map(t => (
                      <tr key={t.id}>
                        <td className="ps-4 fw-bold text-muted">#{t.id}</td>
                        <td>
                          {editandoId === t.id ? (
                            <div className="d-flex flex-column gap-1">
                              <input type="text" className="form-control form-control-sm" value={filaEditada.nombre} onChange={e => setFilaEditada({ ...filaEditada, nombre: e.target.value })} />
                              <input type="text" className="form-control form-control-sm" value={filaEditada.rol} onChange={e => setFilaEditada({ ...filaEditada, rol: e.target.value })} />
                            </div>
                          ) : (
                            <div className="fw-bold">{t.nombre} <br/><small style={{ color: '#D4AF37' }}>{t.rol}</small></div>
                          )}
                        </td>
                        <td>
                          {editandoId === t.id
                            ? renderEstrellas(filaEditada.estrellas, true, val => setFilaEditada({ ...filaEditada, estrellas: val }))
                            : renderEstrellas(t.estrellas)}
                        </td>
                        <td style={{ maxWidth: '320px' }}>
                          {editandoId === t.id ? (
                            <textarea className="form-control form-control-sm" rows={3} value={filaEditada.comentario} onChange={e => setFilaEditada({ ...filaEditada, comentario: e.target.value })} />
                          ) : (
                            <span style={{ fontStyle: 'italic' }}>"{t.comentario}"</span>
                          )}
                        </td>
                        <td className="text-center">
                          <button
                            onClick={() => toggleAprobado(t)}
                            className="btn btn-sm fw-bold"
                            style={{
                              borderRadius: '20px', padding: '5px 16px', fontSize: '0.78rem',
                              backgroundColor: t.estado === 'APROBADO' ? '#d1e7dd' : '#fff3cd',
                              color: t.estado === 'APROBADO' ? '#0f5132' : '#664d03',
                            }}
                          >
                            {t.estado === 'APROBADO' ? '✅ Aprobada' : '⏳ Pendiente'}
                          </button>
                        </td>
                        <td className="text-center pe-4">
                          {editandoId === t.id ? (
                            <div className="d-flex gap-2 justify-content-center">
                              <button className="btn btn-sm fw-bold px-3" style={{ backgroundColor: '#16181D', color: '#D4AF37', borderRadius: '15px' }} onClick={guardarEdicion}>💾 Guardar</button>
                              <button className="btn btn-sm btn-outline-secondary fw-bold px-3" style={{ borderRadius: '15px' }} onClick={cancelarEdicion}>Cancelar</button>
                            </div>
                          ) : (
                            <div className="d-flex gap-2 justify-content-center">
                              <button className="btn btn-sm btn-outline-dark fw-bold px-3" style={{ borderRadius: '15px' }} onClick={() => iniciarEdicion(t)}>✏️ Editar</button>
                              <button className="btn btn-sm btn-outline-danger fw-bold px-3" style={{ borderRadius: '15px' }} onClick={() => handleEliminar(t.id)}>🗑️ Borrar</button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}