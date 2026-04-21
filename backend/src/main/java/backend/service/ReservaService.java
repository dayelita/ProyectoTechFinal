package backend.service;

import backend.model.Reserva;
import backend.model.Usuario;
import backend.repository.ReservaRepository;
import backend.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional; // <-- Importante

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class ReservaService {

    @Autowired
    private ReservaRepository reservaRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    // 👇 @Transactional asegura que si algo falla a la mitad, la base de datos se echa para atrás y no guarda basura
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

        return reservaRepository.save(nueva);
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
        return reservaRepository.save(reserva);
    }
}
