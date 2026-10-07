"""Assignment repository — database-agnostic persistence built on SQLAlchemy.

Works identically against SQLite (local dev) and PostgreSQL (production);
the active engine is decided in database.py from DATABASE_URL.
"""
from sqlalchemy import select
from sqlalchemy.orm import Session

from models import Assignment

FIELDS = [
    "title", "question", "topic", "category", "date",
    "difficulty", "notes", "answer", "solution", "reference",
]


def to_dict(a: Assignment) -> dict:
    return {
        "id": a.id,
        **{f: getattr(a, f) for f in FIELDS},
        "created_at": a.created_at.isoformat() if a.created_at else None,
        "updated_at": a.updated_at.isoformat() if a.updated_at else None,
    }


def list_assignments(db: Session) -> list[dict]:
    stmt = select(Assignment).order_by(Assignment.date.desc(), Assignment.id.desc())
    return [to_dict(a) for a in db.scalars(stmt).all()]


def get_assignment(db: Session, assignment_id: int) -> Assignment | None:
    return db.get(Assignment, assignment_id)


def create_assignment(db: Session, data: dict) -> dict:
    assignment = Assignment(**{f: data.get(f, "") for f in FIELDS})
    db.add(assignment)
    db.commit()
    db.refresh(assignment)
    return to_dict(assignment)


def update_assignment(db: Session, assignment_id: int, data: dict) -> dict | None:
    assignment = db.get(Assignment, assignment_id)
    if assignment is None:
        return None
    for f in FIELDS:
        setattr(assignment, f, data.get(f, ""))
    db.commit()
    db.refresh(assignment)
    return to_dict(assignment)


def delete_assignment(db: Session, assignment_id: int) -> bool:
    assignment = db.get(Assignment, assignment_id)
    if assignment is None:
        return False
    db.delete(assignment)
    db.commit()
    return True
