from pydantic import BaseModel, Field
from typing import List, Optional

class OnboardRequest(BaseModel):
    """ Request model for onboarding a new repository. """
    repo_url: str = Field(..., example="https://github.com/tiangolo/fastapi")

class ExternalResource(BaseModel):
    type: str = Field(..., example="YouTube")
    suggestion: str = Field(..., example="Search for 'FastAPI dependency injection tutorial'")

class LearningStep(BaseModel):
    step: int
    title: str
    description: str
    files_to_review: List[str]
    # + Add the new field to the learning step
    external_resources: List[ExternalResource]

class StarterTask(BaseModel):
    """ A suggested starter task for the new engineer. """
    title: str
    description: str
    suggested_files: List[str]

class OnboardResponse(BaseModel):
    """ Response model after a repository has been successfully onboarded. """
    learning_path: List[LearningStep]
    starter_tasks: List[StarterTask]
    message: str

class ChatRequest(BaseModel):
    """ Request model for a chat query. """
    session_id: str # Represents the repo being discussed, e.g., the collection name
    query: str

class Provenance(BaseModel):
    """ Source document information for citation. """
    file_path: str
    content_chunk: str

class ChatResponse(BaseModel):
    """ Response model for a chat query, including provenance. """
    answer: str
    provenance: List[Provenance]