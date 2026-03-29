# Routing

Path alias: `@/` → `src/`.

**“Live API”** = HTTP via `lib/axios.ts`. **“Mock / static”** = `data/mockData.ts`, `constants/mentor.constant.ts`, or inline constants.

---

## Public routes (no dashboard layout)


| Path               | Page                                  | Primary data source                                            |
| ------------------ | ------------------------------------- | -------------------------------------------------------------- |
| `/`                | `pages/students/Index.tsx`            | Inline marketing copy                                          |
| `/internships`     | `pages/students/Internships.tsx`      | **API:** `jobService.getJobs()` → `GET /internships`           |
| `/internships/:id` | `pages/students/InternshipDetail.tsx` | **API:** `jobService.getJobById` (uses `getJobs` + find by id) |
| `/about`           | `pages/About.tsx`                     | Static                                                         |
| `/login`           | `pages/auth/Login.tsx`                | **Auth:** forms + `AuthContext` → `auth.service.ts`            |
| `/register`        | `pages/auth/Register.tsx`             | Same                                                           |


---

## Student dashboard

**Prefix:** `/student`. **Layout:** `StudentDashboard.tsx` wraps most pages in `DashboardLayout`. **Sidebar:** `constants/student.sidebar.tsx`.


| Route            | Page file                                   | Primary data source                                                                             |
| ---------------- | ------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| `/`              | `pages/students/DashboardHome.tsx`          | Mock: `mockData` (`dashboardStats`)                                                             |
| `/search`        | `pages/students/SearchInternships.tsx`      | Mock: `mockData.internships`                                                                    |
| `/recommended`   | `pages/students/RecommendedInternships.tsx` | Mock: `mockData.internships`                                                                    |
| `/sessions`      | `pages/students/StudentSessions.tsx`        | **API:** `GET /sessions/available` (inline helper); join → `session.service` (`joinSessionApi`) |
| `/resume`        | `pages/students/ResumePage.tsx`             | Mock: `mockData.parsedResume`                                                                   |
| `/skills`        | `pages/students/SkillEvaluation.tsx`        | Mock: `mockData.skillQuiz`                                                                      |
| `/roadmap`       | `pages/students/SkillRoadmap.tsx`           | Mock: `roadmapTasks`, `recommendedCourses`                                                      |
| `/applications`  | `pages/students/Applications.tsx`           | Mock: `KanbanBoard` ← `mockData.applications`                                                   |
| `/notifications` | `pages/students/NotificationsPage.tsx`      | Mock: `mockData.notifications`                                                                  |
| `/settings`      | `pages/students/SettingsPage.tsx`           | UI; `AuthContext` where needed                                                                  |


---

## Recruiter dashboard

**Prefix:** `/recruiter`. **Layout:** `DashboardLayout`. **Sidebar:** `constants/recruiter.sidebar.tsx`.


| Route            | Page file                                    | Primary data source                        |
| ---------------- | -------------------------------------------- | ------------------------------------------ |
| `/`              | `pages/recruiter/Overview.tsx`               | Mock: `dashboardStats`                     |
| `/post`          | `pages/recruiter/PostInternship.tsx`         | `PostInternshipForm` — no API submit wired |
| `/listings`      | `pages/recruiter/MyListings.tsx`             | Mock: `mockData.internships`               |
| `/applicants`    | `pages/recruiter/ApplicantsList.tsx`         | Mock: `mockData.applicants`                |
| `/notifications` | `pages/recruiter/RecruiterNotifications.tsx` | Mock: `mockData.notifications`             |
| `/settings`      | `pages/recruiter/RecruiterSettings.tsx`      | Settings UI                                |


---

## Mentor dashboard

**Prefix:** `/mentor`. **Layout:** `MentorLayout`. **Sidebar:** `constants/mentor.sidebar.tsx`.


| Route          | Page file                            | Primary data source                                                                     |
| -------------- | ------------------------------------ | --------------------------------------------------------------------------------------- |
| `/`            | `pages/mentor/MentorHome.tsx`        | Static stats; `UpcomingClasses` → **API** `getMentorSessions`; `TopStudents` static     |
| `/trainings`   | `pages/mentor/MentorTrainings.tsx`   | Mock: `MOCK_TRAININGS` (`mentor.constant`)                                              |
| `/classes`     | `pages/mentor/MentorClasses.tsx`     | **API:** `getMentorSessions`, mutations via `ClassCard`, dialogs → `session.service.ts` |
| `/students`    | `pages/mentor/MentorStudents.tsx`    | Mock: `MOCK_STUDENTS`                                                                   |
| `/assignments` | `pages/mentor/MentorAssignments.tsx` | Mock: `MOCK_ASSIGNMENTS`                                                                |
| `/progress`    | `pages/mentor/MentorProgress.tsx`    | Mock: `MOCK_STUDENTS`                                                                   |
| `/messages`    | `pages/mentor/MentorMessage.tsx`     | Mock: `MOCK_MESSAGES`                                                                   |
| `/settings`    | `pages/mentor/MentorSetting.tsx`     | `useAuth()`, logout controls                                                            |


`MentorDashboard` imports `MentorHome` and `MentorClasses` from `**pages/mentor/`** only. Same-named files under `components/mentor/` are not used by the router (likely legacy duplicates).

---

## Related docs

- [Architecture](./architecture.md) — providers and HTTP layer
- [Components & services](./components-and-services.md) — component and service details

