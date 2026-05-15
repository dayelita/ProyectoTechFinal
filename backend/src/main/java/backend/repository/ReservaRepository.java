package backend.repository;

import backend.model.Reserva;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository

public interface ReservaRepository extends JpaRepository<Reserva, Long>{

    @Query("SELECT r FROM Reserva r WHERE r.fechaHoraInicio < :fin AND r.fechaHoraFin > :inicio AND r.estado != 'RECHAZADO'")

    List<Reserva> findOverlappingReservations(@Param("inicio") LocalDateTime inicio, @Param("fin") LocalDateTime fin);

    List<Reserva> findByUsuarioCorreo(String correo);
} //valida horas ocupadas
