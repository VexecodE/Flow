"use client";

import React, { useState } from "react";
import { X, Shield, TrendingDown, AlertTriangle, CheckCircle, Info } from "lucide-react";

interface TrustPredictionModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function TrustPredictionModal({ isOpen, onClose }: TrustPredictionModalProps) {
    const [formData, setFormData] = useState({
        delay_days: 0,
        rating: 4.0,
        disputes: 0,
        repeat_client: 1,
        collab_count: 3,
        income_volatility: 0.2,
    });

    const [prediction, setPrediction] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleInputChange = (field: string, value: number) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        setPrediction(null); // Reset prediction when inputs change
        setError("");
    };

    const handlePredict = async () => {
        setLoading(true);
        setError("");
        
        try {
            const response = await fetch("http://localhost:8000/api/trust/predict", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error("Prediction failed. Please ensure the model is loaded.");
            }

            const data = await response.json();
            setPrediction(data);
        } catch (err: any) {
            setError(err.message || "Failed to get prediction");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
            <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto custom-scrollbar">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-100 p-6 rounded-t-[32px] flex items-center justify-between z-10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center">
                            <Shield className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Engineer Reliability Predictor</h2>
                            <p className="text-xs text-gray-500 mt-0.5">AI-powered trust score prediction</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors flex items-center justify-center"
                    >
                        <X className="w-4 h-4 text-gray-600" />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Input Form */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Delay Days */}
                        <div>
                            <label className="block text-sm font-bold text-gray-900 mb-2">
                                Avg Delivery Delay (days)
                                <span className="text-xs font-normal text-gray-500 ml-2">Can be negative (early)</span>
                            </label>
                            <input
                                type="number"
                                step="0.1"
                                value={formData.delay_days}
                                onChange={(e) => handleInputChange("delay_days", parseFloat(e.target.value))}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm font-medium focus:border-gray-400 focus:outline-none"
                                placeholder="e.g., 2.5"
                            />
                        </div>

                        {/* Rating */}
                        <div>
                            <label className="block text-sm font-bold text-gray-900 mb-2">
                                Client Rating (1.0 - 5.0)
                            </label>
                            <input
                                type="number"
                                step="0.1"
                                min="1"
                                max="5"
                                value={formData.rating}
                                onChange={(e) => handleInputChange("rating", parseFloat(e.target.value))}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm font-medium focus:border-gray-400 focus:outline-none"
                                placeholder="e.g., 4.5"
                            />
                        </div>

                        {/* Disputes */}
                        <div>
                            <label className="block text-sm font-bold text-gray-900 mb-2">
                                Dispute Count
                            </label>
                            <input
                                type="number"
                                min="0"
                                value={formData.disputes}
                                onChange={(e) => handleInputChange("disputes", parseInt(e.target.value))}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm font-medium focus:border-gray-400 focus:outline-none"
                                placeholder="e.g., 0"
                            />
                        </div>

                        {/* Repeat Client */}
                        <div>
                            <label className="block text-sm font-bold text-gray-900 mb-2">
                                Has Repeat Clients?
                            </label>
                            <select
                                value={formData.repeat_client}
                                onChange={(e) => handleInputChange("repeat_client", parseInt(e.target.value))}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm font-medium focus:border-gray-400 focus:outline-none bg-white"
                            >
                                <option value={1}>Yes</option>
                                <option value={0}>No</option>
                            </select>
                        </div>

                        {/* Collaboration Count */}
                        <div>
                            <label className="block text-sm font-bold text-gray-900 mb-2">
                                Collaboration Count
                            </label>
                            <input
                                type="number"
                                min="0"
                                value={formData.collab_count}
                                onChange={(e) => handleInputChange("collab_count", parseInt(e.target.value))}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm font-medium focus:border-gray-400 focus:outline-none"
                                placeholder="e.g., 5"
                            />
                        </div>

                        {/* Income Volatility */}
                        <div>
                            <label className="block text-sm font-bold text-gray-900 mb-2">
                                Income Volatility (0.0 - 1.0)
                                <span className="text-xs font-normal text-gray-500 ml-2">0 = stable</span>
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                max="1"
                                value={formData.income_volatility}
                                onChange={(e) => handleInputChange("income_volatility", parseFloat(e.target.value))}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm font-medium focus:border-gray-400 focus:outline-none"
                                placeholder="e.g., 0.25"
                            />
                        </div>
                    </div>

                    {/* Predict Button */}
                    <button
                        onClick={handlePredict}
                        disabled={loading}
                        className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold text-sm hover:bg-black transition-all disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Analyzing...
                            </>
                        ) : (
                            <>
                                <Shield className="w-5 h-5" />
                                Predict Reliability Risk
                            </>
                        )}
                    </button>

                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
                            <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                            <div>
                                <p className="text-sm font-bold text-red-900">Prediction Error</p>
                                <p className="text-xs text-red-700 mt-1">{error}</p>
                                <p className="text-xs text-red-600 mt-2">
                                    Make sure the backend is running and trust_model.pkl is in backend/ml/
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Prediction Results */}
                    {prediction && (
                        <div className="space-y-4 animate-in fade-in-50 duration-500">
                            {/* Main Risk Card */}
                            <div
                                className={`rounded-2xl p-6 border-2 ${
                                    prediction.reliability_risk === 0
                                        ? "bg-green-50 border-green-200"
                                        : "bg-red-50 border-red-200"
                                }`}
                            >
                                <div className="flex items-start gap-4">
                                    {prediction.reliability_risk === 0 ? (
                                        <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center shrink-0">
                                            <CheckCircle className="w-6 h-6 text-white" />
                                        </div>
                                    ) : (
                                        <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center shrink-0">
                                            <AlertTriangle className="w-6 h-6 text-white" />
                                        </div>
                                    )}
                                    <div className="flex-1">
                                        <h3 className="text-2xl font-bold text-gray-900 mb-1">
                                            {prediction.risk_level}
                                        </h3>
                                        <p className="text-sm text-gray-700 font-medium">
                                            {prediction.recommendation}
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mt-6">
                                    <div className="bg-white/80 rounded-xl p-4">
                                        <div className="text-xs font-bold text-gray-500 mb-1">Risk Probability</div>
                                        <div className="text-2xl font-bold text-gray-900">
                                            {prediction.risk_probability}%
                                        </div>
                                    </div>
                                    <div className="bg-white/80 rounded-xl p-4">
                                        <div className="text-xs font-bold text-gray-500 mb-1">Confidence</div>
                                        <div className="text-2xl font-bold text-gray-900">
                                            {prediction.confidence}%
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Feature Analysis */}
                            {prediction.feature_analysis && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Risk Factors */}
                                    {prediction.feature_analysis.risk_factors.length > 0 && (
                                        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                                            <div className="flex items-center gap-2 mb-3">
                                                <TrendingDown className="w-4 h-4 text-red-600" />
                                                <h4 className="text-sm font-bold text-red-900">Risk Factors</h4>
                                            </div>
                                            <ul className="space-y-2">
                                                {prediction.feature_analysis.risk_factors.map((factor: string, i: number) => (
                                                    <li key={i} className="text-xs text-red-800 flex items-start gap-2">
                                                        <span className="text-red-500 mt-0.5">•</span>
                                                        <span>{factor}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {/* Positive Factors */}
                                    {prediction.feature_analysis.positive_factors.length > 0 && (
                                        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                                            <div className="flex items-center gap-2 mb-3">
                                                <CheckCircle className="w-4 h-4 text-green-600" />
                                                <h4 className="text-sm font-bold text-green-900">Positive Factors</h4>
                                            </div>
                                            <ul className="space-y-2">
                                                {prediction.feature_analysis.positive_factors.map((factor: string, i: number) => (
                                                    <li key={i} className="text-xs text-green-800 flex items-start gap-2">
                                                        <span className="text-green-500 mt-0.5">•</span>
                                                        <span>{factor}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Info Note */}
                            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
                                <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                                <p className="text-xs text-blue-800">
                                    This prediction is based on a Random Forest model trained on historical engineer performance data.
                                    Use this as one factor in your decision-making process.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
