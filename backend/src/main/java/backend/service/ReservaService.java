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

        if (nueva.getFechaHoraInicio().isBefore(LocalDateTime.now())) {
            throw new Exception("Seguridad del Servidor: No se pueden agendar horas en el pasado.");
        }

        long horas = Duration.between(nueva.getFechaHoraInicio(), nueva.getFechaHoraFin()).toHours();
        if (horas < 3){
            throw new Exception("Seguridad del Servidor: La reserva debe tener una duración mínima de 3 horas.");
        }

        List<Reserva> choques = reservaRepository.findOverlappingReservations(
                nueva.getFechaHoraInicio(),
                nueva.getFechaHoraFin()
        );

        if (!choques.isEmpty()){
            throw new Exception("El horario seleccionado ya está ocupado. Alguien más pudo haberlo reservado recién.");
        }

        if (nueva.getUsuario() == null || nueva.getUsuario().getId() == null) {
            throw new Exception("Por seguridad, no podemos guardar la reserva: Falta el ID del usuario.");
        }

        Usuario usuarioReal = usuarioRepository.findById(nueva.getUsuario().getId())
                .orElseThrow(() -> new Exception("El usuario especificado no existe en la base de datos."));

        nueva.setUsuario(usuarioReal);
        nueva.setEstado("PENDIENTE");

        Reserva reservaGuardada = reservaRepository.save(nueva);

        // Disparar correo al Admin
        try {
            String fechaStr = reservaGuardada.getFechaHoraInicio().toLocalDate().toString();
            String horaStr = reservaGuardada.getFechaHoraInicio().toLocalTime().toString();
            String nombreCompleto = usuarioReal.getNombre() + " " + (usuarioReal.getApellido() != null ? usuarioReal.getApellido() : "");

            emailService.enviarAvisoAdmin(nombreCompleto, fechaStr, horaStr);
        } catch (Exception e) {
            System.err.println("La reserva se guardó, pero falló el correo al admin: " + e.getMessage());
        }

        return reservaGuardada;
    }

    public List<Reserva> obtenerTodas(){
        return reservaRepository.findAll();
    }

    @Transactional(rollbackFor = Exception.class)
    public Reserva cambiarEstado(Long id, String nuevoEstado) throws Exception{
        Reserva reserva = reservaRepository.findById(id)
                .orElseThrow(() -> new Exception("Reserva no encontrada"));

        if (!nuevoEstado.equals("APROBADO") && !nuevoEstado.equals("RECHAZADO")){
            throw new Exception("Estado no válido");
        }

        reserva.setEstado(nuevoEstado);
        Reserva reservaActualizada = reservaRepository.save(reserva);

        // Disparar correo al Cliente
        try {
            Usuario cliente = reservaActualizada.getUsuario();
            String fechaStr = reservaActualizada.getFechaHoraInicio().toLocalDate().toString();
            String horaStr = reservaActualizada.getFechaHoraInicio().toLocalTime().toString();
            String nombreCompleto = cliente.getNombre();

            boolean esAceptada = nuevoEstado.equals("APROBADO");

            emailService.enviarRespuestaCliente(cliente.getCorreo(), nombreCompleto, fechaStr, horaStr, esAceptada);
        } catch (Exception e) {
            System.err.println("El estado se actualizó, pero falló el correo al cliente: " + e.getMessage());
        }

        return reservaActualizada;
    }
}