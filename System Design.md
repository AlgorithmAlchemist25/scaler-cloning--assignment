<div align="center">
  <h1>📐 System Design — Zoom Clone</h1>
  <p><strong>Architecture, data model, and request flows for the Zoom Clone application.</strong></p>
  <p>
    <a href="#1-high-level-architecture">High-Level Architecture</a> •
    <a href="#2-data-model">Data Model</a> •
    <a href="#3-api-design">API Design</a> •
    <a href="#4-request-flows">Request Flows</a> •
    <a href="#5-design-decisions">Design Decisions</a> •
    <a href="#6-future-improvements">Future Improvements</a>
  </p>
</div>

---

## 1. High-Level Architecture

The system follows a simple **client → API → database** architecture with a clean separation between the presentation layer (Next.js) and the service layer (FastAPI).

```mermaid
graph TD
    User[👤 User Browser]

    subgraph "Frontend — Next.js"
        UI[Dashboard / Meeting Pages]
        APIClient[API Client — lib/api.ts]
    end

    subgraph "Backend — FastAPI"
        Router[Routers<br/>meetings.py / participants.py]
        Service[Services<br/>meeting_service.py / participant_service.py]
        Schema[Pydantic Schemas<br/>request & response validation]
    end

    subgraph "Data Layer"
        ORM[SQLAlchemy ORM]
        DB[(SQLite dev / PostgreSQL prod)]
    end

    User --> UI
    UI --> APIClient
    APIClient -->|HTTPS / JSON, REST| Router
    Router --> Schema
    Router --> Service
    Service --> ORM
    ORM --> DB

    classDef fe fill:#000000,stroke:#fff,color:#fff;
    classDef be fill:#46E3B7,stroke:#333;
    classDef db fill:#f4d35e,stroke:#333;

    class UI,APIClient fe;
    class Router,Service,Schema be;
    class ORM,DB db;
```

**Layer responsibilities:**

| Layer | Responsibility |
|---|---|
| **Frontend (Next.js)** | Renders dashboard, meeting creation/scheduling forms, and join screens. Calls the backend via a typed API client. |
| **Routers** | Define REST endpoints, parse/validate input via Pydantic schemas, delegate to services. |
| **Services** | Contain business logic — generating meeting IDs, timestamps, and querying the DB. Kept separate from routers so logic is testable and reusable. |
| **Models (SQLAlchemy)** | Define the DB schema (`Meeting`, `Participant`) and map rows to Python objects. |
| **Database** | SQLite locally for zero-setup development; PostgreSQL in production via `DATABASE_URL`. |

<br />

## 2. Data Model

The schema is intentionally minimal: two tables, one relationship.

```mermaid
erDiagram
    MEETING ||--o{ PARTICIPANT : "has many"

    MEETING {
        int id PK
        string meeting_id UK "UUID, used in URLs"
        string title
        text description
        datetime scheduled_at "nullable — null for instant meetings"
        int duration_minutes
        datetime created_at
    }

    PARTICIPANT {
        int id PK
        string meeting_id FK "-> meeting.meeting_id"
        string display_name
        datetime joined_at
    }
```

**Notes:**
- `meeting_id` is a UUID string (not the auto-increment `id`) — this is the public identifier used in invite links (`/meeting/{meeting_id}`), so internal DB IDs are never exposed.
- A meeting with `scheduled_at = null` is treated as an **instant meeting**; a non-null value marks it as **scheduled**.
- `Participant.meeting_id` is a foreign key to `Meeting.meeting_id` (not the primary key), keeping the public UUID as the join key throughout the system.

<br />

## 3. API Design

REST API exposed by the FastAPI backend, grouped by resource:

```mermaid
graph LR
    subgraph "Meetings Resource"
        A["POST /meetings/<br/>Create instant meeting"]
        B["POST /meetings/schedule<br/>Create scheduled meeting"]
        C["GET /meetings/<br/>List all meetings"]
        D["GET /meetings/{meeting_id}<br/>Get one meeting"]
    end

    subgraph "Participants Resource"
        E["POST /meetings/{meeting_id}/join<br/>Join a meeting"]
    end
```

| Method | Endpoint | Request Body | Response | Notes |
|---|---|---|---|---|
| `POST` | `/meetings/` | `title?, description?, scheduled_at?, duration_minutes?` | `MeetingResponse` | Generates a UUID `meeting_id`, sets `created_at` server-side. |
| `POST` | `/meetings/schedule` | `title, description?, scheduled_at, duration_minutes (>0)` | `MeetingResponse` | Same as above but `title`, `scheduled_at`, `duration_minutes` are required. |
| `GET` | `/meetings/` | — | `MeetingResponse[]` | Ordered by `created_at` descending (most recent first). |
| `GET` | `/meetings/{meeting_id}` | — | `MeetingResponse` | 404 if not found. |
| `POST` | `/meetings/{meeting_id}/join` | `display_name` | `ParticipantResponse` | Records a participant against the meeting. |

Every `MeetingResponse` includes a computed `invite_link` field (`/meeting/{meeting_id}`) so the frontend never has to build the URL itself.

Validation is handled entirely by **Pydantic schemas** at the router boundary — invalid payloads are rejected with `422` before ever reaching the service layer.

<br />

## 4. Request Flows

### 4.1 Creating an instant meeting

```mermaid
sequenceDiagram
    actor U as User
    participant FE as Next.js Frontend
    participant API as FastAPI Router
    participant SVC as meeting_service
    participant DB as Database

    U->>FE: Click "New Meeting"
    FE->>API: POST /meetings/
    API->>API: Validate body (MeetingCreate schema)
    API->>SVC: create_meeting(db, data)
    SVC->>SVC: Generate UUID meeting_id
    SVC->>DB: INSERT INTO meetings
    DB-->>SVC: Persisted Meeting row
    SVC-->>API: Meeting object
    API-->>FE: MeetingResponse (incl. invite_link)
    FE-->>U: Show meeting + shareable link
```

### 4.2 Scheduling a future meeting

```mermaid
sequenceDiagram
    actor U as User
    participant FE as Next.js Frontend
    participant API as FastAPI Router
    participant SVC as meeting_service
    participant DB as Database

    U->>FE: Fill scheduling form (title, date, duration)
    FE->>API: POST /meetings/schedule
    API->>API: Validate body (ScheduledMeetingCreate)
    API->>SVC: schedule_meeting(...)
    SVC->>DB: INSERT INTO meetings (scheduled_at set)
    DB-->>SVC: Persisted Meeting row
    SVC-->>API: Meeting object
    API-->>FE: MeetingResponse
    FE-->>U: Meeting appears in "Upcoming"
```

### 4.3 Joining a meeting

```mermaid
sequenceDiagram
    actor U as User
    participant FE as Next.js Frontend
    participant API as FastAPI Router
    participant DB as Database

    U->>FE: Open invite link /meeting/{meeting_id}
    FE->>API: GET /meetings/{meeting_id}
    API->>DB: SELECT * FROM meetings WHERE meeting_id = ?
    alt Meeting found
        DB-->>API: Meeting row
        API-->>FE: 200 MeetingResponse
        FE-->>U: Show join screen (enter display name)
        U->>FE: Submit display name
        FE->>API: POST /meetings/{meeting_id}/join
        API->>DB: INSERT INTO participants
        DB-->>API: Persisted Participant row
        API-->>FE: 200 ParticipantResponse
        FE-->>U: Enter meeting room
    else Meeting not found
        DB-->>API: None
        API-->>FE: 404 Not Found
        FE-->>U: Show "Meeting not found" error
    end
```

<br />

## 5. Design Decisions

| Decision | Rationale |
|---|---|
| **UUID `meeting_id` separate from DB `id`** | Prevents leaking sequential primary keys in public URLs and avoids meeting IDs being guessable. |
| **Router / Service / Model separation** | Keeps HTTP concerns (validation, status codes) out of business logic, making services independently testable and reusable. |
| **Pydantic schemas for I/O** | Guarantees the API rejects malformed input before it reaches the database, and gives the frontend a strongly-typed contract (mirrored in TypeScript). |
| **SQLite for local dev, PostgreSQL for prod** | Zero-setup onboarding for new developers (no DB install needed) while still supporting a production-grade relational DB via `DATABASE_URL`. |
| **Stateless REST API** | No server-side session state — every request is self-contained, which makes the backend trivial to scale horizontally behind a load balancer. |

<br />

## 6. Future Improvements

- **Real-time video/audio** — integrate WebRTC (e.g. via a signaling server or a provider SDK) for actual video calls; today the app models meeting metadata and participants but does not carry media.
- **Authentication** — add user accounts so meetings can be tied to a host, with host-only controls (mute/remove participants, end meeting).
- **Real-time participant list** — use WebSockets to push live join/leave events to everyone in a meeting instead of relying on polling.
- **Notifications/reminders** — email or push reminders for scheduled meetings.
- **Rate limiting & abuse prevention** — throttle meeting creation and join attempts per IP/user.
- **Horizontal scaling** — since the API is stateless, it can be scaled out behind a load balancer; the database would then become the primary scaling bottleneck (mitigated via connection pooling and read replicas).
