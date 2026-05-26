package backend.controller;

import backend.model.Testimonio;
import backend.service.TestimonioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/testimonios")
@CrossOrigin(origins = "*")
public class TestimonioController {

    @Autowired
    private TestimonioService testimonioService;

    // ENDPOINT PÚBLICO (Para la vista de clientes)
    @GetMapping("/todos")
    public ResponseEntity<List<Testimonio>> obtenerTestimoniosPublicos(){
        return ResponseEntity.ok(testimonioService.obtenerTestimoniosAprobados());
    }

    //  ENDPOINT ADMIN: Trae toda la base de datos sin filtrar
    @GetMapping("/admin/todos")
    public ResponseEntity<List<Testimonio>> obtenerTodosAdmin(){
        return ResponseEntity.ok(testimonioService.obtenerTodosParaAdmin());
    }

    @PostMapping("/crear")
    public ResponseEntity<Testimonio> crearTestimonio(@RequestBody Testimonio testimonio){
        return ResponseEntity.ok(testimonioService.guardarNuevo(testimonio));
    }

    @GetMapping("/pendientes")
    public ResponseEntity<List<Testimonio>> obtenerPendientes(){
        return ResponseEntity.ok(testimonioService.obtenerTestimoniosPendientes());
    }

    // ENDPOINT ADMIN: Editar texto
    @PutMapping("/editar/{id}")
    public ResponseEntity<Testimonio> editar(@PathVariable Long id, @RequestBody Testimonio detalles){
        try {
            return ResponseEntity.ok(testimonioService.editarTestimonio(id, detalles));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    //  ENDPOINT ADMIN: Eliminar reseña
    @DeleteMapping("/eliminar/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Long id) {
        try {
            testimonioService.eliminarTestimonio(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/moderar/{id}")
    public ResponseEntity<String> moderar(@PathVariable Long id,@RequestBody Map<String, Object> payload){
        try{
            boolean aprobado = (boolean) payload.get("aprobado");
            String motivo = payload.containsKey("motivo") ? (String) payload.get("motivo") : "Sin motivo";

            testimonioService.moderarTestimonio(id, aprobado, motivo);
            String mensaje = aprobado ? "Testimonio aprobado" : "Testimonio rechazado";
            return ResponseEntity.ok(mensaje);
        }catch (Exception e){
            return ResponseEntity.badRequest().body("Error: "+ e.getMessage());
        }
    }
}