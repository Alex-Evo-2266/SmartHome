
BASE_DIR="$(dirname "$(realpath "$0")")/.."

export $(grep -v '^#' $BASE_DIR/.env | xargs)

# Создаём сеть, если её ещё нет
if ! docker network ls | grep -q "^.*${NETWORK_NAME}.*$"; then
  echo "Создаём сеть ${NETWORK_NAME}..."
  docker network create "${NETWORK_NAME}"
  else
  echo "сеть ${NETWORK_NAME} уже создана"

fi