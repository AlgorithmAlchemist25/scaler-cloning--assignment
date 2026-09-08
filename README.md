<div align="center">
  <img src="https://raw.githubusercontent.com/tandpfun/skill-icons/65dea6c4eaca7da319e552c09f4caa5a20f5c2d6/icons/NextJS-Dark.svg" width="60" alt="Next.js" />
  <img src="https://raw.githubusercontent.com/tandpfun/skill-icons/65dea6c4eaca7da319e552c09f4caa5a20f5c2d6/icons/FastAPI.svg" width="60" alt="FastAPI" />
  <img src="https://raw.githubusercontent.com/tandpfun/skill-icons/65dea6c4eaca7da319e552c09f4caa5a20f5c2d6/icons/PostgreSQL-Dark.svg" width="60" alt="PostgreSQL" />
  <img src="https://raw.githubusercontent.com/tandpfun/skill-icons/65dea6c4eaca7da319e552c09f4caa5a20f5c2d6/icons/Vercel-Dark.svg" width="60" alt="Vercel" />
   <h1>Zoom Clone</h1>
  <p><strong>A full-stack video-meeting scheduling app inspired by Zoom, built with Next.js and FastAPI.</strong></p>

  <p>
    <a href="#live-demo">Live Demo</a> •
    <a href="#architecture">Architecture</a> •
    <a href="#features">Features</a> •
    <a href="#getting-started">Getting Started</a> •
    <a href="#api-endpoints">API</a>
  </p>
</div>
---

## 🌍 Live Demo

| Layer    | URL |
|----------|-----|
| Frontend | https://newfrontend-liard.vercel.app/ |
| Backend API | https://scaler-cloning-assignment.onrender.com|
| API Docs (Swagger) | https://scaler-cloning-assignment.onrender.com/docs |

<br />

## ⚡ Overview

Zoom Clone lets users create instant meetings, schedule meetings for a future date/time, and join meetings via a shareable link and display name. The frontend is a Next.js dashboard; the backend is a FastAPI REST service backed by a SQL database (SQLite locally, PostgreSQL in production).

<br />

## 🏛️ Architecture

```mermaid
graph TD
    Client[Client Browser]

    subgraph Frontend Hosting
        Frontend[Next.js App]
    end

    subgraph Backend Hosting
        API[FastAPI Backend / Uvicorn]
        DB[(SQLite / PostgreSQL)]
    end

    Client <-->|HTTPS| Frontend
    Client <-->|REST API calls| API
    API <-->|SQLAlchemy ORM| DB

    classDef frontend fill:#000000,stroke:#fff,stroke-width:1px,color:#fff;
    classDef backend fill:#46E3B7,stroke:#333,stroke-width:1px;

    class Frontend frontend;
    class API,DB backend;
```

### Components
- **Frontend** — Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4. Talks to the backend over plain REST calls (`fetch`), configured via `NEXT_PUBLIC_API_URL`.
- **Backend** — FastAPI + Uvicorn, with Pydantic schemas for request/response validation and CORS restricted to allowed frontend origins.
- **Data layer** — SQLAlchemy ORM. Defaults to a local SQLite file for development; swaps to PostgreSQL in production via the `DATABASE_URL` environment variable.

<br />

## ✨ Features

- 🚀 **Instant meetings** — create a meeting and get a shareable invite link right away
- 📅 **Scheduled meetings** — plan a meeting for a future date/time with a title, description, and duration
- 🔗 **Join by link** — join any meeting using its meeting ID and a display name
- 🖥️ **Dashboard** — view upcoming meetings, recent activity, and quick actions
- 📄 **Auto-generated API docs** — interactive Swagger UI provided out of the box by FastAPI

<br />

## 🛠️ Tech Stack

**Frontend**
- [Next.js](https://nextjs.org) 16 (App Router)
- React 19 + TypeScript
- Tailwind CSS 4

**Backend**
- [FastAPI](https://fastapi.tiangolo.com/)
- SQLAlchemy (ORM)
- SQLite (local dev) / PostgreSQL (production)
- Uvicorn (ASGI server)

<br />

## 📁 Project Structure

```
ZOOM/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI app entrypoint
│   │   ├── database.py          # DB engine/session config
│   │   ├── models/              # SQLAlchemy models (Meeting, Participant)
│   │   ├── schemas/             # Pydantic request/response schemas
│   │   ├── routers/             # API route handlers
│   │   ├── services/            # Business logic
│   │   └── seed.py              # Seeds sample data on first run
│   ├── requirements.txt
│   └── Procfile                 # For deployment (e.g. Render/Heroku)
│
└── frontend/
    ├── app/                     # Next.js App Router pages
    ├── components/              # UI components (dashboard, meeting, modals)
    ├── lib/                     # API client, types, helpers
    └── package.json
```

<br />

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18+
- [Python](https://www.python.org/) 3.10+

### 1. Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate      # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

The API will be running at **http://127.0.0.1:8000**.
Interactive API docs are available at **http://127.0.0.1:8000/docs**.

By default, the backend uses a local SQLite database (`zoom_clone.db`), which is created automatically and seeded with sample data on first run.

### 2. Frontend Setup

In a new terminal:

```bash
cd frontend
npm install
npm run dev
```

The app will be running at **http://localhost:3000**.

### 3. Environment Variables

Create a `.env.local` file inside `frontend/` if your backend isn't running on the default URL:

```
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
```

For the backend, you can optionally set:

```
DATABASE_URL=postgresql://user:password@host:port/dbname
CORS_ORIGINS=https://your-frontend-domain.com
```

<br />

## 📡 API Endpoints

| Method | Endpoint                      | Description                     |
|--------|--------------------------------|----------------------------------|
| GET    | `/meetings/`                   | List all meetings               |
| POST   | `/meetings/`                   | Create an instant meeting       |
| POST   | `/meetings/schedule`           | Schedule a future meeting       |
| GET    | `/meetings/{meeting_id}`       | Get details of a single meeting |
| POST   | `/meetings/{meeting_id}/join`  | Join a meeting as a participant |

<br />

## ☁️ Deployment

- **Backend** — the included `Procfile` (`uvicorn app.main:app --host 0.0.0.0 --port $PORT`) works out of the box on platforms like Render, Railway, or Heroku. Set `DATABASE_URL` to a managed PostgreSQL instance for production.
- **Frontend** — deploy easily on [Vercel](https://vercel.com/new), setting `NEXT_PUBLIC_API_URL` to your deployed backend URL.

<br />
