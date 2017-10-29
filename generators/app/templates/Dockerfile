FROM maven:3.5-jdk-8 as builder

WORKDIR /projects/java/<%=baseName%>

COPY . /projects/java/<%=baseName%>

RUN mvn clean install -DskipTests 

FROM openjdk:alpine

VOLUME /tmp

COPY entrypoint.sh /

COPY --from=builder /projects/java/<%=baseName%>/target/*.jar app.jar

RUN apk add --update bash && rm -rf /var/cache/apk/* \
    && bash -c 'touch /app.jar' \
    && chmod 700 /entrypoint.sh

ENTRYPOINT ["./entrypoint.sh"]

CMD ["start"]