package backend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Expone la carpeta de uploads como recurso estático público.
 *
 * Una imagen guardada en: uploads/galeria/uuid.jpg
 * será accesible en:      http://localhost:8081/uploads/galeria/uuid.jpg
 */
@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Value("${galeria.upload-dir:uploads/galeria}")
    private String uploadDir;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Obtiene la ruta absoluta exacta en tu disco (ej: C:/Users/Marco/.../uploads/galeria)
        String rutaAbsoluta = java.nio.file.Paths.get(uploadDir).toAbsolutePath().toUri().toString();

        // Le dice a Spring: Lo que pidan en /uploads/galeria/** búscalo exactamente en esa carpeta física
        registry
                .addResourceHandler("/uploads/galeria/**")
                .addResourceLocations(rutaAbsoluta);
    }
}
