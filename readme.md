# SmartHome
Smart home system project implemented on FastAPI and React.

---

## Deployment

Deployment requires docker and docker-compass to be installed.
* [docker installation](https://docs.docker.com/engine/install/ubuntu/)
* [installing docker on raspberry pi](https://jfrog.com/connect/post/install-docker-compose-on-raspberry-pi/)

### deployment to docker.

Clone the repository.

``` bash
git clone https://github.com/Alex-Evo-2266/SmartHomePython.git SmartHome 
cd SmartHome
```

In the .env file, you need to fill in the fields:
```
MYSQL_ROOT_PASSWORD=''
MYSQL_DATABASE=''
MYSQL_USER=''
MYSQL_PASSWORD=''

SMARTHOME_BD_HOST=sh_db
SMARTHOME_BD_PORT=3306

MOSQUITTO_USER=''
MOSQUITTO_PASSWD=''

HOST=''
```
* SMARTHOME_BD_HOST - The host on which the database server is running. Leave by default.
* SMARTHOME_BD_PORT - The port on which the database server is running. Leave by default.
* MOSQUITTO_USER - login to connect to mqtt
* MOSQUITTO_PASSWD - password to connect to mqtt
* HOST - Host and port on which the server is running. For example: 192.168.0.7:1337

#### Config docker-compose

``` bash
nano docker-compose.yml
```
Raspberry pi config:
``` yml
...
services:
  sh_db:
    # image: mariadb
    image: 459below/mariadb-armv7:latest
    restart: always
...
```
for the rest:
``` yml
...
services:
  sh_db:
    image: mariadb
    # image: 459below/mariadb-armv7:latest
    restart: always
...
```
##### Run build
``` bash
docker-compose --env-file .env build
```
##### Run system
``` bash
docker-compose --env-file .env up -d
```