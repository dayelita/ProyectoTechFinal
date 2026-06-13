import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

const GestionInventario = () => {
  const [productos, setProductos] = useState([]);
  const categorias = ["Gastronomía","Mobiliario", "Mantelería", "Cristalería", "Iluminación", "Otros"];
  const [nuevoProd, setNuevoProd] = useState({ nombre: '', categoria: 'Mobiliario', cantidad: '', precio: '' });
  const [idEditando, setIdEditando] = useState(null);
  const [filaEditada, setFilaEditada] = useState({});
  const [busqueda, setBusqueda] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('Todas');

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081';

  useEffect(() => {
    cargarInventario();
  }, []);

  const cargarInventario = async () => {
    try {
      // VEMOS EL TOKEN PARA VER EL INVENTARIO
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_URL}/api/stock/todos`, {
        headers: {
          'Authorization': `Bearer ${token}` // INYECCION PARA LA PETICION GET CON EL TOKEN 
        }
      });
      if (response.ok) {
        const data = await response.json();
        setProductos(data);
      } else if (response.status === 401 || response.status === 403) {
        Swal.fire({ icon: 'error', title: 'Acceso Denegado', text: 'Tu sesión ha expirado o no tienes permisos.', background: '#F3E7E4' });
      }
    } catch (error) {
      console.error("Error al cargar stock:", error);
    }
  };

  const handleAgregar = async (e) => {
    e.preventDefault();
    try {
      // VEMOS EL TOKEN PARA PODER CREAR UN PRODUCTO
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_URL}/api/stock/crear`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // INYECCION PARA LA PETICION POST CON EL TOKEN  
        },
        body: JSON.stringify(nuevoProd)
      });
      
      if (response.ok) {
        Swal.fire({ 
          icon: 'success', 
          title: 'Artículo Agregado', 
          timer: 1500, 
          showConfirmButton: false,
          background: '#F3E7E4',
          color: '#16181D'
        });
        setNuevoProd({ nombre: '', categoria: 'Mobiliario', cantidad: '', precio: '' });
        cargarInventario();
      }
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Error de conexión', background: '#F3E7E4' });
    }
  };

  const guardarCambios = async (id) => {
    try {
      // VEMOS EL TOKEN PARA PODER EDITAR UN PRODUCTO
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_URL}/api/stock/editar/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // INYECCION PARA LA PETICION PUT CON EL TOKEN
        },
        body: JSON.stringify(filaEditada)
      });

      if (response.ok) {
        Swal.fire({ 
          icon: 'success', 
          title: 'Actualizado correctamente', 
          timer: 1500, 
          showConfirmButton: false,
          background: '#F3E7E4',
          color: '#16181D'
        });
        setIdEditando(null);
        cargarInventario();
      }
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Error al actualizar', background: '#F3E7E4' });
    }
  };

  const handleEliminar = async (id) => {
    Swal.fire({
      title: '¿Eliminar artículo?',
      text: "Esta acción no se puede deshacer y el ítem desaparecerá del inventario.",
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
          // VEMOS EL TOKEN PARA PODER ELIMINAR UN PRODUCTO 
          const token = localStorage.getItem('token');
          
          const response = await fetch(`${API_URL}/api/stock/eliminar/${id}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}` // INYECCION PARA LA PETICION DELETE CON EL TOKEN 
            }
          });
          if (response.ok) {
            Swal.fire({ title: 'Eliminado', text: 'El artículo ha sido borrado.', icon: 'success', background: '#F3E7E4' });
            cargarInventario();
          }
        } catch (error) {
          Swal.fire({ title: 'Error', text: 'No se pudo conectar con el servidor', icon: 'error', background: '#F3E7E4' });
        }
      }
    });
  };

  const iniciarEdicion = (producto) => {
    setIdEditando(producto.id);
    setFilaEditada({ ...producto });
  };

  const productosFiltrados = productos.filter((p) => {
    const coincideNombre = p.nombre.toLowerCase().includes(busqueda.toLowerCase());
    const coincideCategoria = filtroCategoria === 'Todas' || p.categoria === filtroCategoria;
    return coincideNombre && coincideCategoria;
  });

  return (
    <div style={{ backgroundColor: '#F3E7E4', minHeight: '100vh', paddingBottom: '60px' }}>
      
      {/* BANNER PARA EL STOCK ADMIN */}
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
            Control de Inventario
          </h1>
          <p style={{ color: 'rgba(243, 231, 228, 0.7)', maxWidth: '560px', margin: '0 auto', lineHeight: 1.6, fontSize: '1.05rem', fontFamily: 'sans-serif' }}>
            Gestiona los artículos, mobiliario y recursos disponibles para los eventos en la Casona.
          </p>
        </div>
      </div>

      <div className="container">
        
        {/* PARA REGISTRAR UN PRODUCTO(CREAR) */}
        <div className="card shadow-lg border-0 mb-5" style={{ borderRadius: '20px', overflow: 'hidden' }}>
          <div className="card-header border-0 py-3 px-4" style={{ backgroundColor: '#16181D' }}>
            <h5 className="mb-0 fw-bold" style={{ color: '#D4AF37', fontFamily: "'Georgia', serif" }}>Registrar Nuevo Artículo</h5>
          </div>
          <div className="card-body bg-white p-4">
            <form className="row g-3 align-items-end" onSubmit={handleAgregar}>
              <div className="col-md-3">
                <label className="form-label fw-bold small" style={{ color: '#16181D' }}>NOMBRE DEL ARTÍCULO</label>
                <input type="text" className="form-control" style={{ borderRadius: '10px', padding: '10px' }} placeholder="Ej. Mantel Redondo" value={nuevoProd.nombre} 
                  onChange={e => setNuevoProd({...nuevoProd, nombre: e.target.value})} required />
              </div>
              <div className="col-md-3">
                <label className="form-label fw-bold small" style={{ color: '#16181D' }}>CATEGORÍA</label>
                <select className="form-select" style={{ borderRadius: '10px', padding: '10px' }} value={nuevoProd.categoria} 
                  onChange={e => setNuevoProd({...nuevoProd, categoria: e.target.value})}>
                  {categorias.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
              <div className="col-md-2">
                <label className="form-label fw-bold small" style={{ color: '#16181D' }}>CANTIDAD</label>
                <input type="number" className="form-control" style={{ borderRadius: '10px', padding: '10px' }} min="0" placeholder="0" value={nuevoProd.cantidad} 
                  onChange={e => setNuevoProd({...nuevoProd, cantidad: Number(e.target.value)})} required />
              </div>
              <div className="col-md-2">
                <label className="form-label fw-bold small" style={{ color: '#16181D' }}>PRECIO ($)</label>
                <input type="number" className="form-control" style={{ borderRadius: '10px', padding: '10px' }} min="0" placeholder="0" value={nuevoProd.precio} 
                  onChange={e => setNuevoProd({...nuevoProd, precio: Number(e.target.value)})} required />
              </div>
              <div className="col-md-2">
                <button type="submit" className="btn fw-bold w-100 shadow-sm" 
                  style={{ backgroundColor: '#16181D', color: '#D4AF37', borderRadius: '10px', padding: '10px', transition: 'all 0.3s' }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = '#D4AF37' + 'ee'}
                >
                  ➕ Agregar
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* FILTROS DEL STOCK */}
        <div className="row g-3 mb-4">
          <div className="col-md-8">
            <div className="input-group shadow-sm" style={{ borderRadius: '15px', overflow: 'hidden' }}>
              <span className="input-group-text border-0 bg-white text-muted">🔍</span>
              <input type="text" className="form-control border-0 p-3" placeholder="Buscar artículo por nombre..." 
                value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
            </div>
          </div>
          <div className="col-md-4">
            <select className="form-select border-0 p-3 shadow-sm fw-bold" style={{ borderRadius: '15px', color: '#16181D' }} value={filtroCategoria}
              onChange={(e) => setFiltroCategoria(e.target.value)}>
              <option value="Todas">Todas las categorías</option>
              {categorias.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
        </div>

        {/* VISTA DEL INVENTARIO POR TABLAS */}
        <div className="card shadow-lg border-0" style={{ borderRadius: '20px', overflow: 'hidden' }}>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead style={{ backgroundColor: '#16181D', color: '#F3E7E4' }}>
                  <tr>
                    <th className="ps-4 py-3" style={{ border: 'none' }}>ID</th>
                    <th className="py-3" style={{ border: 'none' }}>Nombre</th>
                    <th className="py-3" style={{ border: 'none' }}>Categoría</th>
                    <th className="py-3" style={{ border: 'none' }}>Stock Actual</th>
                    <th className="py-3" style={{ border: 'none' }}>Precio Unit.</th>
                    <th className="text-center pe-4 py-3" style={{ border: 'none' }}>Acciones</th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {productosFiltrados.map(p => (
                    <tr key={p.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                      <td className="ps-4 fw-bold text-muted">#{p.id}</td>
                      
                      <td>
                        {idEditando === p.id ? 
                          <input type="text" className="form-control form-control-sm" value={filaEditada.nombre} 
                          onChange={e => setFilaEditada({...filaEditada, nombre: e.target.value})} /> 
                          : <span className="fw-bold" style={{ color: '#16181D' }}>{p.nombre}</span>}
                      </td>

                      <td>
                        {idEditando === p.id ? 
                          <select className="form-select form-select-sm" value={filaEditada.categoria} 
                          onChange={e => setFilaEditada({...filaEditada, categoria: e.target.value})}>
                            {categorias.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                          </select>
                          : <span className="badge" style={{ backgroundColor: '#F3E7E4', color: '#16181D', border: '1px solid #D4AF37' }}>{p.categoria}</span>}
                      </td>

                      <td>
                        {idEditando === p.id ? 
                          <input type="number" className="form-control form-control-sm" value={filaEditada.cantidad} 
                          onChange={e => setFilaEditada({...filaEditada, cantidad: Number(e.target.value)})} /> 
                          : (
                            <span 
                              style={{ 
                                padding: '6px 15px', 
                                borderRadius: '20px', 
                                fontSize: '0.85rem', 
                                fontWeight: 'bold',
                                backgroundColor: p.cantidad < 10 ? '#f8d7da' : '#d1e7dd',
                                color: p.cantidad < 10 ? '#842029' : '#0f5132'
                              }}
                            >
                              {p.cantidad} {p.cantidad < 10 ? ' (Bajo Stock)' : ''}
                            </span>
                          )}
                      </td>

                      <td>
                        {idEditando === p.id ? 
                          <input type="number" className="form-control form-control-sm" value={filaEditada.precio} 
                          onChange={e => setFilaEditada({...filaEditada, precio: Number(e.target.value)})} /> 
                          : <span className="fw-semibold">${p.precio.toLocaleString('es-CL')}</span>}
                      </td>

                      <td className="text-center pe-4">
                        {idEditando === p.id ? (
                          <button className="btn btn-sm px-3 me-2 fw-bold" style={{ backgroundColor: '#16181D', color: '#D4AF37', borderRadius: '15px' }} onClick={() => guardarCambios(p.id)}>💾 Guardar</button>
                        ) : (
                          <button className="btn btn-sm btn-outline-dark px-3 me-2 fw-bold" style={{ borderRadius: '15px' }} onClick={() => iniciarEdicion(p)}>✏️ Editar</button>
                        )}
                        <button className="btn btn-sm btn-outline-danger px-3 fw-bold" style={{ borderRadius: '15px' }} onClick={() => handleEliminar(p.id)}>🗑️ Borrar</button>
                      </td>
                    </tr>
                  ))}
                  
                  {productosFiltrados.length === 0 && (
                    <tr>
                      <td colSpan="6" className="text-center py-5">
                        <h1 style={{ fontSize: '3.5rem' }}>📦</h1>
                        <h5 className="fw-bold mt-2" style={{ color: '#16181D', fontFamily: "'Georgia', serif" }}>Inventario Vacío</h5>
                        <p className="text-muted">No se encontraron artículos que coincidan con tu búsqueda.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GestionInventario;