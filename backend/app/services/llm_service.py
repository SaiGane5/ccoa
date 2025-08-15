import google.generativeai as genai
from app.core.config import settings
import logging
import json

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Configure the Gemini API client
genai.configure(api_key=settings.GOOGLE_API_KEY)
model = genai.GenerativeModel('gemini-1.5-flash')

def generate_onboarding_plan(repo_structure: str):
    """
    Uses Gemini to generate a personalized onboarding plan based on the repository structure.
    """
    prompt = f"""
    You are an expert Staff Engineer and mentor responsible for onboarding new developers.
    Based on the following file structure, generate a comprehensive and actionable learning path.
    Your output MUST be a single, valid JSON object. Do not include any text, markdown, or explanations outside of the JSON.

    For each step in the "learning_path", you must:
    1.  Provide a clear title and description.
    2.  List the most relevant files to review for that step.
    3.  Identify the key technologies or concepts (e.g., FastAPI, React Hooks, Docker).
    4.  Provide a list of "external_resources". For each resource, suggest a search query for finding high-quality tutorials, blogs, or official documentation. Do NOT provide real URLs. Frame it as a suggested search.

    Repository File Structure:
    {repo_structure}

    Example JSON output structure:
    {{
      "learning_path": [
        {{
          "step": 1,
          "title": "Project Setup & Core Frameworks",
          "description": "Understand the project's architecture, dependencies, and entry points. The backend is FastAPI and the frontend is React.",
          "files_to_review": ["package.json", "app/main.py", "docker-compose.yml"],
          "external_resources": [
            {{
              "type": "YouTube",
              "suggestion": "Search for 'FastAPI full course for beginners'"
            }},
            {{
              "type": "Blog",
              "suggestion": "Read about 'React functional components vs class components'"
            }},
            {{
              "type": "Official Docs",
              "suggestion": "Review the 'Docker Compose getting started' guide"
            }}
          ]
        }}
      ],
      "starter_tasks": [
        {{
          "title": "Improve API Documentation",
          "description": "Add detailed docstrings and examples to the Pydantic models in `app/models/schemas.py`.",
          "suggested_files": ["app/models/schemas.py"]
        }}
      ]
    }}
    """
    try:
        logger.info("Generating enhanced onboarding plan with Gemini...")
        response = model.generate_content(prompt)
        cleaned_response = response.text.strip().replace("``````", "")
        return json.loads(cleaned_response)
    except Exception as e:
        logger.error(f"Error generating onboarding plan with Gemini: {e}")
        logger.error(f"Gemini response was: {response.text if 'response' in locals() else 'No response received'}")
        raise

def generate_chat_response(query: str, context_documents: list, context_metadatas: list):
    """
    Generates a chat response with Google Search grounding enabled.
    """
    context_str = "\n\n---\n\n".join(
        [f"Source File: {meta['file_path']}\n\nContent:\n{doc}" for doc, meta in zip(context_documents, context_metadatas)]
    )
    
    prompt = f"""
    You are a helpful and brilliant AI assistant. Your primary goal is to help the user.

    - If the user's question is about the specifics of the codebase, answer based ONLY on the provided "Context from the codebase" below.
    - If the user asks for external resources, tutorials, YouTube videos, or general knowledge, search the web to find relevant and current information.
    - **CRITICAL**: When generating code snippets, ALWAYS wrap them in Markdown code fences with the language specified.

    ---
    **Context from the codebase:**
    {context_str}
    ---

    **User's Question:**
    {query}
    """
    
    try:
        logger.info("Generating chat response with Google Search grounding...")
        
        # Use Google's built-in search grounding for Gemini 1.5
        response = model.generate_content(
            prompt
        )
        
        return response.text
        
    except Exception as e:
        logger.error(f"Error generating chat response with Gemini: {e}")
        raise
