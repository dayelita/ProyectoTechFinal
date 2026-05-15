package backend.repository;

import backend.model.Servicio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ServicioRepository extends JpaRepository<Servicio, Long> {
    // Spring Data JPA ya incluye métodos como findAll(), save(), deleteById() automáticamente.
}