import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2'; // Asumo que lo tienes instalado por el calendario

const GestionInventario = () => {
  // 1. Iniciamos el estado vacío, ya no hay datos "duros"
  const [productos, setProductos] = useState([]);
  
  const categorias = ["Mobiliario", "Mantelería", "Cristalería", "Iluminación", "Otros"];
  const [nuevoProd, setNuevoProd] = useState({ nombre: '', categoria: 'Mobiliario', cantidad: '', precio: '' });
  const [idEditando, setIdEditando] = useState(null);
  const [filaEditada, setFilaEditada] = useState({});
  const [busqueda, setBusqueda] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('Todas');

  // 2. Cargar los datos desde Java apenas abre la pantalla
  useEffect(() => {
    cargarInventario();
  }, []);

  // --- PETICIONES AL BACKEND (CRUD REAL) ---

  const cargarInventario = async () => {
    try {
      const response = await fetch('http://localhost:8081/api/stock/todos');
      if (response.ok) {
        const data = await response.json();
        setProductos(data);
      }
    } catch (error) {
      console.error("Error al cargar stock:", error);
    }
  };

  const handleAgregar = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8081/api/stock/crear', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevoProd)
      });
      
      if (response.ok) {
        Swal.fire({ icon: 'success', title: 'Artículo Agregado', timer: 1500, showConfirmButton: false });
        setNuevoProd({ nombre: '', categoria: 'Mobiliario', cantidad: '', precio: '' });
        cargarInventario(); // Recargamos la tabla
      }
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Error de conexión' });
    }
  };

  const guardarCambios = async (id) => {
    try {
      const response = await fetch(`http://localhost:8081/api/stock/editar/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(filaEditada)
      });

      if (response.ok) {
        Swal.fire({ icon: 'success', title: 'Actualizado', timer: 1500, showConfirmButton: false });
        setIdEditando(null);
        cargarInventario();
      }
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Error al actualizar' });
    }
  };

  const handleEliminar = async (id) => {
    Swal.fire({
      title: '¿Eliminar artículo?',
      text: "Esta acción no se puede deshacer",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(`http://localhost:8081/api/stock/eliminar/${id}`, {
            method: 'DELETE'
          });
          if (response.ok) {
            Swal.fire('Eliminado', 'El artículo ha sido borrado.', 'success');
            cargarInventario();
          }
        } catch (error) {
          Swal.fire('Error', 'No se pudo conectar con el servidor', 'error');
        }
      }
    });
  };

  const iniciarEdicion = (producto) => {
    setIdEditando(producto.id);
    setFilaEditada({ ...producto });
  };

  // Lógica de filtrado visual (se mantiene igual, es excelente)
  const productosFiltrados = productos.filter((p) => {
    const coincideNombre = p.nombre.toLowerCase().includes(busqueda.toLowerCase());
    const coincideCategoria = filtroCategoria === 'Todas' || p.categoria === filtroCategoria;
    return coincideNombre && coincideCategoria;
  });

  return (
    <div className="container mt-5 mb-5" style={{ minHeight: '80vh' }}>
      <h2 className="text-center mb-4 fw-bold" style={{ color: '#722F37' }}>📦 Control de Inventario</h2>

      {/* FORMULARIO DE REGISTRO */}
      <div className="card shadow-lg border-0 mb-4" style={{ borderRadius: '15px' }}>
        {/* Cambié el verde por el concho de vino institucional */}
        <div className="card-header text-white border-0 pt-3 pb-3" style={{ backgroundColor: '#722F37', borderTopLeftRadius: '15px', borderTopRightRadius: '15px' }}>
          <h5 className="mb-0 fw-bold">Registrar Nuevo Artículo</h5>
        </div>
        <div className="card-body bg-light p-4">
          <form className="row g-3 align-items-end" onSubmit={handleAgregar}>
            <div className="col-md-3">
              <label className="form-label text-muted small fw-bold">NOMBRE DEL ARTÍCULO</label>
              <input type="text" className="form-control" placeholder="Ej. Mantel Redondo" value={nuevoProd.nombre} 
                onChange={e => setNuevoProd({...nuevoProd, nombre: e.target.value})} required />
            </div>
            <div className="col-md-3">
              <label className="form-label text-muted small fw-bold">CATEGORÍA</label>
              <select className="form-select" value={nuevoProd.categoria} 
                onChange={e => setNuevoProd({...nuevoProd, categoria: e.target.value})}>
                {categorias.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            <div className="col-md-2">
              <label className="form-label text-muted small fw-bold">CANTIDAD</label>
              <input type="number" className="form-control" min="0" placeholder="0" value={nuevoProd.cantidad} 
                onChange={e => setNuevoProd({...nuevoProd, cantidad: Number(e.target.value)})} required />
            </div>
            <div className="col-md-2">
              <label className="form-label text-muted small fw-bold">PRECIO ($)</label>
              <input type="number" className="form-control" min="0" placeholder="0" value={nuevoProd.precio} 
                onChange={e => setNuevoProd({...nuevoProd, precio: Number(e.target.value)})} required />
            </div>
            <div className="col-md-2">
              <button type="submit" className="btn text-white w-100 fw-bold shadow-sm" style={{ backgroundColor: '#722F37' }}>
                ➕ Agregar
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* FILTROS DE BÚSQUEDA */}
      <div className="row mb-4">
        <div className="col-md-8">
          <input type="text" className="form-control p-3 shadow-sm border-0" placeholder="🔍 Buscar artículo por nombre..." 
            value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
        </div>
        <div className="col-md-4">
          <select className="form-select p-3 shadow-sm border-0 text-muted fw-bold" value={filtroCategoria}
            onChange={(e) => setFiltroCategoria(e.target.value)}>
            <option value="Todas">Todas las categorías</option>
            {categorias.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>
      </div>

      {/* TABLA DE INVENTARIO */}
      <div className="card shadow-lg border-0" style={{ borderRadius: '15px', overflow: 'hidden' }}>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th className="ps-4">ID</th>
                  <th>Nombre</th>
                  <th>Categoría</th>
                  <th>Stock</th>
                  <th>Precio Unit.</th>
                  <th className="text-center pe-4">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {productosFiltrados.map(p => (
                  <tr key={p.id}>
                    <td className="ps-4 fw-bold text-secondary">#{p.id}</td>
                    
                    <td>
                      {idEditando === p.id ? 
                        <input type="text" className="form-control form-control-sm border-dark" value={filaEditada.nombre} 
                        onChange={e => setFilaEditada({...filaEditada, nombre: e.target.value})} /> 
                        : <span className="fw-bold">{p.nombre}</span>}
                    </td>

                    <td>
                      {idEditando === p.id ? 
                        <select className="form-select form-select-sm border-dark" value={filaEditada.categoria} 
                        onChange={e => setFilaEditada({...filaEditada, categoria: e.target.value})}>
                          {categorias.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                        : <span className="badge text-dark" style={{ backgroundColor: '#F4E1E6' }}>{p.categoria}</span>}
                    </td>

                    <td>
                      {idEditando === p.id ? 
                        <input type="number" className="form-control form-control-sm border-dark" value={filaEditada.cantidad} 
                        onChange={e => setFilaEditada({...filaEditada, cantidad: Number(e.target.value)})} /> 
                        : (
                          <span className={p.cantidad < 10 ? "badge bg-danger rounded-pill px-3" : "fw-bold"}>
                            {p.cantidad}
                          </span>
                        )}
                    </td>

                    <td>
                      {idEditando === p.id ? 
                        <input type="number" className="form-control form-control-sm border-dark" value={filaEditada.precio} 
                        onChange={e => setFilaEditada({...filaEditada, precio: Number(e.target.value)})} /> 
                        : `$${p.precio.toLocaleString('es-CL')}`}
                    </td>

                    <td className="text-center pe-4">
                      {idEditando === p.id ? (
                        <button className="btn btn-sm btn-dark me-2 fw-bold" onClick={() => guardarCambios(p.id)}>💾 Guardar</button>
                      ) : (
                        <button className="btn btn-sm btn-outline-dark me-2 fw-bold" onClick={() => iniciarEdicion(p)}>✏️ Editar</button>
                      )}
                      <button className="btn btn-sm btn-outline-danger fw-bold" onClick={() => handleEliminar(p.id)}>🗑️ Borrar</button>
                    </td>
                  </tr>
                ))}
                
                {productosFiltrados.length === 0 && (
                  <tr>
                    <td colSpan="6" className="text-center py-5 text-muted">
                      <h1 style={{ fontSize: '3rem' }}>📦</h1>
                      <h5 className="fw-bold mt-2">Inventario Vacío</h5>
                      <p>Agrega artículos o cambia los filtros de búsqueda.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GestionInventario;