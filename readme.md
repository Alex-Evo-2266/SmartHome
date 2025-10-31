# SmartHome
Умный дом мой проект на React и FastAPI

---

## Установка и запуск

Для работы системы нужен Doker.
* [docker installation](https://docs.docker.com/engine/install/ubuntu/)


### Установка в докер.

Сначала клонируем репозиторий.

``` bash
git clone https://github.com/Alex-Evo-2266/SmartHome.git SmartHome 
cd SmartHome
```

Затем открываем .env и меняем стандартные пароли для баз данных и mqtt
``` conf
MYSQL_ROOT_PASSWORD='' <--
MYSQL_DATABASE='SmartHome'
MYSQL_USER='' <--
MYSQL_PASSWORD='' <--

SMARTHOME_BD_HOST='sh_db'
SMARTHOME_BD_PORT='3306'

HOST='127.0.0.1:1337'

# Configurate

# CONFIGURATE_DIR='../../Configurate'

# auth
MYSQL_AUTH_ROOT_PASSWORD='' <--
MYSQL_AUTH_DATABASE='SmartHomeAuth'
MYSQL_AUTH_USER='' <--
MYSQL_AUTH_PASSWORD='' <--

AUTH_BD_HOST='sh_auth_db'
AUTH_BD_PORT='3306'

AUTH_SERVICE_DIR='./AuthService'

AUTH_PIVILEGES='device,room,automation,modules_manager,page'

# mamager

MENEGER_SERVICE_DIR='./ModuleManeger'

# email
EMAIL_TOPIK='email'
EMAIL_QUEUE='email'

#rabbit
RABITMQ_HOST='rabbitmq'
RABITMQ_PORT='5672'
RABITMQ_OUT_PORT='15600'

#data
DATA_QUEUE="deviceServerData"
DATA_DEVICE_QUEUE="deviceServerDataDevice"
DATA_LISTEN_QUEUE="deviceServerReturnData"
DATA_TOPIC="deviceServerData"
DEVICE_VALUE_SEND="deviceSetValue"

EXCHANGE_DEVICE_DATA="exchangeDeviceData"
EXCHANGE_ROOM_DATA="exchangeRoomData"
EXCHANGE_SERVICE_DATA="exchangeServiceData"

# mqtt
MOSQUITTO_USER='' <--
MOSQUITTO_PASSWD='' <--

# script
DATA_SCRIPT="scriptData"

MYSQL_SCRIPT_ROOT_PASSWORD='' <--
MYSQL_SCRIPT_DATABASE='SmartHomeScript'
MYSQL_SCRIPT_USER='' <--
MYSQL_SCRIPT_PASSWORD='' <--

SMARTHOME_SCRIPT_BD_PORT='3306'
SMARTHOME_SCRIPT_BD_HOST='sh_db_script'

# page
MYSQL_PAGE_ROOT_PASSWORD='' <--
MYSQL_PAGE_DATABASE='SmartHomePage'
MYSQL_PAGE_USER='' <--
MYSQL_PAGE_PASSWORD='' <--

SMARTHOME_PAGE_BD_PORT='3306'
SMARTHOME_PAGE_BD_HOST='sh_page_db'


NETWORK_NAME='sh-network'
```

#### Далее запускаем установку необходимых программ
``` bash
bash ./script/setup_all.sh
```
#### Собираем проект
``` bash
bash ./script/build.sh
```
#### Запускаем
``` bash
bash ./script/run.sh

```