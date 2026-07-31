"""
Aegis Backend — Centralized Configuration

All settings are loaded from environment variables or a .env file.
Change DATABASE_URL to switch between SQLite and PostgreSQL.
"""

import os
from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    # ── App ──────────────────────────────────────────────────────────────
    APP_NAME: str = "Aegis"
    APP_VERSION: str = "1.0.0"
    APP_DESCRIPTION: str = "Real-time phishing and fraud detection platform"
    DEBUG: bool = False

    # ── Database ─────────────────────────────────────────────────────────
    # Default: async SQLite (zero config)
    # Postgres: postgresql+asyncpg://user:pass@host:5432/aegis
    DATABASE_URL: str = "sqlite+aiosqlite:///./aegis.db"

    # ── CORS ─────────────────────────────────────────────────────────────
    # Comma-separated origins, or "*" for dev
    CORS_ORIGINS: str = "*"

    # ── LLM (forwarded to ai.llm_explainer) ──────────────────────────────
    LLM_PROVIDER: str = "ollama"
    OLLAMA_MODEL: str = "llama3.1:8b"
    OLLAMA_URL: str = "http://localhost:11434/api/generate"
    GEMINI_API_KEY: str = ""

    @property
    def cors_origin_list(self) -> list[str]:
        if self.CORS_ORIGINS == "*":
            return ["*"]
        return [o.strip() for o in self.CORS_ORIGINS.split(",") if o.strip()]

    model_config = {"env_file": ".env", "env_file_encoding": "utf-8"}


@lru_cache
def get_settings() -> Settings:
    return Settings()
