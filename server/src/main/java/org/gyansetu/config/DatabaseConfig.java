package org.gyansetu.config;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.jdbc.DataSourceProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.util.StringUtils;

import javax.sql.DataSource;
import java.net.URI;

/**
 * Robust DataSource Configuration that automatically detects and translates
 * Render / Cloud PostgreSQL connection strings (postgres:// or postgresql://)
 * into standard JDBC connection properties with connection pooling.
 * Falls back seamlessly to standard application.properties for local development.
 */
@Configuration
public class DatabaseConfig {

    private static final Logger log = LoggerFactory.getLogger(DatabaseConfig.class);

    @Value("${DATABASE_URL:}")
    private String databaseUrl;

    @Value("${INTERNAL_DATABASE_URL:}")
    private String internalDatabaseUrl;

    @Bean
    @Primary
    public DataSource dataSource(DataSourceProperties properties) {
        String targetUrl = StringUtils.hasText(internalDatabaseUrl) ? internalDatabaseUrl.trim() : (databaseUrl != null ? databaseUrl.trim() : "");

        if (StringUtils.hasText(targetUrl) && (targetUrl.startsWith("postgres://") || targetUrl.startsWith("postgresql://"))) {
            log.info("Detected cloud DATABASE_URL / INTERNAL_DATABASE_URL. Translating to standard JDBC format...");
            try {
                String uriString = targetUrl;
                if (uriString.startsWith("postgres://")) {
                    uriString = "postgresql://" + uriString.substring("postgres://".length());
                }

                URI uri = new URI(uriString);
                String userInfo = uri.getUserInfo();
                String username = properties.getUsername();
                String password = properties.getPassword();

                if (StringUtils.hasText(userInfo)) {
                    String[] parts = userInfo.split(":", 2);
                    username = parts[0];
                    if (parts.length > 1) {
                        password = parts[1];
                    }
                }

                int port = uri.getPort() != -1 ? uri.getPort() : 5432;
                String path = uri.getPath(); // e.g. /gyansetu
                String query = uri.getQuery();

                String jdbcUrl = "jdbc:postgresql://" + uri.getHost() + ":" + port + path;
                if (StringUtils.hasText(query)) {
                    jdbcUrl += "?" + query;
                }

                HikariConfig config = new HikariConfig();
                config.setDriverClassName("org.postgresql.Driver");
                config.setJdbcUrl(jdbcUrl);
                if (username != null) config.setUsername(username);
                if (password != null) config.setPassword(password);
                config.setMaximumPoolSize(10);
                config.setMinimumIdle(2);
                config.setConnectionTimeout(30000);
                config.setIdleTimeout(600000);
                config.setMaxLifetime(1800000);

                log.info("HikariDataSource successfully created for host='{}', port={}, database='{}'", uri.getHost(), port, path);
                return new HikariDataSource(config);
            } catch (Exception e) {
                log.error("Failed to parse cloud DATABASE_URL, falling back to standard DataSourceProperties: {}", e.getMessage(), e);
            }
        }

        log.info("Configuring standard DataSource with JDBC URL: {}", properties.getUrl());
        return properties.initializeDataSourceBuilder().type(HikariDataSource.class).build();
    }
}
