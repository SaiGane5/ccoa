from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1 import onboarding
from app.core.config import settings

app = FastAPI(
    title="Contextual Codebase Onboarding Assistant (CCOA)",
    description="API for the CCOA project",
    version="1.0.0"
)

# CORS (Cross-Origin Resource Sharing) Middleware
# This is necessary to allow the frontend (running on a different port)
# to communicate with the backend.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)


@app.get("/", tags=["Root"])
async def read_root():
    """ A simple health check endpoint. """
    return {"message": "CCOA Backend is running!"}


# Include the API router
app.include_router(onboarding.router, prefix=settings.API_V1_STR, tags=["Onboarding"])