# Standalone Spring Boot Backend Dockerfile for Render
FROM maven:3.9.6-eclipse-temurin-17-alpine AS builder
WORKDIR /app

COPY pom.xml ./
RUN mvn dependency:go-offline -B || true

COPY src ./src
RUN mvn clean package -DskipTests -B

FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

RUN apk add --no-cache curl
RUN addgroup -S gyansetu && adduser -S gyansetu -G gyansetu
USER gyansetu:gyansetu

COPY --from=builder /app/target/gyansetu-backend-*.jar app.jar

ENV PORT=10000
EXPOSE ${PORT}

ENTRYPOINT ["java", "-XX:+UseContainerSupport", "-XX:MaxRAMPercentage=75.0", "-Djava.security.egd=file:/dev/./urandom", "-jar", "app.jar"]
