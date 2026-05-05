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

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const response = await fetch('http://localhost:8081/api/reservas/todos');
      const data = await response.json();
      const adaptados = data.map(res => ({
        ...res,
        start: new Date(res.fechaHoraInicio),
        end: new Date(res.fechaHoraFin)
      }));
      setEvents(adaptados);
      setPendientes(adaptados.filter(e => e.estado === 'PENDIENTE').sort((a,b) => a.start - b.start));
    } catch (e) { console.error(e); }
  };

  const handleCambiarEstado = async (id, nuevoEstado) => {
    try {
      const response = await fetch(`http://localhost:8081/api/reservas/${id}/estado`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevoEstado)
      });
      if (response.ok) {
        Swal.fire({ icon: 'success', title: `Reserva ${nuevoEstado}`, timer: 1500, showConfirmButton: false });
        cargarDatos();
      }
    } catch (e) { Swal.fire({ icon: 'error', title: 'Error' }); }
  };

  // 👇 MAGIA VISUAL: Si es rojo, letra blanca. Si es dorado, letra negra.
  const eventStyleGetter = (event) => {
    let backgroundColor = '#D4AF37'; 
    let color = 'black'; 

    if (event.estado === 'APROBADO') {
      backgroundColor = '#722F37';
      color = 'white'; 
    }

    return {
      style: {
        backgroundColor,
        color,
        border: 'none',
        borderRadius: '5px',
        fontWeight: '500'
      }
    };
  };

  return (
    <div className="container mt-4" style={{ paddingBottom: '50px' }}>
      <h2 className="fw-bold mb-4" style={{ color: '#722F37' }}>👑 Panel Maestro de Reservas</h2>

      {/* 1. CALENDARIO DE VISTA RÁPIDA (Igual de grande que el del cliente) */}
      <div className="card shadow-lg border-0 p-4 bg-white mb-5" style={{ borderRadius: '15px' }}>
        <h5 className="fw-bold mb-3" style={{ color: '#722F37' }}>Vista de Ocupación</h5>
        <Calendar
          localizer={localizer}
          events={events.filter(e => e.estado !== 'RECHAZADO')}
          selectable={false} // El admin usa la tabla de abajo, no el calendario
          eventPropGetter={eventStyleGetter}
          style={{ height: "65vh" }} // 👇 ALTURA AJUSTADA PARA QUE SEA GRANDE
          messages={{
            next: "Sig.",
            previous: "Ant.",
            today: "Hoy",
            month: "Mes",
            week: "Sem.",
            day: "Día",
            agenda: "Agenda",
            date: "Fecha",       // 👇 TRADUCCIÓN DE TU IMAGEN
            time: "Hora",        // 👇 TRADUCCIÓN DE TU IMAGEN
            event: "Evento",     // 👇 TRADUCCIÓN DE TU IMAGEN
            noEventsInRange: "No hay reservas en este rango de fechas."
          }}
        />
      </div>

      {/* 2. TABLA DE ACCIONES PENDIENTES */}
      <div className="card shadow-sm border-0" style={{ borderRadius: '15px' }}>
        <div className="card-header bg-white pt-4 border-0">
          <h4 className="fw-bold" style={{ color: '#722F37' }}>🔔 Solicitudes por Procesar</h4>
        </div>
        <div className="card-body">
          {pendientes.length === 0 ? (
            <div className="text-center p-4">
              <h1 style={{ fontSize: '3rem' }}>🎉</h1>
              <p className="text-muted fw-bold mt-2">No hay solicitudes pendientes.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Cliente</th>
                    <th>Fecha y Hora</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {pendientes.map(res => (
                    <tr key={res.id}>
                      <td>
                        <strong>{res.usuario?.nombre} {res.usuario?.apellido}</strong><br/>
                        <small className="text-muted">{res.usuario?.correo}</small>
                      </td>
                      <td>
                        <span className="fw-bold">{capitalize(dayjs(res.start).format('dddd, DD/MM/YYYY'))}</span><br/>
                        {dayjs(res.start).format('HH:mm')} - {dayjs(res.end).format('HH:mm')}
                      </td>
                      <td>
                        <button className="btn btn-sm btn-success me-2 fw-bold shadow-sm" onClick={() => handleCambiarEstado(res.id, 'APROBADO')}>Aprobar</button>
                        <button className="btn btn-sm btn-danger fw-bold shadow-sm" onClick={() => handleCambiarEstado(res.id, 'RECHAZADO')}>Rechazar</button>
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
  );
}