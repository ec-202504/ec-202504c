FROM openjdk:21

WORKDIR /app

COPY build/libs/ec_site-0.0.1-SNAPSHOT.jar /app/ec_site.jar

ENTRYPOINT ["java", "-jar", "/app/ec_site.jar"]

EXPOSE 8080