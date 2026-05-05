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

    // 🔥 1. Inyectamos tu nuevo servicio de correos
    @Autowired
    private EmailService emailService;

    @Transactional(rollbackFor = Exception.class)
    public Reserva crearReserva(Reserva nueva) throws Exception {
        if (nueva == null || nueva.getFechaHoraInicio() == null || nueva.getFechaHoraFin() == null){
            throw new Exception("Error: los datos de la reserva o las fechas están incompletas");
        }

        // 1. VALIDACIÓN ZERO-TRUST: No permitir fechas en el pasado
        if (nueva.getFechaHoraInicio().isBefore(LocalDateTime.now())) {
            throw new Exception("Seguridad del Servidor: No se pueden agendar horas en el pasado.");
        }

        // 2. VALIDACIÓN ZERO-TRUST: Mínimo 3 horas
        long horas = Duration.between(nueva.getFechaHoraInicio(), nueva.getFechaHoraFin()).toHours();
        if (horas < 3){
            throw new Exception("Seguridad del Servidor: La reserva debe tener una duración mínima de 3 horas.");
        }

        // 3. EVITAR CHOQUES DE HORARIO
        List<Reserva> choques = reservaRepository.findOverlappingReservations(
                nueva.getFechaHoraInicio(),
                nueva.getFechaHoraFin()
        );

        if (!choques.isEmpty()){
            throw new Exception("El horario seleccionado ya está ocupado. Alguien más pudo haberlo reservado recién.");
        }

        // 4. VALIDAR USUARIO REAL
        if (nueva.getUsuario() == null || nueva.getUsuario().getId() == null) {
            throw new Exception("Por seguridad, no podemos guardar la reserva: Falta el ID del usuario.");
        }

        Usuario usuarioReal = usuarioRepository.findById(nueva.getUsuario().getId())
                .orElseThrow(() -> new Exception("El usuario especificado no existe en la base de datos."));

        nueva.setUsuario(usuarioReal);
        nueva.setEstado("PENDIENTE");

        // Guardamos la reserva primero
        Reserva reservaGuardada = reservaRepository.save(nueva);

        // 🔥 2. ENVIAR CORREO AL ADMINISTRADOR (TÚ)
        try {
            // Extraemos la fecha y hora para que se vea bien en el correo
            String fechaStr = reservaGuardada.getFechaHoraInicio().toLocalDate().toString();
            String horaStr = reservaGuardada.getFechaHoraInicio().toLocalTime().toString();
            String nombreCompleto = usuarioReal.getNombre() + " " + (usuarioReal.getApellido() != null ? usuarioReal.getApellido() : "");

            // Disparamos el correo
            emailService.enviarAvisoAdmin(nombreCompleto, fechaStr, horaStr);
        } catch (Exception e) {
            System.err.println("AVISO: La reserva se guardó, pero hubo un error enviando el correo al admin: " + e.getMessage());
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

        // Guardamos el nuevo estado en la base de datos
        Reserva reservaActualizada = reservaRepository.save(reserva);

        // 🔥 3. ENVIAR CORREO DE RESPUESTA AL CLIENTE
        try {
            Usuario cliente = reservaActualizada.getUsuario();
            String fechaStr = reservaActualizada.getFechaHoraInicio().toLocalDate().toString();
            String horaStr = reservaActualizada.getFechaHoraInicio().toLocalTime().toString();
            String nombreCompleto = cliente.getNombre();

            boolean esAceptada = nuevoEstado.equals("APROBADO");

            // Disparamos el correo hacia el cliente
            emailService.enviarRespuestaCliente(cliente.getCorreo(), nombreCompleto, fechaStr, horaStr, esAceptada);
        } catch (Exception e) {
            System.err.println("AVISO: El estado se actualizó, pero hubo un error enviando el correo al cliente: " + e.getMessage());
        }

        return reservaActualizada;
    }
}