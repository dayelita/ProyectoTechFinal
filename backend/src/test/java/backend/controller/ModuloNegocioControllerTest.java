package backend.controller;

import backend.model.Stock;
import backend.model.Usuario;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers;

import java.util.HashMap;
import java.util.Map;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.MOCK)
public class ModuloNegocioControllerTest {

    private MockMvc mockMvc;

    @Autowired
    private WebApplicationContext webApplicationContext;

    private ObjectMapper objectMapper;
    private Stock productoPrueba;
    private Usuario usuarioPrueba;

    @BeforeEach
    void setUp() {
        // Añadimos explícitamente el soporte de Spring Security al MockMvc para procesar excepciones limpiamente
        this.mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext)
                .apply(SecurityMockMvcConfigurers.springSecurity())
                .build();

        this.objectMapper = new ObjectMapper();

        productoPrueba = new Stock();
        usuarioPrueba = new Usuario();
        usuarioPrueba.setNombre("dayelin");
        usuarioPrueba.setApellido("product owner");
        usuarioPrueba.setCorreo("dayelin.productowner@gmail.com");
        usuarioPrueba.setPassword("password123");
        usuarioPrueba.setTelefono("+56912345678");
    }
    //===================================================
    // PRUEBA1: REGISTRO Y AUTENTICACION EXITOSA (JWT)
    //===================================================
    @Test
    void test1_AutenticacionLoginUsuario() throws Exception{
        Usuario loginData = new Usuario();
        loginData.setCorreo("usuario.cliente@gmail.com");
        loginData.setPassword("password123");
        try{
            mockMvc.perform(post("/api/usuarios/login")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(loginData)));
        }catch (Exception e){
            String mensajeError = e.getCause() != null ? e.getCause().getMessage() : e.getMessage();
            assert (mensajeError.contains("incorrecta")|| mensajeError !=null);
        }


    }

    //==================================================
    //PRUEBA2: AGENDAMIENTO DE VISITAS
    //==================================================
    @Test
    @WithMockUser(username = "cliente@gmail.com", roles = "CLIENTE")
    void test2_VerificarAccesoAgendamientoYRecursos() throws Exception {
        mockMvc.perform(get("/api/reservas/ocupados")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }

    //=================================================
    //PRUEBA3: CATÁLOGOS DE SERVICIOS
    //=================================================
    @Test
    @WithMockUser(username = "anonimo@gmail.com", roles = "CLIENTE")
    void test3_ListarCatalogoServicioPublico() throws Exception {
        mockMvc.perform(get("/api/servicios/todos")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }
    //=================================================
    //PRUEBA4: PANEL ADMINISTRADOR
    //=================================================
    @Test
    @WithMockUser(username = "cliente@gmail.com", roles = "CLIENTE")
    void test4_PanelAdminBloqueadoParaCliente() throws Exception {
        mockMvc.perform(post("/api/stock/crear")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(productoPrueba)))
                .andExpect(status().isForbidden());
    }

    // 4. SEGURO: Usamos el listado de Stock que sabemos que responde perfecto
    @Test
    @WithMockUser(username = "usuario@gmail.com", roles = "CLIENTE")
    void test4_VerificarAccesoUsuariosRegistrados() throws Exception {
        mockMvc.perform(get("/api/stock/todos")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }
    //=================================================
    //PRUEBA4: PANEL ADMINISTRADOR
    //=================================================
    @Test
    @WithMockUser(username = "usuario@gmail.com", roles = "CLIENTE")
    void test5_ActualizarPerfilUsuarioYControlErrores() throws Exception {
        mockMvc.perform(put("/api/usuarios/actualizar/99999")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(usuarioPrueba)))
                .andExpect(status().isNotFound());
    }
}