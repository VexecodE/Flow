"""
Smart Insights API Routes
"""

from fastapi import APIRouter, HTTPException, Query
from typing import Optional
from .models import SmartInsightsResponse, InsightsSummary
from .service import SmartInsightsService
from .ai_insights import AIInsightsService

router = APIRouter(prefix="/insights", tags=["Smart Insights"])

@router.get("/smart", response_model=SmartInsightsResponse)
async def get_smart_insights(
    user_id: str = Query(..., description="User ID (required)"),
    days: int = Query(90, description="Number of days to analyze", ge=7, le=365),
    use_ai: bool = Query(True, description="Use AI-powered insights with Ollama (local LLM) (default: true)")
):
    """
    **Get comprehensive smart insights**
    
    Analyzes transaction history and provides:
    - Spending patterns by category
    - Income and expense trends
    - Predictions for next month
    - Budget recommendations
    - Anomaly detection
    - AI-powered personalized recommendations
    
    Args:
        user_id: User identifier
        days: Number of days to analyze (default: 90, min: 7, max: 365)
        use_ai: Use Ollama (local LLM) for enhanced insights (default: true)
    
    Returns:
        Complete smart insights with predictions and recommendations
    """
    try:
        if use_ai:
            # Use AI-powered insights with Ollama (local LLM)
            insights = await AIInsightsService.generate_ai_insights(user_id, days)
        else:
            # Use statistical analysis only
            insights = await SmartInsightsService.generate_insights(user_id, days)
        return insights
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/summary", response_model=InsightsSummary)
async def get_insights_summary(
    user_id: str = Query(..., description="User ID (required)")
):
    """
    **Get quick insights summary**
    
    Returns a brief summary of the most important insight
    """
    try:
        # Get full insights
        insights = await SmartInsightsService.generate_insights(user_id, 30)
        
        # Generate summary message
        if insights.savings_rate >= 20:
            message = f"Great job! You're saving {insights.savings_rate:.1f}% of your income."
            status = "excellent"
            key_metric = insights.savings_rate
            metric_name = "Savings Rate"
        elif insights.savings_rate >= 10:
            message = f"You're saving {insights.savings_rate:.1f}% of your income. Aim for 20%+!"
            status = "good"
            key_metric = insights.savings_rate
            metric_name = "Savings Rate"
        elif insights.net_savings > 0:
            message = f"You're saving ${insights.net_savings:.0f} but could do more!"
            status = "okay"
            key_metric = insights.net_savings
            metric_name = "Net Savings"
        else:
            message = f"You're spending more than earning. Review your expenses!"
            status = "warning"
            key_metric = abs(insights.net_savings)
            metric_name = "Deficit"
        
        return InsightsSummary(
            message=message,
            status=status,
            key_metric=key_metric,
            metric_name=metric_name
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/spending-patterns")
async def get_spending_patterns(
    user_id: str = Query(..., description="User ID (required)"),
    days: int = Query(30, description="Number of days to analyze")
):
    """
    **Get spending patterns only**
    
    Returns detailed spending patterns by category
    """
    try:
        insights = await SmartInsightsService.generate_insights(user_id, days)
        return {
            "patterns": insights.top_spending_categories,
            "monthly_breakdown": insights.spending_by_month,
            "analysis_period": insights.analysis_period
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/predictions")
async def get_predictions(
    user_id: str = Query(..., description="User ID (required)"),
    days: int = Query(90, description="Number of days to analyze")
):
    """
    **Get predictions only**
    
    Returns predictions for next month spending and income
    """
    try:
        insights = await SmartInsightsService.generate_insights(user_id, days)
        return {
            "predicted_income": insights.predicted_next_month_income,
            "predicted_expenses": insights.predicted_next_month_spending,
            "predicted_savings": insights.predicted_savings,
            "income_trend": insights.income_trend,
            "expense_trend": insights.expense_trend,
            "category_predictions": [
                {
                    "category": ci.category,
                    "prediction": ci.prediction_next_month
                }
                for ci in insights.category_insights
            ]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/budget-recommendations")
async def get_budget_recommendations(
    user_id: str = Query(..., description="User ID (required)"),
    days: int = Query(60, description="Number of days to analyze")
):
    """
    **Get budget recommendations**
    
    Returns recommended budget allocations by category
    """
    try:
        insights = await SmartInsightsService.generate_insights(user_id, days)
        return {
            "recommendations": insights.budget_predictions,
            "total_recommended": sum(bp.recommended_budget for bp in insights.budget_predictions),
            "analysis_period": insights.analysis_period
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/anomalies")
async def get_anomalies(
    user_id: str = Query(..., description="User ID (required)"),
    days: int = Query(30, description="Number of days to analyze")
):
    """
    **Get unusual transactions**
    
    Detects and returns transactions that are unusually high
    """
    try:
        insights = await SmartInsightsService.generate_insights(user_id, days)
        return {
            "anomalies": insights.unusual_transactions,
            "count": len(insights.unusual_transactions),
            "analysis_period": insights.analysis_period
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/recommendations")
async def get_recommendations(
    user_id: str = Query(..., description="User ID (required)"),
    days: int = Query(60, description="Number of days to analyze")
):
    """
    **Get personalized recommendations**
    
    Returns actionable financial recommendations
    """
    try:
        insights = await SmartInsightsService.generate_insights(user_id, days)
        return {
            "recommendations": insights.recommendations,
            "savings_rate": insights.savings_rate,
            "net_savings": insights.net_savings,
            "analysis_period": insights.analysis_period
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
