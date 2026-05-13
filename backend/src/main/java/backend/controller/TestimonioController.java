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

    // 1. ENDPOINT PÚBLICO: Trae solo los aprobados para el carrusel
    @GetMapping("/todos")
    public ResponseEntity<List<Testimonio>> obtenerTestimoniosPublicos(){
        return ResponseEntity.ok(testimonioService.obtenerTestimoniosAprobados());

    }
    // 2. ENDPOINT CLIENTE: Para que el usuario envíe su reseña (nace PENDIENTE)
    @PostMapping("/crear")
    public ResponseEntity<Testimonio> crearTestimonio(@RequestBody Testimonio testimonio){
        return ResponseEntity.ok(testimonioService.guardarNuevo(testimonio));

    }
    // 3. ENDPOINT ADMIN: Para ver la lista de lo que falta por moderar
    @GetMapping("/pendientes")
    public ResponseEntity<List<Testimonio>> obtenerPendientes(){
        return ResponseEntity.ok(testimonioService.obtenerTestimoniosPendientes());
    }
    // 4. ENDPOINT ADMIN: Para Aprobar o Rechazar y disparar el correo
    @PutMapping("/moderar/{id}")
    public ResponseEntity<String> moderar(@PathVariable Long id,@RequestBody Map<String, Object> payload){
        try{
            // El front debe enviar un JSON como: { "aprobado": true, "motivo": "..." }
            boolean aprobado = (boolean) payload.get("aprobado");
            String motivo = (String) payload.get("motivo");

            testimonioService.moderarTestimonio(id, aprobado,motivo);

            String mensaje = aprobado ? "Testimonio aprobado":"Testimonio rechazado y correo enviado";
            return ResponseEntity.ok(mensaje);
        }catch (Exception e){
            return ResponseEntity.badRequest().body("Error al procesar la moderacion: "+ e.getMessage());

        }
    }
}
