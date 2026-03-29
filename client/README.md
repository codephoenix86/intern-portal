# Career Navigator — Client

React (Vite + TypeScript) front end: public marketing pages, email/password and OAuth auth, and three role-based dashboards (student, recruiter, mentor).

## Documentation

| | |
|---|---|
| **Index** | [`docs/README.md`](./docs/README.md) — table of contents for all client docs |
| **Architecture** | [`docs/architecture.md`](./docs/architecture.md) — stack, entry points, auth, HTTP layer, `src/` layout |
| **Routing** | [`docs/routing.md`](./docs/routing.md) — routes, pages, and where each screen loads data |
| **Components & services** | [`docs/components-and-services.md`](./docs/components-and-services.md) — UI modules and API map |

## Prerequisites

- Node.js 18+ (recommended)
- Backend API running if you use live data (default: `http://localhost:5000`)

## Environment

| Variable | Purpose |
|----------|---------|
| `VITE_API_URL` | Backend base URL (no trailing slash). Defaults to `http://localhost:5000`. |

Axios uses `{VITE_API_URL}/api` — see `src/lib/axios.ts`.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Vite dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm run lint` | ESLint |
| `npm test` | Vitest |

## Source layout (overview)

```
client/
├── docs/                    # Documentation (start at docs/README.md)
├── src/
│   ├── App.tsx              # Routes + providers
│   ├── main.tsx
│   ├── components/          # Layouts, features, ui/
│   ├── pages/               # Route screens
│   ├── contexts/            # AuthContext
│   ├── services/            # API wrappers
│   ├── lib/                 # axios, utils
│   ├── hooks/, constants/, types/, data/, test/
├── package.json
└── README.md                # This file
```

For full detail, see [`docs/architecture.md`](./docs/architecture.md).
