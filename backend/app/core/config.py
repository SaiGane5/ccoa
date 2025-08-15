import os
from dotenv import load_dotenv

# Load environment variables from a .env file
load_dotenv()

class Settings:
    """
    Application settings loaded from environment variables.
    """
    PROJECT_NAME: str = "CCOA"
    API_V1_STR: str = "/api/v1"
    GOOGLE_API_KEY: str = os.getenv("GOOGLE_API_KEY")
    SERPAPI_API_KEY: str = os.getenv("SERPAPI_API_KEY")

    ASTRA_DB_API_ENDPOINT: str = os.getenv("ASTRA_DB_API_ENDPOINT")
    ASTRA_DB_APPLICATION_TOKEN: str = os.getenv("ASTRA_DB_APPLICATION_TOKEN")

settings = Settings()