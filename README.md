# TDD MOOC: Full-Stack To-Do App

This repository implements the Exercise 5 full-stack To-Do app with a TDD-first workflow.

## Stack

- Frontend: React + Vite + Vitest + Testing Library
- Backend: Fastify + PostgreSQL + Vitest
- End-to-end: Playwright(exactly one e2e test)
- Deployment: Docker Compose (`web`, `api`, `db`)

## Implemented Features

- Add a to-do item
- Rename a to-do item
- Mark a todo item completed
- Archive all completed to-do items

## API Routes

- `GET /api/todos` -> `{ items: Todo[] }`
- `POST /api/todos` with `{ title }` -> `201 { item: Todo }`
- `PATCH /api/todos/:id/title` with `{ title }` -> `{ item: Todo }`
- `PATCH /api/todos/:id/completed` with `{ completed }` -> `{ item: Todo }`
- `POST /api/todos/archive-completed` -> `{ archivedCount: number }`

`Todo` fields:

- `id: string`
- `title: string`
- `completed: boolean`
- `archived: boolean`

## Prerequisites

- Node.js >= 20
- npm >= 10
- Docker

## Install

```bash
npm install
```

## Test Commands

Unit tests (frontend + backend unit):

```bash
npm run test:unit
```

API tests (routing/validation, DB-independent):

```bash
npm run test:api
```

Database integration tests (repository/SQL, API-independent):

```bash
docker compose up -d db
npm run test:integration
```

This uses PostgreSQL exposed on `localhost:55432` by Docker Compose.

Single end-to-end test (full Dockerized app):

```bash
docker compose up -d --build
npm run test:e2e
```

## Run With Docker

```bash
docker compose up -d --build
```

- Frontend: `http://localhost:8080`
- Backend: `http://localhost:8081`

Stop:

```bash
docker compose down
```

## Test Layer Separation

- UI tests do not call real API HTTP.
- API tests do not connect to PostgreSQL.
- DB tests do not start HTTP server.
- One Playwright e2e test validates full system wiring.
