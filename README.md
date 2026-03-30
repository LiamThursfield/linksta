# Linksta

Linksta is a simple "link-in-bio" application that allows users to have a basic page displaying all of their links in one place.

## Architecture

This is a full-stack monorepo managed with **pnpm workspaces** and powered by **Vite+** for the ultimate Developer Experience (DX).

- **Frontend:** Svelte + Tailwind CSS (in `apps/website`)
- **Backend:** Fastify + Kysely with PostgreSQL (in `apps/api`)

## Prerequisites

- [pnpm](https://pnpm.io/)
- [Vite+](https://viteplus.dev/) (`vp`)
- PostgreSQL

## Getting Started

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Setup the Backend
   - Navigate to the `apps/api` directory.
   - Copy the `.env.example` file to `.env`:
     ```bash
     cd apps/api
     cp .env.example .env
     ```
   - Start the PostgreSQL database using Docker:
     ```bash
     docker compose up -d
     ```
   - Run database migrations and seeders. You can run them together using the setup script:
     ```bash
     pnpm run db:setup
     ```
     *(Alternatively, you can run them separately using `pnpm run migrate` and `pnpm run seed`)*
   - Start the API server:
     ```bash
     pnpm dev --port=3000
     ```

3. Setup the Frontend
   - Navigate to the `apps/website` directory.
   - Start the frontend server:
     ```bash
     cd apps/website
     pnpm dev
     ```