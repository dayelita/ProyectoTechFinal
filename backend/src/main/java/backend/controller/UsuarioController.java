package backend.controller;

import backend.model.Usuario;
import backend.repository.UsuarioRepository;
import backend.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "*")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    @GetMapping
    public List<Usuario> listarUsuarios(){
        return usuarioService.listarTodos();
    }

    @PostMapping
    public Usuario crear(@RequestBody Usuario usuario){
        return usuarioService.guardar(usuario);
    }

}
