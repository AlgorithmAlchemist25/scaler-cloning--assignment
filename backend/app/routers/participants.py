from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.participant import (
    ParticipantCreate,
    ParticipantResponse
)
from app.services.meeting_service import get_meeting
from app.services.participant_service import join_meeting


router = APIRouter(
    prefix="/meetings",
    tags=["Participants"]
)


@router.post(
    "/{meeting_id}/join",
    response_model=ParticipantResponse
)
def join_existing_meeting(
    meeting_id: str,
    participant_data: ParticipantCreate,
    db: Session = Depends(get_db)
):
    meeting = get_meeting(db, meeting_id)

    if not meeting:
        raise HTTPException(
            status_code=404,
            detail="Meeting not found"
        )

    participant = join_meeting(
        db,
        meeting_id,
        participant_data
    )

    return participant