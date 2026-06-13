package backend.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import java.security.Key;
import java.util.Date;
import java.util.function.Function;

@Component
public class JwtUtil {

    //  clave secreta
    private final Key key = Keys.secretKeyFor(SignatureAlgorithm.HS256);

    //  GENERA EL TOKEN
    public String generarToken(String correo){
        return Jwts.builder()
                .setSubject(correo)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 3600000)) // 1 hora de validez
                .signWith(key)
                .compact();
    }

    //  EXTRAE EL USUARIO (El correo electrónico dentro del Subject)
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    // EXTRAE LA FECHA DE EXPIRACIÓN
    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }


    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    //  DESCIFRA EL TOKEN USANDO TU LLAVE SECRETA
    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    //  VERIFICA SI EL TOKEN YA EXPIRÓ
    private Boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    // VALIDA EL TOKEN (Compara el usuario del token con el de la Base de Datos y ve que esté vigente)
    public Boolean validateToken(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }
}