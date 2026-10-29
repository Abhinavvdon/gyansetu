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
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Robust DataSource Configuration for Render & Cloud Environments.
 * 
 * Supports three fallback mechanisms:
 * 1. Explicit DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD environment variables.
 * 2. DATABASE_URL / INTERNAL_DATABASE_URL cloud connection strings (postgres:// or postgresql://)
 *    using regex extraction to gracefully handle special characters in passwords.
 * 3. Default application.properties configuration for local development.
 */
@Configuration
public class DatabaseConfig {

    private static final Logger log = LoggerFactory.getLogger(DatabaseConfig.class);

    // Regex safely matches postgres://[user[:pass]@]host[:port]/database[?query]
    private static final Pattern DB_URL_PATTERN = Pattern.compile("^(?:postgres|postgresql)://(?:([^:@]+)(?::([^@]+))?@)?([^:/]+)(?::(\\d+))?/(.+)$");

    @Value("${DB_HOST:}")
    private String dbHost;

    @Value("${DB_PORT:5432}")
    private String dbPort;

    @Value("${DB_NAME:}")
    private String dbName;

    @Value("${DB_USER:}")
    private String dbUser;

    @Value("${DB_PASSWORD:}")
    private String dbPassword;

    @Value("${DATABASE_URL:}")
    private String databaseUrl;

    @Value("${INTERNAL_DATABASE_URL:}")
    private String internalDatabaseUrl;

    @Bean
    @Primary
    public DataSource dataSource(DataSourceProperties properties) {
        // Strategy 1: Explicit DB_* properties injected by Render Blueprint
        if (StringUtils.hasText(dbHost) && StringUtils.hasText(dbName)) {
            log.info("Configuring DataSource from explicit DB_HOST='{}', DB_PORT={}, DB_NAME='{}'", dbHost, dbPort, dbName);
            String jdbcUrl = "jdbc:postgresql://" + dbHost.trim() + ":" + dbPort.trim() + "/" + dbName.trim();
            HikariConfig config = createHikariConfig(jdbcUrl, dbUser, dbPassword);
            return new HikariDataSource(config);
        }

        // Strategy 2: Single DATABASE_URL / INTERNAL_DATABASE_URL connection string
        String targetUrl = StringUtils.hasText(internalDatabaseUrl) ? internalDatabaseUrl.trim() : (databaseUrl != null ? databaseUrl.trim() : "");
        if (StringUtils.hasText(targetUrl) && (targetUrl.startsWith("postgres://") || targetUrl.startsWith("postgresql://"))) {
            log.info("Detected cloud DATABASE_URL / INTERNAL_DATABASE_URL. Parsing connection string...");
            Matcher matcher = DB_URL_PATTERN.matcher(targetUrl);
            if (matcher.matches()) {
                String user = matcher.group(1);
                String pass = matcher.group(2);
                String host = matcher.group(3);
                String port = matcher.group(4) != null ? matcher.group(4) : "5432";
                String dbPath = matcher.group(5);

                String jdbcUrl = "jdbc:postgresql://" + host + ":" + port + "/" + dbPath;
                log.info("Parsed cloud database target host='{}', port={}, database='{}'", host, port, dbPath);
                HikariConfig config = createHikariConfig(jdbcUrl, user, pass);
                return new HikariDataSource(config);
            } else {
                log.warn("DATABASE_URL pattern did not match regex, falling back to manual protocol prefixing...");
                String jdbcUrl = targetUrl.replaceFirst("^(?:postgres|postgresql)://", "jdbc:postgresql://");
                HikariConfig config = createHikariConfig(jdbcUrl, properties.getUsername(), properties.getPassword());
                return new HikariDataSource(config);
            }
        }

        // Strategy 3: Standard application.properties for local development
        log.info("Configuring standard DataSource with JDBC URL: {}", properties.getUrl());
        return properties.initializeDataSourceBuilder().type(HikariDataSource.class).build();
    }

    private HikariConfig createHikariConfig(String jdbcUrl, String username, String password) {
        HikariConfig config = new HikariConfig();
        config.setDriverClassName("org.postgresql.Driver");
        config.setJdbcUrl(jdbcUrl);
        if (StringUtils.hasText(username)) config.setUsername(username);
        if (StringUtils.hasText(password)) config.setPassword(password);

        // Resiliency settings for cloud databases:
        // Render databases take 15-30s to boot on initial deployment. We retry for up to 60s.
        config.setMaximumPoolSize(10);
        config.setMinimumIdle(2);
        config.setConnectionTimeout(60000);
        config.setInitializationFailTimeout(60000);
        config.setIdleTimeout(300000);
        config.setMaxLifetime(1800000);
        return config;
    }
}
