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
        // Sube un nivel para mapear toda la carpeta "uploads/"
        String raiz = uploadDir.replace("/galeria", "");
        registry
            .addResourceHandler("/uploads/**")
            .addResourceLocations("file:" + raiz + "/");
    }
}
