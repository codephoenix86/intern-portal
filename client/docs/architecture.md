# Architecture

## Tech stack

| Layer | Choice |
|-------|--------|
| Build | Vite, TypeScript |
| UI | React 18, Tailwind CSS, Radix UI primitives (`src/components/ui/`) |
| Routing | React Router v6 (`BrowserRouter` in `src/App.tsx`) |
| Server state | `@tanstack/react-query` is provided in `App.tsx` (`QueryClientProvider`) but most screens still use `useState` + `useEffect` or static data |
| HTTP | Axios (`src/lib/axios.ts`) — JWT in header, refresh-on-401 |

## Application entry

- `src/main.tsx` mounts `App`.
- `src/App.tsx` wraps the tree with:
  1. `QueryClientProvider`
  2. `TooltipProvider`, toast UIs (`Toaster`, Sonner)
  3. `BrowserRouter`
  4. `AuthProvider` (`src/contexts/AuthContext.tsx`)

## Authentication (summary)

- **Access token:** `localStorage` key `accessToken`; sent as `Authorization: Bearer …` on Axios requests.
- **Refresh:** `httpOnly` cookie + `POST /api/auth/refresh`; the Axios response interceptor retries; on failure, redirect to `/login`.
- **OAuth:** Google may return `?token=…` on a dashboard URL; `AuthProvider` stores the token and calls `GET /api/auth/me`.
- **Route guard:** `src/components/auth/ProtectedRoute.tsx` uses `useAuth()` and optional role checks.

Production auth calls use **`src/services/auth.service.ts`**. The file `src/services/authService.ts` is an unused mock.

## Data layer

| Module | Role |
|--------|------|
| `src/lib/axios.ts` | Single Axios instance: `baseURL` = `{VITE_API_URL}/api`, `withCredentials`, interceptors |
| `src/services/auth.service.ts` | Register, login, `/auth/me`, refresh, logout, logout-all, Google URL helper |
| `src/services/jobService.ts` | Internships via `GET /internships` (list, client-side “recommended” and detail) |
| `src/services/session.service.ts` | Mentor sessions CRUD + student join |
| `src/services/applicationService.ts` | **Stub** — not wired to the API |
| `src/services/authService.ts` | **Unused** legacy mock |

Static demo data: `src/data/mockData.ts`, `src/constants/mentor.constant.ts`.

## Top-level routes

Defined in `src/App.tsx`. Detail tables for dashboard children are in [Routing](./routing.md).

| Path | Access | Notes |
|------|--------|--------|
| `/` | Public | Landing |
| `/internships`, `/internships/:id` | Public | Internships (`jobService`) |
| `/about` | Public | About |
| `/login`, `/register` | Public | Auth |
| `/student/*` | student | `StudentDashboard` |
| `/recruiter/*` | recruiter | `RecruiterDashboard` |
| `/mentor/*` | mentor | `MentorDashboard` |
| `*` | — | `NotFound` |

## `src/` directory layout

```
src/
├── App.tsx                 # Routes + global providers
├── main.tsx
├── components/             # Shared layouts, feature widgets, auth, ui/
├── pages/                  # Route screens: auth/, students/, recruiter/, mentor/
├── contexts/               # AuthContext
├── services/               # API wrappers (see Data layer)
├── lib/                    # axios.ts, utils.ts
├── hooks/
├── constants/              # Sidebars, role constants, mocks
├── types/
├── data/                   # mockData.ts
└── test/                   # Vitest
```

## Related docs

- [Routing](./routing.md) — full route ↔ page ↔ data map
- [Components & services](./components-and-services.md) — UI modules and API reference
