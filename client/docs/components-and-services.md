# Components & services

## Services ↔ HTTP

Paths are relative to `/api` (via `lib/axios.ts`).

| Service | Methods | Endpoints / behavior |
|---------|---------|----------------------|
| `services/auth.service.ts` | `registerUser`, `loginUser`, `getCurrentUser`, `refreshAccessToken`, `logoutUser`, `logoutAllDevices`, `getGoogleOAuthUrl` | `/auth/register`, `/auth/login`, `/auth/me`, `/auth/refresh`, `/auth/logout`, `/auth/logout-all`; Google URL builder |
| `services/jobService.ts` | `getJobs`, `getRecommended`, `getJobById`, `postJob` (stub) | `GET /internships` (+ client filters) |
| `services/session.service.ts` | `createSession`, `getMentorSessions`, `getSessionById`, `updateSession`, `completeSessionApi`, `deleteSessionApi`, `joinSessionApi` | `/mentor/sessions`, `/mentor/sessions/:id`, `/sessions/:id/join` |
| `services/applicationService.ts` | Stubs | Not connected — empty/mock |
| `services/authService.ts` | Mock | **Unused** |

`StudentSessions.tsx` also calls `GET /sessions/available` through a local helper (not only `session.service.ts`).

---

## Components by folder

`components/ui/*` is the shared design system (shadcn/Radix); not enumerated here.

### Root `components/`

| File | Role |
|------|------|
| `DashboardLayout.tsx` | Student/recruiter shell: `DashboardSidebar`, mobile menu, header, `NotificationBell` |
| `DashboardSidebar.tsx` | Sidebar links from props |
| `Navbar.tsx` | Public marketing nav |
| `NavLink.tsx` | Styled router `NavLink` |
| `InternshipCard.tsx` | Internship card; link to `/internships/:id` |
| `MatchScoreBadge.tsx`, `SkillTag.tsx` | Internship UI helpers |
| `StatsCard.tsx` | Metric tiles |
| `KanbanBoard.tsx` | Application columns from `mockData.applications` |
| `NotificationBell.tsx` | Header bell; `mockData.notifications` |
| `ResumeUpload.tsx` | Resume upload UI (mock/local) |

### `components/auth/`

| File | Role |
|------|------|
| `ProtectedRoute.tsx` | Auth + role guard |
| `LoginForm.tsx`, `RegisterForm.tsx` | `useAuth()` login/register |
| `GoogleAuthButton.tsx` | `getGoogleOAuthUrl()` redirect |
| `LogoutButton.tsx`, `LogoutAllButton.tsx` | Logout actions |
| `AuthLogo`, `AuthBrandPanel`, `AuthDivider`, `RoleSelector` | Auth page chrome |

### `components/student/`

| File | Role | Data |
|------|------|------|
| `SessionJoinCard.tsx` | Join session | `joinSessionApi` |
| `ApplicationStatusChart.tsx` | Stats chart | Props |
| `RoadmapTaskItem.tsx`, `RecommendedCourseCard.tsx` | Roadmap | `mockData` via parents |
| `QuizQuestion.tsx`, `QuizResult.tsx` | Skill quiz | `mockData.skillQuiz` |
| `ProfileCompletion.tsx`, `SkillDemandChart.tsx` | Widgets | Props / mock |
| `NotificationItem.tsx` | One notification | Props |

### `components/recruiter/`

| File | Role | Data |
|------|------|------|
| `PostInternshipForm.tsx` | New listing form | No API |
| `ListingCard.tsx` | Listing summary | Parent |
| `ApplicantCard.tsx`, `ApplicantStatusSelect.tsx`, `ApplicantStatusFilter.tsx` | Applicants UI | `mockData` on list page |
| `ApplicantStatusChart.tsx`, `ApplicantMatchStats.tsx` | Analytics | Mock / parent |

### `components/mentor/`

| File | Role | Data |
|------|------|------|
| `MentorLayout.tsx` | Mentor shell | — |
| `UpcomingClasses.tsx` | Upcoming sessions | `getMentorSessions` |
| `ScheduleSessionDialog.tsx` | Create session | `createSession` |
| `EditSessionDialog.tsx` | Edit session | `updateSession` |
| `ClassCard.tsx` | Session row + actions | Session APIs |
| `ProfileCompletion.tsx`, `TopStudents.tsx`, `TrainingCard.tsx`, `StudentCard.tsx`, `AssignmentCard.tsx`, `ProgressCard.tsx`, `MessageCard.tsx` | Sections | Static / `mentor.constant` |

---

## Context and hooks

| Name | Role |
|------|------|
| `contexts/AuthContext.tsx` | User session, `login` / `register` / `logout` / `refreshUser`, bootstrap with `/auth/me` |
| `hooks/use-toast.ts` | Toasts |
| `hooks/use-mobile.tsx` | Responsive sidebar behavior |

---

## Types

`types/auth.types.ts`, `student.types.ts`, `recruiter.types.ts`, `mentor.types.ts` — shared TypeScript models for UI and services.

---

## Tests

`src/test/` — Vitest. Run from client root: `npm test`.

---

## API vs mock (current state)

| Area | Mostly |
|------|--------|
| Auth | **Live API** |
| Public internships | **Live API** (`jobService`) |
| Mentor classes + student sessions | **Live API** (`session.service` + `StudentSessions` helper) |
| Student dashboard (search, recommended, resume, skills, roadmap, applications) | **Mock** |
| Recruiter dashboard | **Mock** |
| Mentor (except home upcoming + classes) | **Mock** (`mentor.constant`) |
| `applicationService.ts` | **Stub** |

When adding screens, either call `lib/axios.ts` through `services/*` or use mocks until the backend exists, and update this doc in the same change.
