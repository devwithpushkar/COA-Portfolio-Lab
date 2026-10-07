"""Database configuration.

Production: PostgreSQL via the DATABASE_URL environment variable (Render
injects it automatically when a database is attached).
Local development: SQLite file next to this module when DATABASE_URL is unset.

The rest of the backend only talks to SQLAlchemy, so the UI/API never care
which engine is active.
"""
import os
from pathlib import Path

from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker

_DEFAULT_SQLITE_PATH = Path(__file__).parent / "assignments.db"


def normalize_database_url(url: str) -> str:
    """Map Render/Heroku-style postgres URLs onto the psycopg (v3) driver."""
    if url.startswith("postgres://"):
        return url.replace("postgres://", "postgresql+psycopg://", 1)
    if url.startswith("postgresql://"):
        return url.replace("postgresql://", "postgresql+psycopg://", 1)
    return url


def resolve_database_url() -> str:
    env_url = os.environ.get("DATABASE_URL", "").strip()
    if env_url:
        return normalize_database_url(env_url)
    return f"sqlite:///{_DEFAULT_SQLITE_PATH}"


DATABASE_URL = resolve_database_url()
IS_SQLITE = DATABASE_URL.startswith("sqlite")

# check_same_thread is required for SQLite under FastAPI's threadpool and
# invalid for other dialects. pool_pre_ping keeps idle PostgreSQL
# connections alive across Render restarts.
connect_args = {"check_same_thread": False} if IS_SQLITE else {}
engine = create_engine(DATABASE_URL, connect_args=connect_args, pool_pre_ping=True)

SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)


class Base(DeclarativeBase):
    pass


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db() -> None:
    """Create any missing tables. Idempotent — safe on every boot, so a
    freshly provisioned production database initializes without manual
    shell commands."""
    import models  # noqa: F401  (register mappers before create_all)

    Base.metadata.create_all(bind=engine)
