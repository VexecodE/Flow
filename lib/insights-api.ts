/**
 * Smart Insights API Client
 * Use this in your frontend to fetch insights
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface SmartInsightsResponse {
    total_income: number;
    total_expenses: number;
    net_savings: number;
    savings_rate: number;
    top_spending_categories: SpendingPattern[];
    spending_by_month: Record<string, number>;
    predicted_next_month_spending: number;
    predicted_next_month_income: number;
    predicted_savings: number;
    category_insights: CategoryInsight[];
    budget_predictions: BudgetPrediction[];
    unusual_transactions: AnomalyDetection[];
    income_trend: string;
    expense_trend: string;
    recommendations: string[];
    analysis_period: string;
    transaction_count: number;
    last_updated: string;
}

export interface SpendingPattern {
    category: string;
    average_amount: number;
    frequency: number;
    trend: string;
    percentage_of_total: number;
}

export interface CategoryInsight {
    category: string;
    total_spent: number;
    transaction_count: number;
    average_transaction: number;
    highest_transaction: number;
    prediction_next_month: number;
}

export interface BudgetPrediction {
    category: string;
    predicted_amount: number;
    confidence: number;
    recommended_budget: number;
}

export interface AnomalyDetection {
    transaction_id: string;
    date: string;
    description: string;
    amount: number;
    category: string;
    reason: string;
}

export interface InsightsSummary {
    message: string;
    status: string;
    key_metric: number;
    metric_name: string;
}

/**
 * Smart Insights API
 */
export const InsightsAPI = {
    /**
     * Get complete smart insights
     * @param userId - User ID
     * @param days - Number of days to analyze (default: 90)
     * @param useAI - Use AI-powered recommendations (default: true)
     */
    async getSmartInsights(userId: string, days: number = 90, useAI: boolean = true): Promise<SmartInsightsResponse> {
        const response = await fetch(
            `${API_BASE_URL}/api/insights/smart?user_id=${userId}&days=${days}&use_ai=${useAI}`
        );
        
        if (!response.ok) {
            throw new Error(`Failed to fetch insights: ${response.statusText}`);
        }
        
        return response.json();
    },

    /**
     * Get quick summary for dashboard
     * @param userId - User ID
     */
    async getSummary(userId: string): Promise<InsightsSummary> {
        const response = await fetch(
            `${API_BASE_URL}/api/insights/summary?user_id=${userId}`
        );
        
        if (!response.ok) {
            throw new Error(`Failed to fetch summary: ${response.statusText}`);
        }
        
        return response.json();
    },

    /**
     * Get spending patterns
     * @param userId - User ID
     * @param days - Number of days to analyze (default: 30)
     */
    async getSpendingPatterns(userId: string, days: number = 30) {
        const response = await fetch(
            `${API_BASE_URL}/api/insights/spending-patterns?user_id=${userId}&days=${days}`
        );
        
        if (!response.ok) {
            throw new Error(`Failed to fetch spending patterns: ${response.statusText}`);
        }
        
        return response.json();
    },

    /**
     * Get predictions for next month
     * @param userId - User ID
     * @param days - Number of days to analyze (default: 90)
     */
    async getPredictions(userId: string, days: number = 90) {
        const response = await fetch(
            `${API_BASE_URL}/api/insights/predictions?user_id=${userId}&days=${days}`
        );
        
        if (!response.ok) {
            throw new Error(`Failed to fetch predictions: ${response.statusText}`);
        }
        
        return response.json();
    },

    /**
     * Get budget recommendations
     * @param userId - User ID
     * @param days - Number of days to analyze (default: 60)
     */
    async getBudgetRecommendations(userId: string, days: number = 60) {
        const response = await fetch(
            `${API_BASE_URL}/api/insights/budget-recommendations?user_id=${userId}&days=${days}`
        );
        
        if (!response.ok) {
            throw new Error(`Failed to fetch budget recommendations: ${response.statusText}`);
        }
        
        return response.json();
    },

    /**
     * Get anomalies (unusual transactions)
     * @param userId - User ID
     * @param days - Number of days to analyze (default: 30)
     */
    async getAnomalies(userId: string, days: number = 30) {
        const response = await fetch(
            `${API_BASE_URL}/api/insights/anomalies?user_id=${userId}&days=${days}`
        );
        
        if (!response.ok) {
            throw new Error(`Failed to fetch anomalies: ${response.statusText}`);
        }
        
        return response.json();
    },

    /**
     * Get personalized recommendations
     * @param userId - User ID
     * @param days - Number of days to analyze (default: 60)
     */
    async getRecommendations(userId: string, days: number = 60) {
        const response = await fetch(
            `${API_BASE_URL}/api/insights/recommendations?user_id=${userId}&days=${days}`
        );
        
        if (!response.ok) {
            throw new Error(`Failed to fetch recommendations: ${response.statusText}`);
        }
        
        return response.json();
    },
};

// Example usage in a React component:
/*

import { InsightsAPI } from '@/lib/insights-api';
import { useState, useEffect } from 'react';

function InsightsPage() {
    const [insights, setInsights] = useState(null);
    const [loading, setLoading] = useState(true);
    const userId = "your-user-id"; // Get from auth context

    useEffect(() => {
        async function loadInsights() {
            try {
                const data = await InsightsAPI.getSmartInsights(userId, 90);
                setInsights(data);
            } catch (error) {
                console.error('Error loading insights:', error);
            } finally {
                setLoading(false);
            }
        }
        loadInsights();
    }, [userId]);

    if (loading) return <div>Loading insights...</div>;
    if (!insights) return <div>No insights available</div>;

    return (
        <div>
            <h1>Smart Insights</h1>
            
            <div className="summary">
                <h2>Summary</h2>
                <p>Income: ${insights.total_income.toFixed(2)}</p>
                <p>Expenses: ${insights.total_expenses.toFixed(2)}</p>
                <p>Savings: ${insights.net_savings.toFixed(2)}</p>
                <p>Savings Rate: {insights.savings_rate.toFixed(1)}%</p>
            </div>

            <div className="predictions">
                <h2>Next Month Predictions</h2>
                <p>Predicted Income: ${insights.predicted_next_month_income.toFixed(2)}</p>
                <p>Predicted Expenses: ${insights.predicted_next_month_spending.toFixed(2)}</p>
                <p>Predicted Savings: ${insights.predicted_savings.toFixed(2)}</p>
            </div>

            <div className="recommendations">
                <h2>Recommendations</h2>
                <ul>
                    {insights.recommendations.map((rec, i) => (
                        <li key={i}>{rec}</li>
                    ))}
                </ul>
            </div>

            <div className="spending">
                <h2>Top Spending Categories</h2>
                {insights.top_spending_categories.map((cat) => (
                    <div key={cat.category}>
                        <h3>{cat.category}</h3>
                        <p>Average: ${cat.average_amount.toFixed(2)}</p>
                        <p>Frequency: {cat.frequency} transactions</p>
                        <p>Trend: {cat.trend}</p>
                        <p>{cat.percentage_of_total.toFixed(1)}% of total spending</p>
                    </div>
                ))}
            </div>

            {insights.unusual_transactions.length > 0 && (
                <div className="anomalies">
                    <h2>⚠️ Unusual Transactions</h2>
                    {insights.unusual_transactions.map((anomaly) => (
                        <div key={anomaly.transaction_id}>
                            <p>{anomaly.description}: ${anomaly.amount.toFixed(2)}</p>
                            <p>{anomaly.reason}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

*/
