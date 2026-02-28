"""
Smart Insights Models - Pydantic models for insights
"""

from pydantic import BaseModel, Field
from typing import List, Dict, Optional
from datetime import datetime

class SpendingPattern(BaseModel):
    """Spending pattern analysis"""
    category: str
    average_amount: float
    frequency: int
    trend: str  # "increasing", "decreasing", "stable"
    percentage_of_total: float

class CategoryInsight(BaseModel):
    """Insights for a specific category"""
    category: str
    total_spent: float
    transaction_count: int
    average_transaction: float
    highest_transaction: float
    prediction_next_month: float

class BudgetPrediction(BaseModel):
    """Budget predictions for upcoming periods"""
    category: str
    predicted_amount: float
    confidence: float  # 0-100
    recommended_budget: float

class AnomalyDetection(BaseModel):
    """Unusual transaction detection"""
    transaction_id: str
    date: str
    description: str
    amount: float
    category: str
    reason: str  # Why it's unusual

class SmartInsightsResponse(BaseModel):
    """Complete smart insights response"""
    # Summary Stats
    total_income: float
    total_expenses: float
    net_savings: float
    savings_rate: float  # percentage
    
    # Spending Analysis
    top_spending_categories: List[SpendingPattern]
    spending_by_month: Dict[str, float]
    
    # Predictions
    predicted_next_month_spending: float
    predicted_next_month_income: float
    predicted_savings: float
    
    # Category Details
    category_insights: List[CategoryInsight]
    
    # Budget Recommendations
    budget_predictions: List[BudgetPrediction]
    
    # Anomalies
    unusual_transactions: List[AnomalyDetection]
    
    # Trends
    income_trend: str  # "increasing", "decreasing", "stable"
    expense_trend: str
    
    # Recommendations
    recommendations: List[str]
    
    # Time Period
    analysis_period: str
    transaction_count: int
    last_updated: str

class InsightsSummary(BaseModel):
    """Quick summary of insights"""
    message: str
    status: str
    key_metric: float
    metric_name: str
