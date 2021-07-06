## Проект для быстрого запуска бэкенд сервисов на nodejs и express

### Установка

> npm install blackbox_server @types/express

### Для конфигурации приложения необходимо в корне разместить файл configApp.json
#### пример конфига
```json
{
  "PORT":8080,
  "DB_HOST":"localhost",
  "DB_PORT":27017,
  "DB_USER":"user_name",
  "DB_PASSWORD":"secret",
  "DB_NAME":"db_name",
  "DB_STRING_OPTIONS":"?authSource=db_name",
  "USE_RABBIT": false,
  "RABBITMQ_URL":"amqp://root:password@localhost:5672",
  "RABBITMQ_RECEIVE_QUEUE_NAME":"q_name",
  "RABBITMQ_RECEIVE_EXCHANGE":"ex_name",
  "RABBITMQ_RECEIVE_ROUTING_KEY":"k_name",
  "RABBITMQ_RECEIVE_BIND_XMTTL":600000,
  "USE_WS": false
}
```

### Подключение основного модуля сервера

```js
import { createApp } from "blackbox_server"

const BASE_PATH = process.env.BASE_PATH
const NODE_ENV = process.env.NODE_ENV

const App = createApp({ BASE_PATH, NODE_ENV })

export default App
```

### Слушатели rabbit

```js
/**
 * Перехват статуса полученного от rabbitMQ
 * @param msg - сообщение от rabbitMQ
 */
App.addListener('getMessageRabbit', (msg) => {
    const str: string = msg.content.toString()

    console.log(str)
})
```

### Слушатели websocket

```js
/**
 * Перехват нового подключения к ws
 */
App.addListener('wsConnecting', (ws: WebSocket) => {
    ws.send('hello')
})

/**
 * Перехват получения сообщения от ws
 */
App.addListener('getMessageFromWS', (ws: WebSocket, message: string) => {
    console.log(message)
})
```

### Маршрутизация

```js
import { createApp, notFound, onErrorAfterResponse } from 'blackbox_server'

/**
 * Обработка маршрутов
 */
App.use(`${BASE_PATH}/router`, Router)

// 404
App.use(notFound)
// errors
App.use(onErrorAfterResponse)

```

