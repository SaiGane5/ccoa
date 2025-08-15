import os
import git
import tempfile
from langchain.text_splitter import RecursiveCharacterTextSplitter
from pathlib import Path
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Supported file extensions for ingestion
SUPPORTED_EXTENSIONS = {
    '.py', '.js', '.jsx', '.ts', '.tsx', '.md', '.json', '.html', '.css', 
    '.yml', '.yaml', '.dockerfile', 'Dockerfile', '.java', '.go', '.rs', '.c', '.cpp'
}

def clone_repo(repo_url: str) -> str:
    """ Clones a public GitHub repository to a temporary directory. """
    try:
        temp_dir = tempfile.mkdtemp()
        logger.info(f"Cloning {repo_url} into {temp_dir}")
        git.Repo.clone_from(repo_url, temp_dir)
        logger.info("Repository cloned successfully.")
        return temp_dir
    except Exception as e:
        logger.error(f"Failed to clone repository: {e}")
        raise

def load_and_split_documents(repo_path: str) -> (list, list, list):
    """
    Loads all supported files from the cloned repo, splits them into chunks,
    and prepares them for embedding.
    """
    documents = []
    metadatas = []
    
    # Using RecursiveCharacterTextSplitter, which is good for code
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=2000,
        chunk_overlap=200,
        length_function=len,
    )

    repo_path_obj = Path(repo_path)
    
    for file_path in repo_path_obj.rglob('*'):
        if file_path.is_file() and file_path.suffix in SUPPORTED_EXTENSIONS:
            # Avoid ingesting git files or other large, irrelevant binaries
            if ".git" in str(file_path):
                continue
            
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                # Split the document content into chunks
                chunks = text_splitter.split_text(content)
                
                for i, chunk in enumerate(chunks):
                    relative_path = str(file_path.relative_to(repo_path_obj))
                    documents.append(chunk)
                    metadatas.append({'file_path': relative_path, 'chunk_index': i})

            except Exception as e:
                logger.warning(f"Could not read or process file {file_path}: {e}")

    # Create unique IDs for each chunk to be stored in ChromaDB
    ids = [f"{meta['file_path']}_{meta['chunk_index']}" for meta in metadatas]
    
    logger.info(f"Loaded and split {len(documents)} document chunks from the repository.")
    return documents, metadatas, ids