## Проект для быстрого запуска бэкенд сервисов на nodejs и express

### Установка

> npm install blackbox_server @types/express

### В текущей версии поддерживаются 
#### базы данных:
> MongoDB

#### каналы связи:
> WebSocket

> RabbitMQ


### Для конфигурации приложения необходимо в корне разместить файл configApp.json

#### пример конфига

```json
{
    "PORT": 8080,
    "DB_HOST": "localhost",
    "DB_PORT": 27017,
    "DB_USER": "user_name",
    "DB_PASSWORD": "secret",
    "DB_NAME": "db_name",
    "DB_STRING_OPTIONS": "?authSource=db_name",
    "USE_RABBIT": true,
    "RABBITMQ_URL": "amqp://root:password@localhost:5672",
    "RABBITMQ_RECEIVE_QUEUE_NAME": "q_name",
    "RABBITMQ_RECEIVE_EXCHANGE": "ex_name",
    "RABBITMQ_RECEIVE_ROUTING_KEY": "k_name",
    "RABBITMQ_RECEIVE_BIND_XMTTL": 600000,
    "USE_WS": true,
    "HEADERS": [
        {
            "key": "Access-Control-Allow-Origin",
            "value": "*"
        },
        {
            "key": "Access-Control-Allow-Methods",
            "value": "GET,PUT,POST,DELETE,PATCH,OPTIONS"
        },
        {
            "key": "Access-Control-Allow-Headers",
            "value": "Content-Type"
        }
    ]
}
```

#### Функция для чтение настроек

```typescript
export function BlackBoxGetConfig<T>(): T
```

### Подключение основного модуля сервера

```js
import { createApp } from 'blackbox_server'

const BASE_PATH = process.env.BASE_PATH || ''
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

### Слушатель(логгер) ошибок

```js
App.emit('errorLog', error, 'Reason')
```

### Слушатель(логгер) событий

```js
App.emit('eventLog', 'EVENT', 'Message')
```

### Маршрутизация

```js
import {
    createApp,
    notFound,
    onErrorAfterResponse,
    onErrorRequest,
} from 'blackbox_server'

/**
 * Обработка маршрутов
 */
App.use(`${BASE_PATH}/router`, Router)

/**
 * Обработка ошибок в маршрутах
 */
// 404
App.use(notFound)
// errors
App.use(onErrorRequest)
App.use(onErrorAfterResponse)
```

### Подключение роутера

```js
import { BlackBoxRouter } from 'blackbox_server'
import Controller from '../../controllers/LoginController'

const Router = BlackBoxRouter()

Router.post('/v1/get-token', (request, response, next) =>
    new Controller(request, response, next).getToken()
)

export default Router
```

### Подключение контроллера

```js
import { BlackBoxBaseController } from 'blackbox_server'

export default class LoginController extends BlackBoxBaseController() {
    constructor(request, response, _next) {
        super(request, response)
    }

    getToken() {}
}
```

### Подключение сервиса для моделей

```js
import { BlackBoxBaseServiceModel } from 'blackbox_server'
import { IUsersModel } from '../../models/UsersModel/users-model'
import UsersModel from '../../models/UsersModel'

class UsersService extends BlackBoxBaseServiceModel() {
    constructor(Model: IUsersModel) {
        super(Model)
    }
}

export default new UsersService(UsersModel)
```

### Работа с ошибками в запросах

#### все возможные классы ошибок указаны в index.d.ts

```js
import { BlackBoxHttpValidationException } from 'blackbox_server'

// валидация email
if (!testEmail(userData?.email)) {
    const error = BlackBoxHttpValidationException()

    throw new error('Ошибка валидации email', this.response)
}
```

### Перечисление событий сервера

```typescript
enum BlackBoxEventName {
    CLIENT_REQUEST = 'CLIENT_REQUEST',
    SERVER_IS_RUNNING = 'SERVER_IS_RUNNING',
    SERVER_IS_STOPPED = 'SERVER_IS_STOPPED',
    DB_IS_CONNECTED = 'DB_IS_CONNECTED',
    AMQP_IS_RECONNECTING = 'AMQP_IS_RECONNECTING',
    AMQP_IS_CONNECTED = 'AMQP_IS_CONNECTED',
    AMQP_CHANNEL_IS_CLOSED = 'AMQP_CHANNEL_IS_CLOSED',
    AMQP_WORKER_IS_STARTED = 'AMQP_WORKER_IS_STARTED',
}
```

### Перечисления кодов ответа сервера

```typescript
enum BlackBoxStatusCode {
    OK = 200,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    TOO_MANY_REQUESTS = 429,
    INTERNAL_SERVER_ERROR = 500,
}
```

### Перечисления причин ошибок

```typescript
enum BlackBoxReasonErro {
    REQUEST = 'REQUEST',
    AMQP = 'AMQP',
    AMQP_CHANNEL = 'AMQP_CHANNEL',
    SOCKET = 'SOCKET',
    CONTROLLER = 'CONTROLLER',
}
```

### Использование декораторов

#### все возможные декораторы указаны в index.d.ts

```typescript
import {
    BlackBoxBaseController,
    checkAccessIp,
} from 'blackbox_server'

export default class UsersController extends BlackBoxBaseController() {
    constructor(request, response, next) {
        super(request, response, next)
    }

    /**
     * Регистрация пользователя по email
     */
    @checkAccessIp(5, 60000, 'error message')
    registrationByEmail() {
    }
}
```
