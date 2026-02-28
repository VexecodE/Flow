"""
RAG Chatbot API Routes
FastAPI routes for the portfolio chatbot using Groq Cloud API
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
import sys
import os

# Add parent directory to path for imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from rag_service import get_rag_service

router = APIRouter(prefix="/chat", tags=["chatbot"])


class ChatMessage(BaseModel):
    """Request model for chat messages."""
    message: str
    model: Optional[str] = "llama-3.3-70b-versatile"


class ChatResponse(BaseModel):
    """Response model for chat messages."""
    response: str
    model: str


class StatusResponse(BaseModel):
    """Response model for status check."""
    status: str
    message: Optional[str] = None
    available_models: Optional[list] = None
    using_model: Optional[str] = None
    model_available: Optional[bool] = None


@router.post("/message", response_model=ChatResponse)
async def send_message(chat_message: ChatMessage):
    """
    Send a message to the RAG chatbot and get a response.
    
    Args:
        chat_message: The user's message and optional model selection
        
    Returns:
        The chatbot's response
    """
    try:
        rag_service = get_rag_service(model=chat_message.model)
        response = await rag_service.generate_response(chat_message.message)
        
        return ChatResponse(
            response=response,
            model=chat_message.model
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate response: {str(e)}"
        )


@router.get("/status", response_model=StatusResponse)
async def check_status():
    """
    Check if Groq API is running and available.
    
    Returns:
        Status information about Groq API
    """
    try:
        rag_service = get_rag_service()
        status = await rag_service.check_service_status()
        
        return StatusResponse(**status)
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to check status: {str(e)}"
        )


@router.get("/health")
async def health_check():
    """Simple health check endpoint."""
    return {"status": "healthy", "service": "rag-chatbot"}
