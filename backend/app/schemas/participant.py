from datetime import datetime

from pydantic import BaseModel


class ParticipantCreate(BaseModel):
    display_name: str


class ParticipantResponse(BaseModel):
    id: int
    meeting_id: str
    display_name: str
    joined_at: datetime