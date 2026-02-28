"""
RAG (Retrieval Augmented Generation) Chatbot Service
Uses Groq Cloud API for fast LLM inference with portfolio context
"""

import os
from typing import Dict, Any, Optional
from groq import Groq
from dotenv import load_dotenv
from portfolio_knowledge import get_knowledge_base

# Load environment variables
load_dotenv()


class GroqRAGService:
    """Service for handling RAG queries using Groq Cloud API."""
    
    def __init__(self, model: str = "llama-3.3-70b-versatile"):
        """
        Initialize the Groq RAG service.
        
        Args:
            model: The Groq model to use (default: llama-3.3-70b-versatile)
                   Available models: llama-3.3-70b-versatile, mixtral-8x7b-32768, etc.
        """
        self.api_key = os.getenv("GROQ_API_KEY")
        if not self.api_key:
            raise ValueError("GROQ_API_KEY not found in environment variables")
        
        self.client = Groq(api_key=self.api_key)
        self.model = model
        self.knowledge_base = get_knowledge_base()
    
    async def generate_response(self, user_message: str) -> str:
        """
        Generate a response to the user's message using RAG.
        
        Args:
            user_message: The user's question or message
            
        Returns:
            The generated response from the LLM
        """
        try:
            # Create the RAG prompt with context
            system_prompt = self._create_system_prompt()
            
            # Call Groq API
            chat_completion = self.client.chat.completions.create(
                messages=[
                    {
                        "role": "system",
                        "content": system_prompt
                    },
                    {
                        "role": "user",
                        "content": user_message
                    }
                ],
                model=self.model,
                temperature=0.3,
                max_tokens=200,
                top_p=0.9,
            )
            
            response = chat_completion.choices[0].message.content
            return response if response else "I apologize, but I couldn't generate a response."
            
        except Exception as e:
            return f"Error: Unable to generate response - {str(e)}"
    
    def _create_system_prompt(self) -> str:
        """
        Create a system prompt with portfolio context.
        
        Returns:
            A formatted system prompt with context
        """
        system_prompt = f"""You are a helpful AI assistant answering questions about a developer's portfolio and professional background.

STRICT RULES:
1. ONLY use information from the PORTFOLIO CONTEXT below
2. If information is NOT in the context, say "I don't have that information in the portfolio"
3. Keep answers SHORT and CONVERSATIONAL (2-3 sentences maximum)
4. DO NOT make up or invent any information
5. DO NOT add details that aren't explicitly stated in the context
6. Be friendly and professional in your responses

PORTFOLIO CONTEXT:
{self.knowledge_base}

Answer questions based ONLY on the information provided in the context above."""
        
        return system_prompt
    
    async def check_service_status(self) -> Dict[str, Any]:
        """
        Check if Groq API is accessible.
        
        Returns:
            Dictionary with status information
        """
        try:
            # Try a simple API call to check connection
            test_completion = self.client.chat.completions.create(
                messages=[
                    {
                        "role": "user",
                        "content": "test"
                    }
                ],
                model=self.model,
                max_tokens=5,
            )
            
            return {
                "status": "online",
                "service": "Groq Cloud API",
                "using_model": self.model,
                "model_available": True
            }
                    
        except Exception as e:
            return {
                "status": "error",
                "message": f"Groq API error: {str(e)}"
            }


# Global instance
_rag_service: Optional[GroqRAGService] = None


def get_rag_service(model: str = "llama-3.3-70b-versatile") -> GroqRAGService:
    """
    Get or create the global RAG service instance.
    
    Args:
        model: The Groq model to use
        
    Returns:
        The RAG service instance
    """
    global _rag_service
    if _rag_service is None:
        _rag_service = GroqRAGService(model=model)
    return _rag_service
