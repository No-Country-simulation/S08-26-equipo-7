package com.serviceflow.api.adapters.in;

import com.serviceflow.api.adapters.in.dto.UserResponse;
import com.serviceflow.api.application.services.DuplicateEmailException;
import com.serviceflow.api.application.services.UserService;
import com.serviceflow.api.application.services.ValidationException;
import com.serviceflow.api.domain.RolUsuario;
import com.serviceflow.api.domain.Usuario;
import com.serviceflow.api.infrastructure.security.UsuarioAutenticado;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.EnumSet;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody CreateUserRequest request, Authentication auth) {
        try {
            if (auth == null || !auth.isAuthenticated()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Authentication required"));
            }
            Usuario created = userService.create(
                    request.name(), request.email(), request.role(), request.password(), request.area()
            );
            return ResponseEntity.status(HttpStatus.CREATED).body(UserResponse.from(created));
        } catch (DuplicateEmailException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("error", e.getMessage()));
        } catch (ValidationException e) {
            return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY).body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<?> list(Authentication auth) {
        if (auth == null || !auth.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Authentication required"));
        }
        List<UserResponse> users = userService.listAll().stream().map(UserResponse::from).toList();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/agents")
    public ResponseEntity<?> agents(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String area,
            Authentication auth) {
        if (auth == null || !auth.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Authentication required"));
        }
        UsuarioAutenticado user = (UsuarioAutenticado) auth.getPrincipal();
        if (!EnumSet.of(RolUsuario.ADMIN, RolUsuario.SUPERVISOR).contains(RolUsuario.valueOf(user.role()))) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", "Forbidden: insufficient role"));
        }
        String needle = search != null ? search.trim().toLowerCase() : null;
        String areaFilter = area != null && !area.isBlank() ? area.trim().toUpperCase() : null;
        List<UserResponse> agents = userService.listAll().stream()
                .filter(u -> u.getRole() == RolUsuario.AGENT)
                .filter(u -> areaFilter == null || (u.getArea() != null && u.getArea().equalsIgnoreCase(areaFilter)))
                .filter(u -> needle == null || needle.isBlank()
                        || (u.getName() != null && u.getName().toLowerCase().contains(needle))
                        || (u.getEmail() != null && u.getEmail().toLowerCase().contains(needle)))
                .map(UserResponse::from)
                .toList();
        return ResponseEntity.ok(agents);
    }

    @PostMapping("/me/password")
    public ResponseEntity<?> changeMyPassword(@RequestBody ChangePasswordRequest request, Authentication auth) {
        if (auth == null || !auth.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Authentication required"));
        }
        try {
            UsuarioAutenticado user = (UsuarioAutenticado) auth.getPrincipal();
            userService.changePassword(user.email(), request.currentPassword(), request.newPassword());
            return ResponseEntity.ok(Map.of("message", "Password updated"));
        } catch (ValidationException e) {
            return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY).body(Map.of("error", e.getMessage()));
        }
    }

    public record CreateUserRequest(String name, String email, String role, String password, String area) {
    }

    public record ChangePasswordRequest(String currentPassword, String newPassword) {
    }
}