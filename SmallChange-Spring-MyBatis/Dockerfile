# Use an official Maven image to build the application
FROM maven:3.8.4-openjdk-17 AS build

# Set the working directory
WORKDIR /home/associate/cloudDeployment/SmallChange-Spring-MyBatis

# Copy the pom.xml file and download dependencies
COPY pom.xml ./
RUN mvn dependency:go-offline

# Copy the rest of the application code
COPY src ./src

# Apply Spring Java format
RUN mvn spring-javaformat:apply

# Package the application
RUN mvn package -DskipTests

# Use an official OpenJDK image to run the application
FROM openjdk:17-slim

# Set the working directory
WORKDIR /home/associate/cloudDeployment/SmallChange-Spring-MyBatis

# Copy the packaged application from the build stage
COPY --from=build /home/associate/cloudDeployment/SmallChange-Spring-MyBatis/target/*.jar app.jar

# Expose the port the app runs on
EXPOSE 8080

# Command to run the application
CMD ["java", "-jar", "app.jar"]
