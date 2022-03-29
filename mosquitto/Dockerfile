FROM eclipse-mosquitto:latest

ARG MOSQUITTO_USER

ARG MOSQUITTO_PASSWD

COPY ./config/mosquitto.conf /mosquitto/config/mosquitto.conf

RUN > /mosquitto/config/passwd

RUN mosquitto_passwd -b /mosquitto/config/passwd $MOSQUITTO_USER $MOSQUITTO_PASSWD
