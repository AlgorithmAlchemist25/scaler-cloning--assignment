import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine
from app.models import Meeting, Participant
from app.routers.meetings import router as meetings_router
from app.routers.participants import router as participants_router
from app.seed import seed_if_empty


Base.metadata.create_all(bind=engine)
seed_if_empty()

app = FastAPI(title="Zoom Clone API")

_default_origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3001",
]

_extra = os.environ.get("CORS_ORIGINS", "")
_origins = _default_origins + [o.strip() for o in _extra.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(meetings_router)
app.include_router(participants_router)


@app.get("/")
def root():
    return {"message": "Zoom Clone API is running"}