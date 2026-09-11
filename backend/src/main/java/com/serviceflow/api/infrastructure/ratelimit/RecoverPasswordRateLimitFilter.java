package com.serviceflow.api.infrastructure.ratelimit;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

public class RecoverPasswordRateLimitFilter extends OncePerRequestFilter {

    private final InMemoryRateLimiter rateLimiter;
    private final int maxRequests;
    private final long windowMs;

    public RecoverPasswordRateLimitFilter(InMemoryRateLimiter rateLimiter, int maxRequests, long windowMs) {
        this.rateLimiter = rateLimiter;
        this.maxRequests = maxRequests;
        this.windowMs = windowMs;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        if ("POST".equalsIgnoreCase(request.getMethod())
                && (request.getRequestURI().equals("/api/v1/auth/recover-password")
                || request.getRequestURI().equals("/api/v1/auth/forgotPassword"))) {
            if (!rateLimiter.allow(clientIp(request), maxRequests, windowMs)) {
                response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
                response.setContentType("application/json");
                response.getWriter().write("{\"error\":\"Too many requests, try again later\"}");
                return;
            }
        }
        filterChain.doFilter(request, response);
    }

    private String clientIp(HttpServletRequest request) {
        String forwarded = request.getHeader("X-Forwarded-For");
        if (forwarded != null && !forwarded.isBlank()) {
            return forwarded.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}