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

2. Start the development servers:

   ```bash
   vp dev
   # or
   pnpm dev
   ```

3. Type-checking, formatting, and linting:

   ```bash
   vp check
   ```

4. Run tests:
   ```bash
   vp test
   ```
