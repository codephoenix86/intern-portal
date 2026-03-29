# Career Navigator — API Server

Express + TypeScript + MongoDB backend for InternPortal / Career Navigator. This service handles authentication (including Google OAuth), mentor live sessions, student internships and applications, recruiter job listings and applicant management, notifications, and static delivery of uploaded resumes.

---

## Contents

- [Requirements](#requirements)
- [Setup](#setup)
- [Running](#running)
- [Environment variables](#environment-variables)
- [Architecture](#architecture)
- [Project layout](#project-layout)
- [API documentation](#api-documentation)
- [Domain notes](#domain-notes)

---

## Requirements

- **Node.js** 20+ (or current LTS)
- **MongoDB** instance (local or Atlas)
- **npm** (or compatible package manager)

---

## Setup

```bash
cd server
npm install
```

Create a `.env` file in this directory (see [Environment variables](#environment-variables)). Ensure MongoDB is reachable before starting the app.

---

## Running

| Command        | Description                          |
|----------------|--------------------------------------|
| `npm run dev`  | Development server with hot reload (`tsx watch`) |
| `npm run build`| Compile TypeScript to `dist/`       |
| `npm start`    | Run compiled output (`node dist/index.js`) |
| `npm run typecheck` | Type-check without emitting files |

Default HTTP port is **5000** unless `PORT` is set.

---

## Environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| `MONGODB_URI` | Yes | MongoDB connection string |
| `ACCESS_TOKEN_SECRET` | Yes | Secret for signing short-lived JWT access tokens |
| `REFRESH_TOKEN_SECRET` | Yes | Secret for refresh tokens |
| `GOOGLE_CLIENT_ID` | Yes* | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Yes* | Google OAuth client secret |
| `GOOGLE_REDIRECT_URI` | No | Defaults to `http://localhost:5000/api/auth/google/callback` |
| `CLIENT_URL` | No | Allowed CORS origin; defaults to `http://localhost:5173` |
| `PORT` | No | Server port; defaults to `5000` |
| `NODE_ENV` | No | `development` or `production` |
| `ACCESS_TOKEN_EXPIRY` | No | Default `15m` |
| `REFRESH_TOKEN_EXPIRY` | No | Default `7d` |

\*Required if Google sign-in is used. Local email/password auth still works with these set to placeholders only if you never hit Google routes (not recommended for production).

---

## Architecture

The codebase follows a conventional layered structure:

1. **Routes** (`src/routes/`) — Mount path segments, attach middleware (auth, role checks, validation), delegate to controllers.
2. **Controllers** (`src/controllers/`) — Parse HTTP input, invoke services, send JSON via `sendSuccess` / `sendError` (`src/utils/response.utils.ts`).
3. **Services** (`src/services/`) — Business logic, orchestration, and calls to Mongoose models.
4. **Models** (`src/models/`) — Mongoose schemas and document shapes.
5. **Validators** (`src/validators/`) — Zod schemas for request bodies and query params.
6. **Middleware** (`src/middleware/`) — JWT authentication, role authorization (`student` \| `mentor` \| `recruiter`), and validated body parsing.

### Response envelope

Successful JSON responses generally look like:

```json
{
  "success": true,
  "message": "Human-readable message",
  "data": { }
}
```

Errors:

```json
{
  "success": false,
  "message": "Error description",
  "errors": { "optionalField": ["validation detail"] }
}
```

### Authentication

- **Access token**: JWT, sent as `Authorization: Bearer <token>` and/or in an `accessToken` cookie (see auth controller for cookie options).
- **Refresh token**: HttpOnly cookie on `/api/auth` path for the refresh flow.
- **Role guard**: `authorize("student" | "mentor" | "recruiter")` after `authenticate`.

### Static files

Uploaded resumes are stored under `uploads/resumes/` and exposed at **`GET /uploads/...`** (not under `/api`). This directory is listed in `.gitignore`.

---

## Project layout

```
server/
├── README.md                 ← You are here
├── docs/
│   └── API.md                ← Full HTTP API reference
├── src/
│   ├── index.ts              ← Boot: DB connect + listen
│   ├── app.ts                ← Express app, CORS, routes, static, errors
│   ├── config/               ← env, db, OAuth, upload (multer)
│   ├── controllers/          ← HTTP handlers
│   ├── data/                 ← Seed content (internships, quiz, roadmap, courses)
│   ├── middleware/           ← auth, validate
│   ├── models/               ← Mongoose models
│   ├── routes/               ← Route modules
│   ├── services/             ← Domain logic
│   ├── types/                ← Express augmentation, etc.
│   ├── utils/                ← responses, tokens, hashing, time, match score
│   └── validators/         ← Zod schemas
├── uploads/                  ← Created at runtime (ignored by git)
├── package.json
└── tsconfig.json
```

---

## API documentation

See **[docs/API.md](./docs/API.md)** for every route, method, auth requirement, query/body summaries, and notable response `data` shapes.

---

## Domain notes

### Auth & users

- Users have roles `student`, `mentor`, or `recruiter`.
- Students gain extra fields on the `User` document: `studentSkills`, `resumeUrl`, `parsedResume`, `profileViews`, `roadmapTasks`.
- Recruiters use `companyName` and `companyEmail` on `User`; postings they create reference them via `Job.recruiterId`.
- **Jobs** (internships) are stored separately; the first student job listing request may **seed** demo listings if the collection is empty (those rows have `recruiterId: null` and are not owned by a recruiter account).

### Live sessions

- Mentors create and manage sessions under `/api/mentor/sessions`.
- Students browse **available** sessions at `GET /api/sessions/available` and join via `POST /api/sessions/:id/join`.
- Session documents include generated meeting links and optional access codes for paid classes.

### Applications

- Students apply with `POST /api/student/jobs/:jobId/apply`. When the job has a `recruiterId`, the recruiter receives a `new_applicant` notification.
- Stored application statuses are `Applied`, `Screening`, `Interview`, `Offer`, `Rejected` (student-facing labels in list endpoints match these).
- Recruiters use `/api/recruiter` to list applicants and patch status; those endpoints expose recruiter UI labels (`Pending`, `Shortlisted`, etc.) mapped to the stored values (e.g. Pending ↔ Applied, Shortlisted ↔ Screening, Accepted ↔ Offer).

### Notifications

- Persisted in MongoDB; created by services (for example when a mentor schedules a session or a student applies to a recruiter-owned job).
- Student and recruiter listing endpoints map server notification types to UI-friendly `success` / `info` labels.

### Resume parsing

- `POST /api/student/resume` stores the file and returns a **stub** parsed structure. Replace the stub in `student-profile.service` when integrating a real parser.

---

## Health check

`GET /health` (root of the server, not under `/api`) returns a simple JSON payload confirming the process is running.

---

## License

See the repository root for project licensing.
