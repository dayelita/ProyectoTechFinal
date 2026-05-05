package backend.controller;

import backend.model.Usuario;
import backend.repository.UsuarioRepository;
import backend.security.JwtUtil;
import backend.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "*")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    // 🔥 Agregamos el repositorio para hacer consultas directas a la BD
    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @GetMapping
    public List<Usuario> listarUsuarios(){
        return usuarioService.listarTodos();
    }

    @PostMapping
    public Usuario crear(@RequestBody Usuario usuario){
        return usuarioService.guardar(usuario);
    }

    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody Usuario loginData){
        Usuario usuario = usuarioService.autenticar(loginData.getCorreo(), loginData.getPassword());

        if (usuario == null){
            throw new RuntimeException("Correo o contraseña incorrecta");
        }

        String token = jwtUtil.generarToken(usuario.getCorreo());

        Map<String, Object> response = new HashMap<>();
        response.put("usuario", usuario);
        response.put("token", token);

        return response;
    }

    // ====================================================================
    // 🔥 ENDPOINT: VERIFICACIÓN ESTRICTA DE ROL PARA EL FRONTEND
    // ====================================================================
    @GetMapping("/verificar/{id}")
    public ResponseEntity<?> verificarRol(@PathVariable Long id) {
        Optional<Usuario> usuario = usuarioRepository.findById(id);

        if (usuario.isPresent()) {
            // Devolvemos un JSON pequeño solo con el rol real de la base de datos
            return ResponseEntity.ok(Collections.singletonMap("rol", usuario.get().getRol()));
        } else {
            // Si el ID no existe o fue manipulado en el LocalStorage, bloqueamos el acceso
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    // ====================================================================
    // 🔥 NUEVO ENDPOINT: ACTUALIZAR PERFIL DEL USUARIO
    // ====================================================================
    @PutMapping("/actualizar/{id}")
    public ResponseEntity<?> actualizarPerfil(@PathVariable Long id, @RequestBody Usuario usuarioActualizado) {

        Optional<Usuario> usuarioExistente = usuarioRepository.findById(id);

        if (usuarioExistente.isPresent()) {
            Usuario usr = usuarioExistente.get();

            // Actualizamos los datos básicos
            usr.setNombre(usuarioActualizado.getNombre());
            usr.setApellido(usuarioActualizado.getApellido());
            usr.setCorreo(usuarioActualizado.getCorreo());
            usr.setTelefono(usuarioActualizado.getTelefono());

            // Si el usuario escribió una contraseña nueva, la actualizamos
            if (usuarioActualizado.getPassword() != null && !usuarioActualizado.getPassword().trim().isEmpty()) {
                usr.setPassword(usuarioActualizado.getPassword());
            }

            // Guardamos los cambios en MySQL
            usuarioRepository.save(usr);

            // Devolvemos el usuario actualizado para que React refresque sus datos
            return ResponseEntity.ok(usr);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuario no encontrado");
        }
    }

}