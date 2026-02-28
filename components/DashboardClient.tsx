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
    Send
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, Legend, LabelList } from 'recharts';

import { useFinance, Transaction } from "@/context/FinanceContext";

export function DashboardClient() {
    const { transactions, accounts, budgets } = useFinance();
    const viewRef = useRef<HTMLDivElement>(null);

    // --- Dynamic Calculations ---

    // 1. Net Worth (Total balance across all accounts)
    let netWorth = accounts.reduce((sum, acc) => sum + acc.balance, 0);

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

    // 5. Cash Flow Area Chart Data
    // Group by date (simplified aggregation)
    const cashFlowMap = new Map();
    transactions.forEach(txn => {
        const date = new Date(txn.date).toLocaleDateString('en-US', { weekday: 'short' }); // e.g., 'Mon'
        if (!cashFlowMap.has(date)) {
            cashFlowMap.set(date, { date, income: 0, expenses: 0 });
        }
        const current = cashFlowMap.get(date);
        if (txn.amount > 0) current.income += txn.amount;
        else current.expenses += Math.abs(txn.amount);
    });
    // Array format for Recharts
    let cashFlowPerformance = Array.from(cashFlowMap.values()).reverse(); // Reverse to read chronologically loosely

    // 6. Top Spending Categories
    const categoryTotals = transactions.filter(t => t.amount < 0).reduce((acc, txn) => {
        acc[txn.category] = (acc[txn.category] || 0) + Math.abs(txn.amount);
        return acc;
    }, {} as Record<string, number>);

    let topSpendingCategories = Object.entries(categoryTotals)
        .map(([name, amount]) => ({
            name,
            amount,
            percentage: Math.min((amount / monthlyExpenses) * 100, 100).toFixed(0) + '%'
        }))
        .sort((a, b) => b.amount - a.amount)
        .slice(0, 3); // Top 3

    // 7. Recent Transactions (Top 5)
    let recentTransactions = transactions.slice(0, 5);

    // --- Mock Data Injection for Empty Accounts / Demo display ---
    if (transactions.length === 0) {
        netWorth = 84112;
        monthlyIncome = 245000;
        monthlyExpenses = 42100;
        incomeTrend = "+18.2%";
        expenseTrend = "-42.5%";

        const mockPerformance = [];
        let curExpense = 80000;
        let curIncome = 10000;

        for (let i = 30; i >= 0; i--) {
            const dateStr = new Date(now.getTime() - i * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { day: 'numeric', month: 'short' });

            // Emulating the drop in expenses (the solid line)
            if (i < 5) curExpense *= 0.6; // sharp drop at end
            else if (i < 15) curExpense *= 0.9;
            else if (i < 25) curExpense *= 0.98;

            // Emulating the exponential growth in income (the dotted line)
            if (i < 10) curIncome *= 1.25;
            else if (i < 20) curIncome *= 1.1;
            else curIncome *= 1.05;

            mockPerformance.push({
                date: dateStr,
                income: curIncome + (Math.random() * 2000),
                expenses: curExpense + ((Math.random() - 0.5) * 5000),
                expenseLabel: (i % 6 === 0) ? (curExpense + ((Math.random() - 0.5) * 5000)) : null,
                incomeLabel: (i % 5 === 0) ? (curIncome + (Math.random() * 2000)) : null
            });
        }
        cashFlowPerformance = mockPerformance;

        topSpendingCategories = [
            { name: "Server Infrastructure", amount: 15400, percentage: "36%" },
            { name: "Software Subscriptions", amount: 12500, percentage: "29%" },
            { name: "Office Assets", amount: 8200, percentage: "19%" }
        ];

        recentTransactions = [
            { id: "mock-1", description: "AWS Cloud Hosting", category: "Infrastructure", status: "Completed", amount: -4500, date: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(), type: 'Expense' },
            { id: "mock-2", description: "Client Retainer - Q3", category: "Income", status: "Completed", amount: 125000, date: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(), type: 'Income' },
            { id: "mock-3", description: "Figma Teams Subscription", category: "Software", status: "Completed", amount: -1200, date: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(), type: 'Expense' },
            { id: "mock-4", description: "Upwork Escrow Funding", category: "Contractors", status: "Pending", amount: -15000, date: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(), type: 'Expense' },
            { id: "mock-5", description: "Monthly AdSense Revenue", category: "Income", status: "Completed", amount: 28400, date: new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000).toISOString(), type: 'Income' }
        ] as any[];
    }

    const mockRevenueData = [
        { name: "W1", Product: 4000, Agency: 2400 },
        { name: "W2", Product: 4500, Agency: 1398 },
        { name: "W3", Product: 2000, Agency: 9800 },
        { name: "W4", Product: 6780, Agency: 8908 },
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

                        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

                            {/* 3. Cash Flow Chart */}
                            <div className="xl:col-span-2 bg-[#0a0a0a] border border-[#222] shadow-soft p-8 rounded-[32px] hover:border-[#333] hover:shadow-soft-lg transition-all duration-300">
                                <div className="flex items-center justify-between mb-8">
                                    <div>
                                        <h3 className="text-xl font-bold text-white tracking-tight">Cash Flow</h3>
                                        <p className="text-xs font-medium text-gray-400 mt-1">Income vs Expenses (Simulated Range)</p>
                                    </div>
                                    <select className="bg-[#1a1a1a] text-white border-none text-sm font-semibold rounded-full px-4 py-2 outline-none cursor-pointer hover:bg-[#2a2a2a] transition-colors">
                                        <option>Last 7 days</option>
                                        <option>Last 30 days</option>
                                        <option>This Year</option>
                                    </select>
                                </div>
                                <div className="h-[280px] w-full mt-4">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={cashFlowPerformance} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={true} horizontal={false} stroke="#333" />
                                            <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#6B7280', fontWeight: '500' }} tickLine={false} axisLine={false} />
                                            <YAxis tick={{ fontSize: 10, fill: '#6B7280', fontWeight: '500' }} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value}`} />
                                            <RechartsTooltip
                                                contentStyle={{ borderRadius: '12px', border: '1px solid #333', backgroundColor: '#111', color: '#fff', fontWeight: 'bold', fontSize: '12px' }}
                                                itemStyle={{ color: '#fff' }}
                                                labelStyle={{ color: '#9CA3AF', marginBottom: '4px' }}
                                                formatter={(value: any) => [`₹${Number(value).toLocaleString()}`, undefined]}
                                                cursor={{ stroke: '#6B7280', strokeWidth: 1, strokeDasharray: '4 4' }}
                                            />
                                            <Line type="monotone" dataKey="expenses" name="Expenses" stroke="#00E5FF" strokeWidth={2.5} dot={false} activeDot={{ r: 6, fill: '#00E5FF', strokeWidth: 0 }}>
                                                <LabelList dataKey="expenseLabel" position="top" fill="#ffffff" fontSize={11} fontWeight="bold" formatter={(v: any) => v ? `₹${(v / 1000).toFixed(1)}k` : ''} offset={12} />
                                            </Line>
                                            <Line type="monotone" dataKey="income" name="Income" stroke="#9CA3AF" strokeWidth={1.5} strokeDasharray="4 4" dot={{ r: 6, fill: '#2563EB', strokeWidth: 0 }} activeDot={{ r: 8, fill: '#2563EB', strokeWidth: 0 }}>
                                                <LabelList dataKey="incomeLabel" position="bottom" fill="#9CA3AF" fontSize={11} fontWeight="bold" formatter={(v: any) => v ? `₹${(v / 1000).toFixed(1)}k` : ''} offset={12} />
                                            </Line>
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {/* 4. Top Spending Categories */}
                            <div className="bg-white border border-gray-100 shadow-soft p-8 flex flex-col rounded-[32px] hover:border-gray-300 hover:shadow-soft-lg transition-all duration-300">
                                <div className="flex items-center justify-between mb-8">
                                    <h3 className="text-xl font-bold text-gray-900 tracking-tight">Top Spent</h3>
                                    <button className="bg-gray-50 text-gray-500 p-2 rounded-full hover:bg-gray-100 hover:text-black transition-colors">
                                        <ArrowRight className="w-4 h-4" />
                                    </button>
                                </div>

                                <div className="flex-1 flex flex-col gap-4">
                                    {topSpendingCategories.map((category, i) => {
                                        const COLORS = ['#000000', '#333333', '#666666'];
                                        const color = COLORS[i % COLORS.length];
                                        return (
                                            <div key={i} className="flex flex-col gap-3">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center shrink-0">
                                                            <Receipt className="w-4 h-4 text-gray-500" />
                                                        </div>
                                                        <h4 className="text-sm font-semibold text-gray-900 truncate">{category.name}</h4>
                                                    </div>
                                                    <p className="text-sm font-bold text-gray-900">₹{category.amount.toLocaleString()}</p>
                                                </div>
                                                <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                                                    <div className="h-full rounded-full transition-all duration-1000" style={{ width: category.percentage, backgroundColor: color }}></div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* 5. Recent Transactions */}
                        <div className="bg-white border border-gray-100 shadow-soft p-6 sm:p-8 rounded-[32px] mt-6 hover:border-gray-300 hover:shadow-soft-lg transition-all duration-300">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                                <h3 className="text-xl font-bold text-gray-900 tracking-tight">Recent Transactions</h3>
                                <button className="text-sm font-bold text-primary hover:text-primary/80 transition-colors flex items-center gap-2 w-fit" onClick={() => window.location.href = '/ledger'}>
                                    Go to Ledger <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="overflow-x-auto custom-scrollbar -mx-4 sm:mx-0">
                                <table className="w-full text-left border-separate border-spacing-y-2 min-w-[600px] sm:min-w-0">
                                    <thead>
                                        <tr className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-6">
                                            <th className="px-6 py-2">Entity / Description</th>
                                            <th className="px-6 py-2">Category</th>
                                            <th className="px-6 py-2">Status</th>
                                            <th className="px-6 py-2 text-right">Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y-0">
                                        {recentTransactions.map((txn, i) => (
                                            <tr key={i} className="hover:bg-gray-50 transition-all group rounded-2xl">
                                                <td className="px-6 py-4 bg-gray-50/30 first:rounded-l-2xl">
                                                    <div className="flex items-center gap-4">
                                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${txn.amount > 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                                                            {txn.amount > 0 ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="text-sm font-bold text-gray-900 line-clamp-1">{txn.description}</span>
                                                            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-tight">{new Date(txn.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 bg-gray-50/30">
                                                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 bg-white border border-gray-100 px-3 py-1.5 rounded-full shadow-sm">
                                                        {txn.category}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 bg-gray-50/30">
                                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter ${txn.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                                        <span className={`w-1.5 h-1.5 rounded-full ${txn.status === 'Completed' ? 'bg-green-500' : 'bg-amber-500'} animate-pulse`}></span>
                                                        {txn.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 bg-gray-50/30 last:rounded-r-2xl text-right">
                                                    <span className={`font-space font-bold text-base ${txn.amount > 0 ? 'text-green-600' : 'text-gray-900'}`}>
                                                        {txn.amount > 0 ? '+' : ''}₹{Math.abs(txn.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            {recentTransactions.length === 0 && (
                                <div className="py-20 text-center">
                                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                                        <Receipt className="w-8 h-8" />
                                    </div>
                                    <p className="text-gray-500 font-semibold text-sm">No transactions found.</p>
                                    <button className="mt-4 text-primary text-xs font-bold hover:underline" onClick={() => window.location.href = '/ledger'}>Add your first entry &rarr;</button>
                                </div>
                            )}
                        </div>

                        {/* 6. Revenue Breakdown (Sample Graph) */}
                        <div className="bg-white border border-gray-100 shadow-soft p-6 sm:p-8 rounded-[32px] mt-6 hover:border-gray-300 hover:shadow-soft-lg transition-all duration-300">
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 tracking-tight">Revenue Breakdown (Sample)</h3>
                                    <p className="text-xs font-medium text-gray-500 mt-1">Product Sales vs Agency Services</p>
                                </div>
                            </div>
                            <div className="h-[300px] w-full mt-4">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={mockRevenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} barSize={32}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                        <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#6B7280', fontWeight: 'bold' }} tickLine={false} axisLine={false} />
                                        <YAxis tick={{ fontSize: 10, fill: '#6B7280', fontWeight: 'bold' }} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value}`} />
                                        <RechartsTooltip
                                            contentStyle={{ borderRadius: '12px', border: '1px solid #F3F4F6', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', color: '#111827', fontWeight: 'bold', fontSize: '12px' }}
                                            cursor={{ fill: '#F9FAFB' }}
                                        />
                                        <Legend wrapperStyle={{ fontSize: '12px', fontWeight: 'bold', color: '#374151' }} />
                                        <Bar dataKey="Product" stackId="a" fill="#000000" radius={[0, 0, 4, 4]} />
                                        <Bar dataKey="Agency" stackId="a" fill="#2563EB" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                    </div>
                </main>
            </div>
        </div>
    );
}
