import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';


export default function CarruselInicio() {
  return (
    <div id="carruselCasona" className="carousel slide mb-5" data-bs-ride="carousel">
      
      {/* Indicadores (Los puntitos de abajo) */}
      <div className="carousel-indicators">
        <button type="button" data-bs-target="#carruselCasona" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
        <button type="button" data-bs-target="#carruselCasona" data-bs-slide-to="1" aria-label="Slide 2"></button>
        <button type="button" data-bs-target="#carruselCasona" data-bs-slide-to="2" aria-label="Slide 3"></button>
      </div>

      {/* Imágenes y contenido de las diapositivas */}
      <div className="carousel-inner" style={{ maxHeight: '500px' }}> {/* Limita la altura máxima */}
        
        {/* Diapositiva 1 */}
        <div className="carousel-item active">
          <img 
            src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=2000" 
            className="d-block w-100" 
            alt="Fachada Casona" 
            style={{ objectFit: 'cover', height: '500px' }} 
          />
          <div className="carousel-caption d-none d-md-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: '8px' }}>
            <h5 className="fw-bold" style={{ color: '#556B2F' }}>Nuestra Fachada</h5>
            <p>Arquitectura clásica y elegancia para recibir a tus invitados.</p>
          </div>
        </div>

        {/* Diapositiva 2 */}
        <div className="carousel-item">
          <img 
            src="https://images.unsplash.com/photo-1510076857177-7470076d4098?q=80&w=1920&h=1080&fit=crop" 
            className="d-block w-100" 
            alt="Salón Principal" 
            style={{ objectFit: 'cover', height: '500px' }} 
          />
          <div className="carousel-caption d-none d-md-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: '8px' }}>
            <h5 className=" fw-bold" style={{ color: '#556B2F' }}>Salón Principal</h5>
            <p>Amplios espacios adaptables a cualquier tipo de celebración.</p>
          </div>
        </div>

        {/* Diapositiva 3 */}
        <div className="carousel-item">
          <img 
            src="https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1920&h=1080&fit=crop" 
            className="d-block w-100" 
            alt="Jardines" 
            style={{ objectFit: 'cover', height: '500px' ,aspectRatio: '16/9'}} 
          />
          <div className="carousel-caption d-none d-md-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: '8px' }}>
            <h5 className="fw-bold" style={{ color: '#556B2F' }}>Hermosos Jardines</h5>
            <p>Entorno natural perfecto para cócteles y fotografías al aire libre.</p>
          </div>
        </div>

      </div>

      {/* Controles: Flecha Anterior */}
      <button className="carousel-control-prev" type="button" data-bs-target="#carruselCasona" data-bs-slide="prev">
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Anterior</span>
      </button>
      
      {/* Controles: Flecha Siguiente */}
      <button className="carousel-control-next" type="button" data-bs-target="#carruselCasona" data-bs-slide="next">
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Siguiente</span>
      </button>
      
    </div>
  );
}