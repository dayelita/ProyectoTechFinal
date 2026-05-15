package backend.repository;

import backend.model.Galeria;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GaleriaRepository extends JpaRepository<Galeria, Long> {

    /** Las imágenes más recientes aparecen primero */
    List<Galeria> findAllByOrderByCreadoEnDesc();
}
