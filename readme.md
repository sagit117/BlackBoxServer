## Проект для быстрого запуска бэкенд сервисов на nodejs и express

###_Для конфигурации приложения необходимо в корне разместить файл configApp.json_
####пример конфига
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

