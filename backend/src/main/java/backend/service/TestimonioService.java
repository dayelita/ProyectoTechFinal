package backend.service;

import backend.model.Testimonio;
import backend.repository.TestimonioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service

public class TestimonioService {
    @Autowired
    private TestimonioRepository testimonioRepository;

    @Autowired
    private EmailService emailService;

    public List<Testimonio> obtenerTestimoniosAprobados(){
        return testimonioRepository.findByEstado("APROBADO");

    }
    public List<Testimonio> obtenerTestimoniosPendientes(){
        return testimonioRepository.findByEstado("PENDIENTE");
    }

    public Testimonio guardarNuevo(Testimonio testimonio){
        testimonio.setEstado("PENDIENTE");
        return testimonioRepository.save(testimonio);
    }
    public void moderarTestimonio(Long id,boolean aprobado, String motivo){
        Testimonio t = testimonioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Testimonio no encontrado"));
        if (aprobado){
            t.setEstado("APROBADO");
        }else{
            t.setEstado("RECHAZADO");
            t.setMotivoRechazo(motivo);
        }
        testimonioRepository.save(t);

        if(t.getUsuario() !=null && t.getUsuario().getCorreo() != null){
            String emailDestino = t.getUsuario().getCorreo();
            emailService.enviarCorreoModeracionReseñas(
                    emailDestino,
                    t.getNombre(),
                    aprobado,
                    motivo
            );

        }else{
            System.err.println("No se pudo enviar el correo: El testimonio no tiene un usuario asociado con email.");
        }

    }
}
