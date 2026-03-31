# Backend API Reference

Base URL (development): `http://localhost:5000`  
All paths below are relative to that origin unless noted.

**API prefix**: Routes are mounted as follows:

| Prefix | Module |
|--------|--------|
| `/api/auth` | Authentication |
| `/api/mentor` | Mentor (live sessions) |
| `/api/sessions` | Student session catalog & join |
| `/api/students` | Public students directory |
| `/api/student` | Student portal (jobs, applications, profile, content) |
| `/api/recruiter` | Recruiter portal (listings, applicants, company profile, notifications) |

**JSON body**: Unless stated otherwise, send `Content-Type: application/json`.

**Auth header**: `Authorization: Bearer <accessToken>`  
Cookies may also carry tokens (see auth responses on login/register).

**Standard success body**:

```json
{
  "success": true,
  "message": "string",
  "data": { }
}
```

**Standard error body**:

```json
{
  "success": false,
  "message": "string",
  "errors": { }
}
```

---

## Table of contents

1. [Health](#health)
2. [Authentication (`/api/auth`)](#authentication-apiauth)
3. [Mentor — live sessions (`/api/mentor`)](#mentor--live-sessions-apimentor)
4. [Sessions — student (`/api/sessions`)](#sessions--student-apisessions)
5. [Public students directory (`/api/students`)](#public-students-directory-apistudents)
6. [Student portal (`/api/student`)](#student-portal-apistudent)
7. [Recruiter portal (`/api/recruiter`)](#recruiter-portal-apirecruiter)
8. [Static files](#static-files)

---

## Health

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/health` | No | Liveness check. Response is not wrapped in the standard `success` envelope used under `/api` (returns `{ success: true, message: "..." }` for this project). |

---

## Authentication (`/api/auth`)

### Register

| Method | Path | Auth | Body (JSON) |
|--------|------|------|-------------|
| POST | `/api/auth/register` | No | See below |

**Body fields** (validated by Zod):

| Field | Type | Rules |
|-------|------|--------|
| `name` | string | 2–100 chars, trimmed |
| `email` | string | Valid email, lowercased |
| `password` | string | 8–128 chars; at least one upper, one lower, one digit |
| `role` | string | `student` \| `mentor` \| `recruiter` |

**Response `data`**: Includes `user` and `accessToken`. Refresh token is set as httpOnly cookie (not duplicated in body). Access token may also be set as cookie depending on controller options.

---

### Login

| Method | Path | Auth | Body (JSON) |
|--------|------|------|-------------|
| POST | `/api/auth/login` | No | `email`, `password` |

**Response `data`**: User + `accessToken`; refresh via cookie flow.

---

### Refresh access token

| Method | Path | Auth | Body |
|--------|------|------|------|
| POST | `/api/auth/refresh` | No (uses refresh cookie) | Empty or optional JSON |

**Response `data`**: New `accessToken`.

---

### Google OAuth

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/auth/google` | No | Starts OAuth flow (optional `?role=` for intended role). |
| GET | `/api/auth/google/callback` | No | OAuth callback; sets tokens and redirects to client. |

Exact redirect URLs depend on `GOOGLE_REDIRECT_URI` and client configuration.

---

### Logout

| Method | Path | Auth |
|--------|------|------|
| POST | `/api/auth/logout` | Varies (clears cookies) |

### Logout all sessions

| Method | Path | Auth |
|--------|------|------|
| POST | `/api/auth/logout-all` | Yes (any authenticated user) |

---

### Current user

| Method | Path | Auth |
|--------|------|------|
| GET | `/api/auth/me` | Yes |

**Response `data`**: Current user profile (password excluded).

---

### Avatar (upload + fetch)

| Method | Path | Auth | Body |
|--------|------|------|------|
| POST | `/api/auth/me/avatar` | Yes | `multipart/form-data`, field name **`avatar`** |
| GET | `/api/auth/me/avatar` | Yes | None |

**Upload notes**:

- Accepts: `image/jpeg`, `image/png`, `image/webp`
- Size limit: 2MB
- Stores on disk under `uploads/avatars/` and sets `user.avatar` to `/uploads/avatars/<filename>`

**GET behavior**:

- Responds with **302 redirect** to the stored `user.avatar` URL (typically `/uploads/avatars/<filename>`)

## Mentor — live sessions (`/api/mentor`)

**All routes require**: `authenticate` + `authorize("mentor")`.

### Create session

| Method | Path | Body (JSON) |
|--------|------|-------------|
| POST | `/api/mentor/sessions` | `topic`, `date`, `time`, `type` (`free_demo` \| `paid_class`), optional `courseId`, `description`, `maxAttendees` |

**Notes**: `date` is expected in `YYYY-MM-DD`, `time` in `HH:MM`. Server generates meeting link and access code when applicable.

---

### List mentor sessions

| Method | Path | Query |
|--------|------|--------|
| GET | `/api/mentor/sessions` | `page`, `limit`, `type` (`all` \| `free_demo` \| `paid_class`), `status` (`all` \| `upcoming` \| `completed`) |

**Response `data`**: `{ sessions, total, page, totalPages }`.

---

### Get one session

| Method | Path |
|--------|------|
| GET | `/api/mentor/sessions/:id` |

**Response `data`**: `{ session }`.

---

### Update session

| Method | Path | Body (JSON) |
|--------|------|-------------|
| PUT | `/api/mentor/sessions/:id` | Optional: `topic`, `date`, `time`, `type`, `description`, `maxAttendees`, `isCompleted` |

---

### Mark session completed

| Method | Path |
|--------|------|
| PATCH | `/api/mentor/sessions/:id/complete` |

---

### Delete session

| Method | Path |
|--------|------|
| DELETE | `/api/mentor/sessions/:id` |

---

## Sessions — student (`/api/sessions`)

### List available sessions (student)

| Method | Path | Auth |
|--------|------|------|
| GET | `/api/sessions/available` | Yes, role `student` |

**Query**: `page`, `limit`, `type` (`all` \| `free_demo` \| `paid_class`).

**Response `data`**: `{ sessions, total, page, totalPages }` (session objects include populated `courseId` when present, virtuals such as `spotsLeft` / `isUpcoming` where enabled).

---

### Join session

| Method | Path | Auth | Body (JSON) |
|--------|------|------|-------------|
| POST | `/api/sessions/:id/join` | Yes | Optional `accessCode` for paid classes |

**Response `data`**: `{ link }` — URL to open for the meeting.

---

## Public students directory (`/api/students`)

Public endpoints for browsing **non-sensitive** student profile “cards”. No authentication is required.

### List public students

| Method | Path | Auth |
|--------|------|------|
| GET | `/api/students` | No |

**Query**:

| Param | Type | Default | Notes |
|-------|------|---------|------|
| `page` | number | 1 | Positive integer |
| `limit` | number | 20 | 1–50 |
| `q` | string | — | Name search (case-insensitive) |
| `college` | string | — | Case-insensitive filter |
| `branch` | string | — | Case-insensitive filter |
| `location` | string | — | Case-insensitive filter |
| `skills` | string | — | Comma-separated list (max 20). Filters by **all** skills (`$all`). Example: `skills=react,node` |
| `sort` | string | `updatedAt` | `updatedAt` \| `name` \| `profileCompletion` |
| `order` | string | `desc` | `asc` \| `desc` |

**Response `data`**:

- `{ items, page, limit, total, totalPages }`
- `items[]` fields:
  - `id`, `name`, optional `avatar`, `college`, `branch`, `location`, `bio`, `experienceSummary`
  - `studentSkills: string[]`, `studentProjects: string[]`, `achievements: string[]`
  - optional `codingProfiles` (subset of `leetcode`, `codechef`, `codeforces`, `github`, `linkedin`, `portfolio`)
  - `profileCompletion: number`, `updatedAt: string` (ISO date)

Example:

```json
{
  "success": true,
  "message": "OK",
  "data": {
    "items": [
      {
        "id": "65f000000000000000000000",
        "name": "Student Name",
        "college": "Example College",
        "branch": "CSE",
        "location": "Pune",
        "studentSkills": ["React", "Node.js"],
        "studentProjects": ["Career Navigator"],
        "achievements": ["Hackathon finalist"],
        "codingProfiles": {
          "github": "https://github.com/example",
          "linkedin": "https://linkedin.com/in/example"
        },
        "profileCompletion": 78,
        "updatedAt": "2026-03-31T00:00:00.000Z"
      }
    ],
    "page": 1,
    "limit": 20,
    "total": 1,
    "totalPages": 1
  }
}
```

---

### Get public student profile

| Method | Path | Auth |
|--------|------|------|
| GET | `/api/students/:studentId` | No |

**Path params**:

| Param | Type | Notes |
|-------|------|------|
| `studentId` | string | Mongo ObjectId (24 hex chars). |

**Response `data`**:

- `{ student }`
- `student` fields: same as list items (`id`, `name`, optional `avatar`, `college`, `branch`, `location`, `bio`, `experienceSummary`, arrays, optional `codingProfiles`, `profileCompletion`, `updatedAt`)

Errors:

- `400` if `studentId` is invalid
- `404` if student does not exist or is not public/active

Example:

```json
{
  "success": true,
  "message": "OK",
  "data": {
    "student": {
      "id": "65f000000000000000000000",
      "name": "Student Name",
      "college": "Example College",
      "branch": "CSE",
      "location": "Pune",
      "studentSkills": ["React", "Node.js"],
      "studentProjects": ["Career Navigator"],
      "achievements": ["Hackathon finalist"],
      "codingProfiles": {
        "github": "https://github.com/example",
        "linkedin": "https://linkedin.com/in/example"
      },
      "profileCompletion": 78,
      "updatedAt": "2026-03-31T00:00:00.000Z"
    }
  }
}
```

## Student portal (`/api/student`)

**All routes require**: `authenticate` + `authorize("student")`.

---

### Dashboard

| Method | Path |
|--------|------|
| GET | `/api/student/dashboard` |

**Response `data`**:

```json
{
  "student": {
    "applicationsSubmitted": 0,
    "interviewsScheduled": 0,
    "profileViews": 0,
    "matchScore": 85
  }
}
```

`matchScore` is derived from the student’s application match averages when available.

---

### Jobs — list

| Method | Path |
|--------|------|
| GET | `/api/student/jobs` |

**Query**:

| Param | Description |
|-------|-------------|
| `keyword` | Search title, company, skills |
| `location` | Filter (regex); use `all` on client to skip |
| `skills` | Comma-separated list; jobs having any listed skill |
| `sort` | `newest` (default) or `match` |

**Response `data`**: `{ jobs: JobCard[] }`  
Each job includes: `id`, `title`, `company`, `location`, `type` (work type: Remote / Hybrid / On-site), `duration`, `stipend`, `skills`, `description`, `requirements`, `postedDate` (relative string), `applicants`, `matchScore`.

**Note**: If the jobs collection is empty, the server inserts seed internships on first access.

---

### Jobs — recommended

| Method | Path |
|--------|------|
| GET | `/api/student/jobs/recommended` |

**Response `data`**: `{ jobs: JobCard[] }` — subset with `matchScore >= 80`.

---

### Jobs — detail

| Method | Path |
|--------|------|
| GET | `/api/student/jobs/:jobId` |

**Response `data`**: `{ job: JobCard }`.

---

### Jobs — match score only

| Method | Path |
|--------|------|
| GET | `/api/student/jobs/:jobId/match-score` |

**Response `data`**: `{ score: number }` (0–100).

---

### Jobs — apply

| Method | Path |
|--------|------|
| POST | `/api/student/jobs/:jobId/apply` |

**Response `data`**: `{ applicationId: string }`  
**Errors**: 400 if already applied; 404 if job missing.

---

### Applications — list

| Method | Path |
|--------|------|
| GET | `/api/student/applications` |

**Response `data`**: `{ applications: [{ id, internship, company, status, date, matchScore }] }`.

---

### Profile — get

| Method | Path |
|--------|------|
| GET | `/api/student/profile` |

**Response `data`**: `name`, `email`, `phone`, `avatar`, `profileCompletion`, `studentSkills`, `resumeUrl`, `parsedResume`.

---

### Profile — update

| Method | Path | Body (JSON) |
|--------|------|-------------|
| PATCH | `/api/student/profile` | Optional: `name`, `phone` (nullable), `studentSkills` (string array) |

**Response `data`**: Updated profile object (same shape as GET).

---

### Resume — upload

| Method | Path | Body |
|--------|------|------|
| POST | `/api/student/resume` | `multipart/form-data`, field name **`resume`** |

**Limits**: Configured in `config/upload.config.ts` (file size and MIME types: PDF / Word).

**Response `data`**: `{ url, parsedResume }` — `parsedResume` is currently a **stub** until a real parser is integrated.

---

### Resume — parse by URL

| Method | Path | Body (JSON) |
|--------|------|-------------|
| POST | `/api/student/resume/parse` | `{ "fileUrl": "https://..." }` |

Persists stub parse result and updates stored resume URL. Replace stub for production.

---

### Content — quiz

| Method | Path |
|--------|------|
| GET | `/api/student/content/quiz` |

**Response `data`**: `{ questions: [{ id, question, options, correct }] }`.

---

### Content — roadmap

| Method | Path |
|--------|------|
| GET | `/api/student/content/roadmap` |

Initializes default tasks on the user document if empty.

**Response `data`**: `{ tasks: [{ id, title, category, completed }] }`.

---

### Content — roadmap task toggle

| Method | Path |
|--------|------|
| PATCH | `/api/student/content/roadmap/tasks/:taskId` | Body may be empty `{}`. |

**Response `data`**: `{ tasks: [...] }` (updated list).

---

### Content — recommended courses

| Method | Path |
|--------|------|
| GET | `/api/student/content/courses` |

**Response `data`**: `{ courses: [{ id, title, provider, duration, level, url }] }`.

---

### Notifications — list

| Method | Path |
|--------|------|
| GET | `/api/student/notifications` |

**Query**: `page`, `limit`.

**Response `data`**: `{ notifications, total, unreadCount, page, totalPages }`  
Each notification: `id`, `message`, `time` (relative), `read`, `type` (`success` \| `info`).

---

### Notifications — mark read

| Method | Path |
|--------|------|
| PATCH | `/api/student/notifications/:id/read` |

---

### Notifications — mark all read

| Method | Path |
|--------|------|
| POST | `/api/student/notifications/read-all` |

---

## Recruiter portal (`/api/recruiter`)

**All routes require**: `authenticate` + `authorize("recruiter")`.

Internships posted by a recruiter are stored as `Job` documents with `recruiterId` set. Seeded demo jobs (`recruiterId: null`) are not owned by any recruiter account. Application records use internal statuses (`Applied`, `Screening`, `Interview`, `Offer`, `Rejected`); this API maps them to recruiter UI labels where noted.

---

### Dashboard

| Method | Path |
|--------|------|
| GET | `/api/recruiter/dashboard` |

**Response `data`**:

```json
{
  "recruiter": {
    "activeListings": 0,
    "totalApplicants": 0,
    "shortlisted": 0,
    "interviewsScheduled": 0
  },
  "statusBreakdown": [
    { "name": "Pending", "value": 0 },
    { "name": "Shortlisted", "value": 0 },
    { "name": "Interview", "value": 0 },
    { "name": "Accepted", "value": 0 },
    { "name": "Rejected", "value": 0 }
  ]
}
```

- **activeListings**: `Job` count for this recruiter with `isActive: true`.
- **totalApplicants**: applications across this recruiter’s jobs.
- **shortlisted**: applications in internal status `Screening`.
- **interviewsScheduled**: applications in status `Interview`.
- **statusBreakdown**: counts per recruiter UI label — maps internally to `Applied`, `Screening`, `Interview`, `Offer`, `Rejected` respectively for Pending → Rejected.

---

### Listings — list

| Method | Path |
|--------|------|
| GET | `/api/recruiter/jobs` |

**Response `data`**: `{ jobs: [...] }` — each item includes `id`, `title`, `company`, `location`, `type` (work type), `duration`, `stipend`, `skills`, `description`, `requirements`, `postedDate` (relative), `applicants` (count), `isActive`.

---

### Listings — get one

| Method | Path |
|--------|------|
| GET | `/api/recruiter/jobs/:jobId` |

**Response `data`**: `{ job: { ...same fields as list item } }`. **Errors**: 404 if not found or not owned by this recruiter.

---

### Listings — create

| Method | Path | Body (JSON) |
|--------|------|-------------|
| POST | `/api/recruiter/jobs` | See below |

| Field | Type | Notes |
|-------|------|--------|
| `title` | string | Required |
| `company` | string | Required |
| `location` | string | Required |
| `type` | string | `remote` \| `onsite` \| `hybrid` (stored as Remote / On-site / Hybrid) |
| `duration` | string | Required |
| `stipend` | string | Required |
| `skills` | string[] or comma-separated string | Required |
| `description` | string | Required |
| `requirements` | string[] | Optional |

**Response `data`**: `{ jobId: string }`.

---

### Listings — update

| Method | Path | Body (JSON) |
|--------|------|-------------|
| PATCH | `/api/recruiter/jobs/:jobId` | Optional: `title`, `company`, `location`, `type`, `duration`, `stipend`, `skills`, `description`, `requirements`, `isActive` |

At least one field is required. **Response `data`**: `{ jobId: string }`.

---

### Listings — close

| Method | Path |
|--------|------|
| PATCH | `/api/recruiter/jobs/:jobId/close` |

Sets `isActive: false`. **Response `data`**: `{ jobId: string }`.

---

### Applicants — list

| Method | Path | Query |
|--------|------|--------|
| GET | `/api/recruiter/applicants` | Optional `status`: `all` (default behavior when omitted), or `Pending`, `Shortlisted`, `Interview`, `Accepted`, `Rejected` |

**Response `data`**: `{ applicants: [...] }`  
Each applicant: `id` (numeric id derived for UI), `applicationId` (Mongo id string), `name`, `email`, `appliedFor` (job title), `matchScore`, `skills`, `skillMatch`, `experienceMatch`, `educationMatch` (derived for display), `status` (recruiter label), `resumeUrl` (nullable).

---

### Applications — update status

| Method | Path | Body (JSON) |
|--------|------|-------------|
| PATCH | `/api/recruiter/applications/:applicationId` | `{ "status": "Pending" \| "Shortlisted" \| "Interview" \| "Accepted" \| "Rejected" }` |

Updates the underlying application status and sends a student notification (`application_update`). **Response `data`**: `{ applicationId, status }` with `status` as the recruiter label. **Errors**: 403/404 when the application is not for this recruiter’s job.

---

### Profile — get

| Method | Path |
|--------|------|
| GET | `/api/recruiter/profile` |

**Response `data`**: `name`, `email`, `companyName`, `companyEmail`, `avatar`.

---

### Profile — update

| Method | Path | Body (JSON) |
|--------|------|-------------|
| PATCH | `/api/recruiter/profile` | Optional: `companyName`, `companyEmail` (nullable) |

At least one field is required. **Response `data`**: Updated profile (same shape as GET).

---

### Notifications — list

| Method | Path |
|--------|------|
| GET | `/api/recruiter/notifications` |

**Query**: `page`, `limit`.

**Response `data`**: Same envelope as student notifications (`notifications`, `total`, `unreadCount`, `page`, `totalPages`). Recruiters receive types such as `new_applicant` when a student applies to one of their listings.

---

### Notifications — mark read

| Method | Path |
|--------|------|
| PATCH | `/api/recruiter/notifications/:id/read` |

---

### Notifications — mark all read

| Method | Path |
|--------|------|
| POST | `/api/recruiter/notifications/read-all` |

---

## Static files

| Method | Path | Auth |
|--------|------|------|
| GET | `/uploads/**` | No |

Serves files from the `uploads/` directory on disk (e.g. resumes saved by the student upload endpoint). In production, consider moving to object storage and returning signed URLs instead.

---

## Summary route map

```
GET    /health
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/refresh
GET    /api/auth/google
GET    /api/auth/google/callback
POST   /api/auth/logout
POST   /api/auth/logout-all
GET    /api/auth/me
POST   /api/auth/me/avatar
GET    /api/auth/me/avatar

POST   /api/mentor/sessions
GET    /api/mentor/sessions
GET    /api/mentor/sessions/:id
PUT    /api/mentor/sessions/:id
PATCH  /api/mentor/sessions/:id/complete
DELETE /api/mentor/sessions/:id

GET    /api/sessions/available
POST   /api/sessions/:id/join

GET    /api/students

GET    /api/student/dashboard
GET    /api/student/jobs/recommended
GET    /api/student/jobs
GET    /api/student/jobs/:jobId/match-score
GET    /api/student/jobs/:jobId
POST   /api/student/jobs/:jobId/apply
GET    /api/student/applications
GET    /api/student/profile
PATCH  /api/student/profile
POST   /api/student/resume
POST   /api/student/resume/parse
GET    /api/student/content/quiz
GET    /api/student/content/roadmap
PATCH  /api/student/content/roadmap/tasks/:taskId
GET    /api/student/content/courses
GET    /api/student/notifications
PATCH  /api/student/notifications/:id/read
POST   /api/student/notifications/read-all

GET    /api/recruiter/dashboard
GET    /api/recruiter/jobs
GET    /api/recruiter/jobs/:jobId
POST   /api/recruiter/jobs
PATCH  /api/recruiter/jobs/:jobId
PATCH  /api/recruiter/jobs/:jobId/close
GET    /api/recruiter/applicants
PATCH  /api/recruiter/applications/:applicationId
GET    /api/recruiter/profile
PATCH  /api/recruiter/profile
GET    /api/recruiter/notifications
PATCH  /api/recruiter/notifications/:id/read
POST   /api/recruiter/notifications/read-all
```

Order matters on the client: `/api/student/jobs/recommended` must be registered before `/api/student/jobs/:jobId` (already correct on the server). For recruiter, static path `/api/recruiter/jobs/:jobId` is registered after `/api/recruiter/jobs` (already correct).

---

*This document reflects the codebase as of the last update. If a route’s behavior changes, update this file alongside the code.*
