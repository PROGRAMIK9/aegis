# ABBS Project

This project contains a Next.js frontend (`client`) and a FastAPI backend (`server`).

## Prerequisites

Ensure you have the following installed on your system:
- [bun](https://bun.sh/) (for the frontend)
- [uv](https://docs.astral.sh/uv/) (for the backend)
- Python 3.12+ (managed via `uv` or installed locally)

---

## Running the Application Locally

You will need two separate terminal windows to run the frontend and backend simultaneously.

### 1. Start the Backend (FastAPI)

Open a terminal and navigate to the `server` directory:

```bash
cd server
```

Install the dependencies (if you haven't already):

```bash
uv sync
```
*(Note: `uv` will automatically create a `.venv` virtual environment for you.)*

Run the FastAPI development server:

```bash
uv run fastapi dev main.py
```
*(Alternatively, you can run `uv run uvicorn main:app --reload`)*

The backend server will start at **http://localhost:8000** (or similar, check the terminal output).

---

### 2. Start the Frontend (Next.js)

Open a **new** terminal window and navigate to the `client` directory:

```bash
cd client
```

Install the Node.js dependencies using `bun`:

```bash
bun install
```

Run the Next.js development server:

```bash
bun run dev
```

The frontend will be available at **http://localhost:3000** (or similar, check the terminal output).
