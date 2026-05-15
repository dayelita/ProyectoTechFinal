package backend.controller;

import backend.model.Galeria;
import backend.repository.GaleriaRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/galeria")
@CrossOrigin(origins = "*")
public class GaleriaController {

    @Autowired
    private GaleriaRepository repository;

    /**
     * Carpeta donde se guardan los archivos.
     * Puedes cambiarlo en application.properties: galeria.upload-dir=uploads/galeria
     */
    @Value("${galeria.upload-dir:uploads/galeria}")
    private String uploadDir;

    /**
     * URL base del servidor.
     * Puedes cambiarlo en application.properties: app.base-url=http://localhost:8081
     */
    @Value("${app.base-url:http://localhost:8081}")
    private String baseUrl;

    /** Crea la carpeta de uploads al arrancar si no existe */
    @PostConstruct
    public void init() throws IOException {
        Files.createDirectories(Paths.get(uploadDir));
    }

    // ── GET /api/galeria/todas ─────────────────────────────────────
    @GetMapping("/todas")
    public List<Galeria> obtenerTodas() {
        return repository.findAllByOrderByCreadoEnDesc();
    }

    // ── POST /api/galeria/subir ────────────────────────────────────
    /**
     * Recibe multipart/form-data con:
     *   file        → archivo de imagen (jpg, png, webp)
     *   titulo      → texto obligatorio
     *   categoria   → texto obligatorio
     *   descripcion → texto opcional
     */
    @PostMapping("/subir")
    public ResponseEntity<?> subirImagen(
            @RequestParam("file")       MultipartFile file,
            @RequestParam("titulo")     String titulo,
            @RequestParam("categoria")  String categoria,
            @RequestParam(value = "descripcion", required = false, defaultValue = "") String descripcion
    ) {
        if (file == null || file.isEmpty()) {
            return ResponseEntity.badRequest().body("El archivo de imagen es obligatorio.");
        }

        try {
            // 1. Nombre único para evitar colisiones
            String extension  = obtenerExtension(file.getOriginalFilename());
            String nombreFile = UUID.randomUUID() + "." + extension;
            Path destino      = Paths.get(uploadDir).resolve(nombreFile);

            // 2. Guardar en disco
            Files.copy(file.getInputStream(), destino, StandardCopyOption.REPLACE_EXISTING);

            // 3. Persistir en BD
            Galeria img = new Galeria();
            img.setTitulo(titulo);
            img.setCategoria(categoria);
            img.setDescripcion(descripcion);
            img.setRutaArchivo(uploadDir + "/" + nombreFile);
            img.setUrl(baseUrl + "/uploads/galeria/" + nombreFile);

            return ResponseEntity.ok(repository.save(img));

        } catch (IOException e) {
            return ResponseEntity.internalServerError()
                    .body("Error al guardar el archivo: " + e.getMessage());
        }
    }

    // ── PUT /api/galeria/editar/{id} ───────────────────────────────
    /**
     * Recibe JSON con los campos editables: titulo, categoria, descripcion.
     * No cambia la imagen en sí, solo los metadatos.
     */
    @PutMapping("/editar/{id}")
    public ResponseEntity<?> editarImagen(
            @PathVariable Long id,
            @RequestBody Map<String, String> campos
    ) {
        return repository.findById(id).map(img -> {
            if (campos.containsKey("titulo")      && !campos.get("titulo").isBlank())
                img.setTitulo(campos.get("titulo"));
            if (campos.containsKey("categoria")   && !campos.get("categoria").isBlank())
                img.setCategoria(campos.get("categoria"));
            if (campos.containsKey("descripcion"))
                img.setDescripcion(campos.get("descripcion"));

            return ResponseEntity.ok(repository.save(img));
        }).orElse(ResponseEntity.notFound().build());
    }

    // ── DELETE /api/galeria/eliminar/{id} ─────────────────────────
    /** Elimina el registro de la BD y borra el archivo del disco */
    @DeleteMapping("/eliminar/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Long id) {
        return repository.findById(id).map(img -> {
            // Borrar archivo físico
            try {
                if (img.getRutaArchivo() != null) {
                    Files.deleteIfExists(Paths.get(img.getRutaArchivo()));
                }
            } catch (IOException e) {
                // Si falla el borrado del archivo, igual eliminamos el registro
                System.err.println("No se pudo borrar el archivo: " + e.getMessage());
            }
            repository.deleteById(id);
            return ResponseEntity.ok("Imagen eliminada correctamente.");
        }).orElse(ResponseEntity.notFound().build());
    }

    // ── AUXILIAR ──────────────────────────────────────────────────
    private String obtenerExtension(String nombreOriginal) {
        if (nombreOriginal != null && nombreOriginal.contains(".")) {
            return nombreOriginal.substring(nombreOriginal.lastIndexOf('.') + 1).toLowerCase();
        }
        return "jpg";
    }
}
