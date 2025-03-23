# Use Amazon Corretto JDK 17 with Alpine Linux
FROM amazoncorretto:17.0.10-alpine as build

# Set the working directory
WORKDIR /app

# Copy the Maven wrapper and pom.xml for dependencies
COPY mvnw pom.xml ./
COPY .mvn .mvn

# Copy the source code
COPY src ./src

# Build the JAR file
RUN ./mvnw package -DskipTests

# Use a minimal JRE for the final image
FROM amazoncorretto:17.0.10-alpine

WORKDIR /app

# Copy the JAR from the build stage
COPY --from=build /app/target/todo-0.0.1-SNAPSHOT.jar app.jar

# Expose the backend port
EXPOSE 8080

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]