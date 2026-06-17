package backend.security;

import backend.model.Usuario;
import backend.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Override
    public UserDetails loadUserByUsername(String correo) throws UsernameNotFoundException {

        // Usamos el repositorio para ir a buscar a MySQL
        Usuario usuario = usuarioRepository.findByCorreo(correo)
                .orElseThrow(() -> new UsernameNotFoundException("El correo no existe en la Base de Datos: " + correo));

        //  Extrae el rol. Spring Security exige que los roles empiecen con "ROLE_"
        String rol = usuario.getRol() != null ? usuario.getRol() : "USER";
        if (!rol.startsWith("ROLE_")) {
            rol = "ROLE_" + rol;
        }

        // Convierte el Usuario de MySQL al formato de seguridad que entiende Spring
        return new User(
                usuario.getCorreo(),
                usuario.getPassword(),
                Collections.singletonList(new SimpleGrantedAuthority(rol))
        );
    }
}