"""
Smart Insights Service - Business logic for generating insights
"""

from database import db
from typing import List, Dict, Optional
from datetime import datetime, timedelta, timezone
from collections import defaultdict
import statistics
from .models import (
    SpendingPattern,
    CategoryInsight,
    BudgetPrediction,
    AnomalyDetection,
    SmartInsightsResponse
)

class SmartInsightsService:
    """Service for generating smart insights from transactions"""
    
    @staticmethod
    async def generate_insights(user_id: str, days: int = 90) -> SmartInsightsResponse:
        """
        Generate comprehensive insights for a user
        
        Args:
            user_id: User identifier
            days: Number of days to analyze (default: 90)
        """
        try:
            # Calculate date range
            end_date = datetime.now(timezone.utc)
            start_date = end_date - timedelta(days=days)
            
            # Fetch transactions
            response = db.table("transactions").select("*").eq("user_id", user_id).gte(
                "date", start_date.strftime("%Y-%m-%d")
            ).order("date", desc=False).execute()
            
            transactions = response.data
            
            if not transactions or len(transactions) == 0:
                # Return empty insights if no data
                return SmartInsightsService._empty_insights()
            
            # Analyze transactions
            income_txns = [t for t in transactions if t["type"] == "Income"]
            expense_txns = [t for t in transactions if t["type"] == "Expense"]
            
            total_income = sum(float(t["amount"]) for t in income_txns)
            total_expenses = sum(abs(float(t["amount"])) for t in expense_txns)
            net_savings = total_income - total_expenses
            savings_rate = (net_savings / total_income * 100) if total_income > 0 else 0
            
            # Spending patterns
            spending_patterns = SmartInsightsService._analyze_spending_patterns(expense_txns)
            
            # Monthly breakdown
            spending_by_month = SmartInsightsService._monthly_breakdown(expense_txns)
            
            # Predictions
            predictions = SmartInsightsService._predict_next_month(
                transactions, income_txns, expense_txns
            )
            
            # Category insights
            category_insights = SmartInsightsService._category_analysis(expense_txns)
            
            # Budget recommendations
            budget_predictions = SmartInsightsService._budget_recommendations(
                expense_txns, total_expenses
            )
            
            # Anomaly detection
            unusual_transactions = SmartInsightsService._detect_anomalies(expense_txns)
            
            # Trends
            income_trend = SmartInsightsService._calculate_trend(income_txns)
            expense_trend = SmartInsightsService._calculate_trend(expense_txns)
            
            # Recommendations
            recommendations = SmartInsightsService._generate_recommendations(
                total_income, total_expenses, savings_rate, spending_patterns
            )
            
            return SmartInsightsResponse(
                total_income=total_income,
                total_expenses=total_expenses,
                net_savings=net_savings,
                savings_rate=round(savings_rate, 2),
                top_spending_categories=spending_patterns[:5],
                spending_by_month=spending_by_month,
                predicted_next_month_spending=predictions["expenses"],
                predicted_next_month_income=predictions["income"],
                predicted_savings=predictions["savings"],
                category_insights=category_insights,
                budget_predictions=budget_predictions,
                unusual_transactions=unusual_transactions,
                income_trend=income_trend,
                expense_trend=expense_trend,
                recommendations=recommendations,
                analysis_period=f"Last {days} days",
                transaction_count=len(transactions),
                last_updated=datetime.now(timezone.utc).isoformat()
            )
            
        except Exception as e:
            raise Exception(f"Error generating insights: {str(e)}")
    
    @staticmethod
    def _analyze_spending_patterns(expense_txns: List[Dict]) -> List[SpendingPattern]:
        """Analyze spending patterns by category"""
        category_data = defaultdict(lambda: {"amounts": [], "count": 0})
        
        total_expenses = sum(abs(float(t["amount"])) for t in expense_txns)
        
        for txn in expense_txns:
            category = txn["category"]
            amount = abs(float(txn["amount"]))
            category_data[category]["amounts"].append(amount)
            category_data[category]["count"] += 1
        
        patterns = []
        for category, data in category_data.items():
            avg_amount = statistics.mean(data["amounts"])
            percentage = (sum(data["amounts"]) / total_expenses * 100) if total_expenses > 0 else 0
            
            # Determine trend (simplified - based on recent vs older transactions)
            mid_point = len(data["amounts"]) // 2
            if mid_point > 0:
                recent_avg = statistics.mean(data["amounts"][mid_point:])
                older_avg = statistics.mean(data["amounts"][:mid_point])
                if recent_avg > older_avg * 1.1:
                    trend = "increasing"
                elif recent_avg < older_avg * 0.9:
                    trend = "decreasing"
                else:
                    trend = "stable"
            else:
                trend = "stable"
            
            patterns.append(SpendingPattern(
                category=category,
                average_amount=round(avg_amount, 2),
                frequency=data["count"],
                trend=trend,
                percentage_of_total=round(percentage, 2)
            ))
        
        # Sort by total spent
        patterns.sort(key=lambda x: x.average_amount * x.frequency, reverse=True)
        return patterns
    
    @staticmethod
    def _monthly_breakdown(expense_txns: List[Dict]) -> Dict[str, float]:
        """Break down spending by month"""
        monthly = defaultdict(float)
        
        for txn in expense_txns:
            month = txn["date"][:7]  # YYYY-MM
            monthly[month] += abs(float(txn["amount"]))
        
        return {k: round(v, 2) for k, v in sorted(monthly.items())}
    
    @staticmethod
    def _predict_next_month(all_txns: List[Dict], income_txns: List[Dict], 
                           expense_txns: List[Dict]) -> Dict[str, float]:
        """Predict next month's income and expenses"""
        # Simple average-based prediction
        months = defaultdict(lambda: {"income": 0, "expenses": 0})
        
        for txn in all_txns:
            month = txn["date"][:7]
            if txn["type"] == "Income":
                months[month]["income"] += float(txn["amount"])
            else:
                months[month]["expenses"] += abs(float(txn["amount"]))
        
        if not months:
            return {"income": 0, "expenses": 0, "savings": 0}
        
        avg_income = statistics.mean([m["income"] for m in months.values()])
        avg_expenses = statistics.mean([m["expenses"] for m in months.values()])
        
        # Apply 10% growth factor for income, 5% for expenses
        predicted_income = avg_income * 1.10
        predicted_expenses = avg_expenses * 1.05
        
        return {
            "income": round(predicted_income, 2),
            "expenses": round(predicted_expenses, 2),
            "savings": round(predicted_income - predicted_expenses, 2)
        }
    
    @staticmethod
    def _category_analysis(expense_txns: List[Dict]) -> List[CategoryInsight]:
        """Detailed analysis per category"""
        category_data = defaultdict(lambda: {"amounts": [], "txns": []})
        
        for txn in expense_txns:
            category = txn["category"]
            amount = abs(float(txn["amount"]))
            category_data[category]["amounts"].append(amount)
            category_data[category]["txns"].append(txn)
        
        insights = []
        for category, data in category_data.items():
            amounts = data["amounts"]
            total_spent = sum(amounts)
            avg_txn = statistics.mean(amounts)
            
            # Predict next month
            predicted = total_spent * 1.05  # 5% growth
            
            insights.append(CategoryInsight(
                category=category,
                total_spent=round(total_spent, 2),
                transaction_count=len(amounts),
                average_transaction=round(avg_txn, 2),
                highest_transaction=round(max(amounts), 2),
                prediction_next_month=round(predicted, 2)
            ))
        
        insights.sort(key=lambda x: x.total_spent, reverse=True)
        return insights
    
    @staticmethod
    def _budget_recommendations(expense_txns: List[Dict], total_expenses: float) -> List[BudgetPrediction]:
        """Generate budget recommendations"""
        category_totals = defaultdict(float)
        
        for txn in expense_txns:
            category_totals[txn["category"]] += abs(float(txn["amount"]))
        
        recommendations = []
        for category, amount in category_totals.items():
            # Recommend 10% buffer
            recommended = amount * 1.10
            confidence = 85 if len([t for t in expense_txns if t["category"] == category]) > 5 else 65
            
            recommendations.append(BudgetPrediction(
                category=category,
                predicted_amount=round(amount * 1.05, 2),
                confidence=confidence,
                recommended_budget=round(recommended, 2)
            ))
        
        recommendations.sort(key=lambda x: x.predicted_amount, reverse=True)
        return recommendations[:10]
    
    @staticmethod
    def _detect_anomalies(expense_txns: List[Dict]) -> List[AnomalyDetection]:
        """Detect unusual transactions"""
        if len(expense_txns) < 5:
            return []
        
        amounts = [abs(float(t["amount"])) for t in expense_txns]
        mean_amount = statistics.mean(amounts)
        stdev = statistics.stdev(amounts) if len(amounts) > 1 else 0
        
        anomalies = []
        for txn in expense_txns:
            amount = abs(float(txn["amount"]))
            
            # Detect if amount is > 2 standard deviations from mean
            if stdev > 0 and amount > mean_amount + (2 * stdev):
                anomalies.append(AnomalyDetection(
                    transaction_id=txn["id"],
                    date=txn["date"],
                    description=txn["description"],
                    amount=amount,
                    category=txn["category"],
                    reason=f"Unusually high transaction - {round((amount / mean_amount - 1) * 100)}% above average"
                ))
        
        return anomalies[:5]
    
    @staticmethod
    def _calculate_trend(transactions: List[Dict]) -> str:
        """Calculate if trend is increasing, decreasing, or stable"""
        if len(transactions) < 4:
            return "insufficient_data"
        
        # Split into two halves
        mid = len(transactions) // 2
        first_half = transactions[:mid]
        second_half = transactions[mid:]
        
        first_avg = statistics.mean([abs(float(t["amount"])) for t in first_half])
        second_avg = statistics.mean([abs(float(t["amount"])) for t in second_half])
        
        if second_avg > first_avg * 1.1:
            return "increasing"
        elif second_avg < first_avg * 0.9:
            return "decreasing"
        else:
            return "stable"
    
    @staticmethod
    def _generate_recommendations(total_income: float, total_expenses: float, 
                                 savings_rate: float, patterns: List[SpendingPattern]) -> List[str]:
        """Generate actionable recommendations"""
        recommendations = []
        
        # Savings recommendations
        if savings_rate < 10:
            recommendations.append("⚠️ Your savings rate is low. Try to save at least 10-20% of your income.")
        elif savings_rate > 30:
            recommendations.append("🎉 Excellent savings rate! Consider investing surplus funds.")
        
        # Category-based recommendations
        if patterns:
            top_category = patterns[0]
            if top_category.percentage_of_total > 30:
                recommendations.append(
                    f"💡 {top_category.category} accounts for {top_category.percentage_of_total:.0f}% of spending. "
                    f"Consider reviewing these expenses."
                )
            
            # Increasing trend warning
            increasing_cats = [p for p in patterns if p.trend == "increasing"]
            if increasing_cats:
                recommendations.append(
                    f"📈 Spending is increasing in: {', '.join([c.category for c in increasing_cats[:3]])}. "
                    f"Monitor these categories closely."
                )
        
        # Income vs expenses
        if total_expenses > total_income *0.9:
            recommendations.append(
                "⚠️ Your expenses are close to your income. Create a buffer by reducing discretionary spending."
            )
        
        # General advice
        if len(recommendations) == 0:
            recommendations.append("✅ Your finances look healthy! Keep up the good habits.")
        
        recommendations.append("💰 Set up automatic savings transfers on payday.")
        recommendations.append("📊 Review your budget monthly and adjust categories as needed.")
        
        return recommendations
    
    @staticmethod
    def _empty_insights() -> SmartInsightsResponse:
        """Return empty insights when no data available"""
        return SmartInsightsResponse(
            total_income=0,
            total_expenses=0,
            net_savings=0,
            savings_rate=0,
            top_spending_categories=[],
            spending_by_month={},
            predicted_next_month_spending=0,
            predicted_next_month_income=0,
            predicted_savings=0,
            category_insights=[],
            budget_predictions=[],
            unusual_transactions=[],
            income_trend="insufficient_data",
            expense_trend="insufficient_data",
            recommendations=["📝 Start tracking transactions to get personalized insights!"],
            analysis_period="No data",
            transaction_count=0,
            last_updated=datetime.now(timezone.utc).isoformat()
        )
