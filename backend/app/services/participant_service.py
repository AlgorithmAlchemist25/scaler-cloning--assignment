from datetime import datetime, timezone

from sqlalchemy.orm import Session

from app.models.participant import Participant
from app.schemas.participant import ParticipantCreate


def join_meeting(
    db: Session,
    meeting_id: str,
    participant_data: ParticipantCreate
) -> Participant:

    participant = Participant(
        meeting_id=meeting_id,
        display_name=participant_data.display_name,
        joined_at=datetime.now(timezone.utc),
    )

    db.add(participant)
    db.commit()
    db.refresh(participant)

    return participant