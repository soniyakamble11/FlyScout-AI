import json
import re
from typing import Any, Dict, Optional, Type
from pydantic import BaseModel
from app.config.settings import settings
from app.logging.logger import logger


class LLMService:
    """Abstract base class for LLM services."""

    async def generate_text(self, prompt: str, system_instruction: Optional[str] = None) -> str:
        raise NotImplementedError

    async def generate_structured(
        self,
        prompt: str,
        response_schema: Type[BaseModel],
        system_instruction: Optional[str] = None
    ) -> BaseModel:
        raise NotImplementedError


class GeminiLLMService(LLMService):
    """
    Implementation of LLMService using Google Gemini API with fallback for structured schema parsing.
    """
    def __init__(self):
        self.api_key = settings.GEMINI_API_KEY
        self.candidate_models = ["gemini-3.6-flash", "gemini-flash-latest", "gemini-2.0-flash"]
        self.model_name = "gemini-3.6-flash"
        self._genai = None
        if self.api_key:
            try:
                import google.generativeai as genai
                genai.configure(api_key=self.api_key)
                self._genai = genai
                logger.info("Initialized Gemini LLM Service successfully.")
            except Exception as e:
                logger.warning(f"Gemini SDK initialization note: {e}")

    def _get_client(self, model_name: str):
        if self._genai:
            return self._genai.GenerativeModel(model_name)
        return None

    async def generate_text(self, prompt: str, system_instruction: Optional[str] = None) -> str:
        if self._genai:
            full_prompt = f"{system_instruction}\n\n{prompt}" if system_instruction else prompt
            for model_name in self.candidate_models:
                try:
                    client = self._get_client(model_name)
                    response = client.generate_content(full_prompt)
                    return response.text
                except Exception as e:
                    logger.warning(f"Gemini model '{model_name}' text call failed: {e}")
        return f"Generated insight response for: {prompt[:60]}..."

    async def generate_structured(
        self,
        prompt: str,
        response_schema: Type[BaseModel],
        system_instruction: Optional[str] = None
    ) -> BaseModel:
        if self._genai:
            full_prompt = (
                f"{system_instruction or ''}\n\n"
                f"Return ONLY valid JSON matching this schema: {json.dumps(response_schema.model_json_schema())}\n\n"
                f"PROMPT: {prompt}"
            )
            for model_name in self.candidate_models:
                try:
                    client = self._get_client(model_name)
                    response = client.generate_content(
                        full_prompt,
                        generation_config={"response_mime_type": "application/json"}
                    )
                    clean_text = re.sub(r"```json\n?|\n?```", "", response.text).strip()
                    raw_json = json.loads(clean_text)
                    return response_schema.model_validate(raw_json)
                except Exception as e:
                    logger.warning(f"Structured Gemini model '{model_name}' call failed: {e}")
        raise RuntimeError("LLM Service fallback triggered.")

    async def generate_json(self, prompt: str, system_instruction: Optional[str] = None) -> Any:
        """Generates raw parsed JSON (dict or list) using Gemini JSON mode."""
        if self._genai:
            full_prompt = (
                f"{system_instruction or ''}\n\n"
                "Return ONLY valid JSON without markdown fences, commentary, or extra text.\n\n"
                f"PROMPT: {prompt}"
            )
            for model_name in self.candidate_models:
                try:
                    client = self._get_client(model_name)
                    response = client.generate_content(
                        full_prompt,
                        generation_config={"response_mime_type": "application/json"}
                    )
                    raw_text = response.text.strip()
                    clean_text = re.sub(r"^```json\s*|\s*```$", "", raw_text, flags=re.MULTILINE).strip()
                    json_match = re.search(r'(\[.*\]|\{.*\})', clean_text, re.DOTALL)
                    if json_match:
                        clean_text = json_match.group(1)
                    return json.loads(clean_text)
                except Exception as e:
                    logger.warning(f"Gemini model '{model_name}' JSON generation failed: {e}")
        return None


