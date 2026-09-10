package com.serviceflow.api.infrastructure.security;

import com.serviceflow.api.infrastructure.ratelimit.InMemoryRateLimiter;
import com.serviceflow.api.infrastructure.ratelimit.RecoverPasswordRateLimitFilter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtService jwtService;
    private final InMemoryRateLimiter rateLimiter;
    private final String allowedOrigin;
    private final int maxRequests;
    private final long windowMs;

    public SecurityConfig(JwtService jwtService,
                          InMemoryRateLimiter rateLimiter,
                          @Value("${app.cors.allowed-origin:http://localhost:5173}") String allowedOrigin,
                          @Value("${app.rate-limit.max-requests:3}") int maxRequests,
                          @Value("${app.rate-limit.window-ms:900000}") long windowMs) {
        this.jwtService = jwtService;
        this.rateLimiter = rateLimiter;
        this.allowedOrigin = allowedOrigin;
        this.maxRequests = maxRequests;
        this.windowMs = windowMs;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf
                        .csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())
                        .ignoringRequestMatchers("/api/v1/auth/login", "/api/v1/auth/recover-password")
                )
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/v1/auth/login", "/api/v1/auth/recover-password").permitAll()
                        .requestMatchers("/api/v1/auth/me").authenticated()
                        .anyRequest().authenticated()
                )
                .addFilterBefore(new JwtAuthFilter(jwtService), UsernamePasswordAuthenticationFilter.class)
                .addFilterBefore(new RecoverPasswordRateLimitFilter(rateLimiter, maxRequests, windowMs),
                        JwtAuthFilter.class);
        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of(allowedOrigin));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}