from datetime import datetime, timezone
from uuid import uuid4

from sqlalchemy.orm import Session

from app.models.meeting import Meeting
from app.schemas.meeting import MeetingCreate


def create_meeting(db: Session, meeting_data: MeetingCreate) -> Meeting:
    meeting_id = str(uuid4())

    meeting = Meeting(
        meeting_id=meeting_id,
        title=meeting_data.title,
        description=meeting_data.description,
        scheduled_at=meeting_data.scheduled_at,
        duration_minutes=meeting_data.duration_minutes,
        created_at=datetime.now(timezone.utc),
    )

    db.add(meeting)
    db.commit()
    db.refresh(meeting)

    return meeting

def get_meetings(db: Session) -> list[Meeting]:
    return db.query(Meeting).order_by(Meeting.created_at.desc()).all()


def get_meeting(db: Session, meeting_id: str) -> Meeting | None:
    return (
        db.query(Meeting)
        .filter(Meeting.meeting_id == meeting_id)
        .first()
    )

def schedule_meeting(
    db: Session,
    title: str,
    description: str | None,
    scheduled_at: datetime,
    duration_minutes: int
) -> Meeting:

    meeting_id = str(uuid4())

    meeting = Meeting(
        meeting_id=meeting_id,
        title=title,
        description=description,
        scheduled_at=scheduled_at,
        duration_minutes=duration_minutes,
        created_at=datetime.now(timezone.utc),
    )

    db.add(meeting)
    db.commit()
    db.refresh(meeting)

    return meeting