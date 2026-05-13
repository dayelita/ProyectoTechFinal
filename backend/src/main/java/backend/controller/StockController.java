package backend.controller;

import backend.model.Stock;
import backend.service.StockService; // Importamos el servicio
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/stock")
@CrossOrigin(origins = "*")
public class StockController {

    @Autowired
    private StockService stockService; // Usamos el Service ahora

    // 1. Cargar inventario
    @GetMapping("/todos")
    public List<Stock> listarTodos() {
        return stockService.listarTodos();
    }

    // 2. Agregar artículo
    @PostMapping("/crear")
    public Stock crear(@RequestBody Stock producto) {
        return stockService.guardar(producto);
    }

    // 3. Editar artículo
    @PutMapping("/editar/{id}")
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
    public ResponseEntity<?> eliminar(@PathVariable Long id) {
        try {
            stockService.eliminar(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}
