# ==============================================================================
# Stage 1: Build Spring Boot 3.3.4 (Java 17) JAR with embedded frontend
# ==============================================================================
FROM maven:3.9.6-eclipse-temurin-17-alpine AS builder
WORKDIR /app

# Cache Maven dependencies
COPY server/pom.xml ./
RUN mvn dependency:go-offline -B || true

# Copy backend source code (including static resources bundle)
COPY server/src ./src

# Package production executable JAR
RUN mvn clean package -DskipTests -B

# ==============================================================================
# Stage 2: Ultra-Lightweight Production JRE Runtime
# ==============================================================================
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Install curl for container health checks
RUN apk add --no-cache curl

# Security: Set up non-root user and ensure directory ownership
RUN addgroup -S gyansetu && adduser -S gyansetu -G gyansetu && \
    mkdir -p /app && chown -R gyansetu:gyansetu /app

USER gyansetu:gyansetu

# Copy built application JAR with non-root ownership
COPY --chown=gyansetu:gyansetu --from=builder /app/target/gyansetu-backend-*.jar /app/app.jar

# Render dynamic port binding (defaults to 10000 on Render)
ENV PORT=10000
EXPOSE ${PORT}

# Tuned for Render Free Tier (512MB RAM constraints):
ENTRYPOINT ["sh", "-c", "java -XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0 -Dserver.port=${PORT:-10000} -Djava.security.egd=file:/dev/./urandom -jar /app/app.jar"]
