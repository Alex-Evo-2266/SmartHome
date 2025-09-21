export const RABBITMQ_HOST = process.env.RMQ_HOST ?? "localhost"
export const RABBITMQ_PORT = process.env.RMQ_PORT
export const EXCHANGE_SERVICE_DATA = process.env.EXCHANGE_SERVICE_DATA
export const SERVICE_NAME_IN_DATA = "MQTT_messages"

export const PORT = process.env.PORT ?? 3000
export const CONTAINER_NAME = process.env.CONTAINER_NAME ?? "localhost"