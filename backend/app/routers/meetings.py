from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.meeting import (
    MeetingCreate,
    MeetingResponse,
    ScheduledMeetingCreate
)
from app.services.meeting_service import (
    create_meeting,
    schedule_meeting,
    get_meetings,
    get_meeting
)


router = APIRouter(
    prefix="/meetings",
    tags=["Meetings"]
)


@router.post("/", response_model=MeetingResponse)
def create_new_meeting(
    meeting_data: MeetingCreate,
    db: Session = Depends(get_db)
):
    meeting = create_meeting(db, meeting_data)

    return MeetingResponse(
        id=meeting.id,
        meeting_id=meeting.meeting_id,
        title=meeting.title,
        description=meeting.description,
        scheduled_at=meeting.scheduled_at,
        duration_minutes=meeting.duration_minutes,
        created_at=meeting.created_at,
        invite_link=f"/meeting/{meeting.meeting_id}"
    )


@router.post("/schedule", response_model=MeetingResponse)
def schedule_new_meeting(
    meeting_data: ScheduledMeetingCreate,
    db: Session = Depends(get_db)
):
    meeting = schedule_meeting(
        db=db,
        title=meeting_data.title,
        description=meeting_data.description,
        scheduled_at=meeting_data.scheduled_at,
        duration_minutes=meeting_data.duration_minutes
    )

    return MeetingResponse(
        id=meeting.id,
        meeting_id=meeting.meeting_id,
        title=meeting.title,
        description=meeting.description,
        scheduled_at=meeting.scheduled_at,
        duration_minutes=meeting.duration_minutes,
        created_at=meeting.created_at,
        invite_link=f"/meeting/{meeting.meeting_id}"
    )


@router.get("/", response_model=list[MeetingResponse])
def get_all_meetings(db: Session = Depends(get_db)):
    meetings = get_meetings(db)

    return [
        MeetingResponse(
            id=meeting.id,
            meeting_id=meeting.meeting_id,
            title=meeting.title,
            description=meeting.description,
            scheduled_at=meeting.scheduled_at,
            duration_minutes=meeting.duration_minutes,
            created_at=meeting.created_at,
            invite_link=f"/meeting/{meeting.meeting_id}"
        )
        for meeting in meetings
    ]


@router.get("/{meeting_id}", response_model=MeetingResponse)
def get_single_meeting(
    meeting_id: str,
    db: Session = Depends(get_db)
):
    meeting = get_meeting(db, meeting_id)

    if not meeting:
        raise HTTPException(
            status_code=404,
            detail="Meeting not found"
        )

    return MeetingResponse(
        id=meeting.id,
        meeting_id=meeting.meeting_id,
        title=meeting.title,
        description=meeting.description,
        scheduled_at=meeting.scheduled_at,
        duration_minutes=meeting.duration_minutes,
        created_at=meeting.created_at,
        invite_link=f"/meeting/{meeting.meeting_id}"
    )