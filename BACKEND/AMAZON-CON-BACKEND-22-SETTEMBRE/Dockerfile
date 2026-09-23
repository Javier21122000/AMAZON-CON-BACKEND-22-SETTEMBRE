FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml ./
RUN mvn -B dependency:go-offline
COPY src ./src
RUN mvn -B -DskipTests package

FROM eclipse-temurin:17-jre-jammy
WORKDIR /app
COPY --from=build /app/target/AMAZON-CON-BACKEND-22-SETTEMBRE-0.0.1-SNAPSHOT.jar app.jar
ENV SPRING_PROFILES_ACTIVE=production
ENV JAVA_TOOL_OPTIONS="-XX:MaxRAMPercentage=65.0"
EXPOSE 10000
USER 10001
ENTRYPOINT ["java", "-jar", "app.jar"]
