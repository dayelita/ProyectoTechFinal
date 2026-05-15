package backend.service;

import backend.model.Reserva;
import backend.model.Usuario;
import backend.repository.ReservaRepository;
import backend.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class ReservaService {

    @Autowired
    private ReservaRepository reservaRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private EmailService emailService;

    @Transactional(rollbackFor = Exception.class)
    public Reserva crearReserva(Reserva nueva) throws Exception {
        if (nueva == null || nueva.getFechaHoraInicio() == null || nueva.getFechaHoraFin() == null){
            throw new Exception("Error: los datos de la reserva o las fechas están incompletas");
        }

        // VALIDACIÓN: No permitir fechas en el pasado
        if (nueva.getFechaHoraInicio().isBefore(LocalDateTime.now())) {
            throw new Exception("Seguridad del Servidor: No se pueden agendar horas en el pasado.");
        }

        // EVITAR CHOQUES DE HORARIO
        List<Reserva> choques = reservaRepository.findOverlappingReservations(
                nueva.getFechaHoraInicio(),
                nueva.getFechaHoraFin()
        );

        if (!choques.isEmpty()){
            throw new Exception("El horario seleccionado ya está ocupado.");
        }

        if (nueva.getUsuario() == null || nueva.getUsuario().getId() == null) {
            throw new Exception("Por seguridad, falta el ID del usuario.");
        }

        Usuario usuarioReal = usuarioRepository.findById(nueva.getUsuario().getId())
                .orElseThrow(() -> new Exception("El usuario especificado no existe."));

        nueva.setUsuario(usuarioReal);

        // Si el título es el de bloqueo, lo guardamos aprobado directamente
        if ("❌ Horario no disponible".equals(nueva.getTitle())) {
            nueva.setEstado("APROBADO");
        } else {
            nueva.setEstado("PENDIENTE");
        }

        Reserva reservaGuardada = reservaRepository.save(nueva);

        // Aviso al Admin solo si es reserva de cliente (no bloqueo manual)
        if (!"❌ Horario no disponible".equals(nueva.getTitle())) {
            try {
                String fechaStr = reservaGuardada.getFechaHoraInicio().toLocalDate().toString();
                String horaStr = reservaGuardada.getFechaHoraInicio().toLocalTime().toString();
                String nombreCompleto = usuarioReal.getNombre() + " " + (usuarioReal.getApellido() != null ? usuarioReal.getApellido() : "");
                emailService.enviarAvisoAdmin(nombreCompleto, fechaStr, horaStr);
            } catch (Exception e) {
                System.err.println("Error enviando correo al admin: " + e.getMessage());
            }
        }

        return reservaGuardada;
    }

    public List<Reserva> obtenerTodas(){
        return reservaRepository.findAll();
    }

    // 🔥 NUEVO MeTODO PARA ELIMINAR BLOQUEOS/RESERVAS
    @Transactional(rollbackFor = Exception.class)
    public boolean eliminarReserva(Long id) {
        if (reservaRepository.existsById(id)) {
            reservaRepository.deleteById(id);
            return true;
        }
        return false;
    }

    @Transactional(rollbackFor = Exception.class)
    public Reserva cambiarEstado(Long id, String nuevoEstado) throws Exception{
        Reserva reserva = reservaRepository.findById(id)
                .orElseThrow(() -> new Exception("Reserva no encontrada"));

        reserva.setEstado(nuevoEstado);
        Reserva reservaActualizada = reservaRepository.save(reserva);

        try {
            Usuario cliente = reservaActualizada.getUsuario();
            String fechaStr = reservaActualizada.getFechaHoraInicio().toLocalDate().toString();
            String horaStr = reservaActualizada.getFechaHoraInicio().toLocalTime().toString();
            boolean esAceptada = nuevoEstado.equals("APROBADO");
            emailService.enviarRespuestaCliente(cliente.getCorreo(), cliente.getNombre(), fechaStr, horaStr, esAceptada);
        } catch (Exception e) {
            System.err.println("Error enviando correo al cliente: " + e.getMessage());
        }

        return reservaActualizada;
    }
}