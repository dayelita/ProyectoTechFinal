package backend.service;

import backend.model.Stock;
import backend.repository.StockRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service

public class StockService {

    @Autowired
    private StockRepository stockRepository;

    public List<Stock>listarTodos(){
        return stockRepository.findAll();
    }
    public Stock guardar(Stock producto){
        // Aquí podrías poner lógica, por ejemplo:
        // if(producto.getPrecio() < 0) throw new RuntimeException("Precio inválido");
        return stockRepository.save(producto);
    }
    public Optional<Stock> obtenerPorId(Long id) {
        return stockRepository.findById(id);
    }
    public void eliminar(Long id){
        stockRepository.deleteById(id);
    }
    public Stock actualizar(Long id, Stock detalles){
        return stockRepository.findById(id).map(producto -> {
            producto.setNombre(detalles.getNombre());
            producto.setCategoria(detalles.getCategoria());
            producto.setCantidad(detalles.getCantidad());
            producto.setPrecio(detalles.getPrecio());
            return stockRepository.save(producto);
        }).orElseThrow(() -> new RuntimeException("Producto no encontrado"));
    }
}
