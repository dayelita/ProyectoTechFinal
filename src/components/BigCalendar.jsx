import React, { useState, useEffect } from 'react';
import { Calendar, dayjsLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import dayjs from 'dayjs';
import "dayjs/locale/es";
import Swal from 'sweetalert2';

dayjs.locale("es");
const localizer = dayjsLocalizer(dayjs);

const capitalize = (str) => str ? str.charAt(0).toUpperCase() + str.slice(1) : '';

export default function BigCalendar() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [usuarioLogueado, setUsuarioLogueado] = useState({ id: null, nombre: '', apellido: '' });
  
  const [events, setEvents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [eventoSeleccionado, setEventoSeleccionado] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const minTime = dayjs().set('hour', 9).set('minute', 0).toDate();
  const maxTime = dayjs().set('hour', 23).set('minute', 0).toDate();

  useEffect(() => {
    const rol = localStorage.getItem('rolUsuario');
    const id = localStorage.getItem('idUsuario');
    const nombre = localStorage.getItem('nombreUsuario');
    const apellido = localStorage.getItem('apellidoUsuario');

    setIsAdmin(rol === 'ADMIN');
    setUsuarioLogueado({ id, nombre, apellido });

    cargarReservas();
  }, []);

  const cargarReservas = async () => {
    try {
      const response = await fetch('http://localhost:8081/api/reservas/todos');
      const data = await response.json();
      
      const eventosAdaptados = data.map(res => ({
        ...res,
        start: new Date(res.fechaHoraInicio),
        end: new Date(res.fechaHoraFin)
      }));
      setEvents(eventosAdaptados);
    } catch (error) {
      console.error("Error cargando reservas:", error);
    }
  };

  const handleSelectSlot = (slotInfo) => {
    if (isAdmin) {
      Swal.fire({ title: 'Modo Admin', text: 'Los administradores no agendan citas, solo gestionan.', icon: 'info' });
      return;
    }

    const ahora = dayjs();
    const inicio = dayjs(slotInfo.start);
    const fin = dayjs(slotInfo.end);

    if (inicio.isBefore(ahora, 'day')) {
      Swal.fire({ icon: 'error', title: 'Fecha pasada', text: 'No puedes agendar en el pasado.', confirmButtonColor: '#722F37' });
      return;
    }

    if (fin.diff(inicio, 'hour', true) < 3) {
      Swal.fire({ icon: 'warning', title: 'Duración mínima', text: 'El arriendo debe ser de al menos 3 horas.', confirmButtonColor: '#722F37' });
      return;
    }

    setSelectedSlot(slotInfo);
    setEventoSeleccionado(null);
    setIsModalOpen(true);
  };

  const handleSolicitarHora = async () => {
    setIsLoading(true);
    
    const nuevaReserva = {
      title: `Reserva de ${usuarioLogueado.nombre} ${usuarioLogueado.apellido}`,
      fechaHoraInicio: dayjs(selectedSlot.start).format('YYYY-MM-DDTHH:mm:ss'),
      fechaHoraFin: dayjs(selectedSlot.end).format('YYYY-MM-DDTHH:mm:ss'),
      usuario: { id: usuarioLogueado.id } 
    };

    try {
      const response = await fetch('http://localhost:8081/api/reservas/crear', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevaReserva)
      });

      if (response.ok) {
        Swal.fire({ icon: 'success', title: 'Solicitud Enviada', text: 'En revisión por el administrador.', confirmButtonColor: '#722F37' });
        cargarReservas();
        setIsModalOpen(false);
      } else {
        const errorText = await response.text();
        Swal.fire({ icon: 'error', title: 'No se pudo agendar', text: errorText, confirmButtonColor: '#722F37' });
      }
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Error de red', text: 'No se pudo conectar con el servidor.' });
    } finally {
      setIsLoading(false);
    }
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
        cargarReservas();
        setIsModalOpen(false);
      }
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Error al actualizar' });
    }
  };

  const reservasParaMostrar = isAdmin 
    ? events.filter(e => e.estado === 'PENDIENTE')
    : events.filter(e => e.usuario && e.usuario.id.toString() === usuarioLogueado.id.toString());

  // 👇 AQUÍ ESTÁ LA MAGIA DEL ORDENAMIENTO POR FECHAS 👇
  const reservasOrdenadas = [...reservasParaMostrar].sort((a, b) => new Date(a.start) - new Date(b.start));

  const eventStyleGetter = (event) => {
    let backgroundColor = event.estado === 'APROBADO' ? '#722F37' : '#D4AF37';
    if (event.estado === 'RECHAZADO') backgroundColor = '#dc3545';
    
    if (!isAdmin && event.usuario && event.usuario.id.toString() !== usuarioLogueado.id.toString()) {
        backgroundColor = '#cccccc';
    }

    return { style: { backgroundColor, borderRadius: '5px', color: 'white', border: 'none', display: 'block' } };
  };

  const formatos = {
    monthHeaderFormat: (d, c, l) => capitalize(l.format(d, 'MMMM YYYY', c)),
    dayFormat: (d, c, l) => capitalize(l.format(d, 'dddd DD', c)),
    dayHeaderFormat: (d, c, l) => capitalize(l.format(d, 'dddd, DD [de] MMMM', c))
  };

  return (
    <div style={{ minHeight: '80vh', padding: '20px', backgroundColor: '#fdfbf7' }}>
      <div className="container">
        
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="text-uppercase m-0" style={{ color: '#722F37', fontWeight: 'bold' }}>Agenda de Eventos</h2>
          <span className={`badge ${isAdmin ? 'bg-dark' : 'bg-secondary'} p-2 fs-6 shadow-sm`}>
            {isAdmin ? '👑 Panel Administrador' : `👤 Cliente: ${usuarioLogueado.nombre}`}
          </span>
        </div>

        <div className="card shadow-lg border-0 mb-5" style={{ borderRadius: '15px' }}>
          <div className="card-body p-4 bg-white">
            <Calendar
              localizer={localizer}
              events={events.filter(e => e.estado !== 'RECHAZADO')}
              selectable={!isAdmin}
              onSelectSlot={handleSelectSlot}
              onSelectEvent={(e) => { setEventoSeleccionado(e); setIsModalOpen(true); }}
              eventPropGetter={eventStyleGetter}
              min={minTime} max={maxTime}
              formats={formatos}
              style={{ height: "60vh" }}
              messages={{ next: "Siguiente", previous: "Atrás", today: "Hoy", month: "Mes", week: "Semana", day: "Día" }}
            />
          </div>
        </div>

        <div className="card shadow-sm border-0" style={{ borderRadius: '15px' }}>
          <div className="card-header bg-white border-0 pt-4">
            <h4 className="fw-bold" style={{ color: '#722F37' }}>
              {isAdmin ? '🔔 Solicitudes Pendientes' : '📅 Mis Reservas'}
            </h4>
          </div>
          <div className="card-body">
            {reservasOrdenadas.length === 0 ? (
              <p className="text-center text-muted">No hay registros recientes.</p>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead className="table-light">
                    <tr>
                      {isAdmin && <th>Cliente</th>}
                      <th>Fecha</th>
                      <th>Horario</th>
                      <th>Estado</th>
                      {isAdmin && <th>Acciones</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {/* 👇 AQUÍ USAMOS reservasOrdenadas PARA DIBUJAR LA TABLA 👇 */}
                    {reservasOrdenadas.map((res) => (
                      <tr key={res.id}>
                        {isAdmin && (
                          <td>
                            <strong>{res.usuario?.nombre} {res.usuario?.apellido}</strong><br/>
                            <small className="text-muted">{res.usuario?.correo}</small>
                          </td>
                        )}
                        <td className="fw-bold">{capitalize(dayjs(res.start).format('dddd, DD/MM/YYYY'))}</td>
                        <td>{dayjs(res.start).format('HH:mm')} - {dayjs(res.end).format('HH:mm')}</td>
                        <td>
                          <span className={`badge ${res.estado === 'PENDIENTE' ? 'bg-warning text-dark' : (res.estado === 'APROBADO' ? 'bg-success' : 'bg-danger')}`}>
                            {res.estado === 'APROBADO' ? '✅ APROBADO' : res.estado === 'RECHAZADO' ? '❌ RECHAZADO' : '⏳ PENDIENTE'}
                          </span>
                        </td>
                        {isAdmin && (
                          <td>
                            <button className="btn btn-sm btn-success me-2 fw-bold" onClick={() => handleCambiarEstado(res.id, 'APROBADO')}>Aprobar</button>
                            <button className="btn btn-sm btn-danger fw-bold" onClick={() => handleCambiarEstado(res.id, 'RECHAZADO')}>Rechazar</button>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

      </div>

      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1050 }}>
          <div className="card p-4 shadow-lg" style={{ width: '450px', borderRadius: '15px' }}>
            
            {!eventoSeleccionado && (
              <>
                <h4 className="fw-bold mb-3 text-center" style={{ color: '#722F37' }}>Solicitar Reserva</h4>
                <div className="alert text-center" style={{ backgroundColor: '#F4E1E6', color: '#722F37' }}>
                   <strong>{dayjs(selectedSlot.start).format('DD/MM/YYYY')}</strong><br/>
                   De {dayjs(selectedSlot.start).format('HH:mm')} a {dayjs(selectedSlot.end).format('HH:mm')}
                </div>
                <button className="btn text-white fw-bold w-100 mb-2" style={{ backgroundColor: '#722F37' }} disabled={isLoading} onClick={handleSolicitarHora}>
                  {isLoading ? 'Enviando...' : 'Confirmar Solicitud'}
                </button>
                <button className="btn btn-light w-100" onClick={() => setIsModalOpen(false)}>Cancelar</button>
              </>
            )}

            {eventoSeleccionado && (
              <>
                <h4 className="fw-bold mb-3 text-center" style={{ color: '#722F37' }}>Detalle de Reserva</h4>
                <div className={`alert mb-3 text-center ${eventoSeleccionado.estado === 'PENDIENTE' ? 'alert-warning' : (eventoSeleccionado.estado === 'APROBADO' ? 'alert-success' : 'alert-danger')}`}>
                  <strong>Estado: {eventoSeleccionado.estado}</strong>
                </div>
                
                {isAdmin && eventoSeleccionado.estado === 'PENDIENTE' ? (
                   <div className="d-flex gap-2">
                     <button className="btn btn-secondary w-100" onClick={() => setIsModalOpen(false)}>Cerrar</button>
                     <button className="btn btn-danger w-100 fw-bold" onClick={() => handleCambiarEstado(eventoSeleccionado.id, 'RECHAZADO')}>Rechazar</button>
                     <button className="btn btn-success w-100 fw-bold" onClick={() => handleCambiarEstado(eventoSeleccionado.id, 'APROBADO')}>Aprobar</button>
                   </div>
                ) : (
                  <button className="btn btn-secondary w-100" onClick={() => setIsModalOpen(false)}>Cerrar</button>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}