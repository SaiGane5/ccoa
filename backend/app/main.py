from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1 import onboarding
from app.core.config import settings

app = FastAPI(
    title="Contextual Codebase Onboarding Assistant (CCOA)",
    description="API for the CCOA project",
    version="1.0.0"
)

# ~ Define the specific origins that are allowed to make requests.
allowed_origins = [
    "https://ccoa-smoky.vercel.app",  # Your production frontend
    "http://localhost:5173",         # Your local development frontend
]

# ~ Update the CORS Middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins, # Use the specific list of origins
    allow_credentials=True,
    allow_methods=["*"],           # Allows all methods (GET, POST, etc.)
    allow_headers=["*"],           # Allows all headers
)

@app.get("/", tags=["Root"])
async def read_root():
    """ A simple health check endpoint. """
    return {"message": "CCOA Backend is running!"}

# Include the API router
app.include_router(onboarding.router, prefix=settings.API_V1_STR, tags=["Onboarding"])