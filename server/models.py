from datetime import datetime, timezone

from sqlalchemy import DateTime, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from database import Base


def _utcnow() -> datetime:
    return datetime.now(timezone.utc)


class Assignment(Base):
    __tablename__ = "assignments"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    question: Mapped[str] = mapped_column(Text, nullable=False)
    topic: Mapped[str] = mapped_column(String(120), nullable=False, default="")
    category: Mapped[str] = mapped_column(String(120), nullable=False, default="")
    date: Mapped[str] = mapped_column(String(40), nullable=False, default="")
    difficulty: Mapped[str] = mapped_column(String(20), nullable=False, default="Medium")
    notes: Mapped[str] = mapped_column(Text, nullable=False, default="")
    answer: Mapped[str] = mapped_column(Text, nullable=False, default="")
    solution: Mapped[str] = mapped_column(Text, nullable=False, default="")
    reference: Mapped[str] = mapped_column(String(500), nullable=False, default="")
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, default=_utcnow)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, default=_utcnow, onupdate=_utcnow
    )
