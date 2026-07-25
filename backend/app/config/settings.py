import os
from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field

class Settings(BaseSettings):
    """
    Centralized Application Settings using Pydantic Settings.
    All attributes are validated and read from environment variables.
    """
    # Metadata
    APP_NAME: str = Field(default="FlyScout AI", description="Name of the application")
    APP_VERSION: str = Field(default="1.0.0", description="Version of the application")
    ENVIRONMENT: str = Field(default="development", description="Execution environment")
    LOG_LEVEL: str = Field(default="INFO", description="Global log verbosity level")

    # URLs & Security
    BACKEND_URL: str = Field(default="http://localhost:8000", description="Backend server base URL")
    FRONTEND_URL: str = Field(default="http://localhost:5173", description="Frontend application base URL")
    ALLOWED_ORIGINS: List[str] = Field(
        default=["http://localhost:5173", "https://fly-scout-ai-omega.vercel.app"],
        description="Allowed CORS origins"
    )

    # API Keys
    GEMINI_API_KEY: str = Field(default="", description="Google Gemini LLM API Key")
    TAVILY_API_KEY: str = Field(default="", description="Tavily AI Search API Key")
    HUNTER_API_KEY: str = Field(default="", description="Hunter.io Contact Discovery API Key")

    # Execution Parameters
    CACHE_TTL: int = Field(default=3600, description="Cache time-to-live in seconds")
    REQUEST_TIMEOUT: int = Field(default=30, description="Global HTTP request timeout in seconds")

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore"
    )

# Global Settings Singleton
settings = Settings()
