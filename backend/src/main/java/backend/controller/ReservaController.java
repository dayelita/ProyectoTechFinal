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
    @GetMapping("/pendientes")
    public ResponseEntity<List<Reserva>> listarPendientes(){
        List<Reserva> pendientes = reservaService.obtenerTodas().stream()
                .filter(reserva -> "PENDIENTE".equals(reserva.getEstado()))
                .toList();
        return ResponseEntity.ok(pendientes);
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
