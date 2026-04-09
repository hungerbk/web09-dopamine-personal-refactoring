# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Murphy** is a full-stack collaborative decision-making app ("발산은 자유롭게, 수렴은 명확하게!"). Users brainstorm ideas on a shared canvas, AI clusters similar ideas via Naver CLOVA API, and teams vote to converge on decisions. Built by Boostcamp's Dopamine team.

## Commands

```bash
# Development
yarn install
yarn docker:up        # Start MySQL 8.0 + Redis 7.0 (requires Docker)
yarn db:update        # prisma generate + migrate dev
yarn dev              # http://localhost:3000

# Build & Lint
yarn build
yarn lint
yarn format

# Testing
yarn test                          # All unit tests
yarn test -- <file> -t "<name>"   # Single file / specific test case
yarn test:watch -- <file>          # Watch mode for single file
yarn test:be:cov                   # Backend coverage (API, lib, utils)
yarn test:fe:cov                   # Frontend coverage (hooks, components)
yarn test:e2e                      # Playwright E2E
yarn test:e2e:ui                   # Playwright with UI

# Database
yarn db:push           # Push schema without migrations
yarn db:seed           # Seed database
yarn prisma:studio     # Open Prisma Studio GUI
```

## Architecture

### Stack

- **Framework:** Next.js 16 (React 19) + TypeScript
- **Styling:** Tailwind CSS + class-variance-authority
- **State:** Zustand 5 (UI/canvas state) + TanStack Query v5 (server state)
- **Real-time:** Server-Sent Events (SSE) for live collaboration
- **Auth:** NextAuth v4 + OAuth (Google, GitHub, Naver)
- **DB:** MySQL 8.0 via Prisma ORM (MariaDB adapter) + Redis 7.0 (ioredis)
- **AI:** Naver CLOVA API for idea categorization
- **Testing:** Jest 29 + Testing Library, Playwright E2E

### Layer Structure

Requests flow through a strict 4-layer stack:

```
Next.js API Routes (src/app/api/)
  → Service Layer (src/lib/services/)
    → Repository Layer (src/lib/repositories/)
      → Prisma ORM → MySQL
```

- **API routes** handle HTTP, call one service function, return standardized responses via `createErrorResponse` / `createSuccessResponse` helpers.
- **Services** contain business logic and use Prisma transactions (`.transaction()`) for atomicity — especially in voting and categorization.
- **Repositories** are data-access abstractions — query builders per entity (idea, vote, category, etc.).
- **Utilities** live in `src/lib/utils/` — API helpers, Korean text processing (es-hangul), word-cloud logic, sort/filter utilities.

### Frontend Structure

```
src/app/
  (full-layout)/      # Pages without sidebar (landing, auth)
  (sidebar-layout)/   # Main app pages with sidebar
    projects/         # Project list
    issues/[id]/      # Main brainstorm canvas
    topics/           # Topic overview
    mypage/
src/components/       # Shared UI components
src/issues/           # Issue-specific feature module
  store/              # Zustand stores: canvas, comments, SSE, idea cards
```

The `src/issues/` directory is the most complex part — it owns the real-time collaborative canvas. SSE connections are managed in `src/lib/sse/` and broadcast AI categorization results and idea updates to all connected users.

### Data Model

Core entities: `User → Project → Issue → Idea → Vote / Comment / Category`. Soft delete pattern (`deletedAt`) is used across models — always filter by `deletedAt: null` in queries.

### Real-time Collaboration

SSE streams live under `src/app/api/.../sse/` routes. The `src/lib/sse/` module manages per-issue broadcast channels. When a user submits/edits/votes, the change is persisted then broadcast to all connected clients via SSE — triggering TanStack Query cache invalidations on the frontend.

### Path Aliases

`@/*` maps to `src/*` — use this consistently throughout the codebase.

## Environment Setup

Copy `.env.example` to `.env` and fill in:
- `DATABASE_URL` — MySQL connection string
- `REDIS_URL` — Redis connection string
- `NEXTAUTH_SECRET` — Random secret for NextAuth
- `CLOVA_API_*` — Naver CLOVA Studio credentials for AI categorization
- OAuth credentials for Google, GitHub, Naver providers
