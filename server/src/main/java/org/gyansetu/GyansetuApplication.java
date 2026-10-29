package org.gyansetu;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@SpringBootApplication
public class GyansetuApplication {

    public static void main(String[] args) {
        SpringApplication.run(GyansetuApplication.class, args);
        System.out.println("=================================================");
        System.out.println("  🎓 GyanSetu Backend Started Successfully!      ");
        System.out.println("  API Available at: http://localhost:8085/api    ");
        System.out.println("=================================================");
    }

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOriginPatterns("http://localhost:*", "http://127.0.0.1:*", "*")
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH")
                        .allowedHeaders("*")
                        .allowCredentials(false);
            }
        };
    }
}
