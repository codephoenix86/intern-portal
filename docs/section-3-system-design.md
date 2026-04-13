# Section 3 — System Design

This section documents the Career Navigator stack at a high level: **React** (client), **Node.js / Express** (API), **MongoDB** (persistence), **Google OAuth** for social login, and **Internshala** as a scraped source for additional internship listings. Persisted internship postings are **`Job`** documents in `server/src/models/`; the ER diagram below matches `user`, `job`, `application`, `course`, and `enrollment` models and route mounts in `server/src/app.ts`.

**Raster exports** for templates that need images: `docs/diagrams/section-3/3-1-architecture.png`, `3-2-data-flow.png`, `3-3-er.png`, `3-4-skill-matching.png`, `3-5-course-recommendation.png`, `3-6-backend-api-workflow.png` (generated from the sibling `.mmd` sources via `@mermaid-js/mermaid-cli` and `puppeteer-config.json`).

---

## 3.1 Architecture Overview

```mermaid
%%{init: {'theme': 'default'}}%%
flowchart TB
    subgraph clientTier [Client Tier]
        reactApp[React SPA]
    end
    subgraph appTier [Application Tier]
        expressApi[Node Express REST API]
    end
    subgraph dataTier [Data Tier]
        mongoDb[(MongoDB)]
    end
    subgraph extServices [External Services]
        googleOAuth[Google OAuth and UserInfo API]
        internshalaSource[Internshala Public Pages]
    end
    reactApp -->|HTTPS JSON REST| expressApi
    expressApi -->|Mongoose ODM| mongoDb
    expressApi -->|OAuth2 token exchange profile fetch| googleOAuth
    expressApi -->|HTTP scrape parse listings| internshalaSource
```

The architecture is organized into four logical tiers. The **client tier** is a React single-page application in the browser; it communicates with the backend only over HTTPS using JSON-based REST calls. The **application tier** is a Node.js **Express** server that implements authentication, business rules, skill matching, job and course workflows, and integrations. Durable state is written through **Mongoose** to **MongoDB** in the **data tier**, including users, jobs (internship postings), applications, courses, enrollments, and related records. The **external services** tier covers dependencies outside the core stack: **Google OAuth** supports delegated login and profile retrieval via Google’s userinfo endpoint, while **Internshala** is not a formal API here—the server retrieves public HTML and parses listings to augment internally stored or seeded opportunities. This separation clarifies presentation, API logic, storage, and third-party boundaries for deployment, security, and scaling discussions typical of a three-tier style design.

---

## 3.2 Data Flow Diagram

```mermaid
flowchart TB
    subgraph extEntities [External Entities]
        student[Student]
        staff[Mentor Recruiter Admin]
        webJobs[Internshala And Seed Data]
    end
    subgraph processes [Processes]
        pAuth[User Authentication]
        pProfile[Profile And Skill Management]
        pMatch[Skill Matching And Recommendations]
        pIntern[Internship Discovery And Application]
        pCourse[Course Discovery And Enrollment]
    end
    subgraph dataStores [Data Stores]
        dUsers[(Users And Auth State)]
        dJobs[(Jobs Applications)]
        dCourses[(Courses Enrollments)]
    end
    student -->|login register OAuth| pAuth
    staff -->|login register OAuth| pAuth
    pAuth -->|sessions user records| dUsers
    student -->|update skills resume| pProfile
    staff -->|directory profiles| pProfile
    pProfile -->|user skill vectors| dUsers
    student -->|request matches| pMatch
    dUsers -->|student skills| pMatch
    dJobs -->|required skills| pMatch
    dCourses -->|skills taught| pMatch
    pMatch -->|ranked jobs courses| student
    webJobs -->|scraped or static listings| pIntern
    student -->|search filter apply| pIntern
    pIntern -->|applications status| dJobs
    student -->|browse enroll track| pCourse
    pCourse -->|enrollment progress| dCourses
    dCourses -->|catalog| pCourse
```

This data-flow view emphasizes **who** originates data, **which processes** transform it, and **where** it is stored—not individual REST endpoints. **Students** authenticate, maintain profiles and skills, request matches, search and apply for internships, and browse or enroll in courses. **Mentors, recruiters, and admins** mainly contribute through authentication, directory-style profiles, and data that still lands in the same logical stores. **User authentication** updates **users and auth-related state** so later actions are authorized. **Profile and skill management** keeps student skill data consistent with what matching and recommendations need. **Skill matching** combines student skills with job-required skills and course skill tags to return ranked suggestions. **Internship discovery** blends **Internshala and seed** listings with persisted jobs and writes **applications and status** to the jobs/applications store. **Course discovery** reads the catalog, records **enrollment and progress**, and returns updates to the student. Arrow direction shows information flow at a logical level rather than every HTTP request–response pair.

---

## 3.3 Entity Relationship Diagram

Figure 3.3 is a **logical, conceptual** view of how major pieces relate; the narrative below interprets it for MongoDB.

```mermaid
erDiagram
    User {
        objectId id PK
        string name
        string email
        string role
        string studentSkills
    }
    Job {
        objectId id PK
        string title
        string company
        string description
        string skills
        objectId recruiterId FK
    }
    Application {
        objectId id PK
        objectId studentId FK
        objectId jobId FK
        string status
        float matchScore
    }
    Course {
        objectId id PK
        string title
        string description
        string skills
        objectId mentorId FK
    }
    Enrollment {
        objectId id PK
        objectId studentId FK
        objectId courseId FK
        string status
        float progress
    }
    User ||--o{ Application : submits as student
    Job ||--o{ Application : receives for job
    User ||--o{ Job : posts as recruiter
    User ||--o{ Course : creates as mentor
    User ||--o{ Enrollment : enrolls as student
    Course ||--o{ Enrollment : has enrollments
```

The ER diagram approximates a **document database**: entities align with collections (or summarized structures) rather than a normalized relational schema. A **User** can represent students, mentors, or recruiters (via **role**); **studentSkills** is modeled as a list of strings, not a separate Skill entity. **Job** stands for internship postings tied to a recruiter (**recruiterId**), with **skills** as strings on the job. **Application** links a student to a job and holds **status** and **matchScore**. **Course** is mentor-authored content (**mentorId**) with **skills** taught. **Enrollment** links a student to a course with **status** and **progress**. Cardinalities follow the usual reading: many applications per user and per job, many jobs per recruiter, many courses per mentor, many enrollments per user and per course. Embedded arrays and subdocuments (for example course **modules**) are left out so the figure stays readable while still matching the main references in the server models. Where the report says “Internship,” persisted openings correspond to **Job** documents in storage.

---

## 3.4 Skill Matching Flowchart

Figure 3.4 is the **skill matching algorithm flowchart**. It explains how the system compares **student skills** with **internship requirements**: collecting inputs, comparing skill sets, calculating a **match percentage**, and identifying **missing skills** for explanations and follow-on steps.

```mermaid
flowchart TB
    subgraph inputs [Input collection]
        A[Student skills from user profile]
        B[Internship required skills from Job record]
    end
    subgraph compare [Comparison and scoring]
        C[Align and compare skill sets per endpoint rules]
        D[Compute match percentage]
    end
    subgraph results [Outputs]
        E[Matched skills]
        F[Missing skills]
        G[Rank filter or display score]
    end
    A --> C
    B --> C
    C --> D
    D --> E
    D --> F
    D --> G
```

In implementation, **input collection** reads the student’s `studentSkills` and the posting’s `skills` from MongoDB via the Express API (and the client may combine scraped plus internal listings before scoring). **Comparison** is overlap-based: for internship listing and application flows the server normalizes strings (trim, lowercase) and scores coverage of the job’s skill list; the dedicated match endpoint uses the same overlap idea with exact string equality on tags as stored. **Match percentage** is the fraction of required job skills the student satisfies, scaled to 0–100 (listing scores are additionally clamped for display). **Missing skills** are the required skills not present in the student profile; they feed course suggestion and internship detail UI. A separate client-only recommended view uses substring checks against title plus skills text, but the diagram above is the canonical server-side flow.

---

## 3.5 Course Recommendation Flow Diagram

Figure 3.5 is the **course recommendation process** diagram. It shows how **missing skills** (relative to an internship) drive a **database lookup** for relevant published courses, how results are shaped for the API, and how the **student interface** presents suggested courses.

```mermaid
flowchart TB
    subgraph inputs [Inputs]
        M[Missing skills for student and internship pair]
    end
    subgraph fetch [Course retrieval]
        N[Find published courses whose skill tags intersect missing skills]
    end
    subgraph shape [Response shaping]
        O[Map to course id title and link slug]
    end
    subgraph ui [Student experience]
        P[API returns JSON to client]
        Q[Internship detail and related views list suggested courses]
    end
    M --> N
    N --> O
    O --> P
    P --> Q
```

The **suggestions** pipeline uses `missingSkills` from the match service, then queries the **Course** collection for documents with `isPublished: true` and at least one `skills` value in that list. The handler returns **recommended courses** with identifiers and links so the student can open them from the internship context. Separately, the **roadmap** experience recommends courses from a static catalog filtered by the student’s chosen interest **tags**; that path is tag-based rather than missing-skill intersection, but Figure 3.5 centers on the internship-driven gap-fill flow described above.

---

## 3.6 Backend API Workflow Diagram

Figure 3.6 is the **backend API flow for matching and suggestions**. It explains how data moves from the **frontend** to **Express** (routing, controller, service layers), through **Mongoose** persistence access, and how **JSON responses** return to the user.

```mermaid
flowchart TB
    subgraph fe [Frontend React]
        UI[Student views e.g. internship detail]
        AX[Axios client baseURL /api]
    end
    subgraph ex [Express application tier]
        RT[match.routes mounts under /api]
        CTL[match.controller getMatch getSuggestions]
        subgraph svc [match.service]
            CALC[calculateMatch or findMissingSkills]
            SUG[suggestCourses]
        end
    end
    subgraph db [MongoDB via Mongoose]
        MU[(User collection)]
        MJ[(Job collection)]
        MC[(Course collection)]
    end
    UI -->|GET /match or /suggestions :ids| AX
    AX --> RT
    RT --> CTL
    CTL -->|User.findById student| MU
    CTL -->|Job.findById internship| MJ
    CTL --> CALC
    CALC -->|suggestions route only| SUG
    SUG -->|published courses by skill overlap| MC
    CTL -->|JSON success and data payload| AX
    AX --> UI
```

The student app issues authenticated **GET** requests relative to `/api` (for example `/api/match/...` and `/api/suggestions/...` as defined in `server/src/routes/match.routes.ts`). **Express** dispatches them to **`match.controller`**, which loads the **student** (`User`, role student) and **internship** (`Job`) by id, reads `studentSkills` and job `skills`, and delegates to **`match.service`**: **`calculateMatch`** for scores and skill lists on the match route, and **`findMissingSkills`** plus **`suggestCourses`** on the suggestions route (the latter queries **Course** documents). The controller sends a **JSON** body (typically `{ success, data }`) back through Axios to the UI. Errors short-circuit with appropriate HTTP status codes and messages without calling the full matching pipeline.
