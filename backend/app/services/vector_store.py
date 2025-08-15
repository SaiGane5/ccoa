from langchain_astradb import AstraDBVectorStore
from langchain_google_genai import GoogleGenerativeAIEmbeddings  # Fixed: AI not Ai
from app.core.config import settings
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class VectorStoreManager:
    """ Manages interactions with the Astra DB vector store. """
    def __init__(self):
        try:
            # Initialize Gemini embeddings model with correct class name
            self.embedding_model = GoogleGenerativeAIEmbeddings(
                model="models/embedding-001", 
                google_api_key=settings.GOOGLE_API_KEY
            )
            logger.info("Successfully initialized Google Generative AI Embeddings.")
        except Exception as e:
            logger.error(f"Failed to initialize embeddings: {e}")
            raise

    def get_or_create_collection(self, name: str):
        """
        Gets an AstraDBVectorStore instance for the given collection name.
        The collection is created automatically if it doesn't exist.
        """
        try:
            vector_store = AstraDBVectorStore(
                collection_name=name,
                embedding=self.embedding_model,
                api_endpoint=settings.ASTRA_DB_API_ENDPOINT,
                token=settings.ASTRA_DB_APPLICATION_TOKEN,
            )
            logger.info(f"Astra DB collection '{name}' accessed/created successfully.")
            return vector_store
        except Exception as e:
            logger.error(f"Failed to get or create Astra DB collection '{name}': {e}")
            raise

    def add_documents_to_collection(self, vector_store, documents: list, metadatas: list, ids: list):
        """ Adds documents with their metadata to the specified collection. """
        try:
            # AstraDBVectorStore's add_texts handles documents, metadatas, and ids
            vector_store.add_texts(texts=documents, metadatas=metadatas, ids=ids)
            logger.info(f"Added {len(documents)} documents to collection '{vector_store.collection_name}'.")
        except Exception as e:
            logger.error(f"Failed to add documents to collection '{vector_store.collection_name}': {e}")
            raise

    def query_collection(self, vector_store, query_text: str, n_results: int = 5):
        """
        Queries the collection to find the most relevant document chunks.
        Returns results in a format similar to the old ChromaDB response.
        """
        try:
            results = vector_store.similarity_search_with_score(query=query_text, k=n_results)
            logger.info(f"Query returned {len(results)} results.")

            # Format the results to match the expected structure
            documents = [[doc.page_content for doc, score in results]]
            metadatas = [[doc.metadata for doc, score in results]]

            return {"documents": documents, "metadatas": metadatas}
        except Exception as e:
            logger.error(f"Failed to query collection '{vector_store.collection_name}': {e}")
            return None

vector_store_manager = VectorStoreManager()
