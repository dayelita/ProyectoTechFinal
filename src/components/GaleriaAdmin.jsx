import React, { useState, useEffect, useRef } from 'react';
import Swal from 'sweetalert2'; 

const CATEGORIAS = ['Salones', 'Jardines', 'Matrimonios', 'Eventos', 'Gastronomía'];
const FORMATOS_VALIDOS = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_MB = 5;

// Imágenes demo para desarrollo offline
const IMAGENES_DEMO = [
  { id: 1, url: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800', titulo: 'Salón Principal', categoria: 'Salones', descripcion: 'Salón central con capacidad para 200 personas' },
  { id: 2, url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800', titulo: 'Jardines Exteriores', categoria: 'Jardines', descripcion: 'Amplios jardines para cócteles y fotografías' },
  { id: 3, url: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800', titulo: 'Ceremonia de Matrimonio', categoria: 'Matrimonios', descripcion: 'Espacio acondicionado para ceremonias íntimas' },
];

export default function GaleriaAdmin() {
  const [imagenes, setImagenes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState('Todas');
  const [vista, setVista] = useState('grid'); 

  // Estado formulario upload
  const [showUpload, setShowUpload] = useState(false);
  const [archivoSeleccionado, setArchivoSeleccionado] = useState(null);
  const [preview, setPreview] = useState(null);
  const [formData, setFormData] = useState({ titulo: '', categoria: 'Salones', descripcion: '' });
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  // Estado edición
  const [editando, setEditando] = useState(null); 
  const [formEdicion, setFormEdicion] = useState({});

  const inputFileRef = useRef();
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081';

  useEffect(() => {
    cargarImagenes();
  }, []);

  const cargarImagenes = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/galeria/todas`);
      if (response.ok) {
        setImagenes(await response.json());
      } else {
        setImagenes(IMAGENES_DEMO);
      }
    } catch {
      setImagenes(IMAGENES_DEMO);
    } finally {
      setLoading(false);
    }
  };

  const validarArchivo = (file) => {
    if (!FORMATOS_VALIDOS.includes(file.type)) {
      Swal.fire({ icon: 'error', title: 'Formato no válido', text: 'Solo se aceptan imágenes JPG, PNG o WEBP.', confirmButtonColor: '#16181D' });
      return false;
    }
    if (file.size > MAX_MB * 1024 * 1024) {
      Swal.fire({ icon: 'error', title: 'Archivo demasiado grande', text: `El tamaño máximo permitido es ${MAX_MB} MB.`, confirmButtonColor: '#16181D' });
      return false;
    }
    return true;
  };

  const handleArchivoChange = (file) => {
    if (!file) return;
    if (!validarArchivo(file)) return;
    setArchivoSeleccionado(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubir = async (e) => {
    e.preventDefault();
    if (!archivoSeleccionado) {
      Swal.fire({ icon: 'warning', title: 'Selecciona una imagen', confirmButtonColor: '#16181D' });
      return;
    }

    setUploading(true);
    const payload = new FormData();
    payload.append('file', archivoSeleccionado);
    payload.append('titulo', formData.titulo);
    payload.append('categoria', formData.categoria);
    payload.append('descripcion', formData.descripcion);

    try {
      const response = await fetch(`${API_URL}/api/galeria/subir`, {
        method: 'POST',
        body: payload,
      });

      if (response.ok) {
        Swal.fire({ icon: 'success', title: '¡Imagen publicada!', timer: 2000, showConfirmButton: false, background: '#F3E7E4' });
        resetFormUpload();
        setShowUpload(false);
        cargarImagenes();
      } else {
        const msg = await response.text();
        throw new Error(msg);
      }
    } catch (err) {
      const nuevaImg = {
        id: Date.now(),
        url: preview,
        titulo: formData.titulo || 'Sin título',
        categoria: formData.categoria,
        descripcion: formData.descripcion,
      };
      setImagenes(prev => [nuevaImg, ...prev]);
      Swal.fire({ icon: 'success', title: '¡Imagen publicada! (demo)', timer: 2000, showConfirmButton: false, background: '#F3E7E4' });
      resetFormUpload();
      setShowUpload(false);
    } finally {
      setUploading(false);
    }
  };

  const resetFormUpload = () => {
    setArchivoSeleccionado(null);
    setPreview(null);
    setFormData({ titulo: '', categoria: 'Salones', descripcion: '' });
  };

  const iniciarEdicion = (img) => {
    setEditando(img.id);
    setFormEdicion({ titulo: img.titulo, categoria: img.categoria, descripcion: img.descripcion || '' });
  };

  const guardarEdicion = async (id) => {
    try {
      const response = await fetch(`${API_URL}/api/galeria/editar/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formEdicion),
      });
      
      setImagenes(prev => prev.map(img => img.id === id ? { ...img, ...formEdicion } : img));
      Swal.fire({ icon: 'success', title: 'Actualizado', timer: 1500, showConfirmButton: false, background: '#F3E7E4' });
    } catch {
      Swal.fire({ icon: 'error', title: 'Error al actualizar', background: '#F3E7E4' });
    } finally {
      setEditando(null);
    }
  };

  const handleEliminar = (id) => {
    Swal.fire({
      title: '¿Eliminar imagen?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#16181D',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      background: '#F3E7E4'
    }).then(async (result) => {
      if (!result.isConfirmed) return;
      try {
        await fetch(`${API_URL}/api/galeria/eliminar/${id}`, { method: 'DELETE' });
        setImagenes(prev => prev.filter(img => img.id !== id));
        Swal.fire({ icon: 'success', title: 'Imagen eliminada', timer: 1500, showConfirmButton: false });
      } catch {
        Swal.fire('Error', 'No se pudo eliminar', 'error');
      }
    });
  };

  const imagenesFiltradas = filtro === 'Todas' ? imagenes : imagenes.filter(i => i.categoria === filtro);

  return (
    <div className="container-fluid" style={{ backgroundColor: '#F3E7E4', minHeight: '100vh', padding: '0 0 60px' }}>

      {/* Header Admin */}
      <div style={{
        background: 'linear-gradient(135deg, #16181D 0%, #1c1f26 100%)',
        padding: '35px 30px', marginBottom: '30px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
      }}>
        <div>
          <h2 style={{ color: '#F3E7E4', margin: 0, fontWeight: 'bold', fontFamily: "'Georgia', serif", fontSize: '1.8rem' }}>🖼️ Gestión de Galería</h2>
          <p style={{ color: 'rgba(243, 231, 228, 0.6)', margin: '5px 0 0', fontSize: '0.95rem' }}>
            {imagenes.length} {imagenes.length === 1 ? 'imagen publicada' : 'imágenes publicadas en el catálogo'}
          </p>
        </div>
        <button
          onClick={() => { setShowUpload(true); resetFormUpload(); }}
          style={{
            backgroundColor: '#D4AF37', color: '#16181D', border: 'none',
            padding: '12px 28px', borderRadius: '30px', fontWeight: 'bold',
            fontSize: '1rem', cursor: 'pointer', boxShadow: '0 4px 15px rgba(212,175,55,0.3)',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
        >
          ➕ Subir Nueva Imagen
        </button>
      </div>

      <div className="container" style={{ maxWidth: '1400px' }}>

        {/* Filtros y controles */}
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-5">
          <div className="d-flex gap-2 flex-wrap">
            {['Todas', ...CATEGORIAS].map(cat => (
              <button
                key={cat}
                onClick={() => setFiltro(cat)}
                style={{
                  padding: '8px 20px', borderRadius: '50px', border: '2px solid #16181D',
                  backgroundColor: filtro === cat ? '#16181D' : 'transparent',
                  color: filtro === cat ? '#D4AF37' : '#16181D',
                  fontWeight: 'bold', fontSize: '0.85rem', cursor: 'pointer', transition: 'all 0.25s'
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="d-flex gap-2">
            {['grid', 'lista'].map(v => (
              <button
                key={v}
                onClick={() => setVista(v)}
                style={{
                  padding: '8px 16px', borderRadius: '10px', border: '1px solid #ccc',
                  backgroundColor: vista === v ? '#16181D' : 'white',
                  color: vista === v ? '#D4AF37' : '#666',
                  cursor: 'pointer', fontWeight: 'bold', fontSize: '0.85rem'
                }}
              >
                {v === 'grid' ? '⊞ Cuadrícula' : '☰ Lista'}
              </button>
            ))}
          </div>
        </div>

        {/* Contenido */}
        {loading ? (
          <div className="text-center py-5">
             <div className="spinner-border" style={{ color: '#D4AF37' }} role="status"></div>
             <p className="mt-3 text-muted">Cargando galería...</p>
          </div>
        ) : vista === 'grid' ? (
          /* VISTA GRID */
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '25px' }}>
            {imagenesFiltradas.map(img => (
              <div key={img.id} className="card border-0 shadow-sm" style={{ borderRadius: '15px', overflow: 'hidden', backgroundColor: 'white' }}>
                <div style={{ position: 'relative', height: '220px', overflow: 'hidden' }}>
                  <img src={img.url} alt={img.titulo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <span style={{
                    position: 'absolute', top: '12px', left: '12px',
                    backgroundColor: '#D4AF37', color: '#16181D',
                    fontSize: '0.7rem', fontWeight: 'bold', padding: '4px 12px',
                    borderRadius: '20px', textTransform: 'uppercase'
                  }}>{img.categoria}</span>
                </div>

                <div className="card-body p-4">
                  {editando === img.id ? (
                    <div className="d-flex flex-column gap-2">
                      <input type="text" value={formEdicion.titulo} onChange={e => setFormEdicion({ ...formEdicion, titulo: e.target.value })} style={inputStyle} />
                      <select value={formEdicion.categoria} onChange={e => setFormEdicion({ ...formEdicion, categoria: e.target.value })} style={inputStyle}>
                        {CATEGORIAS.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                      <textarea value={formEdicion.descripcion} onChange={e => setFormEdicion({ ...formEdicion, descripcion: e.target.value })} rows={2} style={{ ...inputStyle, resize: 'none' }} />
                      <div className="d-flex gap-2 mt-2">
                        <button onClick={() => guardarEdicion(img.id)} className="btn btn-sm w-100 fw-bold" style={{ backgroundColor: '#16181D', color: '#D4AF37' }}>Guardar</button>
                        <button onClick={() => setEditando(null)} className="btn btn-sm btn-light w-100 fw-bold">Cancelar</button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <h5 style={{ fontFamily: "'Georgia', serif", fontWeight: 'bold', color: '#16181D', marginBottom: '8px' }}>{img.titulo}</h5>
                      <p style={{ color: '#666', fontSize: '0.88rem', minHeight: '40px' }}>{img.descripcion || 'Sin descripción.'}</p>
                      <div className="d-flex gap-2 mt-3">
                        <button onClick={() => iniciarEdicion(img)} className="btn btn-sm flex-fill fw-bold" style={{ border: '1px solid #16181D', color: '#16181D' }}>✏️ Editar</button>
                        <button onClick={() => handleEliminar(img.id)} className="btn btn-sm flex-fill fw-bold btn-outline-danger">🗑️ Eliminar</button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* VISTA LISTA */
          <div className="card border-0 shadow-sm" style={{ borderRadius: '15px', overflow: 'hidden' }}>
            <table className="table table-hover align-middle mb-0">
              <thead style={{ backgroundColor: '#16181D', color: '#F3E7E4' }}>
                <tr>
                  <th className="ps-4">Imagen</th>
                  <th>Título</th>
                  <th>Categoría</th>
                  <th>Descripción</th>
                  <th className="text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {imagenesFiltradas.map((img) => (
                  <tr key={img.id}>
                    <td className="ps-4 py-3">
                      <img src={img.url} alt={img.titulo} style={{ width: '80px', height: '55px', objectFit: 'cover', borderRadius: '8px' }} />
                    </td>
                    <td>
                      {editando === img.id
                        ? <input type="text" value={formEdicion.titulo} onChange={e => setFormEdicion({ ...formEdicion, titulo: e.target.value })} className="form-control form-control-sm" />
                        : <strong style={{ color: '#16181D' }}>{img.titulo}</strong>}
                    </td>
                    <td>
                      {editando === img.id
                        ? <select value={formEdicion.categoria} onChange={e => setFormEdicion({ ...formEdicion, categoria: e.target.value })} className="form-select form-select-sm">
                            {CATEGORIAS.map(c => <option key={c} value={c}>{c}</option>)}
                          </select>
                        : <span className="badge" style={{ backgroundColor: '#F3E7E4', color: '#16181D', border: '1px solid #D4AF37' }}>{img.categoria}</span>}
                    </td>
                    <td style={{ color: '#666', fontSize: '0.9rem' }}>
                      {editando === img.id
                        ? <input type="text" value={formEdicion.descripcion} onChange={e => setFormEdicion({ ...formEdicion, descripcion: e.target.value })} className="form-control form-control-sm" />
                        : img.descripcion || '—'}
                    </td>
                    <td>
                      <div className="d-flex gap-2 justify-content-center">
                        {editando === img.id ? (
                          <>
                            <button onClick={() => guardarEdicion(img.id)} className="btn btn-sm btn-dark">💾</button>
                            <button onClick={() => setEditando(null)} className="btn btn-sm btn-light">✕</button>
                          </>
                        ) : (
                          <>
                            <button onClick={() => iniciarEdicion(img)} className="btn btn-sm btn-outline-dark">✏️</button>
                            <button onClick={() => handleEliminar(img.id)} className="btn btn-sm btn-outline-danger">🗑️</button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL DE SUBIDA */}
      {showUpload && (
        <div onClick={() => setShowUpload(false)} style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(22, 24, 29, 0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000, padding: '20px', backdropFilter: 'blur(5px)' }}>
          <div onClick={e => e.stopPropagation()} style={{ background: 'white', borderRadius: '20px', width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
            
            <div style={{ background: '#16181D', padding: '25px 30px', borderRadius: '20px 20px 0 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h4 style={{ color: '#D4AF37', margin: 0, fontWeight: 'bold', fontFamily: "'Georgia', serif" }}>📤 Publicar en Galería</h4>
              <button onClick={() => setShowUpload(false)} style={{ background: 'transparent', border: 'none', color: 'white', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
            </div>

            <div style={{ padding: '35px' }}>
              <form onSubmit={handleSubir}>
                <div
                  onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={e => { e.preventDefault(); setDragOver(false); handleArchivoChange(e.dataTransfer.files[0]); }}
                  onClick={() => inputFileRef.current.click()}
                  style={{
                    border: `2px dashed ${dragOver ? '#D4AF37' : '#ddd'}`,
                    borderRadius: '15px', padding: '40px', textAlign: 'center', cursor: 'pointer',
                    backgroundColor: dragOver ? '#FDF8F0' : '#fafafa', marginBottom: '25px', transition: 'all 0.3s'
                  }}
                >
                  {preview ? (
                    <div>
                      <img src={preview} alt="Preview" style={{ maxHeight: '220px', maxWidth: '100%', objectFit: 'contain', borderRadius: '12px', marginBottom: '15px' }} />
                      <p style={{ color: '#16181D', fontWeight: 'bold', margin: 0 }}>✅ {archivoSeleccionado.name}</p>
                      <small className="text-muted">Haz clic para cambiar la imagen</small>
                    </div>
                  ) : (
                    <div>
                      <div style={{ fontSize: '3rem', marginBottom: '10px' }}>📸</div>
                      <p style={{ fontWeight: 'bold', color: '#16181D', marginBottom: '5px' }}>Selecciona o arrastra una imagen</p>
                      <p style={{ color: '#999', fontSize: '0.85rem' }}>Formatos: JPG, PNG, WEBP (Máx. 5 MB)</p>
                    </div>
                  )}
                  <input ref={inputFileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => handleArchivoChange(e.target.files[0])} />
                </div>

                <div className="mb-3">
                  <label style={labelStyle}>TÍTULO DE LA IMAGEN</label>
                  <input type="text" required value={formData.titulo} onChange={e => setFormData({ ...formData, titulo: e.target.value })} style={inputStyle} placeholder="Ej. Atardecer en los Jardines" />
                </div>

                <div className="mb-3">
                  <label style={labelStyle}>CATEGORÍA</label>
                  <select value={formData.categoria} onChange={e => setFormData({ ...formData, categoria: e.target.value })} style={inputStyle}>
                    {CATEGORIAS.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div className="mb-4">
                  <label style={labelStyle}>DESCRIPCIÓN BREVE</label>
                  <textarea value={formData.descripcion} onChange={e => setFormData({ ...formData, descripcion: e.target.value })} rows={3} style={{ ...inputStyle, resize: 'none' }} placeholder="Escribe una pequeña reseña visual..." />
                </div>

                <div className="d-flex gap-3">
                  <button type="button" onClick={() => setShowUpload(false)} style={btnCancelar}>Cancelar</button>
                  <button type="submit" disabled={uploading} style={btnGuardarPrincipal}>
                    {uploading ? '⏳ Subiendo...' : '📤 Publicar ahora'}
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

// Estilos Reutilizables
const inputStyle = { width: '100%', padding: '12px 15px', border: '1px solid #ddd', borderRadius: '10px', fontSize: '0.95rem' };
const labelStyle = { display: 'block', marginBottom: '8px', color: '#16181D', fontWeight: 'bold', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px' };
const btnGuardarPrincipal = { flex: 2, padding: '14px', borderRadius: '30px', border: 'none', background: '#16181D', color: '#D4AF37', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.3s' };
const btnCancelar = { flex: 1, padding: '14px', borderRadius: '30px', border: '1px solid #ddd', background: 'white', color: '#666', fontWeight: 'bold', cursor: 'pointer' };