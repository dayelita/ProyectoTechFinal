import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

// Testimonios de respaldo si el backend está apagado
const TESTIMONIOS_DEMO = [
  { estrellas: 5, comentario: "Antes de conocerlos, organizar nuestro matrimonio era un estrés. Al llegar a Espacio Casona nos solucionaron todo con una atención increíble.", nombre: "Carlos R.", rol: "Novio" },
  { estrellas: 5, comentario: "Excelente lugar para eventos de empresa. Los salones son amplios y el entorno natural le dio un toque especial a nuestra jornada de capacitación.", nombre: "Elena V.", rol: "Recursos Humanos" },
  { estrellas: 5, comentario: "Celebramos los 50 años de mi padre aquí. La comida, el espacio y la atención fueron de primer nivel. Recomendado 100%.", nombre: "Martina S.", rol: "Invitada" }
];

const Testimonios = () => {
  const [testimonios, setTestimonios] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  
  // Estado del Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [newText, setNewText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  // 🔥 1. Cargar testimonios desde Spring Boot al iniciar
  useEffect(() => {
    cargarTestimonios();
  }, []);

  const cargarTestimonios = async () => {
    try {
      const response = await fetch('http://localhost:8081/api/testimonios/todos');
      if (response.ok) {
        const data = await response.json();
        setTestimonios(data.length > 0 ? data : TESTIMONIOS_DEMO);
      } else {
        setTestimonios(TESTIMONIOS_DEMO);
      }
    } catch (error) {
      setTestimonios(TESTIMONIOS_DEMO);
    }
  };

  // 2. Efecto del Carrusel
  useEffect(() => {
    if (isPaused || testimonios.length === 0) return;
    const timer = setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonios.length);
    }, 3500); 
    return () => clearTimeout(timer);
  }, [isPaused, testimonios.length, currentIndex]);

  // 3. Funciones de navegación
  const handlePrev = () => setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonios.length) % testimonios.length);
  const handleNext = () => setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonios.length);

  // 🔥 4. Abrir Modal con Guardia de Seguridad
  const handleOpenModal = () => {
    const idUsuario = localStorage.getItem('idUsuario');
    
    if (!idUsuario) {
      Swal.fire({
        title: '¡Queremos escucharte!',
        text: 'Para dejar una reseña, por favor inicia sesión con tu cuenta.',
        icon: 'info',
        showCancelButton: true,
        confirmButtonColor: '#722F37',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Iniciar Sesión',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) navigate('/login');
      });
      return; // Detiene la ejecución para no abrir el modal
    }

    setIsModalOpen(true);
    setIsPaused(true); 
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsPaused(false);
    setRating(0);
    setNewText('');
  };

  // 🔥 5. Guardar Reseña enviándola al Backend
  const handleSave = async () => {
    if (!rating || !newText.trim()) {
      Swal.fire({ icon: 'warning', title: 'Faltan datos', text: 'Por favor, escribe tu experiencia y selecciona una calificación.', confirmButtonColor: '#722F37' });
      return;
    }

    setIsSubmitting(true);

    // Armamos el objeto con los datos del localStorage
    const nombreUsuario = localStorage.getItem('nombreUsuario') || 'Usuario';
    const apellidoUsuario = localStorage.getItem('apellidoUsuario') || '';
    const idUsuario = localStorage.getItem('idUsuario');

    const nuevoTestimonio = {
      estrellas: rating,
      comentario: newText,
      nombre: `${nombreUsuario} ${apellidoUsuario}`.trim(),
      rol: 'Cliente Casona JMS', // Rol fijo para las reseñas
      usuario: { id: idUsuario } // Relación con el backend
    };

    try {
      const response = await fetch('http://localhost:8081/api/testimonios/crear', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevoTestimonio)
      });

      if (response.ok) {
        Swal.fire({ icon: 'success', title: '¡Gracias por tu reseña!', timer: 2000, showConfirmButton: false });
        cargarTestimonios(); // Recargamos para ver la nueva reseña
      } else {
        throw new Error('Error al guardar en BD');
      }
    } catch (error) {
      // Fallback: Si el backend falla, lo agregamos visualmente de todos modos
      setTestimonios([...testimonios, nuevoTestimonio]);
      Swal.fire({ icon: 'success', title: '¡Reseña publicada! (Modo Local)', timer: 2000, showConfirmButton: false });
    } finally {
      setIsSubmitting(false);
      handleCloseModal();
    }
  };

  const trackStyle = { transform: `translateX(calc(50% - 190px - ${currentIndex * 380}px))` };

  return (
    <div className="container mt-5 mb-5 testimonios-wrapper">
      
      <div className="card shadow-lg border-0 w-100" style={{ borderRadius: '15px', backgroundColor: '#FFFFFF' }}>
        <div className="card-body p-4 p-md-5">

          <style>{`
            .testimonios-wrapper { font-family: 'Inter', sans-serif; background: transparent; display: flex; justify-content: center; padding: 20px 0; }
            .app-container { width: 100%; max-width: 1200px; text-align: center; margin: 0 auto; }
            .tag { color: #722F37; font-weight: 600; font-size: 0.9rem; text-transform: uppercase; }
            .title-h1 { font-size: 2.5rem; color: #1a1a1a; margin: 15px 0 40px; }
            .carousel-viewport { width: 100%; overflow: hidden; position: relative; padding: 20px 0; }
            .carousel-track { display: flex; transition: transform 0.6s cubic-bezier(0.23, 1, 0.32, 1); }
            .card-t { min-width: 350px; max-width: 350px; margin: 0 15px; flex-shrink: 0; opacity: 0.2; filter: blur(5px); transform: scale(0.9); transition: all 0.6s ease; }
            .card-t.active { opacity: 1; filter: blur(0); transform: scale(1); }
            .card-inner { background: white; padding: 30px; border-radius: 20px; text-align: left; box-shadow: 0 4px 15px rgba(0,0,0,0.03); border: 1px solid #f0f0f0; }
            .stars { color: #D4AF37; margin-bottom: 15px; font-size: 1.1rem; }
            .comment { color: #4b5563; line-height: 1.6; font-size: 1rem; min-height: 90px; margin: 0; }
            .user { display: flex; align-items: center; margin-top: 25px; }
            .avatar { width: 42px; height: 42px; background: #F4E1E6; color: #722F37; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 600; margin-right: 12px; }
            .user-info strong { display: block; font-size: 0.95rem; color: #1a1a1a; }
            .user-info span { font-size: 0.85rem; color: #4b5563; }
            .nav-btn { position: absolute; top: 50%; transform: translateY(-50%); background: #F4E1E6; color: #722F37; border: none; width: 45px; height: 45px; border-radius: 50%; font-size: 1.2rem; cursor: pointer; z-index: 10; box-shadow: 0 4px 6px rgba(0,0,0,0.1); transition: all 0.3s ease; display: flex; align-items: center; justify-content: center; }
            .nav-btn:hover { background: #722F37; color: white; transform: translateY(-50%) scale(1.1); }
            .nav-btn.prev { left: 10px; }
            .nav-btn.next { right: 10px; }
            .btn-t-primary { background: #722F37; color: white; padding: 12px 28px; border-radius: 50px; font-weight: 600; cursor: pointer; border: none; transition: all 0.3s ease; box-shadow: 0 4px 12px rgba(114, 47, 55, 0.2); }
            .btn-t-primary:hover { transform: translateY(-2px); filter: brightness(1.1); }
            .btn-t-secondary { background: #f3f4f6; color: #4b5563; padding: 12px 28px; border-radius: 50px; font-weight: 600; cursor: pointer; border: none; transition: all 0.3s ease; }
            .btn-t-secondary:hover { background: #e5e7eb; }
            .modal-t { position: fixed; top:0; left:0; width:100%; height:100%; background: rgba(0,0,0,0.4); backdrop-filter: blur(5px); display: none; align-items: center; justify-content: center; z-index: 1000; }
            .modal-t.open { display: flex; }
            .modal-box { background: white; padding: 35px; border-radius: 25px; width: 420px; }
            .star-rating { font-size: 2.5rem; color: #ddd; margin-bottom: 20px; text-align: center; cursor: pointer; }
            .star-rating span.on { color: #D4AF37; }
            .modal-box textarea { width: 100%; padding: 15px; margin-bottom: 20px; border: 1.5px solid #eee; border-radius: 12px; box-sizing: border-box; font-family: 'Inter', sans-serif; resize: none; }
            .modal-box textarea:focus { outline: none; border-color: #722F37; }
            .modal-footer { display: flex; justify-content: flex-end; gap: 10px; }
          `}</style>

          <main className="app-container">
            <header>
              <span className="tag">Testimonios</span>
              <h1 className="title-h1">Lo que dicen nuestros clientes</h1>
            </header>

            <div className="carousel-viewport" onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => !isModalOpen && setIsPaused(false)}>
              <button className="nav-btn prev" onClick={handlePrev}>❮</button>
              <button className="nav-btn next" onClick={handleNext}>❯</button>

              <div className="carousel-track" style={trackStyle}>
                {testimonios.map((testimonio, index) => (
                  <div key={index} className={`card-t ${index === currentIndex ? 'active' : ''}`}>
                    <div className="card-inner">
                      <div className="stars">
                        {"★".repeat(testimonio.estrellas)}
                      </div>
                      <p className="comment">"{testimonio.comentario}"</p>
                      <div className="user">
                        <div className="avatar">{testimonio.nombre.charAt(0).toUpperCase()}</div>
                        <div className="user-info">
                          <strong>{testimonio.nombre}</strong>
                          <span>{testimonio.rol}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button onClick={handleOpenModal} className="btn-t-primary mt-4">
              Escribir testimonio
            </button>

            {/* 🔥 MODAL SIMPLIFICADO Y CONECTADO A LOCALSTORAGE */}
            <div className={`modal-t ${isModalOpen ? 'open' : ''}`}>
              <div className="modal-box">
                <h3 style={{color: '#722F37', fontWeight: 'bold', marginBottom: '5px'}}>Cuéntanos tu experiencia</h3>
                <p className="text-muted small mb-4">
                  Publicando como: <strong style={{color: '#1a1a1a'}}>{localStorage.getItem('nombreUsuario')} {localStorage.getItem('apellidoUsuario')}</strong>
                </p>
                
                <div className="star-rating">
                  {[1, 2, 3, 4, 5].map((starValue) => (
                    <span 
                      key={starValue} 
                      className={starValue <= rating ? 'on' : ''}
                      onClick={() => setRating(starValue)}
                    >
                      ★
                    </span>
                  ))}
                </div>
                
                <textarea 
                  placeholder="¿Qué fue lo que más te gustó de tu evento en la Casona JMS?" 
                  rows="4" 
                  value={newText} 
                  onChange={(e) => setNewText(e.target.value)}
                ></textarea>
                
                <div className="modal-footer">
                  <button onClick={handleCloseModal} className="btn-t-secondary" disabled={isSubmitting}>Cancelar</button>
                  <button onClick={handleSave} className="btn-t-primary" disabled={isSubmitting}>
                    {isSubmitting ? 'Publicando...' : 'Publicar Reseña'}
                  </button>
                </div>
              </div>
            </div>
          </main>

        </div>
      </div>
    </div>
  );
};

export default Testimonios;