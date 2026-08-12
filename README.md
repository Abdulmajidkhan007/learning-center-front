# Cornerstone Learning Centre — frontend

Admin and teacher web client for the Cornerstone Learning Centre. It talks to a
Spring backend over `/api/v1/**` and renders a different dashboard per role:

| Role            | What they get                                                        |
| --------------- | -------------------------------------------------------------------- |
| `ADMINISTRATOR` | CRUD over Students, Teachers, Groups, Lessons + record counts        |
| `TEACHER`       | Own groups, roster, "Start lesson", attendance                       |
| anything else   | Placeholder screen (`StudentDashboard` / `SuperAdminDashboard` are stubs) |

## Stack

- **React 19** + **React Router 7**
- **TypeScript 6** (strict) — the whole `src/` tree is `.ts` / `.tsx`
- **Vite 8** for dev server and build
- **ESLint 10** (flat config) with `typescript-eslint`
- No CSS files: every screen styles itself with inline style objects
  (`const s = { … } satisfies Record<string, CSSProperties>`) plus a small
  `<style>` block for `:hover` / `@keyframes`, which inline styles can't express.

## Getting started

```bash
npm install
npm run dev      # http://localhost:5173
```

The dev server proxies `/api` to `http://localhost:8080`, so the backend has to
be running there or every request fails with `ECONNREFUSED`. To point at a
different backend, change the `server.proxy` target in `vite.config.ts`.

## Scripts

| Command             | What it does                                        |
| ------------------- | --------------------------------------------------- |
| `npm run dev`       | Vite dev server on port 5173 with `/api` proxy       |
| `npm run typecheck` | `tsc -b` — type errors only, no output emitted       |
| `npm run build`     | `tsc -b && vite build` → `dist/`                     |
| `npm run lint`      | ESLint over `**/*.{ts,tsx}`                          |
| `npm run preview`   | Serve the built `dist/` locally                      |

> `npm run lint` currently exits non-zero on 5 pre-existing `react-hooks`
> findings in `AdminDashboard.tsx` and `AttendancePage.tsx` (`set-state-in-effect`,
> `immutability`, `no-empty`). They were already there before the TypeScript
> migration and are untouched by it — fixing them means changing runtime
> behaviour, which is its own task.

## Layout

```
src/
  main.tsx              app entry, mounts <App/>
  App.tsx               refresh-token bootstrap, auth state, role routing
  AuthContext.ts        session + logout for the standalone attendance route
  types.ts              every backend DTO shape, in one place
  utils/jwt.ts          unverified JWT payload decode (for role routing only)
  pages/
    Login.tsx
    AdminDashboard.tsx      generic CRUD table over four entities
    TeacherDashboard.tsx    group switcher, roster, start lesson
    AttendancePage.tsx      attendance grid, standalone or embedded
    StudentDashboard.tsx        stub
    SuperAdminDashboard.tsx     stub
```

## Auth flow

1. On load `App.tsx` POSTs `/api/v1/auth/refresh-token` with `credentials: 'include'`
   so the httpOnly refresh cookie can mint a fresh access token.
2. The access token's payload is decoded client-side **without signature
   verification** (`utils/jwt.ts`) purely to read `role` and pick a dashboard.
   Authorisation is the backend's job — never gate anything sensitive on this.
3. Every page-level request sends `Authorization: Bearer <token>` through its
   local `authFetch` helper.

Tokens live in React state only. There is nothing in `localStorage`, and no
secrets belong in this repo — the app has no build-time configuration beyond
the proxy target.

## TypeScript conventions

Types are documented in [`docs/typescript.md`](docs/typescript.md) — read it
before adding a page or wiring up a new endpoint. The short version:

- All DTO shapes go in `src/types.ts`, not next to the component that fetches them.
- Fields are optional (`?`) until the real backend DTO is confirmed.
- `authFetch<T>()` returns `T | null` — the `null` is real (some endpoints
  answer `200` with an empty body), so handle it.
- Style objects end with `satisfies Record<string, CSSProperties>`, never a
  type annotation, so keys stay literal and typos fail the build.
