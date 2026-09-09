package com.serviceflow.api.adapters.in;

import com.serviceflow.api.adapters.in.dto.LoginRequest;
import com.serviceflow.api.adapters.in.dto.LoginResponse;
import com.serviceflow.api.adapters.in.dto.RecoverPasswordRequest;
import com.serviceflow.api.application.services.AuthService;
import com.serviceflow.api.application.services.InvalidCredentialsException;
import com.serviceflow.api.infrastructure.security.JwtAuthFilter;
import com.serviceflow.api.infrastructure.security.JwtService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final AuthService authService;
    private final JwtService jwtService;
    private final boolean cookieSecure;

    public AuthController(AuthService authService, JwtService jwtService,
                          @Value("${app.cookie.secure:false}") boolean cookieSecure) {
        this.authService = authService;
        this.jwtService = jwtService;
        this.cookieSecure = cookieSecure;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request, HttpServletResponse response) {
        try {
            AuthService.LoginResult result = authService.login(request.email(), request.password());

            Cookie cookie = new Cookie(JwtAuthFilter.COOKIE_NAME, result.token());
            cookie.setHttpOnly(true);
            cookie.setSecure(cookieSecure);
            cookie.setAttribute("SameSite", "Strict");
            cookie.setPath("/");
            cookie.setMaxAge(Math.toIntExact(jwtService.expirationInSeconds()));
            response.addCookie(cookie);

            return ResponseEntity.ok(new LoginResponse(result.nombre(), result.rol()));
        } catch (InvalidCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Invalid credentials"));
        }
    }

    @PostMapping("/recover-password")
    public ResponseEntity<?> recoverPassword(@RequestBody RecoverPasswordRequest request) {
        authService.requestPasswordRecovery(request.email());
        return ResponseEntity.ok(Map.of("message", "If the email exists, we will process the request"));
    }

    @GetMapping("/me")
    public ResponseEntity<?> me(Authentication authentication) {
        String email = (String) authentication.getPrincipal();
        return ResponseEntity.ok(Map.of("email", email, "rol", authentication.getAuthorities().stream()
                .findFirst()
                .map(a -> a.getAuthority().replace("ROLE_", ""))
                .orElse("")));
    }
}