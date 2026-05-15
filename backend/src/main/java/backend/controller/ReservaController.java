package backend.controller;

import backend.model.Reserva;
import backend.service.ReservaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reservas")
@CrossOrigin(origins = "*")
public class ReservaController {
    @Autowired
    private ReservaService reservaService;

    @PostMapping("/crear")
    public ResponseEntity<?> crear(@RequestBody Reserva reserva){
        try{
            Reserva nueva = reservaService.crearReserva(reserva);
            return ResponseEntity.ok(nueva);
        } catch (Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/todos")
    public ResponseEntity<List<Reserva>> obtenerTodas(){
        return ResponseEntity.ok(reservaService.obtenerTodas());
    }

    // 🔥 NUEVO ENDPOINT PARA ELIMINAR
    @DeleteMapping("/eliminar/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Long id) {
        if (reservaService.eliminarReserva(id)) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    @PatchMapping("/{id}/estado")
    public ResponseEntity<?> actualizarEstado(@PathVariable Long id, @RequestBody String nuevoEstado){
        try{
            String estadoLimpio = nuevoEstado.replace("\"","");
            return ResponseEntity.ok(reservaService.cambiarEstado(id,estadoLimpio));
        }catch (Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}