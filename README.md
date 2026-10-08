# COA Portfolio & Interactive Computer Organization and Architecture Toolkit

A personal academic portfolio for a Computer Science Engineering student, combined
with an interactive **Computer Organization & Architecture (COA)** learning lab.
It pairs portfolio content (profile, about, achievements, résumé) with working COA
utilities — an instruction-addressing simulator, a number-system converter, and a
database-backed assignment archive — all served through a real full-stack
architecture rather than a static site.

**Live frontend:** https://coa-portfolio.onrender.com
**Live backend:** https://coa-portfolio-api.onrender.com
**Repository:** https://github.com/devwithpushkar/COA-Portfolio-Lab

[![Live Demo](https://img.shields.io/badge/Live%20Demo-coa--portfolio.onrender.com-f5b544?logo=googlechrome&logoColor=111)](https://coa-portfolio.onrender.com)
[![API Health](https://img.shields.io/badge/API%20Health-FastAPI%20%2B%20PostgreSQL-00a98e?logo=fastapi&logoColor=white)](https://coa-portfolio-api.onrender.com/api/health)
![React](https://img.shields.io/badge/React-18-149eca?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6-646cff?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?logo=tailwindcss&logoColor=white)
![SQLAlchemy](https://img.shields.io/badge/SQLAlchemy-2.0-d71f00?logo=sqlalchemy&logoColor=white)
![Render](https://img.shields.io/badge/Deployed%20on-Render-46e3b7?logo=render&logoColor=111)

| | |
|---|---|
| **Author** | Pushkar Gupta |
| **University** | Chandigarh University — UID 25BAI10034 |
| **Program** | B.E. Computer Science Engineering (Expected graduation: 2029) |

---

## Project Overview

This project started as an academic COA assignment and grew into a small
full-stack application. The goal was to combine several things that are usually
kept separate:

- **Academic portfolio presentation** — who the student is, what he studies, and
  what he has built.
- **Computer Organization & Architecture concepts** — instruction addressing and
  number systems, implemented as real, working tools rather than write-ups.
- **Interactive learning utilities** — a live instruction-format simulator and a
  base converter that a visitor can actually use.
- **Assignment management** — a persistent question archive that can be extended
  after deployment without touching frontend code.
- **A real backend/database architecture** — the assignment content lives in an
  API-backed database, not hardcoded in the React bundle.

The result is deliberately not "just a static portfolio." The academic content is
static where that makes sense, but the assignment system is a genuine
React → FastAPI → PostgreSQL implementation with protected write operations and
server-side persistence.

---

## Live Application

| Resource | URL |
|---|---|
| Frontend (React static site) | https://coa-portfolio.onrender.com |
| Backend (FastAPI web service) | https://coa-portfolio-api.onrender.com |
| Backend health endpoint | https://coa-portfolio-api.onrender.com/api/health |
| Source repository | https://github.com/devwithpushkar/COA-Portfolio-Lab |

The deployed application runs the full stack:

```
React frontend  →  FastAPI backend  →  PostgreSQL database
```

The health endpoint reports the active database engine. In production it returns
`{"status":"ok","database":"postgresql"}`, confirming the backend is connected to
PostgreSQL (locally, with no `DATABASE_URL` set, it reports `sqlite`). No
credentials are required to read it, and none are exposed by it.

---

## Features

### Portfolio

- **Landing page** — an entrance experience with a subtle register/bus motif.
- **Home** — a student "command center": identity, academics, and quick highlights.
- **About Me** — introduction, academic interests, goals, categorized technical
  skills, and selected projects.
- **Résumé** — inline PDF preview plus a direct **Download Resume** button
  (`public/resume/pushkar-gupta-resume.pdf`).
- **Achievements** — a data-driven archive (certifications, academics, projects,
  competitions, hackathons, internships) rendered from structured data.
- **Responsive navigation** and a custom **404** page.

### COA Laboratory

- **Instruction Set Address Format simulator** — see the dedicated section below.
- **Number System Converter** — see the dedicated section below.
- **Assignments** — a persistent, admin-editable question archive backed by the
  database.

### Assignments

- Assignment **listing** with expandable cards.
- Assignment **details and answers** shown inline when a card is expanded.
- **Search** across title, question, topic, category, and notes.
- **Filters** by topic and by difficulty.
- **API-based create / update / delete**, protected by admin-token authentication.
- **Persistent, database-backed records** — PostgreSQL in production, SQLite locally.
- A live status banner shows the active engine
  (`CONNECTED · FastAPI + PostgreSQL backend`) or an offline fallback state.
- An **Assignment 1 — Source Document** viewer at the bottom of the page embeds a
  sanitized copy of the assignment PDF (`public/assignment-1.pdf`) using the
  browser's native PDF viewer, with **Download** and **Open in new tab** actions.
  The published document contains only the questions and answers — all
  source-student identity and submission metadata are removed. Regenerate it with
  `node tools/generate-assignment.mjs`.

---

## Interactive COA Tools

### Instruction Set Address Format Simulator

Accepts an arithmetic expression such as:

```
A + B * (C - D)
```

Supported input: single-letter variables `A–Z`, operators `+ - * /`, and
parentheses. The expression is tokenized and **validated** (invalid characters,
missing operands, unbalanced parentheses, and bad operator sequences all produce
clear, position-aware errors). It is then converted from infix to **postfix
(RPN)** and compiled into instruction sequences for all four addressing
organizations:

- **Three-address** — `OP dest, src1, src2` (one instruction per operation).
- **Two-address** — `OP dest, src`, with `MOV` loading values in.
- **One-address** — accumulator machine with an implicit `AC` operand and memory
  temporaries.
- **Zero-address** — stack machine with operands implicit on the top of stack.

The tool shows the postfix form and the detected variables, displays a **per-format
instruction count**, and renders an **instruction-count comparison** across the four
formats (with the honest caveat that fewer instructions is not universally
"better" — it depends on the expression and the machine model).

### Number System Converter

Converts between number systems through a single normalized pipeline
(input → validate for the source base → internal value → render in the target base):

- **Standard systems:** decimal, binary, octal, hexadecimal (one-click presets).
- **Additional systems:** ternary, quaternary, quinary, senary, duodecimal, base-36.
- **Custom bases:** any radix from **2 to 36**.
- **Arbitrary precision** via a `BigInt` internal representation.
- **Validation** of digits against the selected base (e.g. base 2 rejects `2`),
  with support for a leading sign.
- A **Swap** control to reverse source/target, a **copy** button for the result,
  and a decimal preview of the parsed value.

---

## Assignment System

The assignment archive is a small but complete full-stack feature:

- **FastAPI REST API** exposing assignment CRUD.
- **SQLAlchemy 2.0** ORM with a declarative `Assignment` model.
- **PostgreSQL** in production; **SQLite** as a zero-setup local fallback,
  selected automatically from `DATABASE_URL`.
- **Admin-token authentication** on all write operations (create/update/delete);
  reads are public.
- **Server-side persistence** — questions are stored in the database, not
  hardcoded into the React frontend, so new questions can be added after
  deployment without a code change or rebuild.

Each assignment record supports these fields: `title`, `question`, `topic`,
`category`, `date`, `difficulty`, `notes`, `answer`, `solution`, and `reference`
(plus managed `created_at` / `updated_at` timestamps).

The deployed database currently contains the imported **COA Assignment 1**
question set (12 questions, with their source answers) alongside pre-existing
assignment data. Source-student identifying information is deliberately **not**
stored in any public-facing assignment field.

---

## Architecture

```
Browser
   │
   ▼
React + Vite + Tailwind CSS  (Render Static Site)
   │
   │  REST over HTTPS  (/api/...)
   ▼
FastAPI  (Render Web Service)
   │  routes · CORS · admin-token guard · Pydantic validation
   ▼
SQLAlchemy  (ORM)
   │
   ├── PostgreSQL   (Production — persistent)
   │
   └── SQLite       (Local development fallback)
```

- **Frontend (React + Vite + Tailwind):** pages, layouts, and the COA algorithms.
  The COA logic lives under `src/coa/` and is framework-agnostic, so it is
  testable independently of React. `src/services/assignments.js` is the single API
  client, with a transparent browser-store fallback if the API is unreachable.
- **FastAPI:** defines the REST routes, CORS policy, the admin-token guard, and
  Pydantic request validation. Tables are created automatically on startup via a
  lifespan hook (`Base.metadata.create_all`), so a freshly provisioned database
  initializes itself.
- **SQLAlchemy:** the persistence layer. The API and repository code
  (`server/db.py`) only talk to SQLAlchemy, so the engine can change without
  touching application logic.
- **PostgreSQL / SQLite:** production uses PostgreSQL for durable storage; local
  development falls back to a SQLite file when `DATABASE_URL` is unset.

---

## Database

| Environment | Engine | Notes |
|---|---|---|
| Production | **PostgreSQL** | Durable storage that survives Render restarts and redeploys. |
| Local development | **SQLite** | Zero-setup file at `server/assignments.db`, created on first boot. |

- **ORM:** SQLAlchemy 2.0 (`server/models.py` defines the `Assignment` model).
- **Engine selection** is driven entirely by `DATABASE_URL`. `postgres://` and
  `postgresql://` connection strings are normalized to the `psycopg` (v3) driver
  automatically, so no code change is needed to switch databases.
- **Why this setup:** PostgreSQL gives the deployed site real persistence, while
  SQLite keeps local development simple (no database server to install).
- Assignment data is **persisted server-side**, never hardcoded into the React
  bundle. The local SQLite file is runtime data and is git-ignored.

---

## API

All routes are served by the FastAPI backend under `/api`. Reads are public;
writes require the `X-Admin-Token` header to match the server's
`COA_ADMIN_TOKEN` (otherwise the request is rejected with `401`).

| Method | Endpoint | Purpose | Auth |
|---|---|---|---|
| `GET` | `/api/health` | Liveness + active database engine (`sqlite` \| `postgresql`) | Public |
| `GET` | `/api/assignments` | List all assignments | Public |
| `POST` | `/api/assignments` | Create an assignment (returns `201`) | Admin token |
| `PUT` | `/api/assignments/{id}` | Update an assignment | Admin token |
| `DELETE` | `/api/assignments/{id}` | Delete an assignment | Admin token |

Requests are validated server-side with Pydantic (field length limits, a
difficulty allow-list, and `http(s)` validation for `reference`). The admin token
is supplied via environment variable and is **never** documented here.

---

## Environment Variables

Secrets are provided through environment variables only and must **never** be
committed to Git.

| Variable | Service | Purpose |
|---|---|---|
| `DATABASE_URL` | Backend | PostgreSQL connection string. Unset → local SQLite fallback. |
| `COA_ADMIN_TOKEN` | Backend | Token required (header `X-Admin-Token`) for create/update/delete. |
| `FRONTEND_ORIGIN` | Backend | Comma-separated list of allowed CORS origins. Unset → local dev origins. |
| `VITE_API_URL` | Frontend | Backend origin, inlined at **build** time. Unset → same-origin `/api` (dev proxy). |

Placeholder values (`.env`-style):

```dotenv
# Backend
DATABASE_URL=<your-postgresql-connection-string>
COA_ADMIN_TOKEN=<your-admin-token>
FRONTEND_ORIGIN=<your-frontend-origin>

# Frontend (build time)
VITE_API_URL=<backend-url>
```

Templates are provided at `.env.example` (frontend) and `server/.env.example`
(backend); they document keys only and contain no secrets. If `COA_ADMIN_TOKEN`
is unset locally, the backend falls back to a development default defined in
`server/main.py` — always set a strong value for any real deployment.

---

## Local Development

### Prerequisites

- **Node.js** (for the frontend)
- **Python 3** (for the backend)

### 1. Clone the repository

```bash
git clone https://github.com/devwithpushkar/COA-Portfolio-Lab.git
cd COA-Portfolio-Lab
```

### 2. Backend (FastAPI)

```bash
cd server
python -m venv .venv

# Windows
.venv\Scripts\activate
# macOS / Linux
# source .venv/bin/activate

pip install -r requirements.txt
uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```

With no `DATABASE_URL` set, the backend uses a local SQLite file at
`server/assignments.db`, created automatically on first boot.

- Backend: `http://127.0.0.1:8000`
- Health: `http://127.0.0.1:8000/api/health` → `{"status":"ok","database":"sqlite"}`
- Interactive API docs (FastAPI): `http://127.0.0.1:8000/docs`

### 3. Frontend (React + Vite)

From the project root, in a second terminal:

```bash
npm install
npm run dev
```

- Frontend: `http://localhost:5173`

The Vite dev server proxies `/api/*` to `http://127.0.0.1:8000` (see
`vite.config.js`), so no `VITE_API_URL` is needed in local development.

### Editing assignments locally

1. Open **COA Lab → Assignments**.
2. Click **Admin** and enter your `COA_ADMIN_TOKEN` (locally, the development
   default from `server/main.py` if you have not set one).
3. Use **Add Assignment** / **Edit** / **Delete**. Reads are always public;
   writes require the token.

### Production build (frontend)

```bash
npm run build     # outputs the static site to dist/
npm run preview   # optional local preview of the production build
```

---

## Production Deployment (Render)

The app deploys as three Render resources. Deployment is configured through the
Render dashboard; the repository does not include a CI/CD pipeline.

### PostgreSQL

Create a Render **PostgreSQL** instance and note its connection string. The
backend accepts it via `DATABASE_URL` (both `postgres://` and `postgresql://`
forms work).

### Backend — Render Web Service

- **Root Directory:** `server`
- **Runtime:** Python 3
- **Build command:** `pip install -r requirements.txt`
- **Start command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`
  (Render injects `$PORT` — the port is not hardcoded.)
- **Environment variables:**
  - `DATABASE_URL` — the PostgreSQL connection string (Render can supply this
    "from database").
  - `COA_ADMIN_TOKEN` — a strong random secret used for write authentication.
  - `FRONTEND_ORIGIN` — the deployed frontend origin, to keep CORS locked down
    instead of using a wildcard.

On first boot the service runs `Base.metadata.create_all()`, creating the
`assignments` table in the fresh database — no manual SQL required.

### Frontend — Render Static Site

- **Build command:** `npm install && npm run build`
- **Publish directory:** `dist`
- **Environment variable (build time):**
  - `VITE_API_URL` — the deployed backend origin.

> Vite inlines `VITE_API_URL` **at build time**, so it must be set before the
> build runs. After changing it, trigger a rebuild/redeploy.

### Wiring it together

- Backend `FRONTEND_ORIGIN` = the frontend site origin (CORS).
- Frontend `VITE_API_URL` = the backend origin (API calls).

---

## Project Structure

```
COA-Portfolio-Lab/
├── public/                     # Static assets
│   ├── favicon.svg
│   ├── assignment-1.pdf        # Sanitized Assignment 1 source document
│   └── resume/
│       └── pushkar-gupta-resume.pdf
├── server/                     # FastAPI backend
│   ├── main.py                 # Routes, CORS, admin-token guard, lifespan init
│   ├── database.py             # DATABASE_URL → engine/session (PostgreSQL | SQLite)
│   ├── models.py               # SQLAlchemy Assignment model
│   ├── db.py                   # Engine-agnostic repository functions
│   ├── requirements.txt
│   └── .env.example
├── src/                        # React frontend
│   ├── coa/                    # Framework-agnostic COA algorithms
│   │   ├── addressing/         # tokenizer, postfix, 3/2/1/0-address generators
│   │   └── numberSystems/      # validation + BigInt converter
│   ├── components/             # Reveal, SectionHeading
│   ├── data/                   # profile, achievements, projects, skills
│   ├── hooks/                  # useDocumentTitle
│   ├── layouts/                # MainLayout, LabLayout
│   ├── pages/                  # Landing, Home, About, Achievements, NotFound
│   │   └── lab/                # AddressingTool, NumberSystems, Assignments
│   ├── services/               # assignments.js — API client + local fallback
│   ├── App.jsx                 # Route definitions
│   ├── main.jsx
│   └── index.css               # Tailwind v4 theme
├── tools/
│   ├── generate-resume.mjs     # Regenerates the résumé PDF (pdfkit)
│   └── generate-assignment.mjs # Regenerates the sanitized Assignment 1 PDF (pdfkit)
├── index.html
├── vite.config.js              # Dev server + /api proxy
├── package.json
├── .env.example                # Frontend env template (VITE_API_URL)
└── README.md
```

Routes (React Router): `/` (Landing), `/home`, `/about`, `/achievements`, and the
COA Lab at `/lab` → `/lab/addressing`, `/lab/number-systems`, `/lab/assignments`,
with a catch-all 404.

---

## Data / Assignment Import

Assignment records are inserted through the **protected backend API**
(`POST /api/assignments` with the `X-Admin-Token` header) — the database is not
manipulated directly, and the API is the single source of truth for writes.

The current deployment contains the **COA Assignment 1** dataset (12 questions
with their source answers), imported from a submitted assignment document through
that authenticated endpoint. This data lives in the **production PostgreSQL
database** as runtime data; it is **not** committed to Git. Source-student
personal information is intentionally excluded from all public-facing assignment
fields.

---

## Security & Configuration Notes

- **Write protection:** create/update/delete require `X-Admin-Token` to match
  `COA_ADMIN_TOKEN`; a missing or wrong token returns `401`. Reads are public.
- **CORS:** allowed origins come from `FRONTEND_ORIGIN` in production (no
  wildcard); local development allows the Vite dev origins.
- **Secrets:** the admin token and database connection string are supplied
  through environment variables and are never committed.
- **Input validation:** requests are validated server-side with Pydantic, and
  SQLAlchemy parameterizes queries.
- **Persistence:** PostgreSQL provides durable production storage that survives
  service restarts and redeploys.

These are practical, honest controls for a project of this scope — not a claim of
hardened, production-grade security.

---

## Testing / Verification

There is **no formal automated test suite** in the repository. The following are
**manual verification checks** that have actually been performed:

- **Frontend build:** `npm run build` completes successfully and emits the static
  bundle to `dist/`.
- **Backend health:** `GET /api/health` returns `{"status":"ok", ...}` locally
  (`database: sqlite`) and in production (`database: postgresql`).
- **Production PostgreSQL connectivity:** confirmed via the production health
  endpoint reporting `postgresql`.
- **Assignment API:** create / read / update / delete exercised against the API,
  including a `401` check for missing/invalid admin token.
- **Assignment persistence:** a record inserted, the backend restarted, and the
  record confirmed to still be present (verified locally on SQLite and reflected
  in the production PostgreSQL dataset).
- **Deployed UI:** the live Assignments page shows the PostgreSQL-backed status
  banner, renders the imported question cards, expands to show answers, and loads
  with a clean browser console.

---

## Current Status

**Status: Production Deployed**

- Frontend deployed (Render Static Site).
- Backend deployed (Render Web Service).
- PostgreSQL connected and serving assignment data.
- COA tools (addressing simulator, number-system converter) available.
- Assignment system operational with admin-protected writes.
- Production assignment data populated (COA Assignment 1 set + existing records).

---

## Known Limitations

- **Deep-link refresh on the static host.** Directly navigating to (or refreshing)
  `https://coa-portfolio.onrender.com/lab/assignments` returns a static-host `404`,
  because the Render Static Site currently has **no SPA rewrite rule**. This does
  **not** affect normal use:
  - the root site loads correctly,
  - React Router client-side navigation works,
  - the Assignments page loads correctly through the application, and
  - the deployed assignment data works.

  Adding an SPA fallback (e.g. a `/* → /index.html 200` rewrite) would resolve
  this; it is intentionally left as a documented, unimplemented improvement.

---

## Future Improvements

- Add SPA rewrite configuration so deep links and refreshes resolve on the static host.
- Improve assignment import tooling.
- Add richer assignment filtering/search.
- Add automated tests (COA algorithms and API).
- Move beyond a single admin token if the application's scope expands.

---

## Author

**Pushkar Gupta**
B.E. Computer Science & Engineering — Chandigarh University
Expected Graduation: 2029

- GitHub: https://github.com/devwithpushkar
- LinkedIn: https://linkedin.com/in/pushkargupta-
