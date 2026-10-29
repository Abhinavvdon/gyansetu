package org.gyansetu.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.Resource;
import org.springframework.lang.NonNull;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.resource.PathResourceResolver;

import java.io.IOException;

/**
 * Single Page Application (SPA) Web Routing Configuration.
 * Enables Spring Boot to serve prebuilt React 19 / Vite frontend assets from
 * classpath:/static/ while gracefully routing client-side HTML5 history routes
 * (e.g. /opportunities, /timeline, /calculator) to index.html without interfering
 * with Spring Boot REST API endpoints (/api/**) or Actuator metrics.
 */
@Configuration
public class WebSpaConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(@NonNull ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/**")
                .addResourceLocations("classpath:/static/")
                .resourceChain(true)
                .addResolver(new PathResourceResolver() {
                    @Override
                    protected Resource getResource(@NonNull String resourcePath, @NonNull Resource location) throws IOException {
                        // Bypass REST API and monitoring routes
                        if (resourcePath.startsWith("api") || resourcePath.startsWith("actuator")) {
                            return null;
                        }

                        Resource requested = location.createRelative(resourcePath);
                        if (requested.exists() && requested.isReadable()) {
                            return requested;
                        }

                        // For HTML5 client routes, forward to index.html if available
                        Resource indexHtml = location.createRelative("index.html");
                        if (indexHtml.exists() && indexHtml.isReadable()) {
                            return indexHtml;
                        }

                        return null;
                    }
                });
    }
}
