"""
AI-Powered Insights using Ollama (Local LLM)
"""

import os
import json
from typing import Dict, List
from database import db
from datetime import datetime, timedelta, timezone
import httpx
from .service import SmartInsightsService
from .models import SmartInsightsResponse

class AIInsightsService:
    """Service for AI-powered insights using Ollama (Local LLM)"""
    
    OLLAMA_URL = os.environ.get("OLLAMA_URL", "http://localhost:11434/api/generate")
    MODEL = os.environ.get("OLLAMA_MODEL", "tinyllama")  # Using tinyllama model
    
    @staticmethod
    async def generate_ai_insights(user_id: str, days: int = 90) -> SmartInsightsResponse:
        """
        Generate AI-powered insights using Ollama LLM (Local)
        
        Args:
            user_id: User identifier
            days: Number of days to analyze
        """
        try:
            # First get statistical analysis
            base_insights = await SmartInsightsService.generate_insights(user_id, days)
            
            # Check if Ollama is available
            if not await AIInsightsService._check_ollama_health():
                print("⚠️  Ollama not available, using statistical insights only")
                return base_insights
            
            # Fetch actual transactions for AI context
            end_date = datetime.now(timezone.utc)
            start_date = end_date - timedelta(days=days)
            
            response = db.table("transactions").select("*").eq("user_id", user_id).gte(
                "date", start_date.strftime("%Y-%m-%d")
            ).order("date", desc=True).limit(50).execute()
            
            transactions = response.data
            
            # Prepare context for AI
            context = AIInsightsService._prepare_context(base_insights, transactions)
            
            # Get AI recommendations
            ai_recommendations = await AIInsightsService._get_ai_recommendations(context)
            
            # Merge AI recommendations with base insights
            if ai_recommendations:
                base_insights.recommendations = ai_recommendations
            
            return base_insights
            
        except Exception as e:
            print(f"AI Insights error: {e}, falling back to statistical insights")
            # Fall back to statistical insights on error
            return await SmartInsightsService.generate_insights(user_id, days)
    
    @staticmethod
    async def _check_ollama_health() -> bool:
        """Check if Ollama server is running"""
        try:
            async with httpx.AsyncClient(timeout=2.0) as client:
                response = await client.get("http://localhost:11434/api/tags")
                return response.status_code == 200
        except Exception:
            return False
    
    @staticmethod
    def _prepare_context(insights: SmartInsightsResponse, transactions: List[Dict]) -> str:
        """Prepare context for AI model"""
        
        # Recent transactions summary
        recent_txns = []
        for txn in transactions[:10]:
            recent_txns.append(f"- {txn['date']}: {txn['description']} ({txn['category']}) - ${abs(float(txn['amount'])):.2f}")
        
        context = f"""
Analyze this user's financial data and provide personalized insights and recommendations.

## Financial Summary (Last {insights.analysis_period})
- Total Income: ${insights.total_income:.2f}
- Total Expenses: ${insights.total_expenses:.2f}
- Net Savings: ${insights.net_savings:.2f}
- Savings Rate: {insights.savings_rate}%

## Spending Trends
- Income Trend: {insights.income_trend}
- Expense Trend: {insights.expense_trend}

## Top Spending Categories
{chr(10).join([f"- {p.category}: ${p.average_amount * p.frequency:.2f} ({p.percentage_of_total}% of total, trend: {p.trend})" for p in insights.top_spending_categories[:5]])}

## Predictions
- Predicted Next Month Spending: ${insights.predicted_next_month_spending:.2f}
- Predicted Next Month Income: ${insights.predicted_next_month_income:.2f}
- Predicted Savings: ${insights.predicted_savings:.2f}

## Recent Transactions
{chr(10).join(recent_txns)}

Based on this data, provide 3-5 specific, actionable financial recommendations.
Keep recommendations concise and actionable.
"""
        return context
    
    @staticmethod
    async def _get_ai_recommendations(context: str) -> List[str]:
        """Get AI recommendations from Ollama"""
        try:
            payload = {
                "model": AIInsightsService.MODEL,
                "prompt": context,
                "stream": False,
                "options": {
                    "temperature": 0.7,
                    "num_predict": 500  # Limit response length
                }
            }
            
            async with httpx.AsyncClient(timeout=60.0) as client:  # Longer timeout for local LLM
                response = await client.post(
                    AIInsightsService.OLLAMA_URL,
                    json=payload
                )
                
                if response.status_code == 200:
                    data = response.json()
                    ai_response = data.get("response", "")
                    
                    if not ai_response:
                        print("⚠️  Empty response from Ollama")
                        return None
                    
                    # Parse recommendations from AI response
                    recommendations = AIInsightsService._parse_recommendations(ai_response)
                    return recommendations
                else:
                    print(f"❌ Ollama API error: {response.status_code} - {response.text}")
                    return None
                    
        except Exception as e:
            print(f"❌ Error calling Ollama: {e}")
            return None
    
    @staticmethod
    def _parse_recommendations(ai_response: str) -> List[str]:
        """Parse AI response into list of recommendations"""
        try:
            # Split by newlines and filter non-empty lines
            lines = [line.strip() for line in ai_response.split('\n') if line.strip()]
            
            # Filter lines that look like recommendations (start with number, bullet, or emoji)
            recommendations = []
            for line in lines:
                # Remove numbering if present
                cleaned = line.lstrip('0123456789.-) ')
                if len(cleaned) > 10:  # Filter out very short lines
                    recommendations.append(cleaned)
            
            return recommendations[:8]  # Limit to 8 recommendations
            
        except Exception as e:
            print(f"Error parsing recommendations: {e}")
            return ["Unable to generate AI recommendations at this time."]
