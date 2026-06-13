package backend.service;

import backend.model.Servicio;
import backend.repository.ServicioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ServicioService {

    @Autowired
    private ServicioRepository servicioRepository;

    // Obtiene todos
    public List<Servicio> obtenerTodos() {
        return servicioRepository.findAll();
    }

    //  Crea nuevo servicio
    public Servicio crearServicio(Servicio servicio) {
        // Aquí en el futuro podrías agregar validaciones (ej. que el precio no sea negativo)
        return servicioRepository.save(servicio);
    }

    //  Edita existentes
    public Optional<Servicio> editarServicio(Long id, Servicio servicioActualizado) {
        Optional<Servicio> servicioExistente = servicioRepository.findById(id);

        if (servicioExistente.isPresent()) {
            Servicio servicio = servicioExistente.get();
            servicio.setNombre(servicioActualizado.getNombre());
            servicio.setCategoria(servicioActualizado.getCategoria());
            servicio.setDescripcion(servicioActualizado.getDescripcion());
            servicio.setCapacidad(servicioActualizado.getCapacidad());
            servicio.setPrecio(servicioActualizado.getPrecio());
            servicio.setImagen(servicioActualizado.getImagen());
            servicio.setBadge(servicioActualizado.getBadge());
            servicio.setBadgeColor(servicioActualizado.getBadgeColor());
            servicio.setDetalles(servicioActualizado.getDetalles());

            return Optional.of(servicioRepository.save(servicio));
        }
        return Optional.empty(); // Retorna vacío si no encontró el ID
    }

    //  Elimina
    public boolean eliminarServicio(Long id) {
        if (servicioRepository.existsById(id)) {
            servicioRepository.deleteById(id);
            return true;
        }
        return false;
    }
}