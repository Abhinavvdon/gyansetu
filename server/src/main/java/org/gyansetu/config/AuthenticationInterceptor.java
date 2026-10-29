package org.gyansetu.config;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.gyansetu.model.User;
import org.gyansetu.service.AuthService;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import java.util.Optional;
import java.util.Set;

@Component
public class AuthenticationInterceptor implements HandlerInterceptor {

    private final AuthService authService;

    // Endpoints that are explicitly public and do not require user authentication
    private static final Set<String> PUBLIC_EXACT_OR_PREFIXES = Set.of(
            "/api/auth",
            "/api/health",
            "/api/scam-alerts",
            "/api/verify-url",
            "/api/peer-stories"
    );

    public AuthenticationInterceptor(AuthService authService) {
        this.authService = authService;
    }

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        // 1. Allow CORS preflight requests (OPTIONS)
        if (HttpMethod.OPTIONS.matches(request.getMethod())) {
            return true;
        }

        String uri = request.getRequestURI();

        // 2. Allow non-api requests (static assets, index.html)
        if (!uri.startsWith("/api")) {
            return true;
        }

        // 3. Allow public API endpoints
        for (String prefix : PUBLIC_EXACT_OR_PREFIXES) {
            if (uri.equals(prefix) || uri.startsWith(prefix + "/") || uri.startsWith(prefix + "?")) {
                return true;
            }
        }

        // 4. Extract token from Authorization header or X-Auth-Token
        String authHeader = request.getHeader("Authorization");
        String token = null;

        if (authHeader != null && authHeader.toLowerCase().startsWith("bearer ")) {
            token = authHeader.substring(7).trim();
        } else if (authHeader != null && !authHeader.isBlank()) {
            token = authHeader.trim();
        } else {
            token = request.getHeader("X-Auth-Token");
        }

        if (token != null && !token.isBlank()) {
            Optional<User> userOpt = authService.validateToken(token);
            if (userOpt.isPresent()) {
                User user = userOpt.get();
                request.setAttribute("authenticatedUser", user);
                request.setAttribute("authenticatedUserId", user.getId());
                return true;
            }
        }

        // 5. Unauthenticated access attempt to a protected resource:
        // Respond with HTTP 401 Unauthorized
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType("application/json;charset=UTF-8");
        response.getWriter().write("""
            {
              "status": 401,
              "error": "Unauthorized",
              "message": "Full authentication is required to access this resource. Please provide a valid Bearer token in the Authorization header."
            }
            """);
        return false;
    }
}
