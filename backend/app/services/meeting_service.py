from datetime import datetime, timezone, timedelta
from uuid import uuid4

from sqlalchemy.orm import Session

from app.models.meeting import Meeting
from app.schemas.meeting import MeetingCreate
from app.schemas.meeting import ScheduledMeetingCreate;


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
    india_timezone = timezone(timedelta(hours=5, minutes=30))
    now = datetime.now(india_timezone).replace(tzinfo=None)

    return (
        db.query(Meeting)
        .filter(
            Meeting.scheduled_at.isnot(None),
            Meeting.scheduled_at > now
        )
        .order_by(Meeting.scheduled_at.asc())
        .all()
    )


def get_meeting(db: Session, meeting_id: str) -> Meeting | None:
    return (
        db.query(Meeting)
        .filter(Meeting.meeting_id == meeting_id)
        .first()
    )

def schedule_meeting(
    db: Session,
    meeting_data: ScheduledMeetingCreate
) -> Meeting:

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