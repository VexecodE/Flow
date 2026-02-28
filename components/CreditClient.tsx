"use client";

import React, { useRef, useEffect, useState } from "react";
import { Sidebar } from "./Sidebar";
import gsap from "gsap";
import { Header } from "./Header";
import { DashboardWaves } from "./DashboardWaves";
import {
    Activity,
    Trophy,
    Star,
    Shield,
    CheckCircle2,
    TrendingUp,
    Zap,
    Briefcase,
    Clock
} from "lucide-react";
import { useFinance } from "@/context/FinanceContext";

export function CreditClient() {
    const viewRef = useRef<HTMLDivElement>(null);
    const { transactions } = useFinance();

    // Calculate a mock score based on transaction behaviour and active usage
    const baseScore = 650;

    // Some metric calculations
    const incomeTxns = transactions.filter(t => t.amount > 0).length;
    const completedTxns = transactions.filter(t => t.status === "Completed").length;

    // Add points based on completed txns
    const calculatedScore = baseScore + (completedTxns * 5) + (incomeTxns * 10);
    // Cap at 850
    const finalScore = Math.min(calculatedScore, 850);

    const scoreCategory = finalScore >= 800 ? "Excellent" : finalScore >= 740 ? "Very Good" : finalScore >= 670 ? "Good" : finalScore >= 580 ? "Fair" : "Poor";
    const scoreColor = finalScore >= 740 ? "text-green-500" : finalScore >= 670 ? "text-blue-500" : finalScore >= 580 ? "text-yellow-500" : "text-red-500";
    const bgScoreColor = finalScore >= 740 ? "bg-green-500" : finalScore >= 670 ? "bg-blue-500" : finalScore >= 580 ? "bg-yellow-500" : "bg-red-500";

    useEffect(() => {
        if (viewRef.current) {
            gsap.fromTo(
                viewRef.current.children,
                { y: 20, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: "power2.out" }
            );

            // Animate meter stroke
            gsap.to("#score-meter", {
                strokeDashoffset: (1 - (finalScore / 850)) * 283, // 283 is approx circumference of r=45
                duration: 1.5,
                ease: "power2.out",
                delay: 0.2
            });
        }
    }, [finalScore]);

    return (
        <div className="flex bg-transparent h-screen overflow-hidden relative">
            <DashboardWaves />
            <Sidebar />

            <div className="flex-1 flex flex-col h-screen overflow-hidden relative z-10">
                <Header />

                <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-10 pt-8 pb-32 lg:pb-20 custom-scrollbar z-0 w-full relative">
                    <div ref={viewRef} className="max-w-6xl mx-auto space-y-6">

                        {/* Page Title */}
                        <div className="bg-white border border-gray-100 shadow-soft p-6 sm:p-8 rounded-[32px] flex items-center justify-between gap-4 hover:border-gray-300 hover:shadow-soft-lg transition-all duration-300">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center shrink-0">
                                    <Shield className="w-6 h-6 text-emerald-600" />
                                </div>
                                <div>
                                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">Trust & Credibility Score</h1>
                                    <p className="text-sm font-medium text-gray-500 mt-1">Your reliability score based on completed projects, transactions, and peer feedback.</p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                            {/* Main Score Area */}
                            <div className="lg:col-span-2 bg-white border border-gray-100 shadow-soft p-6 sm:p-10 rounded-[32px] flex flex-col items-center justify-center relative overflow-hidden group hover:border-gray-300 hover:shadow-soft-lg transition-all duration-300 text-center">
                                {/* Ambient glow */}
                                <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 ${bgScoreColor} opacity-5 blur-3xl rounded-full`}></div>

                                <h2 className="text-lg font-bold text-gray-900 mb-6">Your Unified Trust Score</h2>

                                <div className="relative w-48 h-48 mb-6">
                                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                                        <circle
                                            cx="50"
                                            cy="50"
                                            r="45"
                                            fill="transparent"
                                            stroke="#f3f4f6"
                                            strokeWidth="8"
                                        />
                                        <circle
                                            id="score-meter"
                                            cx="50"
                                            cy="50"
                                            r="45"
                                            fill="transparent"
                                            stroke="currentColor"
                                            strokeWidth="8"
                                            strokeLinecap="round"
                                            className={`${scoreColor} transition-all duration-1000`}
                                            strokeDasharray="283"
                                            strokeDashoffset="283" // Starts empty
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <span className={`text-5xl font-black tracking-tighter ${scoreColor}`}>{finalScore}</span>
                                        <span className="text-sm font-bold text-gray-400">/ 850</span>
                                    </div>
                                </div>

                                <div className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest bg-gray-50 border border-gray-100 ${scoreColor}`}>
                                    <Trophy className="w-3.5 h-3.5" />
                                    {scoreCategory} Standing
                                </div>

                                <p className="text-sm font-medium text-gray-500 mt-6 max-w-md mx-auto leading-relaxed">
                                    This score aggregates your on-time project completions, transaction history, and client endorsements. A higher score increases your visibility in the Collaboration Hub.
                                </p>
                            </div>

                            {/* Impact Factors */}
                            <div className="space-y-6">
                                <div className="bg-white border border-gray-100 shadow-soft p-6 sm:p-8 rounded-[32px] hover:border-gray-300 hover:shadow-soft-lg transition-all duration-300">
                                    <h3 className="text-lg font-bold text-gray-900 tracking-tight mb-5">Score Factors</h3>

                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between pb-3 border-b border-gray-50">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                                                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                                </div>
                                                <div>
                                                    <div className="text-sm font-bold text-gray-900">Project Completion</div>
                                                    <div className="text-xs font-medium text-gray-500">High Impact</div>
                                                </div>
                                            </div>
                                            <span className="text-sm font-bold text-emerald-600">+12 pts</span>
                                        </div>

                                        <div className="flex items-center justify-between pb-3 border-b border-gray-50">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                                                    <Briefcase className="w-4 h-4 text-blue-600" />
                                                </div>
                                                <div>
                                                    <div className="text-sm font-bold text-gray-900">Transaction History</div>
                                                    <div className="text-xs font-medium text-gray-500">Medium Impact</div>
                                                </div>
                                            </div>
                                            <span className="text-sm font-bold text-blue-600">+{completedTxns * 5} pts</span>
                                        </div>

                                        <div className="flex items-center justify-between pb-3 border-b border-gray-50">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center shrink-0">
                                                    <Star className="w-4 h-4 text-amber-500" />
                                                </div>
                                                <div>
                                                    <div className="text-sm font-bold text-gray-900">Peer Reviews</div>
                                                    <div className="text-xs font-medium text-gray-500">Medium Impact</div>
                                                </div>
                                            </div>
                                            <span className="text-sm font-bold text-amber-500">+25 pts</span>
                                        </div>
                                    </div>

                                </div>

                                <div className="bg-gradient-to-br from-gray-900 to-black rounded-[32px] shadow-soft p-6 sm:p-8 relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform">
                                        <TrendingUp className="w-16 h-16 text-white" />
                                    </div>
                                    <h3 className="text-white text-lg font-bold mb-2 relative z-10">Boost your score</h3>
                                    <p className="text-gray-400 text-sm font-medium mb-6 relative z-10 leading-relaxed">
                                        Complete your profile and link your GitHub to instantly gain +50 trust points.
                                    </p>
                                    <button className="w-full bg-white text-black py-3 rounded-xl text-sm font-bold shadow-soft hover:bg-gray-100 transition-colors flex items-center justify-center gap-2 relative z-10">
                                        <Zap className="w-4 h-4" /> Connect Accounts
                                    </button>
                                </div>
                            </div>

                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
