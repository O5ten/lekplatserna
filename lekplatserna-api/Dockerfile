FROM java:8

ADD target/lekplatserna-api.jar /
ADD target/.api-config /

EXPOSE 4567
ENTRYPOINT ["java", "-jar", "lekplatserna-api.jar"]
