# Nest Ecommerce API

A NestJS-based ecommerce REST API with Prisma ORM, PostgreSQL, and Docker.

## Tech Stack

- **Runtime:** Node.js
- **Framework:** NestJS 11
- **ORM:** Prisma 7 (with PostgreSQL adapter)
- **Database:** PostgreSQL 16.
- **Package Manager:** pnpm
- **Containerization:** Docker Compose (Postgres + pgAdmin).

## Prerequisites

- Node.js (v20+)
- pnpm
- Docker & Docker Compose

## Getting Started

Follow these steps in order. Each step depends on the previous one.

### 1. Clone the repository

```bash
git clone <repo-url>
cd nest-ecommerce
```

### 2. Install dependencies

```bash
pnpm install
```

If you don't have pnpm installed, run `npm install -g pnpm` first.

### 3. Configure environment variables

Copy the example file and edit the values:

```bash
cp .env.example .env
```

Open `.env` and update the credentials. At minimum, change `POSTGRES_PASSWORD` and keep `DATABASE_URL` in sync with it:

```env
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your-password-here
POSTGRES_DB=nest_ecommerce
DATABASE_URL="postgresql://postgres:your-password-here@localhost:5432/nest_ecommerce?schema=public"
```

### 4. Start the database with Docker

Make sure Docker Desktop (or Docker daemon) is running, then:

```bash
pnpm run db:up
```

This boots two containers:
- **PostgreSQL** on `localhost:5432`
- **pgAdmin** on [http://localhost:5050](http://localhost:5050) (log in with `PGADMIN_DEFAULT_EMAIL` / `PGADMIN_DEFAULT_PASSWORD`)

Verify the containers are healthy:

```bash
docker ps
```

### 5. Run database migrations

This applies the Prisma schema to your fresh database and creates all tables:

```bash
pnpm run db:migrate
```

### 6. Generate the Prisma client

```bash
pnpm run db:generate
```

Re-run this any time `prisma/schema/*.prisma` changes.

### 7. Start the application

```bash
# Development (hot-reload)
pnpm run start:dev
```

The API is now live at [http://localhost:8000/api/v1](http://localhost:8000/api/v1).

### 8. (Optional) Production build

```bash
pnpm run build
pnpm run start:prod
```

### Stopping the app

Stop the dev server with `Ctrl+C`, then shut down the database containers:

```bash
pnpm run db:down
```

Your data persists in a Docker volume and will still be there next time you run `pnpm run db:up`.

### Troubleshooting

- **Port `5432` already in use:** another Postgres is running locally. Stop it, or change `POSTGRES_PORT` in `.env` (and update `DATABASE_URL` to match).
- **Prisma client errors after schema changes:** run `pnpm run db:generate`, then restart the dev server.
- **Start over with a clean database:** `pnpm run db:reset` drops everything and re-runs migrations.

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

[MIT](LICENSE).
