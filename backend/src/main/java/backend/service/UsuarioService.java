package backend.service;
import backend.model.Usuario;
import backend.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    public List<Usuario> listarTodos(){
        return usuarioRepository.findAll();
    }

    public Usuario guardar(Usuario usuario){

        Optional<Usuario> exixstente = usuarioRepository.findByCorreo(usuario.getCorreo());

        if (exixstente.isPresent()){
            throw new RuntimeException("Error: El correo " + usuario.getCorreo() + "ya esta regsitrado.");
        }
        return usuarioRepository.save(usuario);
    }
    public Usuario obtenerPorId(Long id){
        return usuarioRepository.findById(id).orElse(null);
    }

    public Usuario autenticar(String correo, String password){
        Optional<Usuario> usuarioOptional = usuarioRepository.findByCorreo(correo);

        if (usuarioOptional.isPresent()){
            Usuario usuario = usuarioOptional.get();
            if (usuario.getPassword().equals(password)){
                return usuario;
            }
        }
        return null;
    }
}
