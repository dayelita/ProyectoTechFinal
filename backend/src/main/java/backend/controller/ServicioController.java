package backend.controller;

import backend.model.Servicio;
import backend.service.ServicioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/servicios")
@CrossOrigin(origins = "*")
public class ServicioController {

    // 🔥 Ahora inyectamos el Servicio, no el Repositorio
    @Autowired
    private ServicioService servicioService;

    @GetMapping("/todos")
    public ResponseEntity<List<Servicio>> obtenerTodos() {
        return ResponseEntity.ok(servicioService.obtenerTodos());
    }

    @PostMapping("/crear")
    public ResponseEntity<Servicio> crearServicio(@RequestBody Servicio servicio) {
        Servicio nuevoServicio = servicioService.crearServicio(servicio);
        return ResponseEntity.ok(nuevoServicio);
    }

    @PutMapping("/editar/{id}")
    public ResponseEntity<Servicio> editarServicio(@PathVariable Long id, @RequestBody Servicio servicioActualizado) {
        Optional<Servicio> servicioEditado = servicioService.editarServicio(id, servicioActualizado);

        return servicioEditado
                .map(ResponseEntity::ok) // Si está presente, devuelve 200 OK con el objeto
                .orElseGet(() -> ResponseEntity.notFound().build()); // Si está vacío, devuelve 404
    }

    @DeleteMapping("/eliminar/{id}")
    public ResponseEntity<Void> eliminarServicio(@PathVariable Long id) {
        boolean eliminado = servicioService.eliminarServicio(id);

        if (eliminado) {
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}