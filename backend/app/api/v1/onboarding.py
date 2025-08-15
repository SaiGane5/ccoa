from fastapi import APIRouter, HTTPException
from app.models.schemas import OnboardRequest, OnboardResponse, ChatRequest, ChatResponse, Provenance
from app.services import ingestion, llm_service
from app.services.vector_store import vector_store_manager
import os
import shutil
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter()

def get_repo_structure(path: str, limit: int = 50) -> str:
    """ Creates a string representation of the repo's file structure. """
    structure = []
    count = 0
    for root, _, files in os.walk(path):
        if '.git' in root:
            continue
        level = root.replace(path, '').count(os.sep)
        indent = ' ' * 4 * level
        structure.append(f'{indent}{os.path.basename(root)}/')
        sub_indent = ' ' * 4 * (level + 1)
        for f in files:
            if count >= limit:
                structure.append(f'{sub_indent}...')
                return "\n".join(structure)
            structure.append(f'{sub_indent}{f}')
            count += 1
    return "\n".join(structure)

def generate_collection_name(repo_url: str) -> str:
    """ Generates a ChromaDB-compatible collection name from a repo URL. """
    return repo_url.replace("https://", "").replace("/", "_").replace(".", "_")


@router.post("/onboard", response_model=OnboardResponse)
async def onboard_repository(request: OnboardRequest):
    """
    Onboards a new repository: clones it, processes files, creates embeddings,
    and generates an initial learning plan.
    """
    repo_path = None
    try:
        # 1. Clone the repository
        repo_path = ingestion.clone_repo(request.repo_url)

        # 2. Generate a unique collection name for this repo
        collection_name = generate_collection_name(request.repo_url)
        collection = vector_store_manager.get_or_create_collection(collection_name)

        # 3. Load, split, and embed documents
        documents, metadatas, ids = ingestion.load_and_split_documents(repo_path)
        if not documents:
            raise HTTPException(status_code=400, detail="No supported files found in the repository.")
        
        vector_store_manager.add_documents_to_collection(collection, documents, metadatas, ids)

        # 4. Generate onboarding plan with LLM
        repo_structure = get_repo_structure(repo_path)
        plan_data = llm_service.generate_onboarding_plan(repo_structure)
        
        return OnboardResponse(
            learning_path=plan_data['learning_path'],
            starter_tasks=plan_data['starter_tasks'],
            message=f"Successfully onboarded {request.repo_url}. You can now start asking questions."
        )

    except Exception as e:
        logger.error(f"Onboarding failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        # 5. Clean up the cloned repo
        if repo_path and os.path.exists(repo_path):
            shutil.rmtree(repo_path)
            logger.info(f"Cleaned up temporary directory: {repo_path}")


@router.post("/chat", response_model=ChatResponse)
async def chat_with_repo(request: ChatRequest):
    """
    Handles a user's chat query about a previously onboarded repository.
    """
    try:
        collection_name = request.session_id # The collection name is the session ID
        collection = vector_store_manager.get_or_create_collection(collection_name)

        # 1. Query vector store for relevant context
        query_results = vector_store_manager.query_collection(
            collection,
            request.query,
            n_results=5
        )

        if not query_results or not query_results.get('documents'):
            return ChatResponse(answer="I couldn't find any relevant information in the codebase to answer your question.", provenance=[])
        
        context_docs = query_results['documents'][0]
        context_metadatas = query_results['metadatas'][0]

        # 2. Generate response with LLM using the context
        answer = llm_service.generate_chat_response(request.query, context_docs, context_metadatas)

        # 3. Format provenance
        provenance = [
            Provenance(file_path=meta['file_path'], content_chunk=doc)
            for doc, meta in zip(context_docs, context_metadatas)
        ]

        return ChatResponse(answer=answer, provenance=provenance)

    except Exception as e:
        logger.error(f"Chat failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))