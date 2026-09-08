from sqlalchemy import Column, Integer, String, DateTime, ForeignKey

from app.database import Base


class Participant(Base):
    __tablename__ = "participants"

    id = Column(Integer, primary_key=True, index=True)
    meeting_id = Column(
        String,
        ForeignKey("meetings.meeting_id"),
        nullable=False
    )
    display_name = Column(String, nullable=False)
    joined_at = Column(DateTime, nullable=False)