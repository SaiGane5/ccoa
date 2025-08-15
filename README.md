# CCOA: Contextual Codebase Onboarding Assistant

A Gen-AI powered, repo-aware onboarding assistant that produces personalized learning paths, interactive Q&A with provenance, and starter tasks to ramp new engineers up to full productivity faster.



[![Project Status: Active][status-shield]][status-url]
[![Python Version: 3.11+][py-shield]][py-url]
[![React Version: 18.2+][react-shield]][react-url]
[![License: MIT][license-shield]][license-url]

---

### Table of Contents
1.  [About The Project](#about-the-project)
2.  [Core Features](#-core-features)
3.  [Tech Stack](#-tech-stack)
4.  [Architecture Overview](#-architecture-overview)
5.  [Getting Started](#-getting-started)
    * [Prerequisites](#prerequisites)
    * [Local Development Setup](#local-development-setup)
6.  [Deployment Instructions](#-deployment-instructions)
    * [Backend on Railway](#backend-on-railway)
    * [Frontend on Vercel](#frontend-on-vercel)
7.  [Project Structure](#-project-structure)
8.  [Contributing](#-contributing)
9.  [License](#-license)
10. [Contact](#-contact)

---

## About The Project

CCOA was built to solve a critical and expensive problem in software engineering: **the slow ramp-up time for new developers**. It can take weeks or even months for a new engineer to become fully productive, a process that often requires significant time from senior engineers for mentorship and knowledge transfer.

This project automates the initial discovery phase by transforming a complex codebase into a structured, interactive learning experience. CCOA analyzes a repository and generates a curated onboarding plan, suggests manageable "first tasks," and provides an AI-powered chat assistant that can answer questions about the code with direct citations, effectively surfacing "tribal knowledge" locked away in the codebase.

By leveraging a powerful backend and a modern AI stack, CCOA aims to dramatically reduce the time-to-productivity for new hires and free up senior developers to focus on more complex challenges.

---

## ✨ Core Features

* 🧠 **Personalized Learning Paths:** Ingests an entire codebase and generates a logical, step-by-step guide for new developers, complete with suggested readings.
* 📚 **External Resource Suggestions:** Automatically suggests relevant YouTube tutorials, blogs, and official documentation for the technologies found in the repo.
* 💬 **Interactive Q&A with Provenance:** Ask questions about the codebase (e.g., "How does authentication work?") and get answers backed by citations to the specific files and code chunks.
* 🔎 **Live Web Search:** The AI can perform live Google searches to answer general programming questions or find the latest documentation and tutorials.
* ✅ **Automated Starter Tasks:** Suggests "good first issues" or starter PRs based on an analysis of the repo's structure and complexity.
* 💾 **Persistent Onboarding Sessions:** Onboarding plans are cached, allowing users to instantly resume their session with a previously analyzed repository.

---

## 🛠️ Tech Stack

This project uses a modern, production-ready technology stack.

* **Backend:**
    * [Python 3.11](https://www.python.org/)
    * [FastAPI](https://fastapi.tiangolo.com/) for the robust API.
    * [Gunicorn](https://gunicorn.org/) as the production web server.
* **Frontend:**
    * [React 18](https://reactjs.org/) (with Vite)
    * [Tailwind CSS](https://tailwindcss.com/) for professional styling.
* **AI & Data:**
    * [Google Gemini API](https://ai.google.dev/) (Gemini 1.5 Flash) for embeddings and generative chat.
    * [Tool Calling](https://ai.google.dev/docs/function_calling) for live Google Search integration.
* **Database:**
    * [Astra DB](https://www.datastax.com/products/astra-db) (via DataStax) as the serverless, persistent vector store.
* **DevOps & Deployment:**
    * [Docker](https://www.docker.com/) & [Docker Compose](https://docs.docker.com/compose/)
    * [Railway](https://railway.app/) for backend deployment.
    * [Vercel](https://vercel.com/) for frontend deployment.

---

## 🏛️ Architecture Overview

CCOA uses a decoupled frontend/backend architecture, containerized for portability and deployed on modern serverless platforms.

```
+------------------+      +---------------------+      +-------------------+
| Vercel           |      | Railway             |      | External APIs     |
| +--------------+ |      | +-----------------+ |      | +---------------+ |
| | React        | | <=>  | | FastAPI         | | <=>  | | Google Gemini | |
| | Frontend     | |      | | (Docker)        | |      | +---------------+ |
| +--------------+ |      | +-----------------+ |      | +---------------+ |
+------------------+      |         |           |      | | SerpApi       | |
                        |         v           |      | +---------------+ |
                        | +-----------------+ |      +-------------------+
                        | | Astra DB        | |
                        | | (Vector Store)  | |
                        | +-----------------+ |
                        +---------------------+
```

---

## 🚀 Getting Started

Follow these steps to set up and run the project locally.

### Prerequisites

You'll need accounts and API keys for the following services:
* **Google Gemini API Key**: Get one from [Google AI Studio](https://aistudio.google.com/app/apikey).
* **Astra DB Credentials**:
    1.  Sign up for a free account at [DataStax Astra](https://astra.datastax.com/).
    2.  Create a **Vector Database**.
    3.  Copy the **API Endpoint** and generate a **Token**.
* **SerpApi API Key**: For the Google Search tool. Get one from [SerpApi](https://serpapi.com/).
* **Software**:
    * [Git](https://git-scm.com/)
    * [Python 3.11](https://www.python.org/downloads/release/python-3110/)
    * [Node.js](https://nodejs.org/) (v18+)
    * [Docker](https://www.docker.com/products/docker-desktop/)

### Local Development Setup

1.  **Clone the Repository**
    ```bash
    git clone [https://github.com/SaiGane5/ccoa.git](https://github.com/SaiGane5/ccoa.git)
    cd ccoa
    ```

2.  **Configure Environment Variables**
    * Navigate to the `backend/` directory.
    * Create a `.env` file from the example:
        ```bash
        cd backend
        cp ../.env.example .env
        ```
    * Edit the `.env` file and add all your API keys and credentials.

3.  **Set Up the Backend**
    ```bash
    # Still in the ccoa/backend/ directory
    python -m venv .venv
    source .venv/bin/activate
    pip install -r requirements.txt
    uvicorn app.main:app --reload
    ```

4.  **Set Up the Frontend**
    ```bash
    cd ../frontend
    npm install
    npm run dev
    ```

5.  **Run the Application with Docker (Recommended)**
    * From the root `ccoa/` directory, build and start the containers:
        ```bash
        docker-compose up --build
        ```
    * **Frontend UI:** `http://localhost:5173`
    * **Backend API Docs:** `http://localhost:8000/docs`

---

## 🛰️ Deployment Instructions

This project is designed for a seamless deployment on Vercel and Railway.

### Backend on Railway

1.  **Create a New Project**: In your Railway dashboard, create a new project and select "Deploy from a GitHub repo".
2.  **Select Your Repo**: Choose your forked CCOA repository.
3.  **Configure Service**:
    * Railway will ask what to deploy. Choose **"Deploy from a Dockerfile"**.
    * It will ask for the path. Enter: `./backend/Dockerfile`.
4.  **Add Environment Variables**: Go to the "Variables" tab for your new service and add all the secrets from your `.env` file (`GOOGLE_API_KEY`, `SERPAPI_API_KEY`, `ASTRA_DB_API_ENDPOINT`, etc.).
5.  **Get Public URL**: Go to the "Settings" tab and copy the public URL provided under the "Networking" section. You'll need this for the frontend.

### Frontend on Vercel

1.  **Create a New Project**: In your Vercel dashboard, create a new project and import your CCOA GitHub repository.
2.  **Configure Project Settings**:
    * **Framework Preset**: Should be auto-detected as `Vite`.
    * **Root Directory**: Set this to `frontend`.
3.  **Add Environment Variable**:
    * Go to the project's "Settings" -> "Environment Variables".
    * Add a new variable:
        * **Name**: `VITE_API_BASE_URL`
        * **Value**: Paste the public URL you copied from Railway.
4.  **Deploy**: Click the "Deploy" button. Vercel will build and deploy your frontend, connecting it to your live backend on Railway.

---

## 📁 Project Structure

The project uses a standard monorepo structure to separate backend and frontend concerns.

```
ccoa/
├── backend/            # FastAPI, Poetry, and all Python code
│   ├── app/
│   │   ├── api/
│   │   ├── core/
│   │   ├── models/
│   │   ├── services/
│   │   └── tools/
│   └── main.py
├── frontend/           # React, Vite, and all JavaScript/CSS code
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── hooks/
│   │   └── pages/
│   └── App.jsx
├── .env.example        # Template for environment variables
├── docker-compose.yml  # Docker orchestration for local dev
└── README.md
```

---

## 🙌 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 📧 Contact


Project Link: [https://github.com/SaiGane5/ccoa.git](https://github.com/SaiGane5/ccoa.git)


[status-shield]: https://img.shields.io/badge/status-active-success.svg
[status-url]: https://github.com/your-username/ccoa
[py-shield]: https://img.shields.io/badge/python-3.11+-blue.svg
[py-url]: https://www.python.org/
[react-shield]: https://img.shields.io/badge/react-18.2+-61DAFB.svg
[react-url]: https://reactjs.org/
[license-shield]: https://img.shields.io/github/license/othneildrew/Best-README-Template.svg?style=for-the-badge
[license-url]: https://github.com/your-username/ccoa/blob/main/LICENSE