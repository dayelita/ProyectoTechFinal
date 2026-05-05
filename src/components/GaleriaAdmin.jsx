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
  const [vista, setVista] = useState('grid'); // 'grid' | 'lista'

  // Estado formulario upload
  const [showUpload, setShowUpload] = useState(false);
  const [archivoSeleccionado, setArchivoSeleccionado] = useState(null);
  const [preview, setPreview] = useState(null);
  const [formData, setFormData] = useState({ titulo: '', categoria: 'Salones', descripcion: '' });
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  // Estado edición
  const [editando, setEditando] = useState(null); // id imagen editando
  const [formEdicion, setFormEdicion] = useState({});

  const inputFileRef = useRef();

  useEffect(() => {
    cargarImagenes();
  }, []);

  const cargarImagenes = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8081/api/galeria/todas');
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

  // --- VALIDACIÓN DE ARCHIVO ---
  const validarArchivo = (file) => {
    if (!FORMATOS_VALIDOS.includes(file.type)) {
      Swal.fire({ icon: 'error', title: 'Formato no válido', text: 'Solo se aceptan imágenes JPG, PNG o WEBP.', confirmButtonColor: '#722F37' });
      return false;
    }
    if (file.size > MAX_MB * 1024 * 1024) {
      Swal.fire({ icon: 'error', title: 'Archivo demasiado grande', text: `El tamaño máximo permitido es ${MAX_MB} MB.`, confirmButtonColor: '#722F37' });
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

  // --- SUBIR IMAGEN ---
  const handleSubir = async (e) => {
    e.preventDefault();
    if (!archivoSeleccionado) {
      Swal.fire({ icon: 'warning', title: 'Selecciona una imagen', confirmButtonColor: '#722F37' });
      return;
    }

    setUploading(true);
    const payload = new FormData();
    payload.append('file', archivoSeleccionado);
    payload.append('titulo', formData.titulo);
    payload.append('categoria', formData.categoria);
    payload.append('descripcion', formData.descripcion);

    try {
      const response = await fetch('http://localhost:8081/api/galeria/subir', {
        method: 'POST',
        body: payload,
      });

      if (response.ok) {
        Swal.fire({ icon: 'success', title: '¡Imagen publicada!', timer: 2000, showConfirmButton: false });
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
      Swal.fire({ icon: 'success', title: '¡Imagen publicada! (demo)', timer: 2000, showConfirmButton: false });
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

  // --- EDITAR ---
  const iniciarEdicion = (img) => {
    setEditando(img.id);
    setFormEdicion({ titulo: img.titulo, categoria: img.categoria, descripcion: img.descripcion || '' });
  };

  const guardarEdicion = async (id) => {
    try {
      const response = await fetch(`http://localhost:8081/api/galeria/editar/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formEdicion),
      });
      if (response.ok) {
        setImagenes(prev => prev.map(img => img.id === id ? { ...img, ...formEdicion } : img));
        Swal.fire({ icon: 'success', title: 'Actualizado', timer: 1500, showConfirmButton: false });
      } else {
        setImagenes(prev => prev.map(img => img.id === id ? { ...img, ...formEdicion } : img));
        Swal.fire({ icon: 'success', title: 'Actualizado (demo)', timer: 1500, showConfirmButton: false });
      }
    } catch {
      setImagenes(prev => prev.map(img => img.id === id ? { ...img, ...formEdicion } : img));
      Swal.fire({ icon: 'success', title: 'Actualizado (demo)', timer: 1500, showConfirmButton: false });
    } finally {
      setEditando(null);
    }
  };

  // --- ELIMINAR ---
  const handleEliminar = (id) => {
    Swal.fire({
      title: '¿Eliminar imagen?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#722F37',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then(async (result) => {
      if (!result.isConfirmed) return;
      try {
        const response = await fetch(`http://localhost:8081/api/galeria/eliminar/${id}`, { method: 'DELETE' });
        if (!response.ok) throw new Error();
      } catch {
        // Fallback demo
      } finally {
        setImagenes(prev => prev.filter(img => img.id !== id));
        Swal.fire({ icon: 'success', title: 'Imagen eliminada', timer: 1500, showConfirmButton: false });
      }
    });
  };

  const imagenesFiltradas = filtro === 'Todas' ? imagenes : imagenes.filter(i => i.categoria === filtro);

  return (
    <div className="container-fluid" style={{ backgroundColor: '#fdfbf7', minHeight: '100vh', padding: '0 0 60px' }}>

      {/* Header Admin */}
      <div style={{
        background: 'linear-gradient(135deg, #722F37 0%, #4a1c20 100%)',
        padding: '28px 30px', marginBottom: '30px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px',
      }}>
        <div>
          <h2 style={{ color: 'white', margin: 0, fontWeight: 800, fontSize: '1.5rem' }}>🖼️ Gestión de Galería</h2>
          <p style={{ color: 'rgba(255,255,255,0.65)', margin: '4px 0 0', fontSize: '0.9rem' }}>
            {imagenes.length} {imagenes.length === 1 ? 'imagen publicada' : 'imágenes publicadas'}
          </p>
        </div>
        <button
          onClick={() => { setShowUpload(true); resetFormUpload(); }}
          style={{
            backgroundColor: '#D4AF37', color: '#2a0f12', border: 'none',
            padding: '10px 24px', borderRadius: '25px', fontWeight: 700,
            fontSize: '0.95rem', cursor: 'pointer', boxShadow: '0 4px 12px rgba(212,175,55,0.4)',
          }}
        >
          ➕ Subir Imagen
        </button>
      </div>

      <div style={{ padding: '0 20px', maxWidth: '1400px', margin: '0 auto' }}>

        {/* Filtros y controles */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '25px' }}>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {['Todas', ...CATEGORIAS].map(cat => (
              <button
                key={cat}
                onClick={() => setFiltro(cat)}
                style={{
                  padding: '6px 18px', borderRadius: '50px', border: '2px solid',
                  borderColor: filtro === cat ? '#722F37' : '#ddd',
                  backgroundColor: filtro === cat ? '#722F37' : 'white',
                  color: filtro === cat ? 'white' : '#666',
                  fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer',
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            {['grid', 'lista'].map(v => (
              <button
                key={v}
                onClick={() => setVista(v)}
                style={{
                  padding: '6px 14px', borderRadius: '8px', border: '2px solid',
                  borderColor: vista === v ? '#722F37' : '#ddd',
                  backgroundColor: vista === v ? '#722F37' : 'white',
                  color: vista === v ? 'white' : '#666',
                  cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem',
                }}
              >
                {v === 'grid' ? '⊞ Cuadrícula' : '☰ Lista'}
              </button>
            ))}
          </div>
        </div>

        {/* Contenido */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px' }}>
            <div style={{ fontSize: '2.5rem' }}>⏳</div>
            <p style={{ color: '#999' }}>Cargando galería...</p>
          </div>
        ) : vista === 'grid' ? (
          /* VISTA GRID */
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
            {imagenesFiltradas.map(img => (
              <div key={img.id} style={{ background: 'white', borderRadius: '14px', overflow: 'hidden', boxShadow: '0 3px 12px rgba(0,0,0,0.08)' }}>
                <div style={{ position: 'relative', height: '200px', overflow: 'hidden' }}>
                  <img src={img.url} alt={img.titulo} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  <span style={{
                    position: 'absolute', top: '12px', left: '12px',
                    backgroundColor: '#D4AF37', color: '#2a0f12',
                    fontSize: '0.7rem', fontWeight: 700, padding: '3px 10px',
                    borderRadius: '20px', textTransform: 'uppercase', letterSpacing: '0.8px',
                  }}>
                    {img.categoria}
                  </span>
                </div>

                <div style={{ padding: '16px' }}>
                  {editando === img.id ? (
                    <div>
                      <input
                        type="text" placeholder="Título" value={formEdicion.titulo}
                        onChange={e => setFormEdicion({ ...formEdicion, titulo: e.target.value })}
                        style={inputStyle}
                      />
                      <select value={formEdicion.categoria}
                        onChange={e => setFormEdicion({ ...formEdicion, categoria: e.target.value })}
                        style={inputStyle}
                      >
                        {CATEGORIAS.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                      <textarea placeholder="Descripción" value={formEdicion.descripcion}
                        onChange={e => setFormEdicion({ ...formEdicion, descripcion: e.target.value })}
                        rows={2} style={{ ...inputStyle, resize: 'none' }}
                      />
                      <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                        <button onClick={() => guardarEdicion(img.id)} style={btnGuardar}>💾 Guardar</button>
                        <button onClick={() => setEditando(null)} style={btnCancelar}>Cancelar</button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <h5 style={{ margin: '0 0 4px', color: '#1a1a1a', fontWeight: 700 }}>{img.titulo}</h5>
                      {img.descripcion && <p style={{ margin: '0 0 12px', color: '#888', fontSize: '0.85rem', lineHeight: 1.5 }}>{img.descripcion}</p>}
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={() => iniciarEdicion(img)} style={btnEditar}>✏️ Editar</button>
                        <button onClick={() => handleEliminar(img.id)} style={btnEliminar}>🗑️ Eliminar</button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* VISTA LISTA */
          <div style={{ background: 'white', borderRadius: '14px', overflow: 'hidden', boxShadow: '0 3px 12px rgba(0,0,0,0.08)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f9f5f0', borderBottom: '2px solid #f0e8e0' }}>
                  <th style={th}>Imagen</th>
                  <th style={th}>Título</th>
                  <th style={th}>Categoría</th>
                  <th style={th}>Descripción</th>
                  <th style={{ ...th, textAlign: 'center' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {imagenesFiltradas.map((img, i) => (
                  <tr key={img.id} style={{ borderBottom: '1px solid #f0e8e0', backgroundColor: i % 2 === 0 ? 'white' : '#fdfbf7' }}>
                    <td style={{ padding: '12px 16px' }}>
                      <img src={img.url} alt={img.titulo} style={{ width: '70px', height: '50px', objectFit: 'cover', borderRadius: '8px' }} />
                    </td>
                    <td style={{ padding: '12px 16px', fontWeight: 600, color: '#1a1a1a' }}>
                      {editando === img.id
                        ? <input type="text" value={formEdicion.titulo} onChange={e => setFormEdicion({ ...formEdicion, titulo: e.target.value })} style={{ ...inputStyle, marginBottom: 0 }} />
                        : img.titulo}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      {editando === img.id
                        ? <select value={formEdicion.categoria} onChange={e => setFormEdicion({ ...formEdicion, categoria: e.target.value })} style={{ ...inputStyle, marginBottom: 0 }}>
                            {CATEGORIAS.map(c => <option key={c} value={c}>{c}</option>)}
                          </select>
                        : <span style={{ backgroundColor: '#F4E1E6', color: '#722F37', padding: '3px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>{img.categoria}</span>
                      }
                    </td>
                    <td style={{ padding: '12px 16px', color: '#888', fontSize: '0.875rem', maxWidth: '250px' }}>
                      {editando === img.id
                        ? <input type="text" value={formEdicion.descripcion} onChange={e => setFormEdicion({ ...formEdicion, descripcion: e.target.value })} style={{ ...inputStyle, marginBottom: 0 }} />
                        : img.descripcion || '—'
                      }
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                      {editando === img.id ? (
                        <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                          <button onClick={() => guardarEdicion(img.id)} style={btnGuardar}>💾</button>
                          <button onClick={() => setEditando(null)} style={btnCancelar}>✕</button>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                          <button onClick={() => iniciarEdicion(img)} style={btnEditar}>✏️</button>
                          <button onClick={() => handleEliminar(img.id)} style={btnEliminar}>🗑️</button>
                        </div>
                      )}
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
        <div
          onClick={() => setShowUpload(false)}
          style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.65)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000, padding: '20px' }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{ background: 'white', borderRadius: '20px', width: '100%', maxWidth: '580px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}
          >
            <div style={{ background: 'linear-gradient(135deg, #722F37, #4a1c20)', padding: '22px 28px', borderRadius: '20px 20px 0 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h4 style={{ color: 'white', margin: 0, fontWeight: 700 }}>📤 Subir Nueva Imagen</h4>
              <button onClick={() => setShowUpload(false)} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', color: 'white', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', fontSize: '1rem' }}>✕</button>
            </div>

            <div style={{ padding: '28px' }}>
              <form onSubmit={handleSubir}>
                <div
                  onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={e => { e.preventDefault(); setDragOver(false); handleArchivoChange(e.dataTransfer.files[0]); }}
                  onClick={() => inputFileRef.current.click()}
                  style={{
                    border: `2px dashed ${dragOver ? '#722F37' : '#ddd'}`,
                    borderRadius: '14px', padding: '30px', textAlign: 'center', cursor: 'pointer',
                    backgroundColor: dragOver ? '#FFF0F2' : '#fafafa', marginBottom: '20px',
                  }}
                >
                  {preview ? (
                    <div>
                      <img src={preview} alt="Preview" style={{ maxHeight: '200px', maxWidth: '100%', objectFit: 'contain', borderRadius: '10px', marginBottom: '12px' }} />
                      <p style={{ color: '#722F37', fontWeight: 600, margin: 0 }}>✅ {archivoSeleccionado.name}</p>
                    </div>
                  ) : (
                    <div>
                      <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>🖼️</div>
                      <p style={{ fontWeight: 600, color: '#444' }}>Arrastra tu imagen aquí</p>
                      <p style={{ color: '#999', fontSize: '0.85rem' }}>o haz clic para seleccionar · Máx. 5 MB</p>
                    </div>
                  )}
                  <input ref={inputFileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => handleArchivoChange(e.target.files[0])} />
                </div>

                <div style={{ marginBottom: '14px' }}>
                  <label style={labelStyle}>Título de la imagen *</label>
                  <input type="text" required value={formData.titulo} onChange={e => setFormData({ ...formData, titulo: e.target.value })} style={inputStyle} />
                </div>

                <div style={{ marginBottom: '14px' }}>
                  <label style={labelStyle}>Categoría *</label>
                  <select value={formData.categoria} onChange={e => setFormData({ ...formData, categoria: e.target.value })} style={inputStyle}>
                    {CATEGORIAS.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div style={{ marginBottom: '22px' }}>
                  <label style={labelStyle}>Descripción</label>
                  <textarea value={formData.descripcion} onChange={e => setFormData({ ...formData, descripcion: e.target.value })} rows={3} style={{ ...inputStyle, resize: 'none' }} />
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <button type="button" onClick={() => setShowUpload(false)} style={btnCancelar}>Cancelar</button>
                  <button type="submit" disabled={uploading} style={btnGuardarPrincipal}>
                    {uploading ? '⏳ Subiendo...' : '📤 Publicar Imagen'}
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

// Estilos
const inputStyle = { width: '100%', padding: '10px 14px', border: '1.5px solid #e0d6cc', borderRadius: '10px', marginBottom: '10px' };
const labelStyle = { display: 'block', marginBottom: '6px', color: '#722F37', fontWeight: 700, fontSize: '0.85rem' };
const th = { padding: '12px 16px', textAlign: 'left', color: '#722F37', fontWeight: 700 };
const btnEditar = { padding: '6px 14px', borderRadius: '8px', border: '1.5px solid #722F37', background: 'white', color: '#722F37', cursor: 'pointer' };
const btnEliminar = { padding: '6px 14px', borderRadius: '8px', border: '1.5px solid #dc3545', background: 'white', color: '#dc3545', cursor: 'pointer' };
const btnGuardar = { padding: '6px 14px', borderRadius: '8px', border: 'none', background: '#722F37', color: 'white', cursor: 'pointer' };
const btnGuardarPrincipal = { flex: 2, padding: '12px', borderRadius: '10px', border: 'none', background: '#722F37', color: 'white', fontWeight: 700, cursor: 'pointer' };
const btnCancelar = { flex: 1, padding: '12px', borderRadius: '10px', border: '1.5px solid #ddd', background: 'white', color: '#666', cursor: 'pointer' };