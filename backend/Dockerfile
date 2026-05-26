FROM eclipse-temurin:21-jdk-jammy
ARG JAR_FILE=target/backend-0.0.1.jar
COPY ${JAR_FILE} backend.jar
EXPOSE 8081
ENTRYPOINT ["java", "-jar", "backend.jar"]