from datetime import datetime

from pydantic import BaseModel, Field


class MeetingCreate(BaseModel):
    title: str | None = None
    description: str | None = None
    scheduled_at: datetime | None = None
    duration_minutes: int | None = None


class ScheduledMeetingCreate(BaseModel):
    title: str
    description: str | None = None
    scheduled_at: datetime
    duration_minutes: int = Field(gt=0)


class MeetingResponse(BaseModel):
    id: int
    meeting_id: str
    title: str | None
    description: str | None
    scheduled_at: datetime | None
    duration_minutes: int | None
    created_at: datetime
    invite_link: str