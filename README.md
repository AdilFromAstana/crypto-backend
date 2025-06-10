# 🛡 Crypto Wallet Service — Backend на NestJS

Этот проект — backend микросервиса для управления криптокошельками, сделанный на основе **Clean Architecture + DDD** с использованием **NestJS**, **TypeORM**, **PostgreSQL** и **MongoDB** (для логов).

## 🚀 Основные возможности

- 🔐 Регистрация и авторизация с JWT
- 🧾 Управление пользователями и ролями (admin/user)
- 👛 Управление кошельками (создание, просмотр, передача средств)
- 💸 Имитация отправки криптовалют (ETH) между пользователями (mock режим)
- 📊 История транзакций и логгирование действий (MongoDB)
- 🔍 Фильтрация транзакций по пользователям, дате и статусу
- 🧰 Чистая архитектура: Domain, Application, Infrastructure, Interface

## 🧱 Архитектура

Проект реализован по принципам **Clean Architecture**, что делает его легко расширяемым и тестируемым:

```
src/
│
├── application/          # Use-cases (бизнес-логика)
├── domain/               # Entities, интерфейсы репозиториев
├── infrastructure/       # Репозитории, мапперы, ORM-энтити
├── interfaces/           # Controllers, DTO, modules
├── logs/                 # MongoDB-логирование
├── common/               # Общие утилиты и исключения
```

## ⚙️ Технологии

| Стек              | Назначение                            |
|-------------------|----------------------------------------|
| **NestJS**        | Backend Framework                      |
| **TypeORM**       | ORM для PostgreSQL                     |
| **MongoDB**       | Хранение логов                         |
| **JWT**           | Авторизация и refresh-токены          |
| **Clean Architecture** | Чистая разделённая архитектура      |
| **Swagger**       | Документация API                       |

## 🔒 Авторизация

- `POST /auth/register` — регистрация пользователя
- `POST /auth/login` — логин, получение access и refresh токенов
- `POST /auth/refresh` — обновление access токена

## 👤 Пользователи

- `GET /admin/users` — список пользователей (только admin)
- `PATCH /admin/users/:id/toggle` — блокировка пользователя
- `GET /admin/logs` — просмотр логов системы (MongoDB)

## 💰 Транзакции и кошельки

- `POST /wallets/send` — отправка средств (mock)
- `GET /wallets/:id/transactions` — история по кошельку
- `POST /wallets` — создание нового кошелька
- `GET /wallets` — список кошельков пользователя

## 🧪 Тесты

- Покрытие unit-тестами `use-cases` и контроллеров.
- Пример: `transactions.controller.spec.ts`.

## 📦 Установка и запуск

```bash
# Установка зависимостей
npm install

# Запуск в режиме разработки
npm run start:dev

# Запуск тестов
npm run test
```

## 📚 Swagger-документация

После запуска доступна по адресу:

```
http://localhost:3000/docs
```

## ✅ TODO

- [ ] Настоящая интеграция с Ethereum через Ethers.js
- [ ] Валидация баланса и комиссии
- [ ] Подпись транзакций
- [ ] Email/SMS уведомления
- [ ] Admin-панель (отдельный frontend)

## 🧑‍💻 Автор

Разработано в рамках pet-проекта для демонстрации **архитектурных навыков, TypeScript и NestJS**.

## 📄 Лицензия

MIT — свободно использовать и модифицировать.