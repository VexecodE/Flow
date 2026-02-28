"use client";

import React from "react";
import { SmartInsightsResponse } from "@/lib/insights-api";
import { TrendingUp, TrendingDown, AlertTriangle, Lightbulb, Target, DollarSign, Brain } from "lucide-react";

interface InsightsCardProps {
    insights: SmartInsightsResponse | null;
    loading?: boolean;
}

export function InsightsCard({ insights, loading }: InsightsCardProps) {
    if (loading) {
        return (
            <div className="bg-gradient-to-br from-black/80 to-white/20 backdrop-blur-2xl ring-1 ring-inset ring-white/30 shadow-[0_8px_32px_0_rgba(0,0,0,0.25)] rounded-[32px] p-6 sm:p-8 hover:shadow-soft-lg transition-all duration-300 relative overflow-hidden">
                <div className="flex items-center gap-3 mb-6">
                    <Brain className="w-6 h-6 text-white/80 animate-pulse" />
                    <h2 className="text-xl font-bold text-white">Smart Insights</h2>
                </div>
                <div className="text-white/60 text-center py-8">Loading insights...</div>
            </div>
        );
    }

    if (!insights) {
        return (
            <div className="bg-gradient-to-br from-black/80 to-white/20 backdrop-blur-2xl ring-1 ring-inset ring-white/30 shadow-[0_8px_32px_0_rgba(0,0,0,0.25)] rounded-[32px] p-6 sm:p-8 hover:shadow-soft-lg transition-all duration-300 relative overflow-hidden">
                <div className="flex items-center gap-3 mb-6">
                    <Brain className="w-6 h-6 text-white/80" />
                    <h2 className="text-xl font-bold text-white">Smart Insights</h2>
                </div>
                <div className="text-white/60 text-center py-8">
                    No insights available yet. Add transactions to see personalized insights.
                </div>
            </div>
        );
    }

    const savingsRate = insights.savings_rate || 0;
    const isSavingsPositive = savingsRate > 0;
    const isIncomeIncreasing = insights.income_trend === "increasing";
    const isExpenseIncreasing = insights.expense_trend === "increasing";

    return (
        <div className="bg-gradient-to-br from-black/80 to-white/20 backdrop-blur-2xl ring-1 ring-inset ring-white/30 shadow-[0_8px_32px_0_rgba(0,0,0,0.25)] rounded-[32px] p-6 sm:p-8 hover:shadow-soft-lg transition-all duration-300 relative overflow-hidden">
            {/* Glass shine overlay */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/20 to-transparent"></div>

            <div className="relative z-10">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <Brain className="w-6 h-6 text-white/80" />
                        <h2 className="text-xl font-bold text-white">Smart Insights</h2>
                    </div>
                    <span className="text-xs text-white/60">{insights.analysis_period || 'Last 90 days'}</span>
                </div>

                {/* Summary Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                    {/* Income */}
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                        <div className="flex items-center gap-2 mb-2">
                            <TrendingUp className={`w-4 h-4 ${isIncomeIncreasing ? 'text-green-400' : 'text-white/60'}`} />
                            <span className="text-xs text-white/60 uppercase tracking-wide">Income</span>
                        </div>
                        <div className="text-2xl font-bold text-white">₹{(insights.total_income || 0).toLocaleString()}</div>
                        <div className="text-xs text-white/60 mt-1">{insights.income_trend || 'stable'}</div>
                    </div>

                    {/* Expenses */}
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                        <div className="flex items-center gap-2 mb-2">
                            <TrendingDown className={`w-4 h-4 ${isExpenseIncreasing ? 'text-red-400' : 'text-green-400'}`} />
                            <span className="text-xs text-white/60 uppercase tracking-wide">Expenses</span>
                        </div>
                        <div className="text-2xl font-bold text-white">₹{(insights.total_expenses || 0).toLocaleString()}</div>
                        <div className="text-xs text-white/60 mt-1">{insights.expense_trend || 'stable'}</div>
                    </div>

                    {/* Savings */}
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                        <div className="flex items-center gap-2 mb-2">
                            <DollarSign className={`w-4 h-4 ${isSavingsPositive ? 'text-green-400' : 'text-red-400'}`} />
                            <span className="text-xs text-white/60 uppercase tracking-wide">Savings</span>
                        </div>
                        <div className="text-2xl font-bold text-white">₹{(insights.net_savings || 0).toLocaleString()}</div>
                        <div className="text-xs text-white/60 mt-1">{savingsRate.toFixed(1)}% rate</div>
                    </div>
                </div>

                {/* AI Recommendations */}
                {insights.recommendations && insights.recommendations.length > 0 && (
                    <div className="mb-6">
                        <div className="flex items-center gap-2 mb-3">
                            <Lightbulb className="w-4 h-4 text-yellow-400" />
                            <h3 className="text-sm font-semibold text-white">AI Recommendations</h3>
                        </div>
                        <div className="space-y-2">
                            {insights.recommendations.slice(0, 3).map((rec, idx) => (
                                <div 
                                    key={idx} 
                                    className="bg-white/5 backdrop-blur-sm rounded-xl p-3 border border-white/10 text-sm text-white/80 flex items-start gap-2"
                                >
                                    <span className="text-yellow-400 text-xs mt-0.5">•</span>
                                    <span className="flex-1">{rec}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Top Spending Categories */}
                {insights.top_spending_categories && insights.top_spending_categories.length > 0 && (
                    <div className="mb-6">
                        <div className="flex items-center gap-2 mb-3">
                            <Target className="w-4 h-4 text-blue-400" />
                            <h3 className="text-sm font-semibold text-white">Top Spending</h3>
                        </div>
                        <div className="space-y-2">
                            {insights.top_spending_categories.slice(0, 3).map((cat, idx) => (
                                <div 
                                    key={idx} 
                                    className="bg-white/5 backdrop-blur-sm rounded-xl p-3 border border-white/10"
                                >
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-sm font-medium text-white">{cat.category}</span>
                                        <span className="text-xs text-white/60">{cat.percentage_of_total.toFixed(1)}%</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-white/80">₹{cat.average_amount.toFixed(0)}</span>
                                        <span className="text-xs text-white/60">• {cat.frequency} transactions</span>
                                        <span className={`text-xs ${cat.trend === 'increasing' ? 'text-red-400' : cat.trend === 'decreasing' ? 'text-green-400' : 'text-white/60'}`}>
                                            {cat.trend}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Anomalies */}
                {insights.unusual_transactions && insights.unusual_transactions.length > 0 && (
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <AlertTriangle className="w-4 h-4 text-orange-400" />
                            <h3 className="text-sm font-semibold text-white">Unusual Transactions</h3>
                        </div>
                        <div className="space-y-2">
                            {insights.unusual_transactions.slice(0, 2).map((anomaly, idx) => (
                                <div 
                                    key={idx} 
                                    className="bg-orange-500/10 backdrop-blur-sm rounded-xl p-3 border border-orange-500/20"
                                >
                                    <div className="flex justify-between items-start mb-1">
                                        <span className="text-sm font-medium text-white">{anomaly.description}</span>
                                        <span className="text-sm text-orange-400">₹{anomaly.amount.toLocaleString()}</span>
                                    </div>
                                    <div className="text-xs text-white/60">{anomaly.reason}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Predictions */}
                {insights.predicted_next_month_spending && (
                    <div className="mt-6 bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                        <h3 className="text-sm font-semibold text-white mb-3">Next Month Prediction</h3>
                        <div className="grid grid-cols-3 gap-3 text-center">
                            <div>
                                <div className="text-xs text-white/60 mb-1">Income</div>
                                <div className="text-lg font-bold text-green-400">₹{(insights.predicted_next_month_income || 0).toLocaleString()}</div>
                            </div>
                            <div>
                                <div className="text-xs text-white/60 mb-1">Expenses</div>
                                <div className="text-lg font-bold text-red-400">₹{(insights.predicted_next_month_spending || 0).toLocaleString()}</div>
                            </div>
                            <div>
                                <div className="text-xs text-white/60 mb-1">Savings</div>
                                <div className="text-lg font-bold text-blue-400">₹{(insights.predicted_savings || 0).toLocaleString()}</div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Updated timestamp */}
                <div className="mt-4 text-xs text-white/40 text-center">
                    Last updated: {new Date(insights.last_updated).toLocaleString()}
                </div>
            </div>
        </div>
    );
}
