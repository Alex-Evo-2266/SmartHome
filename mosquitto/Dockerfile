FROM eclipse-mosquitto:latest

COPY ./config/mosquitto.conf /mosquitto/config/mosquitto.conf

RUN > /mosquitto/config/passwd

RUN mosquitto_passwd -b /mosquitto/config/passwd admin admin
