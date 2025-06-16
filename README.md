# Simple express API with PostgreSQL and static file service

## Описание

Простая реализация REST-API с CRUD операциями для работы с пользователями и постами.<br>
Также реализована раздача статических файлов из папки static по роуту `/static/<imageName>`<br>
Пример использования:

```
http://localhost:5000/static/982820dd-b97a-44f6-8e03-6df854942fa1.jpg
```

## Начало работы

1. Создать БД в PostgreSQL
2. Скопировать `.env.example` и переименовать копию в `.env`, настроить.
3. `npm install`
4. `npm run migrate` - для создания таблиц в БД и миграций
