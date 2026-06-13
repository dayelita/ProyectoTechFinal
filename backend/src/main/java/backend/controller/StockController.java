package backend.controller;

import backend.model.Stock;
import backend.service.StockService; // Importamos el servicio
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/stock")
@CrossOrigin(origins = "*")
public class StockController {

    @Autowired
    private StockService stockService;

    // Cargar inventario
    @GetMapping("/todos")
    public List<Stock> listarTodos() {
        return stockService.listarTodos();
    }

    //  Agregar artículo
    @PostMapping("/crear")
    @PreAuthorize("hasRole('ADMIN')")
    public Stock crear(@RequestBody Stock producto) {
        return stockService.guardar(producto);
    }

    // Editar artículo
    @PutMapping("/editar/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Stock> editar(@PathVariable Long id, @RequestBody Stock detallesProducto) {
        try {
            Stock actualizado = stockService.actualizar(id, detallesProducto);
            return ResponseEntity.ok(actualizado);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // 4. Eliminar artículo
    @DeleteMapping("/eliminar/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> eliminar(@PathVariable Long id) {
        try {
            stockService.eliminar(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}
