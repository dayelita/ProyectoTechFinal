package backend.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    // 1. CORREO PARA EL ADMINISTRADOR (TÚ)
    public void enviarAvisoAdmin(String nombreCliente, String fecha, String hora) {
        try {
            MimeMessage mensaje = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mensaje, true, "UTF-8");

            // 🔥 Tu correo personal como Administrador
            helper.setTo("erammarcorojasp@gmail.com");
            helper.setSubject("🔔 Nueva Solicitud de Reserva - Casona JMS");

            String html = "<h3>Tienes una nueva solicitud de hora presencial</h3>"
                    + "<p><strong>Cliente:</strong> " + nombreCliente + "</p>"
                    + "<p><strong>Fecha solicitada:</strong> " + fecha + "</p>"
                    + "<p><strong>Hora solicitada:</strong> " + hora + "</p>"
                    + "<p>Por favor, ingresa al Panel de Administración para Aceptar o Rechazar esta solicitud.</p>";

            helper.setText(html, true);
            mailSender.send(mensaje);
            System.out.println("Aviso enviado exitosamente al Admin.");

        } catch (MessagingException e) {
            System.err.println("Error al enviar aviso al admin: " + e.getMessage());
        }
    }

    // 2. CORREO PARA EL CLIENTE (LA RESPUESTA)
    public void enviarRespuestaCliente(String correoCliente, String nombreCliente, String fecha, String hora, boolean esAceptada) {
        try {
            MimeMessage mensaje = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mensaje, true, "UTF-8");

            helper.setTo(correoCliente);

            String asunto = esAceptada ? "¡Tu reserva en Casona JMS fue ACEPTADA! 🎉" : "Actualización de tu reserva en Casona JMS";
            helper.setSubject(asunto);

            String mensajeEstado = esAceptada
                    ? "<p style='color: green;'>Nos complace informarte que tu solicitud de visita ha sido <strong>Aprobada</strong>. Te esperamos en la fecha y hora acordada.</p>"
                    : "<p style='color: red;'>Lamentamos informarte que no tenemos disponibilidad para la fecha solicitada y tu reserva ha sido <strong>Rechazada</strong>. Por favor, intenta agendar en otro horario.</p>";

            String html = "<div style='font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd;'>"
                    + "<div style='background-color: #722F37; color: white; padding: 15px; text-align: center;'>"
                    + "<h2>Espacio Casona JMS</h2></div>"
                    + "<div style='padding: 20px;'>"
                    + "<p>Hola <strong>" + nombreCliente + "</strong>,</p>"
                    + mensajeEstado
                    + "<div style='background-color: #fdfbf7; padding: 15px; margin: 20px 0;'>"
                    + "<p>📅 Fecha: " + fecha + "</p>"
                    + "<p>⏰ Hora: " + hora + "</p>"
                    + "</div>"
                    + "<p>Saludos cordiales,<br>El equipo de Espacio Casona JMS</p>"
                    + "</div></div>";

            helper.setText(html, true);
            mailSender.send(mensaje);
            System.out.println("Respuesta enviada exitosamente al Cliente.");

        } catch (MessagingException e) {
            System.err.println("Error al responder al cliente: " + e.getMessage());
        }
    }
}