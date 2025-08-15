from serpapi import GoogleSearch
from app.core.config import settings
import json

def search(query: str):
    """
    Performs a Google search for the given query using SerpApi and returns the top organic results.
    
    Args:
        query (str): The search query.
        
    Returns:
        str: A JSON string of the search results.
    """
    params = {
        "engine": "google",
        "q": query,
        "api_key": settings.SERPAPI_API_KEY,
    }

    search_client = GoogleSearch(params)
    results = search_client.get_dict()
    
    organic_results = results.get("organic_results", [])
    
    # Extract relevant info from the top 5 results
    simplified_results = []
    for result in organic_results[:5]:
        simplified_results.append({
            "title": result.get("title"),
            "link": result.get("link"),
            "snippet": result.get("snippet"),
        })

    return json.dumps(simplified_results)

# Define the tool for the Gemini model
google_search_tool = {
    "name": "google_search",
    "description": "Get information from Google Search. Use this to find external resources, tutorials, documentation, and up-to-date information.",
    "parameters": {
        "type": "OBJECT",
        "properties": {
            "query": {
                "type": "STRING",
                "description": "The search query."
            }
        },
        "required": ["query"]
    }
}