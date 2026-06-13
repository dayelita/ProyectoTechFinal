import React, { useState, useEffect } from 'react';
import { Calendar, dayjsLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import dayjs from 'dayjs';
import "dayjs/locale/es";
import Swal from 'sweetalert2';

dayjs.locale("es");
const localizer = dayjsLocalizer(dayjs);
const capitalize = (str) => str ? str.charAt(0).toUpperCase() + str.slice(1) : '';

export default function AgendaAdmin() {
  const [events, setEvents] = useState([]);
  const [pendientes, setPendientes] = useState([]);
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081';

  // RECOGE EL TOKEN Y PREPARA LA CABECERA SEGURA 
  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      // AGREGAMOS EL TOKEN A LA PETICION GET (BUSCAR)
      const response = await fetch(`${API_URL}/api/reservas/todos`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        const adaptados = data.map(res => ({
          ...res,
          start: new Date(res.fechaHoraInicio),
          end: new Date(res.fechaHoraFin)
        }));
        setEvents(adaptados);
        
        setPendientes(adaptados.filter(e => e.estado === 'PENDIENTE' && e.title !== '❌ Horario no disponible').sort((a,b) => a.start - b.start));
      }
    } catch (e) { 
      console.error("Error al cargar datos:", e); 
    }
  };

  const handleCambiarEstado = async (id, nuevoEstado) => {
    const actionText = nuevoEstado === 'APROBADO' ? 'aprobar' : 'rechazar';
    
    Swal.fire({
      title: `¿Confirmar acción?`,
      text: `Estás a punto de ${actionText} esta solicitud de reserva.`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: nuevoEstado === 'APROBADO' ? '#16181D' : '#d33',
      cancelButtonColor: '#aaa',
      confirmButtonText: 'Sí, confirmar',
      cancelButtonText: 'Cancelar',
      background: '#F3E7E4',
      color: '#16181D'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // AGREGAMOS LA CABECERA A LA PETICION PATCH (ACTUALIZAR ESTADO)
          const response = await fetch(`${API_URL}/api/reservas/${id}/estado`, {
            method: 'PATCH',
            headers: getAuthHeaders(),
            body: JSON.stringify(nuevoEstado)
          });
          if (response.ok) {
            Swal.fire({ 
              icon: 'success', 
              title: `Reserva ${nuevoEstado}`, 
              timer: 1500, 
              showConfirmButton: false,
              background: '#F3E7E4',
              color: '#16181D'
            });
            cargarDatos();
          }
        } catch (e) { 
          Swal.fire({ icon: 'error', title: 'Error de conexión', background: '#F3E7E4' }); 
        }
      }
    });
  };

  const handleSelectSlot = (slotInfo) => {
    const inicio = dayjs(slotInfo.start);
    const fin = dayjs(slotInfo.end);

    if (inicio.isBefore(dayjs(), 'minute')) {
      Swal.fire({ icon: 'warning', title: 'Fecha pasada', text: 'No puedes bloquear fechas que ya pasaron.', confirmButtonColor: '#16181D', background: '#F3E7E4' });
      return;
    }

    Swal.fire({
      title: 'Bloquear Horario',
      html: `¿Deseas marcar como <b>No Disponible</b> el:<br/> <br/> <span style="color:#D4AF37; font-weight:bold;">${inicio.format('DD/MM/YYYY')}</span> <br/> De ${inicio.format('HH:mm')} a ${fin.format('HH:mm')}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#16181D',
      cancelButtonColor: '#666',
      confirmButtonText: 'Sí, bloquear',
      cancelButtonText: 'Cancelar',
      background: '#F3E7E4',
      color: '#16181D'
    }).then(async (result) => {
      if (result.isConfirmed) {
        const bloque = {
          title: '❌ Horario no disponible',
          fechaHoraInicio: inicio.format('YYYY-MM-DDTHH:mm:ss'),
          fechaHoraFin: fin.format('YYYY-MM-DDTHH:mm:ss'),
          usuario: { id: localStorage.getItem('idUsuario') } 
        };

        try {
          // AGREGAMOS LA CABECERA A LA PETICION POST (CREAR)
          const response = await fetch(`${API_URL}/api/reservas/crear`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(bloque)
          });
          if (response.ok) {
            Swal.fire({ icon: 'success', title: 'Horario bloqueado', timer: 1500, showConfirmButton: false, background: '#F3E7E4' });
            cargarDatos();
          }
        } catch (e) {
          Swal.fire({ icon: 'error', title: 'Error al bloquear', background: '#F3E7E4' });
        }
      }
    });
  };

  const handleSelectEvent = (event) => {
    if (event.title === '❌ Horario no disponible') {
      Swal.fire({
        title: 'Desbloquear Horario',
        text: '¿Deseas volver a habilitar este horario para que los clientes puedan reservar?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#D4AF37',
        cancelButtonColor: '#666',
        confirmButtonText: '<span style="color:#16181D; font-weight:bold;">Sí, liberar horario</span>',
        cancelButtonText: 'Cancelar',
        background: '#16181D',
        color: '#F3E7E4'
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            // AGREGAMOS LA CABECERA A LA PETICION DELETE (LIBERAR HORARIO)
            const response = await fetch(`${API_URL}/api/reservas/eliminar/${event.id}`, { 
              method: 'DELETE',
              headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            if (response.ok) {
              Swal.fire({ icon: 'success', title: 'Horario liberado', timer: 1500, showConfirmButton: false, background: '#F3E7E4', color: '#16181D' });
              cargarDatos();
            }
          } catch (e) {
            Swal.fire({ icon: 'error', title: 'Error al liberar', background: '#F3E7E4' });
          }
        }
      });
    } else {
      Swal.fire({
        title: 'Detalles de Reserva',
        html: `<b>Cliente:</b> ${event.usuario?.nombre} ${event.usuario?.apellido} <br/> <b>Contacto:</b> ${event.usuario?.telefono || 'No registrado'} <br/> <b>Fecha:</b> ${dayjs(event.start).format('DD/MM/YYYY')} <br/> <b>Horario:</b> ${dayjs(event.start).format('HH:mm')} a ${dayjs(event.end).format('HH:mm')}<br/> <b>Estado:</b> ${event.estado}`,
        icon: 'info',
        confirmButtonColor: '#16181D',
        background: '#F3E7E4',
        color: '#16181D'
      });
    }
  };

  const eventStyleGetter = (event) => {
    let backgroundColor = '#D4AF37'; 
    let color = '#16181D'; 

    if (event.title === '❌ Horario no disponible') {
      backgroundColor = '#4b5563'; 
      color = '#F3E7E4'; 
    } else if (event.estado === 'APROBADO') {
      backgroundColor = '#16181D'; 
      color = '#D4AF37'; 
    }

    return {
      style: {
        backgroundColor,
        color,
        border: 'none',
        borderRadius: '6px',
        fontWeight: 'bold',
        fontSize: '0.85rem',
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
      }
    };
  };

  return (
    <div style={{ backgroundColor: '#F3E7E4', minHeight: '100vh', paddingBottom: '60px' }}>
      
      {/* BANNER DE LA SECCION DEL ADMIN */}
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
            ✦  Panel de Control  ✦
          </p>
          <h1 style={{ color: '#F3E7E4', fontSize: 'clamp(2rem, 5vw, 3.2rem)', fontWeight: 400, marginBottom: '15px', fontFamily: 'Georgia, serif' }}>
            Gestión de Reservas
          </h1>
          <p style={{ color: 'rgba(243, 231, 228, 0.7)', maxWidth: '560px', margin: '0 auto', lineHeight: 1.6, fontSize: '1.05rem', fontFamily: 'sans-serif' }}>
            Selecciona un espacio en el calendario para <b>bloquear horarios</b>, o haz clic en uno bloqueado para <b>liberarlo</b>.
          </p>
        </div>
      </div>

      <div className="container">
        
        {/*  CALENDARIO ADMIN */}
        <div className="card shadow-lg border-0 p-4 bg-white mb-5" style={{ borderRadius: '20px' }}>
          <div className="d-flex justify-content-between align-items-center mb-4 px-2 flex-wrap gap-2">
            <h4 className="fw-bold m-0" style={{ color: '#16181D', fontFamily: "'Georgia', serif" }}>Vista de Ocupación</h4>
            <div className="d-flex gap-3 flex-wrap">
               <small><span style={{ color: '#16181D' }}>●</span> Cliente Aprobado</small>
               <small><span style={{ color: '#D4AF37' }}>●</span> Solicitud Pendiente</small>
               <small><span style={{ color: '#4b5563' }}>●</span> Horario Bloqueado</small>
            </div>
          </div>

          <style>{`
            .rbc-calendar { font-family: 'Segoe UI', sans-serif; }
            .rbc-header { padding: 12px 0; font-weight: bold; color: #16181D; background-color: #f8f9fa; border-bottom: 2px solid #D4AF37; }
            .rbc-toolbar button { color: #16181D; border-radius: 20px; border: 1px solid #ddd; margin: 0 2px; }
            .rbc-toolbar button.rbc-active { background-color: #16181D; color: #D4AF37; border-color: #16181D; }
            .rbc-today { background-color: rgba(212, 175, 55, 0.05); }
            .rbc-event { transition: transform 0.2s; cursor: pointer !important; }
            .rbc-event:hover { transform: scale(1.02); z-index: 10; }
          `}</style>

          <Calendar
            localizer={localizer}
            events={events.filter(e => e.estado !== 'RECHAZADO')}
            selectable={true} 
            onSelectSlot={handleSelectSlot} 
            onSelectEvent={handleSelectEvent} 
            eventPropGetter={eventStyleGetter}
            style={{ height: "65vh" }}
            messages={{
              next: "Sig.", previous: "Ant.", today: "Hoy", month: "Mes", week: "Sem.", day: "Día",
              agenda: "Agenda", date: "Fecha", time: "Hora", event: "Evento",
              noEventsInRange: "No hay reservas en este rango."
            }}
          />
        </div>

        {/* SOLICITUDES PENDIENTES */}
        <div className="card shadow-sm border-0" style={{ borderRadius: '20px', overflow: 'hidden' }}>
          <div className="card-header border-0 pt-4 pb-3 px-4" style={{ backgroundColor: '#16181D' }}>
            <h4 className="fw-bold m-0" style={{ color: '#D4AF37', fontFamily: "'Georgia', serif" }}>
              🔔 Solicitudes por Procesar
            </h4>
          </div>
          <div className="card-body p-0">
            {pendientes.length === 0 ? (
              <div className="text-center py-5 bg-white">
                <h1 style={{ fontSize: '3.5rem' }}>✨</h1>
                <h5 className="text-muted fw-bold">¡Todo al día!</h5>
                <p className="text-muted">No tienes solicitudes pendientes de revisión.</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead style={{ backgroundColor: '#f8f9fa' }}>
                    <tr>
                      <th className="ps-4" style={{ padding: '15px', color: '#16181D' }}>Cliente</th>
                      <th style={{ padding: '15px', color: '#16181D' }}>Fecha y Horario</th>
                      <th className="text-center" style={{ padding: '15px', color: '#16181D' }}>Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white">
                    {pendientes.map(res => (
                      <tr key={res.id}>
                        <td className="ps-4 py-4">
                          <div className="d-flex align-items-center">
                            <div style={{ width: '40px', height: '40px', backgroundColor: '#F3E7E4', color: '#16181D', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', marginRight: '12px' }}>
                              {res.usuario?.nombre?.charAt(0)}
                            </div>
                            <div>
                              <strong style={{ color: '#16181D', fontSize: '1rem' }}>{res.usuario?.nombre} {res.usuario?.apellido}</strong><br/>
                              <small className="text-muted">{res.usuario?.correo}</small>
                            </div>
                          </div>
                        </td>
                        <td className="py-4">
                          <span className="fw-bold" style={{ color: '#16181D' }}>{capitalize(dayjs(res.start).format('dddd, DD/MM/YYYY'))}</span><br/>
                          <span className="text-muted">{dayjs(res.start).format('HH:mm')} - {dayjs(res.end).format('HH:mm')}</span>
                        </td>
                        <td className="text-center py-4 pe-4">
                          <button 
                            className="btn btn-sm px-4 me-2 fw-bold shadow-sm" 
                            style={{ backgroundColor: '#198754', color: 'white', borderRadius: '20px', transition: '0.3s' }}
                            onClick={() => handleCambiarEstado(res.id, 'APROBADO')}
                            onMouseEnter={e => e.currentTarget.style.filter = 'brightness(1.1)'}
                            onMouseLeave={e => e.currentTarget.style.filter = 'none'}
                          >
                            ✓ Aprobar
                          </button>
                          <button 
                            className="btn btn-sm btn-outline-danger px-4 fw-bold shadow-sm" 
                            style={{ borderRadius: '20px', transition: '0.3s' }}
                            onClick={() => handleCambiarEstado(res.id, 'RECHAZADO')}
                          >
                            ✕ Rechazar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}