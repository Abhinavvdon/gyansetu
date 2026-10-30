package org.gyansetu.config;

import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.io.IOException;

/**
 * Filter that attaches baseline security headers to every HTTP response.
 * Resolves ArgosX / OWASP security scan requirements:
 * - X-Frame-Options: DENY (clickjacking protection)
 * - Strict-Transport-Security: max-age=63072000; includeSubDomains; preload (HSTS)
 * - X-Content-Type-Options: nosniff (MIME sniffing prevention)
 * - Permissions-Policy: camera, microphone, geolocation restrictions
 * - Referrer-Policy: strict-origin-when-cross-origin
 * - Content-Security-Policy: restrict allowed script/style/frame/connect sources
 */
@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
public class SecurityHeadersFilter implements Filter {

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        if (response instanceof HttpServletResponse httpServletResponse) {
            httpServletResponse.setHeader("X-Frame-Options", "DENY");
            httpServletResponse.setHeader("X-Content-Type-Options", "nosniff");
            httpServletResponse.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
            httpServletResponse.setHeader("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
            httpServletResponse.setHeader("Permissions-Policy", "geolocation=(), camera=(), microphone=(), payment=()");
            httpServletResponse.setHeader("Content-Security-Policy",
                    "default-src 'self'; " +
                    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://fonts.googleapis.com; " +
                    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
                    "font-src 'self' https://fonts.gstatic.com data:; " +
                    "img-src 'self' data: https: blob:; " +
                    "connect-src 'self' https: http:; " +
                    "frame-ancestors 'none'; " +
                    "base-uri 'self'; " +
                    "form-action 'self';");
        }
        chain.doFilter(request, response);
    }
}
