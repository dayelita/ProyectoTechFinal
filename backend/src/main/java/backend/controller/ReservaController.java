package backend.controller;

import backend.model.Reserva;
import backend.service.ReservaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
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
    @GetMapping("/ocupados")
    public ResponseEntity<?> obtenerFechasOcupadas() {
        // Busca todas las reservas reales de la base de datos
        List<Reserva> todas = reservaService.obtenerTodas();

        // Las transforma en una lista de mapas "anónimos" sobre la marcha
        List<java.util.Map<String, Object>> reservasAnonimas = todas.stream().map(reserva -> {
            java.util.Map<String, Object> mapa = new java.util.HashMap<>();

            // Estructuramos solo los datos que el calendario de React necesita ver
            mapa.put("id", reserva.getId());
            mapa.put("start", reserva.getFechaHoraInicio());
            mapa.put("title", "Ocupado");          // Máscara para proteger la identidad del cliente

            return mapa;
        }).collect(java.util.stream.Collectors.toList());

        //  Enviamos la lista limpia. Spring la transforma en JSON automáticamente
        return ResponseEntity.ok(reservasAnonimas);
    }
    //  ENDPOINT PARA ELIMINAR
    @DeleteMapping("/eliminar/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> eliminar(@PathVariable Long id) {
        if (reservaService.eliminarReserva(id)) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    @PatchMapping("/{id}/estado")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> actualizarEstado(@PathVariable Long id, @RequestBody String nuevoEstado){
        try{
            String estadoLimpio = nuevoEstado.replace("\"","");
            return ResponseEntity.ok(reservaService.cambiarEstado(id,estadoLimpio));
        }catch (Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}