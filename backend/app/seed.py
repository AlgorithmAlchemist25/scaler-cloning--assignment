"""
Seed script for the Zoom Clone database.

Usage (from the backend/ directory, with your venv active):
    python -m app.seed

Re-running it is safe — it clears existing sample rows first so you
don't end up with duplicates every time you run it.
"""

from datetime import datetime, timedelta, timezone
from uuid import uuid4

from app.database import Base, engine, SessionLocal
from app.models.meeting import Meeting
from app.models.participant import Participant


def seed():
    # Make sure tables exist (harmless if they already do)
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()

    try:
        # Wipe existing data so this script is idempotent
        db.query(Participant).delete()
        db.query(Meeting).delete()
        db.commit()

        now = datetime.now(timezone.utc)

        # --- Upcoming (scheduled) meetings -> shows in "Upcoming Meetings" ---
        upcoming_meetings = [
            Meeting(
                meeting_id=str(uuid4()),
                title="Product Roadmap Sync",
                description="Quarterly planning discussion with the product team.",
                scheduled_at=now + timedelta(days=1, hours=2),
                duration_minutes=45,
                created_at=now - timedelta(days=2),
            ),
            Meeting(
                meeting_id=str(uuid4()),
                title="Design Review",
                description="Walkthrough of the new onboarding flow mockups.",
                scheduled_at=now + timedelta(days=2, hours=5),
                duration_minutes=30,
                created_at=now - timedelta(days=1),
            ),
            Meeting(
                meeting_id=str(uuid4()),
                title="1:1 with Manager",
                description=None,
                scheduled_at=now + timedelta(days=3, hours=3),
                duration_minutes=15,
                created_at=now - timedelta(hours=6),
            ),
        ]

        # --- Past meetings -> could power a "Recent Meetings" section ---
        past_meetings = [
            Meeting(
                meeting_id=str(uuid4()),
                title="All-Hands Meeting",
                description="Company-wide monthly update.",
                scheduled_at=now - timedelta(days=3),
                duration_minutes=60,
                created_at=now - timedelta(days=4),
            ),
            Meeting(
                meeting_id=str(uuid4()),
                title="Sprint Retrospective",
                description="What went well, what didn't, action items.",
                scheduled_at=now - timedelta(days=7),
                duration_minutes=30,
                created_at=now - timedelta(days=8),
            ),
        ]

        # --- An instant meeting (no scheduled_at, like "New Meeting" creates) ---
        instant_meetings = [
            Meeting(
                meeting_id=str(uuid4()),
                title=None,
                description=None,
                scheduled_at=None,
                duration_minutes=None,
                created_at=now - timedelta(hours=1),
            ),
        ]

        all_meetings = upcoming_meetings + past_meetings + instant_meetings
        db.add_all(all_meetings)
        db.commit()

        for m in all_meetings:
            db.refresh(m)

        # --- Participants for a couple of the past meetings ---
        participants = [
            Participant(
                meeting_id=past_meetings[0].meeting_id,
                display_name="Alex Johnson",
                joined_at=past_meetings[0].scheduled_at,
            ),
            Participant(
                meeting_id=past_meetings[0].meeting_id,
                display_name="Priya Sharma",
                joined_at=past_meetings[0].scheduled_at + timedelta(minutes=2),
            ),
            Participant(
                meeting_id=past_meetings[1].meeting_id,
                display_name="Sam Lee",
                joined_at=past_meetings[1].scheduled_at,
            ),
        ]
        db.add_all(participants)
        db.commit()

        print(f"Seeded {len(all_meetings)} meetings and {len(participants)} participants.")
        for m in all_meetings:
            print(f"  - {m.meeting_id}  |  {m.title or '(instant meeting)'}")

    finally:
        db.close()


def seed_if_empty():
    """
    Seeds the database only when it holds no meetings yet.

    Hosted free tiers give each instance a fresh, empty disk, so the
    tables come back empty after every deploy, restart or wake-up.
    Running this on startup means the dashboard always has sample data
    to show, while the emptiness check keeps it from touching anything
    that was created while the instance was already up.
    """
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()

    try:
        already_populated = db.query(Meeting).first() is not None
    finally:
        db.close()

    if already_populated:
        print("Database already has meetings, skipping seed.")
        return False

    seed()

    return True


if __name__ == "__main__":
    seed()