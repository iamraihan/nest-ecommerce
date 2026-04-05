# Nest Ecommerce API

A NestJS-based ecommerce REST API with Prisma ORM, PostgreSQL, and Docker.

## Tech Stack

- **Runtime:** Node.js
- **Framework:** NestJS 11
- **ORM:** Prisma 7 (with PostgreSQL adapter)
- **Database:** PostgreSQL 16
- **Package Manager:** pnpm
- **Containerization:** Docker Compose (Postgres + pgAdmin)

## Prerequisites

- Node.js (v20+)
- pnpm
- Docker & Docker Compose

## Getting Started

### 1. Clone & Install

```bash
git clone <repo-url>
cd nest-ecommerce
pnpm install
```

### 2. Environment Setup

```bash
cp .env.example .env
# Edit .env with your values
```

### 3. Start Database

```bash
pnpm run db:up
```

This starts PostgreSQL on port `5432` and pgAdmin on port `5050`.

### 4. Run Migrations & Generate Client

```bash
pnpm run db:migrate
pnpm run db:generate
```

### 5. Start the App

```bash
# Development (watch mode)
pnpm run start:dev

# Production
pnpm run build
pnpm run start:prod
```

The API will be available at `http://localhost:8000/api/v1`.

## Available Scripts

| Script | Description |
|---|---|
| `pnpm run start:dev` | Start in watch mode |
| `pnpm run start:debug` | Start in debug + watch mode |
| `pnpm run build` | Build for production |
| `pnpm run start:prod` | Run production build |
| `pnpm run lint` | Lint and auto-fix |
| `pnpm run format` | Format code with Prettier |
| `pnpm run test` | Run unit tests |
| `pnpm run test:e2e` | Run e2e tests |
| `pnpm run test:cov` | Run tests with coverage |
| `pnpm run db:up` | Start Docker containers |
| `pnpm run db:down` | Stop Docker containers |
| `pnpm run db:migrate` | Run Prisma migrations |
| `pnpm run db:generate` | Generate Prisma client |
| `pnpm run db:studio` | Open Prisma Studio |
| `pnpm run db:reset` | Reset database |

## API Endpoints

Base URL: `http://localhost:8000/api/v1`

### Users

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/users` | Create a user |
| `GET` | `/users` | List users (paginated) |
| `GET` | `/users/:id` | Get user by ID |
| `PATCH` | `/users/:id` | Update user |
| `DELETE` | `/users/:id` | Soft-delete user |

## Project Structure

```
src/
├── common/
│   ├── dto/                  # Shared DTOs (pagination)
│   ├── filters/              # Exception filters (Prisma errors)
│   └── interceptors/         # Response wrapper interceptor
├── config/                   # App & database config, env validation
├── prisma/                   # PrismaService, extensions (soft-delete)
├── users/                    # Users module (controller, service, DTOs)
├── app.module.ts
└── main.ts
prisma/
└── schema/                   # Multi-file Prisma schema
    ├── schema.prisma         # Generator & datasource
    └── user.prisma           # User model, enums
```

## License

[MIT](LICENSE)
