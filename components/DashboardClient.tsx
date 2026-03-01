"use client";

import React, { useRef, useEffect } from "react";
import { Sidebar } from "./Sidebar";
import gsap from "gsap";
import { Header } from "./Header";
import { DashboardWaves } from "./DashboardWaves";
import {
    TrendingUp,
    TrendingDown,
    PiggyBank,
    CreditCard,
    ArrowRight,
    Landmark,
    Wallet,
    Receipt,
    Bell,
    MoreHorizontal,
    FileText,
    ChevronDown,
    Send,
    ShoppingCart,
    Star,
    Package
} from "lucide-react";
import { BarChart, Bar, Legend, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';

import { useFinance, Transaction } from "@/context/FinanceContext";

export function DashboardClient() {
    const { transactions, accounts, budgets } = useFinance();
    const viewRef = useRef<HTMLDivElement>(null);

    // --- Dynamic Calculations ---

    // 1. Net Worth (Total balance across all accounts)
    let netWorth = accounts.length > 0 ? accounts.reduce((sum, acc) => sum + acc.balance, 0) : 84112;

    // 2. Total Assets (Cash + Digital Assets)
    let totalAssets = accounts.filter(a => a.type !== 'Credit Card').reduce((sum, a) => sum + a.balance, 0);

    // 3. Total Liabilities (Credit Cards)
    let totalLiabilities = Math.abs(accounts.filter(a => a.type === 'Credit Card').reduce((sum, a) => sum + a.balance, 0));

    // 4. Monthly Income/Expenses (Dynamic based on last 30 days)
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

    const currentPeriodTransactions = transactions.filter(t => new Date(t.date) >= thirtyDaysAgo);
    const previousPeriodTransactions = transactions.filter(t => new Date(t.date) >= sixtyDaysAgo && new Date(t.date) < thirtyDaysAgo);

    const calcTrend = (current: number, previous: number) => {
        if (previous === 0) return current > 0 ? "+100%" : "0%";
        const percent = ((current - previous) / previous) * 100;
        return `${percent > 0 ? '+' : ''}${percent.toFixed(1)}%`;
    };

    let monthlyIncome = currentPeriodTransactions.filter(t => t.amount > 0).reduce((sym, t) => sym + t.amount, 0);
    const prevIncome = previousPeriodTransactions.filter(t => t.amount > 0).reduce((sym, t) => sym + t.amount, 0);
    let incomeTrend = calcTrend(monthlyIncome, prevIncome);

    let monthlyExpenses = currentPeriodTransactions.filter(t => t.amount < 0).reduce((sym, t) => sym + Math.abs(t.amount), 0);
    const prevExpenses = previousPeriodTransactions.filter(t => t.amount < 0).reduce((sym, t) => sym + Math.abs(t.amount), 0);
    let expenseTrend = calcTrend(monthlyExpenses, prevExpenses);

    let netCashFlow = monthlyIncome - monthlyExpenses;
    const cashFlowText = transactions.length === 0
        ? "Connect your accounts and start tracking transactions to see your financial health."
        : netCashFlow > 0
            ? `Cash flow is positive this period with a net surplus of ₹${netCashFlow.toLocaleString()}.`
            : `You spent ₹${Math.abs(netCashFlow).toLocaleString()} more than your income this period.`;

    // 6. Top Spending Categories
    const categoryTotals = transactions.filter(t => t.amount < 0).reduce((acc, txn) => {
        acc[txn.category] = (acc[txn.category] || 0) + Math.abs(txn.amount);
        return acc;
    }, {} as Record<string, number>);

    let topSpendingCategories: { name: string; amount: number; percentage: string }[] = Object.entries(categoryTotals)
        .map(([name, amount]) => ({
            name,
            amount,
            percentage: Math.min((amount / monthlyExpenses) * 100, 100).toFixed(0) + '%'
        }))
        .sort((a, b) => b.amount - a.amount)
        .slice(0, 6); // Top 6

    // Fill with demo categories if fewer than 6
    const demoPadding: { name: string; amount: number; percentage: string }[] = [
        { name: "Server Infrastructure", amount: 15400, percentage: "36%" },
        { name: "Software Subscriptions", amount: 12500, percentage: "29%" },
        { name: "Office Assets", amount: 8200, percentage: "19%" },
        { name: "Freelancer Payments", amount: 3800, percentage: "9%" },
        { name: "Marketing & Ads", amount: 1700, percentage: "4%" },
        { name: "Travel & Meals", amount: 500, percentage: "1%" },
    ];
    if (topSpendingCategories.length < 6) {
        const existingNames = new Set(topSpendingCategories.map(c => c.name));
        const fillers = demoPadding.filter(d => !existingNames.has(d.name));
        topSpendingCategories = [...topSpendingCategories, ...fillers].slice(0, 6);
    }

    // --- Mock Data Injection for Empty Accounts / Demo display ---
    if (transactions.length === 0) {
        netWorth = 84112;
        monthlyIncome = 245000;
        monthlyExpenses = 42100;
        incomeTrend = "+18.2%";
        expenseTrend = "-42.5%";

        topSpendingCategories = [
            { name: "Server Infrastructure", amount: 15400, percentage: "36%" },
            { name: "Software Subscriptions", amount: 12500, percentage: "29%" },
            { name: "Office Assets", amount: 8200, percentage: "19%" },
            { name: "Freelancer Payments", amount: 3800, percentage: "9%" },
            { name: "Marketing & Ads", amount: 1700, percentage: "4%" },
            { name: "Travel & Meals", amount: 500, percentage: "1%" }
        ];

    }

    const suggestedProducts = [
        { title: "SaaS Admin Dashboard", category: "Templates", price: "$49", rating: 4.8, sales: 120, image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=200&h=200" },
        { title: "Advanced Auth Hook", category: "Scripts", price: "$19", rating: 4.9, sales: 340, image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=200&h=200" },
        { title: "Fintech UI Kit Pro", category: "UI Kits", price: "$79", rating: 5.0, sales: 85, image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=200&h=200" },
        { title: "E-Commerce Wrapper", category: "Backend", price: "$29", rating: 4.7, sales: 210, image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=200&h=200" }
    ];

    useEffect(() => {
        if (viewRef.current) {
            gsap.fromTo(
                viewRef.current.children,
                { y: 20, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: "power2.out" }
            );

            // Animate progress bar
            gsap.fromTo("#progress",
                { width: "0%" },
                { width: "38%", duration: 1.5, ease: "power2.out", delay: 0.3 }
            );
        }
    }, []);

    return (
        <div className="flex bg-transparent h-screen overflow-hidden relative">
            <DashboardWaves />
            <Sidebar />

            <div className="flex-1 flex flex-col h-screen overflow-hidden relative z-10">
                {/* Clean background area */}

                <Header />

                <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-10 pt-8 pb-32 lg:pb-20 custom-scrollbar z-0 w-full relative">
                    <div ref={viewRef} className="max-w-6xl mx-auto space-y-12">

                        {/* 1. Net Worth Summary - Redesigned to lime green project card theme */}
                        <div className="flex flex-col bg-gradient-to-br from-black/80 to-white/20 backdrop-blur-2xl ring-1 ring-inset ring-white/30 shadow-[0_8px_32px_0_rgba(0,0,0,0.25)] rounded-[32px] p-6 sm:p-8 md:p-10 hover:shadow-soft-lg transition-all duration-300 relative overflow-hidden">
                            {/* Glass shine overlay */}
                            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/20 to-transparent"></div>
                            <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[radial-gradient(100%_40%_at_50%_0%,rgba(255,255,255,0.3),rgba(255,255,255,0))]"></div>

                            <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-8 md:gap-6 mt-4 md:mt-0">
                                <div>
                                    <h1 className="text-sm sm:text-base font-semibold text-white/80 tracking-tight mb-2">Current Work</h1>
                                    <div className="flex flex-col sm:flex-row sm:items-baseline gap-3 sm:gap-4 mt-2">
                                        <h2 className="text-4xl sm:text-5xl md:text-[64px] font-bold text-white tracking-tight leading-none">E-commerce Scaling & UI Revamp for "EcoStride"</h2>

                                    </div>
                                    <div className="mt-8 mb-4 max-w-sm">
                                        <div className="relative h-2 w-full overflow-hidden rounded-full bg-white/20">
                                            <div id="progress" className="h-full w-[38%] rounded-full bg-gradient-to-r from-gray-400 to-white"></div>
                                            <div className="pointer-events-none absolute inset-0 rounded-full border border-white/20"></div>
                                        </div>
                                        <div className="mt-2 flex items-center justify-between text-[11px] font-bold text-white/80">
                                            <span>38%</span>
                                            <span>100%</span>
                                        </div>
                                    </div>
                                    <p className="text-xs sm:text-sm text-white/80 font-medium max-w-lg">
                                        To migrate a legacy Shopify store to a headless architecture using Next.js to improve page load speeds by 40%.
                                    </p>
                                </div>
                                <div className="flex items-center gap-4 shrink-0">
                                    <button className="w-full sm:w-auto bg-white text-black rounded-full px-8 py-3.5 text-sm font-bold hover:bg-gray-100 shadow-soft hover:shadow-soft-lg transition-all" onClick={() => window.location.href = '/projects'}>
                                        Open Project
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* 2. Quick Finance Metrics */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                            {[
                                { title: "Net Balance", value: `₹${netWorth.toLocaleString()}`, trend: "Live Data", isPositive: true, icon: Landmark, cardColor: "bg-white", iconBg: "bg-gradient-to-br from-black/80 to-white/20 text-white" },
                                { title: "30-Day Income", value: `₹${monthlyIncome.toLocaleString()}`, trend: incomeTrend, isPositive: parseFloat(incomeTrend) >= 0, icon: TrendingUp, cardColor: "bg-white", iconBg: "bg-gradient-to-br from-black/80 to-white/20 text-white" },
                                { title: "30-Day Expenses", value: `₹${monthlyExpenses.toLocaleString()}`, trend: expenseTrend, isPositive: parseFloat(expenseTrend) <= 0, icon: TrendingDown, cardColor: "bg-white", iconBg: "bg-gradient-to-br from-black/80 to-white/20 text-white" },
                            ].map((stat, i) => (
                                <div key={i} className={`group ${stat.cardColor} border border-gray-100 shadow-soft p-5 sm:p-6 rounded-[32px] hover:border-gray-300 hover:shadow-soft-lg transition-all duration-300 relative overflow-hidden`}>
                                    <div className="flex justify-between items-start mb-4 sm:mb-6">
                                        <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full ${stat.iconBg} flex items-center justify-center transition-all duration-300 group-hover:invert`}>
                                            <stat.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                                        </div>
                                        <span className={`text-[9px] sm:text-[10px] font-bold px-2 py-1 rounded-full ${stat.isPositive ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
                                            {stat.trend}
                                        </span>
                                    </div>
                                    <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1 sm:mb-2">{stat.title}</p>
                                    <h3 className="text-2xl sm:text-3xl font-bold text-gray-900">{stat.value}</h3>
                                </div>
                            ))}
                        </div>

                        <div className="mt-6">

                            {/* 3. Top Spending Categories (formerly 4) */}
                            <div className="bg-white border border-gray-100 shadow-soft p-8 flex flex-col rounded-[32px] hover:border-gray-300 hover:shadow-soft-lg transition-all duration-300">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-xl font-bold text-gray-900 tracking-tight">Top Spent</h3>
                                    <button className="text-xs font-bold text-gray-500 hover:text-black transition-colors flex items-center gap-1 uppercase tracking-wider">
                                        View All <ArrowRight className="w-3 h-3" />
                                    </button>
                                </div>

                                <div className="flex-1 flex flex-col gap-4">
                                    {topSpendingCategories.map((category, i) => {
                                        const COLORS = ['#000000', '#1a1a1a', '#333333', '#4d4d4d', '#666666', '#808080'];
                                        const color = COLORS[i % COLORS.length];
                                        return (
                                            <div key={i} className="flex flex-col gap-2.5 group">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center shrink-0 text-lg group-hover:scale-105 transition-transform">
                                                            <Receipt className="w-4 h-4 text-gray-500" />
                                                        </div>
                                                        <div>
                                                            <h4 className="text-sm font-semibold text-gray-900 truncate">{category.name}</h4>
                                                            <span className="text-[10px] font-bold text-gray-400 uppercase">{category.percentage}</span>
                                                        </div>
                                                    </div>
                                                    <p className="text-sm font-bold text-gray-900">₹{category.amount.toLocaleString()}</p>
                                                </div>
                                                <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                                                    <div className="h-full rounded-full transition-all duration-1000" style={{ width: category.percentage, backgroundColor: color }}></div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>

                                {/* Total */}
                                <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Spent</span>
                                    <span className="text-lg font-black text-gray-900">₹{topSpendingCategories.reduce((s, c) => s + c.amount, 0).toLocaleString()}</span>
                                </div>
                            </div>
                        </div>

                        {/* 6. Marketplace Suggested Products */}
                        <div className="bg-white border border-gray-100 shadow-soft p-6 sm:p-8 rounded-[32px] hover:border-gray-300 hover:shadow-soft-lg transition-all duration-300 flex flex-col mt-6">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 tracking-tight">Suggested for You</h3>
                                    <p className="text-xs font-medium text-gray-500 mt-1">Based on your recent activity</p>
                                </div>
                                <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center shrink-0">
                                    <ShoppingCart className="w-5 h-5 text-gray-900" />
                                </div>
                            </div>

                            <div className="flex-1 flex flex-col gap-3">
                                {suggestedProducts.map((product, i) => (
                                    <div key={i} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-gray-50 border border-transparent hover:border-gray-100 transition-colors cursor-pointer group">
                                        <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center shrink-0 overflow-hidden group-hover:scale-105 transition-transform">
                                            <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-sm font-bold text-gray-900 truncate mb-0.5 group-hover:text-black transition-colors">{product.title}</h4>
                                            <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                                                <span>{product.category}</span>
                                                <div className="flex items-center gap-0.5 text-gray-500">
                                                    <Star className="w-3 h-3 fill-gray-900 text-gray-900" />
                                                    {product.rating}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right shrink-0">
                                            <div className="text-sm font-black text-gray-900 mb-0.5">{product.price}</div>
                                            <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{product.sales} sold</div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <button
                                className="mt-4 w-full py-3.5 bg-gray-900 hover:bg-black text-white text-sm font-bold rounded-xl transition-colors shadow-soft focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
                                onClick={() => window.location.href = '/marketplace'}
                            >
                                Explore Marketplace
                            </button>
                        </div>

                    </div>
                </main>
            </div>
        </div>
    );
}
