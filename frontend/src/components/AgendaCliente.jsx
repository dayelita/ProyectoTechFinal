import React, { useState, useEffect } from 'react';
import { Calendar, dayjsLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import dayjs from 'dayjs';
import "dayjs/locale/es";
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

dayjs.locale("es");
const localizer = dayjsLocalizer(dayjs);
const capitalize = (str) => str ? str.charAt(0).toUpperCase() + str.slice(1) : '';

export default function AgendaCliente() {
  const [usuarioLogueado, setUsuarioLogueado] = useState({ id: null, nombre: '', apellido: '' });
  const [events, setEvents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate(); 
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081';

  const minTime = dayjs().set('hour', 9).set('minute', 0).toDate();
  const maxTime = dayjs().set('hour', 23).set('minute', 0).toDate();

  useEffect(() => {
    setUsuarioLogueado({
      id: localStorage.getItem('idUsuario'),
      nombre: localStorage.getItem('nombreUsuario'),
      apellido: localStorage.getItem('apellidoUsuario')
    });
    cargarReservas();
  }, []);

  const cargarReservas = async () => {
    try {
      const response = await fetch(`${API_URL}/api/reservas/todos`);
      if (response.ok) {
        const data = await response.json();
        const adaptados = data.map(res => ({
          ...res,
          start: new Date(res.fechaHoraInicio),
          end: new Date(res.fechaHoraFin)
        }));
        setEvents(adaptados);
      }
    } catch (error) { 
      console.error("Error al cargar reservas:", error); 
    }
  };

  const handleSelectSlot = (slotInfo) => {
    //  GUARDIA DE SEGURIDAD (SOLO PERSONAS LOGEADAS AGENDARAN CITAS)
    if (!usuarioLogueado || !usuarioLogueado.id) {
      Swal.fire({
        title: '¡Únete a la familia JMS!',
        text: 'Para agendar una hora en la Casona, necesitas iniciar sesión o crear una cuenta gratuita.',
        icon: 'info',
        showCancelButton: true,
        confirmButtonColor: '#16181D', 
        cancelButtonColor: '#D4AF37', 
        background: '#F3E7E4',
        color: '#16181D',
        confirmButtonText: 'Ir a Iniciar Sesión',
        cancelButtonText: 'Seguir mirando'
      }).then((result) => {
        if (result.isConfirmed) {
          navigate('/login'); 
        }
      });
      return; 
    }

    // CUANDO ESTE LOGEADO PODRA SEGUIR EL FLUJO NORMAL 
    const ahora = dayjs();
    const inicio = dayjs(slotInfo.start);
    const fin = dayjs(slotInfo.end);

    if (inicio.isBefore(ahora, 'day')) {
      Swal.fire({ icon: 'error', title: 'Fecha pasada', text: 'No puedes agendar en el pasado.', confirmButtonColor: '#16181D', background: '#F3E7E4', color: '#16181D' });
      return;
    }
    if (fin.diff(inicio, 'hour', true) < 3) {
      Swal.fire({ icon: 'warning', title: 'Duración mínima', text: 'El arriendo debe ser de al menos 3 horas.', confirmButtonColor: '#16181D', background: '#F3E7E4', color: '#16181D' });
      return;
    }
    setSelectedSlot(slotInfo);
    setIsModalOpen(true);
  };

  const handleSolicitarHora = async () => {
    setIsLoading(true);
    
   
    const token = localStorage.getItem('token');

    const nuevaReserva = {
      title: `Reserva de ${usuarioLogueado.nombre} ${usuarioLogueado.apellido}`,
      fechaHoraInicio: dayjs(selectedSlot.start).format('YYYY-MM-DDTHH:mm:ss'),
      fechaHoraFin: dayjs(selectedSlot.end).format('YYYY-MM-DDTHH:mm:ss'),
      usuario: { id: usuarioLogueado.id }
    };

    try {
      const response = await fetch(`${API_URL}/api/reservas/crear`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(nuevaReserva)
      });
      
      if (response.ok) {
        Swal.fire({ icon: 'success', title: 'Solicitud Enviada', text: 'En revisión por el administrador.', confirmButtonColor: '#16181D', background: '#F3E7E4', color: '#16181D' });
        cargarReservas();
        setIsModalOpen(false);
      } else {
        const txt = await response.text();
        Swal.fire({ icon: 'error', title: 'Error', text: txt, confirmButtonColor: '#16181D', background: '#F3E7E4', color: '#16181D' });
      }
    } catch (e) { 
      Swal.fire({ icon: 'error', title: 'Error de red', confirmButtonColor: '#16181D', background: '#F3E7E4', color: '#16181D' }); 
    }
    finally { setIsLoading(false); }
  };

  // FILTRA EVENTOS EN EL CALENDARIO
  const eventosCalendarioPrivado = events
    .filter(e => e.estado !== 'RECHAZADO')
    .map(e => {
      if (e.usuario?.id?.toString() === usuarioLogueado.id?.toString()) {
        return e; 
      } else {
        return { ...e, title: '❌ No Disponible' }; 
      }
    });

  const misReservasOrdenadas = events
    .filter(e => e.usuario && e.usuario.id?.toString() === usuarioLogueado.id?.toString())
    .sort((a, b) => new Date(a.start) - new Date(b.start));

  return (
    <div style={{ backgroundColor: '#F3E7E4', minHeight: '100vh', paddingBottom: '60px' }}>
      
      {/* BANNER PARA LA AGENDA CLIENTE */}
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
            ✦  Reserva tu Espacio  ✦
          </p>
          <h1 style={{ color: '#F3E7E4', fontSize: 'clamp(2rem, 5vw, 3.2rem)', fontWeight: 400, marginBottom: '15px', fontFamily: 'Georgia, serif' }}>
            Consulta de Disponibilidad
          </h1>
          <p style={{ color: 'rgba(243, 231, 228, 0.7)', maxWidth: '560px', margin: '0 auto', lineHeight: 1.6, fontSize: '1.05rem', fontFamily: 'sans-serif' }}>
            Selecciona un bloque en el calendario (mínimo 3 horas) para enviar tu solicitud de reserva a nuestra coordinadora.
          </p>
        </div>
      </div>

      <div className="container">
        
        {/* CONTENEDOR DEL CALENDARIO */}
        <div className="card shadow-lg border-0 p-4 bg-white mb-5" style={{ borderRadius: '20px' }}>
          
          {/* ESTILOS INYECTADOS DE REACT-BIG-CALENDAR  */}
          <style>{`
            .rbc-calendar { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
            .rbc-header { padding: 10px 0; font-weight: bold; color: #16181D; background-color: #f9f9f9; border-bottom: 2px solid #D4AF37; }
            .rbc-today { background-color: rgba(212, 175, 55, 0.1); }
            .rbc-time-view { border: 1px solid #e0e0e0; border-radius: 10px; overflow: hidden; }
            .rbc-timeslot-group { border-bottom: 1px solid #f0f0f0; }
            .rbc-day-slot .rbc-time-slot { border-top: 1px solid #f9f9f9; }
            .rbc-btn-group button { color: #16181D; border-color: #ddd; transition: all 0.2s; }
            .rbc-btn-group button.rbc-active { background-color: #16181D; color: #D4AF37; border-color: #16181D; }
            .rbc-btn-group button:hover:not(.rbc-active) { background-color: #f0f0f0; }
          `}</style>

          <Calendar
            localizer={localizer}
            events={eventosCalendarioPrivado} 
            selectable
            onSelectSlot={handleSelectSlot}
            eventPropGetter={(event) => ({
              style: { 
                backgroundColor: event.usuario?.id?.toString() === usuarioLogueado.id?.toString() ? '#D4AF37' : '#e0e0e0', 
                color: event.usuario?.id?.toString() === usuarioLogueado.id?.toString() ? '#16181D' : '#888888',
                border: event.usuario?.id?.toString() === usuarioLogueado.id?.toString() ? '1px solid #b8962e' : 'none',
                fontWeight: 'bold',
                borderRadius: '5px',
                padding: '2px 5px'
              }
            })}
            min={minTime} max={maxTime}
            style={{ height: "70vh" }}
            messages={{ next: "Sig.", previous: "Ant.", today: "Hoy", month: "Mes", week: "Sem.", day: "Día" }}
          />
        </div>

        {/* SOLICITUDES DEL CLIENTE VISIBLES SOLO PARA EL*/}
        {usuarioLogueado && usuarioLogueado.id && (
          <div className="card shadow-sm border-0" style={{ borderRadius: '20px', backgroundColor: '#ffffff' }}>
            <div className="card-header bg-white border-0 pt-4 pb-0 px-4">
              <h4 style={{ color: '#16181D', fontFamily: "'Georgia', serif", fontWeight: 'bold' }}>
                📜 Mis Solicitudes de Reserva
              </h4>
            </div>
            <div className="card-body p-4">
              {misReservasOrdenadas.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-muted mb-0" style={{ fontSize: '1.1rem' }}>Aún no tienes reservas registradas en el sistema.</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table align-middle">
                    <thead style={{ backgroundColor: '#16181D', color: '#F3E7E4' }}>
                      <tr>
                        <th style={{ borderTopLeftRadius: '10px', border: 'none', padding: '15px' }}>Fecha</th>
                        <th style={{ border: 'none', padding: '15px' }}>Horario</th>
                        <th style={{ borderTopRightRadius: '10px', border: 'none', padding: '15px' }}>Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {misReservasOrdenadas.map((res) => (
                        <tr key={res.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                          <td className="fw-bold" style={{ color: '#16181D', padding: '15px' }}>
                            {capitalize(dayjs(res.start).format('dddd, DD/MM/YYYY'))}
                          </td>
                          <td style={{ color: '#555', padding: '15px' }}>
                            {dayjs(res.start).format('HH:mm')} - {dayjs(res.end).format('HH:mm')}
                          </td>
                          <td style={{ padding: '15px' }}>
                            <span 
                              style={{ 
                                padding: '6px 12px', 
                                borderRadius: '20px', 
                                fontSize: '0.85rem', 
                                fontWeight: 'bold',
                                backgroundColor: res.estado === 'PENDIENTE' ? '#fff3cd' : (res.estado === 'APROBADO' ? '#d1e7dd' : '#f8d7da'),
                                color: res.estado === 'PENDIENTE' ? '#856404' : (res.estado === 'APROBADO' ? '#0f5132' : '#842029')
                              }}
                            >
                              {res.estado === 'APROBADO' ? '✅ APROBADO' : res.estado === 'RECHAZADO' ? '❌ RECHAZADO' : '⏳ PENDIENTE'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

      </div>

      {/* CONFIRMACION DE CITAS */}
      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(22, 24, 29, 0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1050, backdropFilter: 'blur(5px)' }}>
          <div className="card p-5 shadow-lg border-0" style={{ width: '450px', borderRadius: '20px', backgroundColor: '#ffffff' }}>
            
            <h3 className="fw-bold mb-2 text-center" style={{ color: '#16181D', fontFamily: "'Georgia', serif" }}>Confirmar Reserva</h3>
            <p className="text-center text-muted mb-4 small">Revisa los detalles antes de enviar tu solicitud</p>
            
            <div className="alert text-center border-0 mb-4" style={{ backgroundColor: '#F3E7E4', color: '#16181D', borderRadius: '15px', padding: '20px' }}>
              <div style={{ fontSize: '1.2rem', marginBottom: '5px' }}>
                <strong style={{ color: '#D4AF37' }}>📅 Fecha:</strong> {dayjs(selectedSlot.start).format('DD/MM/YYYY')}
              </div>
              <div style={{ fontSize: '1.1rem' }}>
                <strong style={{ color: '#D4AF37' }}>⏰ Horario:</strong> De {dayjs(selectedSlot.start).format('HH:mm')} a {dayjs(selectedSlot.end).format('HH:mm')}
              </div>
            </div>

            <button 
              className="btn fw-bold w-100 mb-3 shadow-sm py-2" 
              style={{ backgroundColor: '#16181D', color: '#D4AF37', borderRadius: '25px', fontSize: '1.1rem', transition: 'all 0.3s ease' }} 
              onClick={handleSolicitarHora} 
              disabled={isLoading}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#D4AF37'; e.currentTarget.style.color = '#16181D'; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#16181D'; e.currentTarget.style.color = '#D4AF37'; }}
            >
              {isLoading ? 'Enviando...' : 'Enviar Solicitud'}
            </button>
            
            <button 
              className="btn fw-bold w-100 py-2" 
              style={{ backgroundColor: 'transparent', color: '#16181D', border: '2px solid #ddd', borderRadius: '25px', transition: 'all 0.3s ease' }} 
              onClick={() => setIsModalOpen(false)}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#16181D'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#ddd'; }}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}