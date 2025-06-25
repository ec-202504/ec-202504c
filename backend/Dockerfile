FROM openjdk:21

WORKDIR /app

COPY build/libs/ec_site-0.0.1-SNAPSHOT.jar /app/ec_site.jar
COPY private_key.pem /app/key/private_key.pem
COPY public_key.pem /app/key/public_key.pem

ENTRYPOINT ["java", "-jar", "/app/ec_site.jar"]

EXPOSE 8080