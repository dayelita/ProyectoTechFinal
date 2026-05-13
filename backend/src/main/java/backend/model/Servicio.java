package backend.model;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "servicios")
public class Servicio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String categoria;
    private String nombre;

    @Column(length = 1500) // Le damos bastante espacio para la descripción
    private String descripcion;

    private String capacidad;
    private String precio;

    @Column(length = 1000) // Las URLs de imágenes a veces son largas
    private String imagen;

    private String badge;
    private String badgeColor;

    // Crea una tabla anexa automáticamente para guardar la lista de "Qué incluye"
    @ElementCollection
    @CollectionTable(name = "servicio_detalles", joinColumns = @JoinColumn(name = "servicio_id"))
    @Column(name = "detalle")
    private List<String> detalles;

    // Constructor vacío exigido por JPA
    public Servicio() {
    }

    // --- GETTERS Y SETTERS ---

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCategoria() { return categoria; }
    public void setCategoria(String categoria) { this.categoria = categoria; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }

    public String getCapacidad() { return capacidad; }
    public void setCapacidad(String capacidad) { this.capacidad = capacidad; }

    public String getPrecio() { return precio; }
    public void setPrecio(String precio) { this.precio = precio; }

    public String getImagen() { return imagen; }
    public void setImagen(String imagen) { this.imagen = imagen; }

    public String getBadge() { return badge; }
    public void setBadge(String badge) { this.badge = badge; }

    public String getBadgeColor() { return badgeColor; }
    public void setBadgeColor(String badgeColor) { this.badgeColor = badgeColor; }

    public List<String> getDetalles() { return detalles; }
    public void setDetalles(List<String> detalles) { this.detalles = detalles; }
}