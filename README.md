# Pushkar Gupta — Student Portfolio & COA Laboratory

A personal portfolio for a Computer Science Engineering student, combined with an
interactive **Computer Organization & Architecture (COA)** toolkit. Built as an
academic COA project.

- **Frontend:** React + Vite + Tailwind CSS
- **Backend:** FastAPI + SQLAlchemy
- **Database:** PostgreSQL in production, SQLite for local development
  (selected automatically via `DATABASE_URL`)

## Features

- Landing, Home, About (with resume preview + PDF download), Achievements
- **COA Lab**
  - *Instruction Set Addressing* — validates an infix expression, converts it to
    postfix, and generates correct **3-, 2-, 1-, and 0-address** instruction
    sequences with counts and a comparison view.
  - *Number System Converter* — arbitrary-base (2–36) conversion through a single
    BigInt pipeline, with per-base digit validation and a swap control.
  - *Assignments* — a persistent, admin-editable question archive backed by the
    database (add / edit / delete, filters, search).

## Project structure

```
COA-Portfolio-Lab/
├── src/                    # React frontend
│   ├── coa/                # COA algorithms (framework-agnostic)
│   │   ├── addressing/     # tokenizer, postfix, 3/2/1/0-address generators
│   │   └── numberSystems/  # validation + BigInt converter
│   ├── components/ layouts/ pages/ data/ services/ hooks/
│   └── main.jsx App.jsx index.css
├── server/                 # FastAPI backend
│   ├── main.py             # API routes, CORS, admin-token guard, lifespan init
│   ├── database.py         # DATABASE_URL → engine/session (PostgreSQL or SQLite)
│   ├── models.py           # SQLAlchemy Assignment model
│   ├── db.py               # repository functions (database-agnostic)
│   ├── requirements.txt
│   └── .env.example
├── public/                 # static assets (favicon, resume PDF)
├── tools/generate-resume.mjs
├── index.html vite.config.js package.json .env.example
└── README.md
```

---

## Local development

### 1. Backend (FastAPI)

```bash
cd server
python -m venv .venv
# Windows:
.venv\Scripts\activate
# macOS/Linux:
# source .venv/bin/activate

pip install -r requirements.txt
uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```

With no `DATABASE_URL` set, the backend uses a local SQLite file at
`server/assignments.db` (created automatically on first boot). The default local
admin token is `coa-lab-dev-token`.

Health check: `GET http://127.0.0.1:8000/api/health` →
`{"status":"ok","database":"sqlite"}`.

### 2. Frontend (React + Vite)

In a second terminal, from the project root:

```bash
npm install
npm run dev
```

Open `http://localhost:5173`. The Vite dev server proxies `/api/*` to
`http://127.0.0.1:8000` (see `vite.config.js`), so no `VITE_API_URL` is needed
locally.

### Editing assignments locally

1. Open **COA Lab → Assignments**.
2. Click **Admin** and enter the token (`coa-lab-dev-token` locally, or your
   `COA_ADMIN_TOKEN`).
3. Use **Add Assignment** / **Edit** / **Delete**. Reads are always public;
   writes require the token.

### Environment variables

| Variable           | Where    | Purpose                                                                 | Default (local)                  |
| ------------------ | -------- | ----------------------------------------------------------------------- | -------------------------------- |
| `DATABASE_URL`     | Backend  | PostgreSQL connection string. Unset → SQLite fallback.                   | `sqlite:///server/assignments.db`|
| `COA_ADMIN_TOKEN`  | Backend  | Token required (header `X-Admin-Token`) for create/update/delete.        | `coa-lab-dev-token`              |
| `FRONTEND_ORIGIN`  | Backend  | Comma-separated allowed CORS origins.                                    | `localhost:5173`, `127.0.0.1:5173`|
| `VITE_API_URL`     | Frontend | Backend origin, inlined at **build** time. Unset → same-origin `/api`.   | *(unset)*                        |

Copy `server/.env.example` and `.env.example` for reference. **Never commit real
secrets.**

---

## Production build (frontend)

```bash
npm run build     # outputs static site to dist/
npm run preview   # optional local preview of the production build
```

---

## Render deployment

The app deploys as **three Render resources**: a PostgreSQL database, a FastAPI
web service (backend), and a static site (frontend).

### Step 1 — Create the PostgreSQL database

1. Render dashboard → **New +** → **PostgreSQL**.
2. Name it (e.g. `coa-lab-db`), choose a plan/region, and **Create**.
3. Note its **Internal Database URL** (you will connect the backend to it).

### Step 2 — Create the FastAPI backend service

1. **New +** → **Web Service**, connect the repo containing this project.
2. **Root Directory:** `server`
3. **Runtime:** Python 3.
4. **Build Command:** `pip install -r requirements.txt`
5. **Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`
   (Render injects `$PORT` — do not hard-code a port.)
6. **Environment variables:**
   - `DATABASE_URL` = the PostgreSQL connection string from Step 1. Easiest:
     use **"From Database"** and select `coa-lab-db` → `connectionString`.
     Both `postgres://` and `postgresql://` forms work (they are normalized to
     the `psycopg` (v3) driver automatically).
   - `COA_ADMIN_TOKEN` = a strong random secret (this is the token you will type
     into the site's **Admin** field to edit assignments).
   - `FRONTEND_ORIGIN` = your deployed frontend origin from Step 3
     (e.g. `https://coa-lab-frontend.onrender.com`). This keeps CORS locked to
     your site instead of `*`.
7. **Deploy.** On first boot the app runs `Base.metadata.create_all()`, which
   creates the `assignments` table in the fresh PostgreSQL database — no manual
   SQL required.
8. Verify: `GET https://<backend>.onrender.com/api/health` →
   `{"status":"ok","database":"postgresql"}`.

### Step 3 — Create the frontend static site

1. **New +** → **Static Site**, connect the same repo.
2. **Root Directory:** *(leave as the repo root)*.
3. **Build Command:** `npm install && npm run build`
4. **Publish Directory:** `dist`
5. **Environment variable (build-time):**
   - `VITE_API_URL` = your backend origin from Step 2
     (e.g. `https://coa-lab-backend.onrender.com`).
   > Vite inlines `VITE_API_URL` during the build, so it must be set **before**
   > building. After changing it, trigger a rebuild.
6. **Deploy.**

### Step 4 — Wire CORS both ways

- Backend `FRONTEND_ORIGIN` = frontend site origin (Step 2.6).
- Frontend `VITE_API_URL` = backend origin (Step 3.5).

### Step 5 — Verify persistence in production

1. Open the deployed frontend.
2. Go to **COA Lab → Assignments**, click **Admin**, enter `COA_ADMIN_TOKEN`.
3. **Add** a question and save.
4. **Refresh** the page — the question is still there (it is in PostgreSQL).
5. In Render, **restart/redeploy** the backend service, then refresh the
   frontend again — the question **still** persists (it is not tied to the
   ephemeral container filesystem).
6. Delete any test question so no test data remains.

> The status pill on the Assignments page reads **CONNECTED · FastAPI + SQLite
> backend** or **CONNECTED · FastAPI + PostgreSQL** depending on the active
> engine, and **OFFLINE MODE** if the API cannot be reached (the UI then falls
> back to a temporary browser store — that fallback is **not** persistent across
> devices and is only a dev convenience).

---

## Database abstraction

The persistence layer is engine-agnostic:

```
React frontend
   └── src/services/assignments.js   →  REST /api/assignments
FastAPI (server/main.py)
   └── server/db.py                  →  repository functions (SQLAlchemy)
        └── server/database.py       →  engine from DATABASE_URL
             ├── PostgreSQL (prod, psycopg v3)
             └── SQLite     (local fallback)
```

Switching databases is purely a `DATABASE_URL` change — no code edits. Schema is
created automatically on startup via SQLAlchemy `create_all`. If you later want
versioned migrations, add **Alembic** against the same `Base.metadata`; the
model lives in `server/models.py`.

## Security notes

- Assignment **reads are public**; **writes require** `X-Admin-Token` to match
  `COA_ADMIN_TOKEN` (otherwise `401`).
- All input is validated server-side with Pydantic (length limits, difficulty
  allow-list, `http(s)` reference URLs). SQLAlchemy parameterizes all queries.
- CORS is restricted to `FRONTEND_ORIGIN` in production (no wildcard).
- Secrets come from environment variables only; none are committed.

## Regenerating the resume PDF

```bash
node tools/generate-resume.mjs   # writes public/resume/pushkar-gupta-resume.pdf
```
