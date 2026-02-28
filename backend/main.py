from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from transactions import transaction_router
from insights import insights_router
from reminders import reminder_router
from chatbot import router as chatbot_router
from ml import router as ml_router
from resume.routes import router as resume_router
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI(
    title="Flo Finance Backend API",
    description="Backend API for Flo personal finance management - Transactions, AI Insights & Email Reminders",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS Configuration - Allow Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # Next.js dev server
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

# Include Routers
app.include_router(transaction_router, prefix="/api")
app.include_router(insights_router, prefix="/api")
app.include_router(reminder_router, prefix="/api")
app.include_router(chatbot_router, prefix="/api")
app.include_router(ml_router, prefix="/api")
app.include_router(resume_router, prefix="/api")

# Root endpoint
@app.get("/")
def read_root():
    """Root endpoint - API status"""
    return {
        "app": "Flo Finance Backend",
        "status": "running",
        "version": "1.0.0",
        "endpoints": {
            "transactions": "/api/transactions",
            "insights": "/api/insights/smart",
            "insights_summary": "/api/insights/summary",
            "predictions": "/api/insights/predictions",
            "budget_recommendations": "/api/insights/budget-recommendations",
            "anomalies": "/api/insights/anomalies",
            "stats": "/api/transactions/stats/summary",
            "categories": "/api/transactions/categories/list",
            "search": "/api/transactions/search/query",
            "chatbot": "/api/chat/message",
            "chatbot_status": "/api/chat/status",
            "reminders": "/api/reminders/emi",
            "trust_predict": "/api/trust/predict",
            "trust_health": "/api/trust/health",
            "docs": "/docs",
            "redoc": "/redoc"
        }
    }

# Health check endpoint
@app.get("/health")
def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "flo-backend",
        "timestamp": "2026-02-28"
    }

# API info endpoint
@app.get("/api")
def api_info():
    """API information"""
    return {
        "message": "Flo Finance API",
        "version": "1.0.0",
        "available_endpoints": {
            "GET /api/transactions": "Get all transactions (with filters)",
            "GET /api/transactions/{id}": "Get single transaction",
            "POST /api/transactions": "Create new transaction",
            "POST /api/transactions/bulk": "Create multiple transactions",
            "PUT /api/transactions/{id}": "Update transaction",
            "DELETE /api/transactions/{id}": "Delete transaction",
            "GET /api/transactions/stats/summary": "Get statistics",
            "GET /api/transactions/categories/list": "Get all categories",
            "GET /api/transactions/search/query": "Search transactions"
        }
    }

# Run the application
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,  # Auto-reload on code changes
        log_level="info"
    )
