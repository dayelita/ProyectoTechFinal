import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

// TESTIMOCIOS DEMO
const TESTIMONIOS_DEMO = [
  { estrellas: 5, comentario: "Antes de conocerlos, organizar nuestro matrimonio era un estrés. Al llegar a Espacio Casona nos solucionaron todo con una atención increíble.", nombre: "Carlos R.", rol: "Novio" },
  { estrellas: 5, comentario: "Excelente lugar para eventos de empresa. Los salones son amplios y el entorno natural le dio un toque especial a nuestra jornada de capacitación.", nombre: "Elena V.", rol: "Recursos Humanos" },
  { estrellas: 5, comentario: "Celebramos los 50 años de mi padre aquí. La comida, el espacio y la atención fueron de primer nivel. Recomendado 100%.", nombre: "Martina S.", rol: "Invitada" }
];

const Testimonios = () => {
  const [testimonios, setTestimonios] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  
  // ESTADO DE MODAL
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [newText, setNewText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081';

  // SE CARGAN TESTUMONIOS AL INICIAR
  useEffect(() => {
    cargarTestimonios();
  }, []);

  const cargarTestimonios = async () => {
    try {
      const response = await fetch(`${API_URL}/api/testimonios/todos`);
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

  // EL EFECTO DEL CARRUSEL 
  useEffect(() => {
    if (isPaused || testimonios.length === 0) return;
    const timer = setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonios.length);
    }, 3500); 
    return () => clearTimeout(timer);
  }, [isPaused, testimonios.length, currentIndex]);

  // NAVEGACION
  const handlePrev = () => setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonios.length) % testimonios.length);
  const handleNext = () => setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonios.length);

  
  const handleOpenModal = () => {
    const idUsuario = localStorage.getItem('idUsuario');
    
    if (!idUsuario) {
      Swal.fire({
        title: '¡Queremos escucharte!',
        text: 'Para dejar una reseña, por favor inicia sesión con tu cuenta.',
        icon: 'info',
        showCancelButton: true,
        confirmButtonColor: '#16181D', // Azul Noche Profundo
        cancelButtonColor: '#D4AF37', // Dorado
        background: '#F3E7E4', // Casi-Blanco
        color: '#16181D',
        confirmButtonText: 'Iniciar Sesión',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) navigate('/login');
      });
      return; 
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

  // SE GUARDA LA RESEÑA ENVIANDOSE AL BACKEND
  const handleSave = async () => {
    if (!rating || !newText.trim()) {
      Swal.fire({ 
        icon: 'warning', 
        title: 'Faltan datos', 
        text: 'Por favor, escribe tu experiencia y selecciona una calificación.', 
        confirmButtonColor: '#16181D',
        background: '#F3E7E4',
        color: '#16181D'
      });
      return;
    }

    setIsSubmitting(true);

    const nombreUsuario = localStorage.getItem('nombreUsuario') || 'Usuario';
    const apellidoUsuario = localStorage.getItem('apellidoUsuario') || '';
    const idUsuario = localStorage.getItem('idUsuario');

    const nuevoTestimonio = {
      estrellas: rating,
      comentario: newText,
      nombre: `${nombreUsuario} ${apellidoUsuario}`.trim(),
      rol: 'Cliente Casona JMS', 
      usuario: { id: idUsuario } 
    };

    try {
      const response = await fetch(`${API_URL}/api/testimonios/crear`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevoTestimonio)
      });

      if (response.ok) {
        Swal.fire({ icon: 'success', title: '¡Gracias por tu reseña!', timer: 2000, showConfirmButton: false, background: '#F3E7E4', color: '#16181D' });
        cargarTestimonios(); 
      } else {
        throw new Error('Error al guardar en BD');
      }
    } catch (error) {
      setTestimonios([...testimonios, nuevoTestimonio]);
      Swal.fire({ icon: 'success', title: '¡Reseña publicada! (Modo Local)', timer: 2000, showConfirmButton: false, background: '#F3E7E4', color: '#16181D' });
    } finally {
      setIsSubmitting(false);
      handleCloseModal();
    }
  };

  const trackStyle = { transform: `translateX(calc(50% - 190px - ${currentIndex * 380}px))` };

  return (
    <div className="container mt-5 mb-5 testimonios-wrapper">
      
      <div className="card shadow-sm border-0 w-100" style={{ borderRadius: '15px', backgroundColor: '#FFFFFF' }}>
        <div className="card-body p-4 p-md-5">

          <style>{`
            .testimonios-wrapper { font-family: 'Segoe UI', sans-serif; background: transparent; display: flex; justify-content: center; padding: 20px 0; }
            .app-container { width: 100%; max-width: 1200px; text-align: center; margin: 0 auto; }
            .tag { color: #D4AF37; font-weight: 700; font-size: 0.95rem; text-transform: uppercase; letter-spacing: 1px; }
            .title-h1 { font-family: 'Georgia', serif; font-size: 2.5rem; color: #16181D; margin: 10px 0 40px; font-weight: bold; }
            .carousel-viewport { width: 100%; overflow: hidden; position: relative; padding: 20px 0; }
            .carousel-track { display: flex; transition: transform 0.6s cubic-bezier(0.23, 1, 0.32, 1); }
            .card-t { min-width: 350px; max-width: 350px; margin: 0 15px; flex-shrink: 0; opacity: 0.3; filter: blur(3px); transform: scale(0.9); transition: all 0.6s ease; }
            .card-t.active { opacity: 1; filter: blur(0); transform: scale(1); }
            .card-inner { background: white; padding: 30px; border-radius: 20px; text-align: left; box-shadow: 0 4px 20px rgba(0,0,0,0.06); border: 1px solid #f0f0f0; }
            .stars { color: #D4AF37; margin-bottom: 15px; font-size: 1.2rem; letter-spacing: 2px; }
            .comment { color: #4b5563; line-height: 1.6; font-size: 1rem; min-height: 90px; margin: 0; font-style: italic; }
            .user { display: flex; align-items: center; margin-top: 25px; }
            
            /* Avatar invertido: Fondo noche, letra dorada */
            .avatar { width: 45px; height: 45px; background: #16181D; color: #D4AF37; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; margin-right: 12px; font-size: 1.2rem; }
            .user-info strong { display: block; font-size: 0.95rem; color: #16181D; }
            .user-info span { font-size: 0.85rem; color: #D4AF37; font-weight: 500; }
            
            /* Botones de navegación del carrusel */
            .nav-btn { position: absolute; top: 50%; transform: translateY(-50%); background: #16181D; color: #D4AF37; border: none; width: 45px; height: 45px; border-radius: 50%; font-size: 1.2rem; cursor: pointer; z-index: 10; box-shadow: 0 4px 10px rgba(0,0,0,0.2); transition: all 0.3s ease; display: flex; align-items: center; justify-content: center; }
            .nav-btn:hover { background: #D4AF37; color: #16181D; transform: translateY(-50%) scale(1.1); }
            .nav-btn.prev { left: 10px; }
            .nav-btn.next { right: 10px; }
            
            /* Botones principales */
            .btn-t-primary { background: #16181D; color: #D4AF37; padding: 12px 30px; border-radius: 25px; font-weight: bold; cursor: pointer; border: 2px solid #16181D; transition: all 0.3s ease; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); }
            .btn-t-primary:hover { background: #D4AF37; color: #16181D; border-color: #D4AF37; transform: translateY(-2px); }
            .btn-t-primary:disabled { opacity: 0.7; cursor: not-allowed; }
            
            .btn-t-secondary { background: transparent; color: #16181D; padding: 12px 25px; border-radius: 25px; font-weight: bold; cursor: pointer; border: 2px solid #ddd; transition: all 0.3s ease; }
            .btn-t-secondary:hover { border-color: #16181D; }
            
            /* Modal */
            .modal-t { position: fixed; top:0; left:0; width:100%; height:100%; background: rgba(22, 24, 29, 0.8); backdrop-filter: blur(5px); display: none; align-items: center; justify-content: center; z-index: 1050; }
            .modal-t.open { display: flex; }
            .modal-box { background: #ffffff; padding: 40px; border-radius: 20px; width: 450px; box-shadow: 0 20px 50px rgba(0,0,0,0.3); }
            .star-rating { font-size: 2.5rem; color: #e0e0e0; margin-bottom: 20px; text-align: center; cursor: pointer; transition: color 0.2s; }
            .star-rating span:hover, .star-rating span.on { color: #D4AF37; }
            .modal-box textarea { width: 100%; padding: 15px; margin-bottom: 25px; border: 1.5px solid #ddd; border-radius: 12px; box-sizing: border-box; font-family: 'Segoe UI', sans-serif; resize: none; transition: border-color 0.3s; }
            .modal-box textarea:focus { outline: none; border-color: #D4AF37; box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.1); }
            .modal-footer { display: flex; justify-content: flex-end; gap: 12px; }
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

            {/* MODAL */}
            <div className={`modal-t ${isModalOpen ? 'open' : ''}`}>
              <div className="modal-box">
                <h3 style={{ color: '#16181D', fontFamily: "'Georgia', serif", fontWeight: 'bold', marginBottom: '10px' }}>Cuéntanos tu experiencia</h3>
                <p className="text-muted small mb-4">
                  Publicando como: <strong style={{ color: '#D4AF37' }}>{localStorage.getItem('nombreUsuario')} {localStorage.getItem('apellidoUsuario')}</strong>
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