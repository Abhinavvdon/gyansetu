# ==============================================================================
# Stage 1: Build the React 19 + TypeScript + Vite Frontend
# ==============================================================================
FROM node:20-alpine AS frontend-builder
WORKDIR /app/client

# Copy dependency manifests first for optimal Docker layer caching
COPY client/package*.json ./
RUN npm ci || npm install

# Copy source and build production bundle
COPY client/ ./
RUN npm run build

# ==============================================================================
# Stage 2: Build Spring Boot 3.3.4 (Java 17) JAR with embedded frontend
# ==============================================================================
FROM maven:3.9.6-eclipse-temurin-17-alpine AS backend-builder
WORKDIR /app/server

# Cache Maven dependencies
COPY server/pom.xml ./
RUN mvn dependency:go-offline -B || true

# Copy backend source code
COPY server/src ./src

# Inject pre-built React frontend bundle directly into Spring Boot static resources
COPY --from=frontend-builder /app/client/dist ./src/main/resources/static/

# Package executable JAR
RUN mvn clean package -DskipTests -B

# ==============================================================================
# Stage 3: Lightweight Production JRE Runtime
# ==============================================================================
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Install curl for container health checks
RUN apk add --no-cache curl

# Security: Run as unprivileged non-root user
RUN addgroup -S gyansetu && adduser -S gyansetu -G gyansetu
USER gyansetu:gyansetu

# Copy built application JAR
COPY --from=backend-builder /app/server/target/gyansetu-backend-*.jar app.jar

# Render assigns dynamic port via $PORT (defaults to 10000 on Render)
ENV PORT=10000
EXPOSE ${PORT}

# Tuned for Render Free Tier (512MB RAM constraints):
# - Container-aware memory sizing (75% of container RAM allocated to JVM heap)
# - Fast non-blocking entropy source
ENTRYPOINT ["java", "-XX:+UseContainerSupport", "-XX:MaxRAMPercentage=75.0", "-Djava.security.egd=file:/dev/./urandom", "-jar", "app.jar"]
