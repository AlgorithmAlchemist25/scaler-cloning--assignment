from datetime import datetime, timezone

from sqlalchemy.orm import Session

from fastapi import HTTPException, status

from app.models.meeting import Meeting
from app.models.participant import Participant
from app.schemas.participant import ParticipantCreate


def join_meeting(
    db: Session,
    meeting_id: str,
    participant_data: ParticipantCreate
) -> Participant:

    meeting = (
        db.query(Meeting)
        .filter(Meeting.meeting_id == meeting_id)
        .first()
    )

    if meeting is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Meeting not found")

    participant = Participant(
        meeting_id=meeting_id,
        display_name=participant_data.display_name,
        joined_at=datetime.now(timezone.utc),
    )

    db.add(participant)
    db.commit()
    db.refresh(participant)

    return participant