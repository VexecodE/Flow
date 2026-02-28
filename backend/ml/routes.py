from fastapi import APIRouter, HTTPException
from .models import TrustPredictionRequest, TrustPredictionResponse
from .service import trust_service
from .ai_insights import trust_insights_ai

router = APIRouter()

@router.post("/trust/predict", response_model=dict)
async def predict_engineer_trust(request: TrustPredictionRequest):
    """
    Predict engineer reliability risk based on historical metrics
    
    Returns risk assessment and AI-powered recommendations
    """
    try:
        features = {
            "delay_days": request.delay_days,
            "rating": request.rating,
            "disputes": request.disputes,
            "repeat_client": request.repeat_client,
            "collab_count": request.collab_count,
            "income_volatility": request.income_volatility,
        }
        
        # Get prediction from model
        result = trust_service.predict_trust(features)
        
        # Generate AI-powered personalized insights
        ai_recommendations = trust_insights_ai.generate_personalized_insights(result, features)
        result["ai_recommendations"] = ai_recommendations
        
        return result
        
    except ValueError as e:
        raise HTTPException(status_code=503, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")

@router.get("/trust/health")
async def check_model_health():
    """Check if the trust model is loaded and ready"""
    if trust_service.model is None:
        return {
            "status": "unhealthy",
            "message": "Model not loaded. Please place trust_model.pkl in backend/ml/ folder",
            "model_path": str(trust_service.model_path)
        }
    return {
        "status": "healthy",
        "message": "Trust prediction model is ready",
        "model_path": str(trust_service.model_path)
    }
