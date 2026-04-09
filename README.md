# Log Viewer

A web app for browsing and filtering Traefik logs. Built with NestJS (backend) and React + Vite (frontend).

## Getting started

```bash
npm install   # installs everything (root + backend + frontend)
npm run dev   # starts both services with mock data
```

Frontend: http://localhost:5173  
Backend API + Swagger: http://localhost:3000/swagger

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start both services with mock data (`USE_MOCK=true`) |
| `npm run build` | Build both for production |
| `npm run test` | Run all tests |
| `npm run lint` | Lint both projects |

Individual project scripts are available from within `log-view-back/` and `log-view-front/` directories.

## Configuration

Copy `.env.example` to `.env` before running with a real log file:

| Variable | Default | Description |
|---|---|---|
| `USE_MOCK` | `false` | Use hardcoded mock data instead of a real log file |
| `LOG_PATH` | `""` | Absolute path to a Traefik log file on the host |
| `PORT` | `3000` | Backend HTTP port |

## Deployment

Docker Compose with Traefik reverse proxy:

```bash
cp .env.example .env   # fill in HOST_LOG_PATH and PORT
docker compose up -d
```

The frontend is served by nginx and proxies `/api/` to the backend. Traefik handles TLS via Let's Encrypt.

## Architecture

- **Backend** — NestJS reads a Traefik log file at startup, parses it line-by-line into an in-memory SQLite database, and exposes `GET /api/logs` with cursor-based pagination and filtering by level and date range.
- **Frontend** — React with TanStack Query, Tailwind CSS for styling. Filter state lives in `useFilters()`, data fetching in `useLogs()`.
