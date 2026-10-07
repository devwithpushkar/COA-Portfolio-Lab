import os
from contextlib import asynccontextmanager

from fastapi import Depends, FastAPI, Header, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, field_validator
from sqlalchemy.orm import Session

import db
from database import IS_SQLITE, get_db, init_db

ADMIN_TOKEN = os.environ.get("COA_ADMIN_TOKEN", "coa-lab-dev-token")
ALLOWED_DIFFICULTIES = {"Easy", "Medium", "Hard"}

DEV_ORIGINS = ["http://localhost:5173", "http://127.0.0.1:5173"]
_frontend_origin = os.environ.get("FRONTEND_ORIGIN", "").strip()
ALLOW_ORIGINS = (
    [o.strip() for o in _frontend_origin.split(",") if o.strip()]
    if _frontend_origin
    else DEV_ORIGINS
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Creates tables on first boot — a freshly provisioned production
    # database initializes itself, no manual shell commands required.
    init_db()
    yield


app = FastAPI(title="COA Lab Assignments API", version="2.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOW_ORIGINS,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)


class AssignmentIn(BaseModel):
    title: str = Field(min_length=1, max_length=200)
    question: str = Field(min_length=1, max_length=8000)
    topic: str = Field(default="", max_length=120)
    category: str = Field(default="", max_length=120)
    date: str = Field(default="", max_length=40)
    difficulty: str = Field(default="Medium", max_length=20)
    notes: str = Field(default="", max_length=4000)
    answer: str = Field(default="", max_length=8000)
    solution: str = Field(default="", max_length=8000)
    reference: str = Field(default="", max_length=500)

    @field_validator("title", "question")
    @classmethod
    def not_blank(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("must not be blank")
        return v.strip()

    @field_validator("difficulty")
    @classmethod
    def valid_difficulty(cls, v: str) -> str:
        return v if v in ALLOWED_DIFFICULTIES else "Medium"

    @field_validator("reference")
    @classmethod
    def safe_reference(cls, v: str) -> str:
        v = v.strip()
        if v and not (v.startswith("http://") or v.startswith("https://")):
            raise ValueError("reference must be a valid http(s) URL or empty")
        return v


def require_admin(x_admin_token: str = Header(default="")) -> None:
    if x_admin_token != ADMIN_TOKEN:
        raise HTTPException(status_code=401, detail="Invalid or missing admin token")


@app.get("/api/health")
def health() -> dict:
    return {"status": "ok", "database": "sqlite" if IS_SQLITE else "postgresql"}


@app.get("/api/assignments")
def read_assignments(session: Session = Depends(get_db)) -> dict:
    return {"items": db.list_assignments(session)}


@app.post("/api/assignments", status_code=201)
def create_assignment(
    payload: AssignmentIn,
    session: Session = Depends(get_db),
    _: None = Depends(require_admin),
) -> dict:
    return db.create_assignment(session, payload.model_dump())


@app.put("/api/assignments/{assignment_id}")
def update_assignment(
    assignment_id: int,
    payload: AssignmentIn,
    session: Session = Depends(get_db),
    _: None = Depends(require_admin),
) -> dict:
    updated = db.update_assignment(session, assignment_id, payload.model_dump())
    if updated is None:
        raise HTTPException(status_code=404, detail="Assignment not found")
    return updated


@app.delete("/api/assignments/{assignment_id}")
def delete_assignment(
    assignment_id: int,
    session: Session = Depends(get_db),
    _: None = Depends(require_admin),
) -> dict:
    if not db.delete_assignment(session, assignment_id):
        raise HTTPException(status_code=404, detail="Assignment not found")
    return {"deleted": assignment_id}
