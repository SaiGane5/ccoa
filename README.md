# CCOA: Contextual Codebase Onboarding Assistant

A Gen-AI powered, repo-aware onboarding assistant that produces personalized learning paths, interactive Q&A with provenance, and starter tasks to ramp new engineers up to full productivity faster.



---

## ✨ Core Features

* **Personalized Learning Paths:** Ingests a whole codebase and generates a step-by-step guide for new developers.
* **Interactive Q&A with Provenance:** Ask questions about the codebase and get answers backed by citations to the specific files and line numbers.
* **Automated Starter Tasks:** Suggests "good first issues" or starter PRs based on an analysis of the repo's structure and complexity.
* **Multi-Source Ingestion:** Understands source code, `READMEs`, and other documentation files.

---

## 🏛️ Architecture Overview

CCOA uses a modern, containerized stack:

* **Frontend:** A clean UI built with **React (Vite)** and styled with **Tailwind CSS**.
* **Backend:** A robust API powered by **FastAPI** (Python).
* **AI/ML:** Orchestration of **Google Gemini** for generation and embeddings.
* **Vector Store:** **ChromaDB** for efficient, local-first storage and retrieval of codebase embeddings.
* **DevOps:** **Docker** and **Docker Compose** for consistent development and production environments.

```
+---------------------+      +------------------------+      +--------------------+
|   React Frontend    | <=>  |    FastAPI Backend     | <=>  |   Google Gemini    |
| (localhost:5173)    |      |    (localhost:8000)    |      |   (API for LLM &   |
+---------------------+      +------------------------+      |    Embeddings)     |
                             |           |            |      +--------------------+
                             |           v            |
                             |  +------------------+  |
                             |  |  ChromaDB        |  |
                             |  | (Vector Store)   |  |
                             |  +------------------+  |
                             +------------------------+
```

---

## 📁 Folder Structure

The project is organized into a `backend` and `frontend` monorepo structure.

```
ccoa/
├── backend/
│   ├── app/
│   │   ├── api/              # FastAPI routers/endpoints
│   │   │   └── v1/
│   │   │       └── onboarding.py
│   │   ├── core/             # Configuration and settings
│   │   │   └── config.py
│   │   ├── models/           # Pydantic data models
│   │   │   └── schemas.py
│   │   ├── services/         # Core business logic
│   │   │   ├── ingestion.py    # Git cloning, parsing, chunking
│   │   │   ├── llm_service.py  # Gemini API interactions
│   │   │   └── vector_store.py # ChromaDB management
│   │   └── main.py           # FastAPI app entrypoint
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/       # Reusable React components
│   │   │   ├── ChatWindow.jsx
│   │   │   └── LearningPlan.jsx
│   │   ├── App.jsx           # Main application component
│   │   └── index.css         # Tailwind CSS directives
│   ├── Dockerfile.prod
│   ├── package.json
│   └── vite.config.js
├── .env.example
├── .gitignore
├── docker-compose.yml
└── README.md
```

---

## 🛠️ Project Setup & Installation

Follow these steps to get the CCOA running locally.

### Prerequisites

* **Docker** and **Docker Compose**
* **Git**
* A **Google Gemini API Key**. You can get one for free from [Google AI Studio](https://aistudio.google.com/app/apikey).

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd ccoa
```

### 2. Configure Environment Variables

Create a `.env` file by copying the example file.

```bash
cp .env.example .env
```

Now, open the `.env` file and add your Google Gemini API Key:

```env
# .env
GOOGLE_API_KEY="YOUR_GEMINI_API_KEY_HERE"
```

### 3. Build and Run with Docker Compose

This single command will build the frontend and backend Docker images and start the services.

```bash
docker-compose up --build
```

### 4. Access the Application

* **Frontend UI:** Open your browser and navigate to `http://localhost:5173`
* **Backend API Docs:** Open your browser and navigate to `http://localhost:8000/docs`

You are now ready to start onboarding! Enter a public GitHub repository URL and see the magic happen.

---