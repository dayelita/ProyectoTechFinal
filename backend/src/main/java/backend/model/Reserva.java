package backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonProperty;

@Entity
@Table(name = "reservas")
public class Reserva {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 👇 ESTE ES EL CANDADO ANTI-DUPLICADOS (Optimistic Locking) 👇
    @Version
    private Long version;

    @JsonProperty("fechaHoraInicio")
    @Column(nullable = false)
    private LocalDateTime fechaHoraInicio;

    @JsonProperty("fechaHoraFin")
    @Column(nullable = false)
    private LocalDateTime fechaHoraFin;

    private String title;

    private String estado;

    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    public Reserva() {}

    public Reserva(LocalDateTime fechaHoraInicio, LocalDateTime fechaHoraFin, String title, String estado, Usuario usuario){
        this.fechaHoraInicio = fechaHoraInicio;
        this.fechaHoraFin = fechaHoraFin;
        this.title = title;
        this.estado = estado;
        this.usuario = usuario;
    }

    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getVersion() { return version; }
    public void setVersion(Long version) { this.version = version; }

    public LocalDateTime getFechaHoraInicio() { return fechaHoraInicio; }
    public void setFechaHoraInicio(LocalDateTime fechaHoraInicio) { this.fechaHoraInicio = fechaHoraInicio; }

    public LocalDateTime getFechaHoraFin() { return fechaHoraFin; }
    public void setFechaHoraFin(LocalDateTime fechaHoraFin) { this.fechaHoraFin = fechaHoraFin; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }

    public Usuario getUsuario() { return usuario; }
    public void setUsuario(Usuario usuario) { this.usuario = usuario; }
}