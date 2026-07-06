package backend.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtRequestFilter jwtRequestFilter;

    public SecurityConfig(JwtRequestFilter jwtRequestFilter) {
        this.jwtRequestFilter = jwtRequestFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .authorizeHttpRequests(auth -> auth
                        // RUTAS PÚBLICAS (Visitantes sin sesión)
                        .requestMatchers(
                                "/api/usuarios/login",
                                "/api/usuarios/registro",
                                "/api/galeria/todas",
                                "/uploads/**",
                                "/api/servicios/todos",
                                "/api/usuarios",
                                "/api/testimonios/todos",
                                "/api/reservas/todos",
                                "/api/usuarios",
                                "/api/usuarios/verificar/"

                        ).permitAll()

                        // RUTAS ADMINISTRATIVAS Y PRIVADAS (Requieren Token)

                        .requestMatchers("/api/usuarios/actualizar/**").authenticated()
                        .requestMatchers("/api/testimonios/crear").authenticated()
                        .requestMatchers("/api/stock/**").authenticated()
                        .requestMatchers("/api/testimonios/crear").authenticated()
                        .requestMatchers("/api/galeria/subir", "/api/galeria/editar/**", "/api/galeria/eliminar/**").authenticated()
                        .requestMatchers("/api/servicios/crear", "/api/servicios/editar/**", "/api/servicios/eliminar/**").authenticated()
                        .requestMatchers("/api/reservas/**").authenticated()

                        // CUALQUIER OTRA RUTA NO DECLARADA SE BLOQUEA
                        .anyRequest().authenticated()
                )
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

        // Inyectamos el filtro de la pulsera VIP antes de procesar la petición
        http.addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // Direcciones autorizadas (Local y CloudFront de la nube)
        configuration.setAllowedOrigins(Arrays.asList(
                "http://localhost:5173",
                "https://dhpvuyzw9urhi.cloudfront.net"
        ));

        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type"));
        configuration.setExposedHeaders(Arrays.asList("Authorization"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}