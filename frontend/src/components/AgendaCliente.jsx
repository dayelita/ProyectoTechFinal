import React, { useState, useEffect } from 'react';
import { Calendar, dayjsLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import dayjs from 'dayjs';
import "dayjs/locale/es";
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom'; // 🔥 1. Importamos useNavigate para la redirección

dayjs.locale("es");
const localizer = dayjsLocalizer(dayjs);
const capitalize = (str) => str ? str.charAt(0).toUpperCase() + str.slice(1) : '';

export default function AgendaCliente() {
  const [usuarioLogueado, setUsuarioLogueado] = useState({ id: null, nombre: '', apellido: '' });
  const [events, setEvents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate(); // 🔥 2. Activamos el navegador interno de React

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
      const response = await fetch('http://localhost:8081/api/reservas/todos');
      const data = await response.json();
      const adaptados = data.map(res => ({
        ...res,
        start: new Date(res.fechaHoraInicio),
        end: new Date(res.fechaHoraFin)
      }));
      setEvents(adaptados);
    } catch (error) { console.error("Error:", error); }
  };

  const handleSelectSlot = (slotInfo) => {
    // 🛑 3. EL GUARDIA DE SEGURIDAD VISUAL 🛑
    if (!usuarioLogueado || !usuarioLogueado.id) {
      Swal.fire({
        title: '¡Únete a la familia JMS!',
        text: 'Para agendar una hora en la Casona, necesitas iniciar sesión o crear una cuenta gratuita.',
        icon: 'info',
        showCancelButton: true,
        confirmButtonColor: '#722F37',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Ir a Iniciar Sesión',
        cancelButtonText: 'Seguir mirando'
      }).then((result) => {
        if (result.isConfirmed) {
          navigate('/login'); // Redirige suavemente sin recargar la página
        }
      });
      return; // Detenemos la función para que no abra el modal
    }

    // ✅ Si el usuario SI está logueado, sigue el flujo normal:
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
        const txt = await response.text();
        Swal.fire({ icon: 'error', title: 'Error', text: txt });
      }
    } catch (e) { Swal.fire({ icon: 'error', title: 'Error de red' }); }
    finally { setIsLoading(false); }
  };

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
    <div className="container mt-4" style={{ minHeight: '80vh', paddingBottom: '40px' }}>
      
      <h2 className="fw-bold mb-4" style={{ color: '#722F37' }}>📅 Consulta tu fecha </h2>
      
      <div className="card shadow-lg border-0 p-4 bg-white mb-5" style={{ borderRadius: '15px' }}>
        <Calendar
          localizer={localizer}
          events={eventosCalendarioPrivado} 
          selectable
          onSelectSlot={handleSelectSlot}
          eventPropGetter={(event) => ({
            style: { 
              backgroundColor: event.usuario?.id?.toString() === usuarioLogueado.id?.toString() ? '#722F37' : '#cccccc', 
              color: event.usuario?.id?.toString() === usuarioLogueado.id?.toString() ? 'white' : '#666666',
              border: 'none',
              fontWeight: '500'
            }
          })}
          min={minTime} max={maxTime}
          style={{ height: "65vh" }}
          messages={{ next: "Sig.", previous: "Ant.", today: "Hoy", month: "Mes", week: "Sem.", day: "Día" }}
        />
      </div>

      <div className="card shadow-sm border-0" style={{ borderRadius: '15px' }}>
        <div className="card-header bg-white border-0 pt-4">
          <h4 className="fw-bold" style={{ color: '#722F37' }}>📜 Mis Solicitudes de Reserva</h4>
        </div>
        <div className="card-body">
          {misReservasOrdenadas.length === 0 ? (
            <p className="text-center text-muted p-3">Aún no tienes reservas registradas en el sistema.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Fecha</th>
                    <th>Horario</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {misReservasOrdenadas.map((res) => (
                    <tr key={res.id}>
                      <td className="fw-bold">{capitalize(dayjs(res.start).format('dddd, DD/MM/YYYY'))}</td>
                      <td>{dayjs(res.start).format('HH:mm')} - {dayjs(res.end).format('HH:mm')}</td>
                      <td>
                        <span className={`badge ${res.estado === 'PENDIENTE' ? 'bg-warning text-dark' : (res.estado === 'APROBADO' ? 'bg-success' : 'bg-danger')}`}>
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

      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1050 }}>
          <div className="card p-4 shadow-lg" style={{ width: '400px', borderRadius: '15px' }}>
            <h4 className="fw-bold mb-3 text-center" style={{ color: '#722F37' }}>Confirmar Reserva</h4>
            <div className="alert text-center" style={{ backgroundColor: '#F4E1E6', color: '#722F37' }}>
                <strong>{dayjs(selectedSlot.start).format('DD/MM/YYYY')}</strong><br/>
                De {dayjs(selectedSlot.start).format('HH:mm')} a {dayjs(selectedSlot.end).format('HH:mm')}
            </div>
            <button className="btn text-white fw-bold w-100 mb-2" style={{ backgroundColor: '#722F37' }} onClick={handleSolicitarHora} disabled={isLoading}>
              {isLoading ? 'Enviando...' : 'Enviar Solicitud'}
            </button>
            <button className="btn btn-light w-100" onClick={() => setIsModalOpen(false)}>Cancelar</button>
          </div>
        </div>
      )}
    </div>
  );
}