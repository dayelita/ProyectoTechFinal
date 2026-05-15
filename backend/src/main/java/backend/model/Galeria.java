package backend.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "galeria")
public class Galeria {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String titulo;
    private String categoria;

    @Column(length = 500)
    private String descripcion;

    /**
     * URL pública de la imagen que el frontend muestra.
     * Ejemplo: http://localhost:8081/uploads/galeria/uuid.jpg
     */
    private String url;

    /**
     * Ruta interna del archivo guardado en disco.
     * Ejemplo: uploads/galeria/uuid.jpg
     * Se usa para borrar el archivo al eliminar el registro.
     */
    private String rutaArchivo;

    @Column(updatable = false)
    private LocalDateTime creadoEn = LocalDateTime.now();
}
