"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Sidebar } from "./Sidebar";
import { DashboardWaves } from "./DashboardWaves";
import { Header } from "./Header";
import {
    Plus,
    TrendingUp,
    TrendingDown,
    Wallet,
    ArrowUpRight,
    Search,
    Filter,
    Download,
    X,
    Receipt,
    Sparkles,
    ArrowRight,
    ArrowRightLeft,
    Mic,
    MicOff,
    Loader2,
    Bell,
    Building2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

import { useFinance, Transaction } from "@/context/FinanceContext";
import { createClient } from "@/utils/supabase/client";

const COLORS = ['#111827', '#374151', '#6B7280', '#9CA3AF', '#D1D5DB', '#1F2937', '#4B5563', '#E5E7EB', '#F3F4F6'];

export function LedgerClient() {
    let { transactions, addTransaction, deleteTransaction, insights, insightsLoading, loadInsights } = useFinance();
    let isDemoMode = false;
    let mockCashFlowData: any[] = [];

    if (transactions.length === 0) {
        isDemoMode = true;
        const now = new Date();
        transactions = [
            { id: "mock-1", description: "AWS Cloud Hosting", category: "Infrastructure", status: "Completed", amount: -4500, date: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(), type: 'Expense' },
            { id: "mock-2", description: "Client Retainer - Q3", category: "Sales", status: "Completed", amount: 125000, date: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(), type: 'Income' },
            { id: "mock-3", description: "Figma Teams Subscription", category: "Software", status: "Completed", amount: -1200, date: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(), type: 'Expense' },
            { id: "mock-4", description: "Upwork Escrow Funding", category: "Services", status: "Pending", amount: -15000, date: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(), type: 'Expense' },
            { id: "mock-5", description: "Monthly AdSense Revenue", category: "Sales", status: "Completed", amount: 28400, date: new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000).toISOString(), type: 'Income' }
        ] as any[];

        let curExpense = 80000;
        let curIncome = 10000;
        for (let i = 30; i >= 0; i--) {
            const dateStr = new Date(now.getTime() - i * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
            if (i < 5) curExpense *= 0.6;
            else if (i < 15) curExpense *= 0.9;
            else if (i < 25) curExpense *= 0.98;
            if (i < 10) curIncome *= 1.25;
            else if (i < 20) curIncome *= 1.1;
            else curIncome *= 1.05;
            mockCashFlowData.push({
                date: dateStr,
                income: curIncome + (Math.random() * 2000),
                expense: curExpense + ((Math.random() - 0.5) * 5000),
            });
        }
    }
    const containerRef = useRef<HTMLDivElement>(null);
    const viewRef = useRef<HTMLDivElement>(null);

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isCategoriesModalOpen, setIsCategoriesModalOpen] = useState(false);
    const [isEmiReminderActive, setIsEmiReminderActive] = useState(false);
    const [userEmail, setUserEmail] = useState<string | null>(null);
    const [isSendingEmail, setIsSendingEmail] = useState(false);
    const [emailStatus, setEmailStatus] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({ 
        show: false, 
        message: '', 
        type: 'success' 
    });

    // Custom categories state
    const [customCategories, setCustomCategories] = useState<string[]>([
        "Sales", "Infrastructure", "Marketing", "Software", "Services", "Other", "Food"
    ]);
    const [newCategory, setNewCategory] = useState("");

    // Form state
    const [desc, setDesc] = useState("");
    const [amt, setAmt] = useState("");
    const [cat, setCat] = useState("Sales");
    const [txnType, setTxnType] = useState<"Income" | "Expense">("Income");

    // Filter & Sort state
    const [searchQuery, setSearchQuery] = useState("");
    const [filterType, setFilterType] = useState<string>("All"); // Expanded from strictly "All" | "Income" | "Expense" | "Pending" to allow any custom category string
    const [sortField, setSortField] = useState<"date" | "amount" | null>("date");
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
    const [dateFilter, setDateFilter] = useState<"All" | "Last 7 Days" | "Last 30 Days" | "This Month">("All");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    // AI Categorizer State
    const [isAutoCategorizing, setIsAutoCategorizing] = useState(false);
    const [showAiBadge, setShowAiBadge] = useState(false);
    const aiTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Receipt Scanner State
    const [isScanningReceipt, setIsScanningReceipt] = useState(false);
    const [receiptScanned, setReceiptScanned] = useState(false);
    const [isDragging, setIsDragging] = useState(false);

    // Voice Recording State
    const [isRecording, setIsRecording] = useState(false);
    const [isProcessingVoice, setIsProcessingVoice] = useState(false);
    const [voiceItems, setVoiceItems] = useState<any[]>([]);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);

    // Speech-to-text State
    const [isListening, setIsListening] = useState(false);
    const recognitionRef = useRef<any>(null);

    const toggleListening = () => {
        setIsListening(!isListening);
    };

    // Voice Recording Handlers
    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            audioChunksRef.current = [];

            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    audioChunksRef.current.push(e.data);
                }
            };

            mediaRecorder.onstop = async () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                await processVoiceTransaction(audioBlob);
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorder.start();
            setIsRecording(true);
        } catch (error) {
            console.error("Error accessing microphone:", error);
            alert("Could not access microphone. Please check permissions.");
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };

    const processVoiceTransaction = async (audioBlob: Blob) => {
        setIsProcessingVoice(true);
        try {
            const formData = new FormData();
            formData.append('audio', audioBlob, 'voice.webm');
            formData.append('mimeType', 'audio/webm');
            formData.append('categories', JSON.stringify(customCategories));

            const res = await fetch('/api/voice-transaction', {
                method: 'POST',
                body: formData
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.error || "Failed to process voice input");
            }

            const data = await res.json();

            // Auto fill form
            setDesc(data.description || "");
            if (data.amount) setAmt(data.amount.toString());

            if (data.category) {
                if (!customCategories.includes(data.category)) {
                    const newCats = [...customCategories, data.category];
                    setCustomCategories(newCats);
                    localStorage.setItem("customCategories", JSON.stringify(newCats));
                }
                setCat(data.category);
            }

            if (data.type === "Income" || data.type === "Expense") {
                setTxnType(data.type);
            }

            if (data.items) {
                setVoiceItems(data.items);
            }

            setShowAiBadge(true);

        } catch (error: any) {
            console.error("Voice processing error:", error);
            alert(error.message || "Failed to process voice input.");
        } finally {
            setIsProcessingVoice(false);
        }
    };

    // AI Categorizer Effect
    useEffect(() => {
        if (!desc) {
            setShowAiBadge(false);
            return;
        }

        // Debounce to simulate waiting for user to stop typing
        if (aiTimeoutRef.current) clearTimeout(aiTimeoutRef.current);

        setIsAutoCategorizing(true);
        setShowAiBadge(false);

        aiTimeoutRef.current = setTimeout(() => {
            const lowerDesc = desc.toLowerCase();
            let newCat = cat;

            // Simple mock heuristic logic
            if (lowerDesc.includes("netflix") || lowerDesc.includes("spotify") || lowerDesc.includes("adobe") || lowerDesc.includes("aws")) {
                newCat = "Software";
                setTxnType("Expense");
            } else if (lowerDesc.includes("server") || lowerDesc.includes("aws") || lowerDesc.includes("hosting") || lowerDesc.includes("domain")) {
                newCat = "Infrastructure";
                setTxnType("Expense");
            } else if (lowerDesc.includes("google ads") || lowerDesc.includes("facebook ads") || lowerDesc.includes("marketing") || lowerDesc.includes("promo")) {
                newCat = "Marketing";
                setTxnType("Expense");
            } else if (lowerDesc.includes("sale") || lowerDesc.includes("client") || lowerDesc.includes("invoice") || lowerDesc.includes("freelance")) {
                newCat = "Sales";
                setTxnType("Income");
            }

            if (newCat !== cat || (newCat === cat && lowerDesc.length > 3)) {
                setCat(newCat);
                setShowAiBadge(true);
            }

            setIsAutoCategorizing(false);
        }, 800); // 800ms "AI Request" delay

        return () => {
            if (aiTimeoutRef.current) clearTimeout(aiTimeoutRef.current);
        };
    }, [desc]);

    useEffect(() => {
        gsap.fromTo(
            viewRef.current,
            { opacity: 0 },
            { opacity: 1, duration: 0.5, ease: "power2.out" }
        );

        if (containerRef.current) {
            const elements = containerRef.current.children;
            gsap.fromTo(
                elements,
                { y: 20, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.5, stagger: 0.08, ease: "power2.out", delay: 0.2 }
            );
        }
    }, []);

    // Fetch user email from Supabase auth
    useEffect(() => {
        const fetchUser = async () => {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();
            if (user?.email) {
                setUserEmail(user.email);
            }
        };
        fetchUser();
    }, []);

    // Function to send EMI reminder email
    const sendEmiReminderEmail = async () => {
        if (!userEmail) {
            setEmailStatus({ 
                show: true, 
                message: 'Please log in to receive email reminders', 
                type: 'error' 
            });
            setTimeout(() => setEmailStatus({ show: false, message: '', type: 'success' }), 3000);
            return;
        }

        setIsSendingEmail(true);

        try {
            const response = await fetch('http://localhost:8000/api/reminders/emi', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_email: userEmail,
                    loan_type: 'Home Loan',
                    bank_name: 'HDFC Bank',
                    amount: 45200.0,
                    due_days: 5,
                    due_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
                })
            });

            const data = await response.json();

            if (data.success) {
                setEmailStatus({ 
                    show: true, 
                    message: `✅ Email reminder sent to ${userEmail}`, 
                    type: 'success' 
                });
            } else {
                throw new Error('Failed to send email');
            }
        } catch (error) {
            console.error('Email error:', error);
            setEmailStatus({ 
                show: true, 
                message: '❌ Failed to send email reminder', 
                type: 'error' 
            });
        } finally {
            setIsSendingEmail(false);
            setTimeout(() => setEmailStatus({ show: false, message: '', type: 'success' }), 5000);
        }
    };

    // Handle toggle change
    const handleEmiToggle = async () => {
        const newState = !isEmiReminderActive;
        setIsEmiReminderActive(newState);
        
        if (newState) {
            // When enabling, send email reminder
            await sendEmiReminderEmail();
        }
    };

    const totalIncome = isDemoMode ? 245000 : transactions.filter(t => t.amount > 0).reduce((sum, t) => sum + t.amount, 0);
    const totalExpense = isDemoMode ? 42100 : transactions.filter(t => t.amount < 0).reduce((sum, t) => sum + Math.abs(t.amount), 0);
    const balance = isDemoMode ? 84112 : transactions.reduce((sum, t) => sum + t.amount, 0);
    const incomeTrend = isDemoMode ? "+18.2%" : "+14%";
    const expenseTrend = isDemoMode ? "-42.5%" : "-2%";

    const handleAddCategory = () => {
        if (!newCategory.trim() || customCategories.includes(newCategory.trim())) return;
        const updated = [...customCategories, newCategory.trim()];
        setCustomCategories(updated);
        localStorage.setItem("customCategories", JSON.stringify(updated));
        setNewCategory("");
    };

    const handleRemoveCategory = (catToRemove: string) => {
        const updated = customCategories.filter(c => c !== catToRemove);
        setCustomCategories(updated);
        localStorage.setItem("customCategories", JSON.stringify(updated));
        // Reset default cat if it was removed
        if (cat === catToRemove) {
            setCat(updated.length > 0 ? updated[0] : "");
        }
    };

    const handleAddTransaction = (e: React.FormEvent) => {
        e.preventDefault();
        if (!desc || !amt) return;

        addTransaction({
            date: new Date().toISOString().split('T')[0],
            description: desc.trim(),
            category: cat,
            type: txnType,
            amount: parseFloat(amt),
            source: voiceItems.length > 0 ? "voice" : "manual",
            items: voiceItems.length > 0 ? voiceItems : undefined,
        });

        setIsAddModalOpen(false);
        setDesc("");
        setAmt("");
        setVoiceItems([]);
        setShowAiBadge(false);
        setReceiptScanned(false);
    };

    const processReceiptImage = async (file: File) => {
        setIsScanningReceipt(true);
        setReceiptScanned(false);
        try {
            const formData = new FormData();
            formData.append('image', file);
            formData.append('categories', JSON.stringify(customCategories));

            const res = await fetch('/api/receipt-transaction', {
                method: 'POST',
                body: formData
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.error || "Failed to process receipt image");
            }

            const data = await res.json();

            // Auto fill form
            setDesc(data.description || "");
            if (data.amount) setAmt(data.amount.toString());

            if (data.category && !customCategories.includes(data.category)) {
                const newCats = [...customCategories, data.category];
                setCustomCategories(newCats);
                localStorage.setItem("customCategories", JSON.stringify(newCats));
                setCat(data.category);
            } else if (data.category) {
                setCat(data.category);
            }

            if (data.type === "Income" || data.type === "Expense") {
                setTxnType(data.type);
            }

            if (data.items) {
                setVoiceItems(data.items);
            }

            setShowAiBadge(true);
            setReceiptScanned(true);

        } catch (error: any) {
            console.error("Receipt processing error:", error);
            alert(error.message || "Failed to process receipt image.");
        } finally {
            setIsScanningReceipt(false);
        }
    };

    // Receipt Scanner Handlers
    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent | React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        setIsDragging(false);

        let file: File | null = null;

        if ('dataTransfer' in e) {
            if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                file = e.dataTransfer.files[0];
            }
        } else if (e.target && e.target.files && e.target.files.length > 0) {
            file = e.target.files[0];
        }

        if (file && file.type.startsWith('image/')) {
            processReceiptImage(file);
        } else {
            alert("Please provide a valid image file.");
        }
    };

    // Derived Data for Charts
    const getFilteredCashFlowData = () => {
        let maxDays = Infinity;
        if (dateFilter === "Last 7 Days") maxDays = 7;
        if (dateFilter === "Last 30 Days") maxDays = 30;

        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        const recentTxns = transactions.filter(t => {
            const txnDate = new Date(t.date);
            if (dateFilter === "This Month") return txnDate >= startOfMonth;

            const diffTime = Math.abs(now.getTime() - txnDate.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            return diffDays <= maxDays;
        });

        const dailyData = recentTxns.reduce((acc, txn) => {
            const date = txn.date;
            if (!acc[date]) acc[date] = { income: 0, expense: 0 };
            if (txn.amount > 0) acc[date].income += txn.amount;
            else acc[date].expense += Math.abs(txn.amount);
            return acc;
        }, {} as Record<string, { income: number, expense: number }>);

        return Object.entries(dailyData)
            .map(([date, data]) => ({ date, ...data }))
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    };

    const cashFlowData = isDemoMode ? mockCashFlowData : getFilteredCashFlowData();

    // Reset pagination to 1 when search or filter changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, filterType]);

    const expenseBreakdownData = isDemoMode ? [
        { name: "Server Infrastructure", value: 15400 },
        { name: "Software Subscriptions", value: 12500 },
        { name: "Office Assets", value: 8200 }
    ] : transactions
        .filter(t => t.amount < 0 && t.category_prices)
        .reduce((acc, txn) => {
            if (!txn.category_prices) return acc;

            Object.entries(txn.category_prices).forEach(([categoryName, amount]) => {
                // LLM might have returned positive amounts for expenses, or negative.
                // We'll trust our overarching t.amount sign or Math.abs it.
                const fallbackAmount = Math.abs(amount);
                const existing = acc.find(item => item.name === categoryName);
                if (existing) {
                    existing.value += fallbackAmount;
                } else {
                    acc.push({ name: categoryName, value: fallbackAmount });
                }
            });
            return acc;
        }, [] as { name: string, value: number }[])
        .sort((a, b) => b.value - a.value);

    // Filtered & Sorted Transactions
    const filteredAndSortedTransactions = [...transactions]
        .filter(t => {
            const searchLower = searchQuery.toLowerCase();
            const matchesSearch = t.description.toLowerCase().includes(searchLower) ||
                t.id.toLowerCase().includes(searchLower) ||
                (t.category_prices && Object.keys(t.category_prices).some(cat => cat.toLowerCase().includes(searchLower))) ||
                (t.category && t.category.toLowerCase().includes(searchLower));

            const matchesType = filterType === "All" ? true :
                filterType === "Pending" ? t.status === "Pending" :
                    filterType === "Income" ? t.type === "Income" :
                        filterType === "Expense" ? t.type === "Expense" :
                            t.category === filterType || (t.category_prices && Object.keys(t.category_prices).includes(filterType));

            let matchesDate = true;
            if (dateFilter !== "All") {
                const txnDate = new Date(t.date);
                const now = new Date();
                if (dateFilter === "Last 7 Days") {
                    matchesDate = txnDate >= new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                } else if (dateFilter === "Last 30 Days") {
                    matchesDate = txnDate >= new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                } else if (dateFilter === "This Month") {
                    matchesDate = txnDate.getMonth() === now.getMonth() && txnDate.getFullYear() === now.getFullYear();
                }
            }

            return matchesSearch && matchesType && matchesDate;
        })
        .sort((a, b) => {
            if (!sortField) return 0;
            if (sortField === "date") {
                const dateA = new Date(a.date).getTime();
                const dateB = new Date(b.date).getTime();
                return sortDirection === "asc" ? dateA - dateB : dateB - dateA;
            } else if (sortField === "amount") {
                return sortDirection === "asc" ? a.amount - b.amount : b.amount - a.amount;
            }
            return 0;
        });

    const handleSort = (field: "date" | "amount") => {
        if (sortField === field) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            setSortField(field);
            setSortDirection("desc");
        }
    };

    const totalPages = Math.ceil(filteredAndSortedTransactions.length / itemsPerPage);
    const paginatedTransactions = filteredAndSortedTransactions.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleExportCSV = () => {
        const headers = ["ID", "Date", "Description", "Category", "Amount", "Type", "Status"];
        const csvContent = [
            headers.join(","),
            ...filteredAndSortedTransactions.map(t =>
                [t.id, t.date, `"${t.description.replace(/"/g, '""')}"`, t.category, t.amount, t.amount > 0 ? "Income" : "Expense", t.status].join(",")
            )
        ].join("\n");
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "kolpay_ledger_export.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div ref={viewRef} className="flex h-screen overflow-hidden bg-transparent relative">
            <DashboardWaves />
            <Sidebar />
            <div className="flex-1 flex flex-col h-full overflow-y-auto relative z-10">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gray-900/5 rounded-full blur-[120px] -z-10 pointer-events-none translate-x-1/3 -translate-y-1/3"></div>
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gray-400/5 rounded-full blur-[120px] -z-10 pointer-events-none -translate-x-1/3 translate-y-1/3"></div>
                <Header />

                <main
                    ref={containerRef}
                    className="flex-1 px-4 sm:px-6 lg:px-10 pt-8 pb-32 lg:pb-20 space-y-8 max-w-[1600px] mx-auto w-full z-0 custom-scrollbar overflow-x-hidden"
                >
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4">
                        <div>
                            <p className="text-xs sm:text-sm font-semibold text-gray-900 uppercase tracking-wider mb-2">Financials</p>
                            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-foreground leading-tight">
                                Ledger & Bookkeeping
                            </h1>
                            <p className="text-xs sm:text-sm text-gray-500 mt-2">Track income, expenses, and overall balance.</p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <motion.button
                                onClick={handleExportCSV}
                                whileHover={{ y: -2 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full sm:w-auto bg-white text-foreground font-semibold px-6 py-3 rounded-full flex items-center justify-center gap-2 hover:-translate-y-0.5 transition-all border border-gray-100 shadow-soft hover:shadow-soft-lg text-sm"
                            >
                                <Download className="w-4 h-4 text-gray-400" /> Export CSV
                            </motion.button>
                            <motion.button
                                onClick={() => setIsAddModalOpen(true)}
                                whileHover={{ y: -2 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full sm:w-auto bg-gray-900 text-white font-bold px-6 py-3 rounded-full flex items-center justify-center gap-2 hover:bg-black transition-all shadow-soft hover:shadow-soft-lg text-sm"
                            >
                                <Plus className="w-4 h-4" /> Add Entry
                            </motion.button>
                        </div>
                    </div>

                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="bg-white rounded-[32px] p-6 sm:p-8 shadow-soft border border-gray-100 transition-colors group relative overflow-hidden hover:shadow-soft-lg">
                            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform">
                                <Wallet className="w-20 h-20 sm:w-24 sm:h-24" />
                            </div>
                            <div className="flex justify-between items-start mb-6 relative z-10">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-black/80 to-white/20 text-white flex items-center justify-center transition-all duration-300 group-hover:invert">
                                    <Wallet className="w-4 h-4 sm:w-5 sm:h-5" />
                                </div>
                            </div>
                            <div className="relative z-10">
                                <p className="text-gray-500 text-xs sm:text-sm font-semibold mb-2">Total Balance</p>
                                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground truncate">₹{balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h2>
                            </div>
                        </div>

                        <div className="bg-white rounded-[32px] p-6 sm:p-8 shadow-soft border border-gray-100 transition-colors group relative overflow-hidden hover:shadow-soft-lg">
                            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform">
                                <TrendingUp className="w-20 h-20 sm:w-24 sm:h-24" />
                            </div>
                            <div className="flex justify-between items-start mb-6 relative z-10">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-black/80 to-white/20 text-white flex items-center justify-center transition-all duration-300 group-hover:invert">
                                    <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
                                </div>
                                <span className="flex items-center gap-1 text-[10px] sm:text-xs font-bold text-green-700 bg-green-100 px-3 py-1.5 rounded-full">
                                    <ArrowUpRight className="w-3 h-3" /> {incomeTrend}
                                </span>
                            </div>
                            <div className="relative z-10">
                                <p className="text-gray-500 text-xs sm:text-sm font-semibold mb-2">Total Income (Monthly)</p>
                                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground truncate">₹{totalIncome.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h2>
                            </div>
                        </div>

                        <div className="bg-white rounded-[32px] p-6 sm:p-8 shadow-soft border border-gray-100 transition-colors group relative overflow-hidden hover:shadow-soft-lg sm:col-span-2 lg:col-span-1">
                            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform">
                                <TrendingDown className="w-20 h-20 sm:w-24 sm:h-24" />
                            </div>
                            <div className="flex justify-between items-start mb-6 relative z-10">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-black/80 to-white/20 text-white flex items-center justify-center transition-all duration-300 group-hover:invert">
                                    <TrendingDown className="w-4 h-4 sm:w-5 sm:h-5" />
                                </div>
                                <span className="flex items-center gap-1 text-[10px] sm:text-xs font-bold text-red-700 bg-red-100 px-3 py-1.5 rounded-full">
                                    <TrendingDown className="w-3 h-3" /> {expenseTrend}
                                </span>
                            </div>
                            <div className="relative z-10">
                                <p className="text-gray-500 text-xs sm:text-sm font-semibold mb-2">Total Expenses (Monthly)</p>
                                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground truncate">₹{totalExpense.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h2>
                            </div>
                        </div>
                    </div>

                    {/* Analytics & Insights Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
                        {/* Cash Flow Chart */}
                        <div className="lg:col-span-2 bg-white rounded-[32px] border border-gray-100 shadow-soft p-6 sm:p-8 flex flex-col">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                                <div>
                                    <h2 className="text-xl font-bold text-foreground">Cash Flow Trend</h2>
                                    <p className="text-xs sm:text-sm font-semibold text-gray-500">Income vs Expenses over time</p>
                                </div>
                                <select
                                    value={dateFilter}
                                    onChange={(e) => setDateFilter(e.target.value as any)}
                                    className="bg-gray-50 border-none rounded-full px-5 py-2.5 text-xs sm:text-sm font-semibold outline-none focus:ring-2 focus:ring-gray-900/50 cursor-pointer w-full sm:w-auto"
                                >
                                    <option value="All">All Time</option>
                                    <option value="Last 30 Days">Last 30 Days</option>
                                    <option value="Last 7 Days">Last 7 Days</option>
                                    <option value="This Month">This Month</option>
                                </select>
                            </div>
                            <div className="flex-1 min-h-[250px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={cashFlowData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                                            </linearGradient>
                                            <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                        <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#6B7280' }} tickLine={false} axisLine={false} />
                                        <YAxis tick={{ fontSize: 12, fill: '#6B7280' }} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value}`} />
                                        <RechartsTooltip
                                            contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 10px 40px -4px rgba(0, 0, 0, 0.08)' }}
                                            formatter={(value: any) => [`₹${Number(value).toLocaleString()}`, undefined]}
                                        />
                                        <Area type="monotone" dataKey="income" name="Income" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#colorIncome)" />
                                        <Area type="monotone" dataKey="expense" name="Expense" stroke="#EF4444" strokeWidth={3} fillOpacity={1} fill="url(#colorExpense)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* AI Insights & Expense Breakdown */}
                        <div className="flex flex-col gap-6">
                            {/* AI Insight Card */}
                            <div className="bg-linear-to-br from-gray-900/10 to-gray-400/10 rounded-[32px] border border-gray-900/20 shadow-soft p-8 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-4 opacity-10">
                                    <Sparkles className="w-16 h-16 text-gray-900" />
                                </div>
                                <div className="flex items-center gap-2 mb-4">
                                    <Sparkles className="w-6 h-6 text-gray-900" />
                                    <h3 className="font-bold text-xl text-gray-900">Smart Insight</h3>
                                </div>
                                {insightsLoading ? (
                                    <div className="text-sm text-gray-600 font-semibold mb-6 flex items-center gap-2">
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Analyzing your transactions...
                                    </div>
                                ) : insights ? (
                                    <>
                                        <div className="space-y-3 mb-6">
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="text-gray-600 font-medium">Total Income</span>
                                                <span className="font-bold text-green-600">₹{insights.total_income.toLocaleString()}</span>
                                            </div>
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="text-gray-600 font-medium">Total Expenses</span>
                                                <span className="font-bold text-red-600">₹{insights.total_expenses.toLocaleString()}</span>
                                            </div>
                                            <div className="flex justify-between items-center text-sm pt-2 border-t border-gray-200">
                                                <span className="text-gray-700 font-semibold">Savings Rate</span>
                                                <span className={`font-bold ${insights.savings_rate > 20 ? 'text-green-600' : insights.savings_rate > 10 ? 'text-yellow-600' : 'text-red-600'}`}>
                                                    {insights.savings_rate.toFixed(1)}%
                                                </span>
                                            </div>
                                        </div>
                                        {insights.recommendations && insights.recommendations.length > 0 && (
                                            <div className="text-sm text-gray-700 font-semibold leading-relaxed mb-6 bg-white/50 rounded-2xl p-4 border border-gray-200">
                                                <div className="flex items-start gap-2">
                                                    <Sparkles className="w-4 h-4 text-gray-900 mt-0.5 flex-shrink-0" />
                                                    <p>{insights.recommendations[0]}</p>
                                                </div>
                                            </div>
                                        )}
                                        <button
                                            onClick={() => loadInsights(90, true)}
                                            className="text-sm font-bold text-gray-900 flex items-center gap-1.5 group-hover:gap-2.5 transition-all"
                                        >
                                            Refresh Insights <ArrowRight className="w-4 h-4" />
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <p className="text-sm text-gray-700 font-semibold leading-relaxed mb-6">
                                            Start tracking your income and expenses to receive personalized, AI-driven insights on your spending habits.
                                        </p>
                                        <button
                                            onClick={() => loadInsights(90, true)}
                                            className="text-sm font-bold text-gray-900 flex items-center gap-1.5 group-hover:gap-2.5 transition-all"
                                        >
                                            Generate Insights <ArrowRight className="w-4 h-4" />
                                        </button>
                                    </>
                                )}
                            </div>

                            {/* CIBIL Growth Engine */}
                            <div className="bg-white rounded-[32px] border border-gray-100 shadow-soft p-6 sm:p-8 flex-1 flex flex-col">
                                <h3 className="text-lg font-bold text-foreground mb-4">CIBIL Growth Engine</h3>

                                <div className="flex items-center justify-between bg-gray-50 p-4 rounded-2xl mb-6 border border-gray-200">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm">
                                            <Bell className="w-4 h-4 text-gray-900" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-900 leading-tight">EMI Email Reminders</p>
                                            <p className="text-[10px] sm:text-xs font-semibold text-gray-500 mt-0.5">
                                                {userEmail ? `Notifications sent to ${userEmail}` : 'Get email alerts 5 days before EMI date'}
                                            </p>
                                        </div>
                                    </div>
                                    {/* Toggle Switch with Email Integration */}
                                    <div
                                        onClick={handleEmiToggle}
                                        className={`w-11 h-6 rounded-full relative cursor-pointer shrink-0 transition-colors duration-300 ${isEmiReminderActive ? 'bg-primary' : 'bg-gray-300'}`}
                                    >
                                        <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 shadow-sm transition-all duration-300 ${isEmiReminderActive ? 'left-[22px]' : 'left-0.5'} flex items-center justify-center`}>
                                            {isSendingEmail && <Loader2 className="w-3 h-3 text-primary animate-spin" />}
                                        </div>
                                    </div>
                                </div>

                                {/* Email Status Message */}
                                <AnimatePresence>
                                    {emailStatus.show && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto', marginBottom: 16 }}
                                            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="overflow-hidden"
                                        >
                                            <div className={`${
                                                emailStatus.type === 'success' 
                                                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
                                                    : 'bg-red-50 border-red-200 text-red-800'
                                            } border rounded-xl p-3 text-sm font-semibold`}>
                                                {emailStatus.message}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <AnimatePresence>
                                    {isEmiReminderActive && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto', marginBottom: 24 }}
                                            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                                            className="overflow-hidden"
                                        >
                                            <div className="bg-red-50/50 border border-red-100 rounded-2xl p-4 flex flex-col gap-3">
                                                <div className="flex justify-between items-start">
                                                    <div className="flex gap-3 items-center">
                                                        <div className="w-10 h-10 rounded-xl bg-white shadow-soft flex items-center justify-center shrink-0 border border-gray-50">
                                                            <Building2 className="w-5 h-5 text-gray-700" />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-bold text-gray-900">Home Loan EMI</p>
                                                            <p className="text-xs font-semibold text-gray-500">HDFC Bank</p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-sm font-bold text-gray-900">₹45,200</p>
                                                        <p className="text-[10px] sm:text-xs font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded-full inline-block mt-1">Due in 5 days</p>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2 mt-1">
                                                    <button className="flex-1 bg-gray-900 text-white text-xs font-bold py-2 rounded-xl hover:bg-black transition-colors shadow-soft">
                                                        Pay Now
                                                    </button>
                                                    <button className="flex-1 bg-white text-gray-700 border border-gray-200 text-xs font-bold py-2 rounded-xl hover:bg-gray-50 transition-colors shadow-soft">
                                                        Remind Later
                                                    </button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {expenseBreakdownData.length > 0 ? (
                                    <div className="flex-1 flex flex-col justify-center relative">
                                        <div className="h-[140px] w-full">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <PieChart>
                                                    <Pie
                                                        data={expenseBreakdownData}
                                                        innerRadius={45}
                                                        outerRadius={65}
                                                        paddingAngle={5}
                                                        dataKey="value"
                                                        stroke="none"
                                                    >
                                                        {expenseBreakdownData.map((entry, index) => (
                                                            <Cell
                                                                key={`cell-${index}`}
                                                                fill={filterType === entry.name ? COLORS[index % COLORS.length] : filterType === "All" || filterType === "Pending" ? COLORS[index % COLORS.length] : '#E5E7EB'}
                                                                style={{ cursor: 'pointer', transition: 'all 0.3s ease', transformOrigin: 'center', transform: filterType === entry.name ? 'scale(1.05)' : 'scale(1)' }}
                                                                onClick={() => {
                                                                    if (filterType === entry.name) {
                                                                        setFilterType("All");
                                                                    } else {
                                                                        setFilterType(entry.name as any);
                                                                    }
                                                                }}
                                                            />
                                                        ))}
                                                    </Pie>
                                                    <RechartsTooltip
                                                        formatter={(value: any) => `₹${Number(value).toLocaleString()}`}
                                                        contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 10px 40px -4px rgba(0, 0, 0, 0.08)' }}
                                                    />
                                                </PieChart>
                                            </ResponsiveContainer>
                                        </div>
                                        <div className="mt-4 space-y-3 max-h-[120px] overflow-y-auto pr-2 custom-scrollbar">
                                            {expenseBreakdownData.map((entry, index) => (
                                                <div
                                                    key={index}
                                                    className={`flex items-center justify-between text-sm p-2 rounded-xl cursor-pointer transition-colors ${filterType === entry.name ? 'bg-gray-100 ring-1 ring-gray-200' : 'hover:bg-gray-50'}`}
                                                    onClick={() => {
                                                        if (filterType === entry.name) {
                                                            setFilterType("All");
                                                        } else {
                                                            setFilterType(entry.name as any);
                                                        }
                                                    }}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                                                        <span className={`font-semibold truncate max-w-[100px] ${filterType === entry.name ? 'text-foreground' : 'text-gray-600'}`} title={entry.name}>{entry.name}</span>
                                                    </div>
                                                    <span className="font-bold text-foreground">₹{entry.value.toLocaleString()}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex-1 flex items-center justify-center text-sm font-semibold text-gray-400">
                                        No expenses recorded yet.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Transactions Table Section */}
                    <div className="bg-white rounded-[32px] border border-gray-100 shadow-soft flex flex-col overflow-hidden mt-8">
                        <div className="p-6 sm:p-8 border-b border-gray-100 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                            <h2 className="text-xl font-bold text-foreground flex items-center gap-3">
                                <Receipt className="w-6 h-6 text-gray-900" /> Transactions
                            </h2>
                            <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
                                <div className="relative w-full sm:w-72">
                                    <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                                    <input
                                        type="text"
                                        placeholder="Search ledger..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="py-3 pl-11 pr-5 text-sm font-semibold bg-gray-50 border-none rounded-full focus:outline-none focus:ring-2 focus:ring-gray-900/50 transition-all w-full"
                                    />
                                </div>
                                <div className="relative flex items-center bg-gray-50 rounded-full px-5 py-3 text-sm font-semibold focus-within:ring-2 focus-within:ring-gray-900/50 cursor-pointer transition-all w-full sm:w-auto">
                                    <Filter className="w-5 h-5 text-gray-400 mr-2 pointer-events-none" />
                                    <select
                                        className="bg-transparent outline-none cursor-pointer text-foreground appearance-none pr-4 w-full sm:w-auto"
                                        value={filterType}
                                        onChange={(e) => setFilterType(e.target.value as any)}
                                    >
                                        <option value="All">All Categories</option>
                                        <option value="Pending">Pending</option>
                                        <optgroup label="Categories">
                                            {customCategories.map(c => (
                                                <option key={c} value={c}>{c}</option>
                                            ))}
                                        </optgroup>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="overflow-x-auto custom-scrollbar -mx-4 sm:mx-0">
                            <table className="w-full text-left border-collapse min-w-[800px] lg:min-w-0">
                                <thead>
                                    <tr className="bg-gray-50/50 text-[10px] sm:text-xs uppercase tracking-wider text-gray-400 font-bold border-b border-gray-50">
                                        <th className="px-6 py-4">Transaction ID</th>
                                        <th className="px-6 py-4 cursor-pointer hover:text-gray-900 select-none" onClick={() => handleSort("date")}>
                                            <div className="flex items-center gap-1">
                                                Date {sortField === "date" && (sortDirection === "asc" ? "↑" : "↓")}
                                            </div>
                                        </th>
                                        <th className="px-6 py-4">Description</th>
                                        <th className="px-6 py-4">Category</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4 text-right cursor-pointer hover:text-gray-900 select-none" onClick={() => handleSort("amount")}>
                                            <div className="flex items-center justify-end gap-1">
                                                Amount {sortField === "amount" && (sortDirection === "asc" ? "↑" : "↓")}
                                            </div>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {filteredAndSortedTransactions.map((txn) => (
                                        <tr key={txn.id} className="hover:bg-gray-50/50 transition-colors group">
                                            <td className="px-6 py-4">
                                                <span className="text-sm font-semibold text-foreground bg-gray-50 px-3 py-1.5 rounded-full">{txn.id}</span>
                                            </td>
                                            <td className="px-6 py-4 text-sm font-medium text-gray-500">
                                                {txn.date}
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="text-sm font-bold text-foreground">{txn.description}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-gray-50 text-gray-600">
                                                    {txn.category}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center gap-2 text-xs font-bold text-green-700 bg-green-100 px-3 py-1.5 rounded-full">
                                                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                                    {txn.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-3">
                                                    <span className={`text-sm font-bold ${txn.type === 'Income' ? 'text-green-600' : 'text-red-600'}`}>
                                                        {txn.type === 'Income' ? '+' : '-'}₹{txn.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                                    </span>
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); deleteTransaction(txn.id); }}
                                                        className="w-8 h-8 flex justify-center items-center text-red-400 bg-red-50 hover:bg-red-500 hover:text-white rounded-full transition-all opacity-0 group-hover:opacity-100 shadow-soft"
                                                        title="Delete Transaction"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {paginatedTransactions.length === 0 && (
                                        <tr>
                                            <td colSpan={6} className="px-6 py-12 text-center text-gray-500 text-sm font-semibold">
                                                No transactions match your filters.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {totalPages > 1 && (
                            <div className="p-6 border-t border-gray-100 flex items-center justify-between bg-gray-50/30">
                                <span className="text-sm font-medium text-gray-500">
                                    Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredAndSortedTransactions.length)} of {filteredAndSortedTransactions.length} entries
                                </span>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                        disabled={currentPage === 1}
                                        className="px-4 py-2 text-sm font-semibold rounded-full border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        Previous
                                    </button>
                                    <button
                                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                        disabled={currentPage === totalPages}
                                        className="px-4 py-2 text-sm font-semibold rounded-full border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </main>

                {/* Add Transaction Modal */}
                <AnimatePresence>
                    {isAddModalOpen && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 bg-black/20 backdrop-blur-sm"
                                onClick={() => setIsAddModalOpen(false)}
                            />
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                className="relative bg-white rounded-[32px] shadow-soft-lg w-full max-w-md overflow-hidden z-10 mx-4"
                            >
                                <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-900">
                                            <Plus className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-bold text-foreground">Add Entry</h2>
                                            <p className="text-sm font-semibold text-gray-500">Record a new transaction</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-3 items-center">
                                        <button
                                            type="button"
                                            onClick={isRecording ? stopRecording : startRecording}
                                            title="Use Voice AI"
                                            disabled={isProcessingVoice}
                                            className={`relative flex items-center justify-center w-10 h-10 rounded-full transition-all shadow-soft overflow-hidden group ${isRecording
                                                ? 'bg-red-50 text-red-600 border border-red-200 shadow-[0_0_15px_rgba(239,68,68,0.2)]'
                                                : isProcessingVoice
                                                    ? 'bg-gray-100 text-gray-500 border border-gray-200 cursor-not-allowed'
                                                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200 hover:scale-105'
                                                }`}
                                        >
                                            {isRecording && (
                                                <span className="absolute inset-0 bg-red-100/50 animate-pulse rounded-full" />
                                            )}
                                            {isProcessingVoice ? (
                                                <Loader2 className="w-4 h-4 animate-spin relative z-10" />
                                            ) : isRecording ? (
                                                <MicOff className="w-4 h-4 relative z-10 animate-pulse" />
                                            ) : (
                                                <Mic className="w-5 h-5 relative z-10" />
                                            )}
                                        </button>
                                        <button
                                            onClick={() => setIsAddModalOpen(false)}
                                            className="text-gray-400 hover:text-black transition-colors bg-gray-50 hover:bg-gray-100 p-2 rounded-full"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>

                                <div className="p-8">

                                    {/* Mock Receipt Dropzone */}
                                    <div
                                        className={`mb-6 p-6 border-2 border-dashed rounded-[24px] flex flex-col items-center justify-center text-center transition-all cursor-pointer ${isDragging ? 'border-gray-900 bg-gray-50' : (receiptScanned ? 'border-green-400 bg-green-50' : 'border-gray-200 bg-gray-50 hover:bg-gray-100 hover:border-gray-300')}`}
                                        onDragOver={handleDragOver}
                                        onDragLeave={handleDragLeave}
                                        onDrop={handleDrop}
                                        onClick={() => !isScanningReceipt && !receiptScanned && document.getElementById('receipt-upload')?.click()}
                                    >
                                        <input type="file" id="receipt-upload" className="hidden" accept="image/*" onChange={(e) => {
                                            if (e.target.files && e.target.files.length > 0) {
                                                handleDrop(e as any); // Re-use drop logic for file select
                                            }
                                        }} />
                                        {isScanningReceipt ? (
                                            <div className="flex flex-col items-center gap-2 py-4">
                                                <div className="w-8 h-8 rounded-full border-2 border-gray-900 border-t-transparent animate-spin"></div>
                                                <p className="text-xs font-bold text-gray-900">Extracting text via AI OCR...</p>
                                            </div>
                                        ) : receiptScanned ? (
                                            <div className="flex flex-col items-center gap-1.5 py-4">
                                                <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center mb-1">
                                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                                </div>
                                                <p className="text-sm font-bold text-green-700">Receipt Extracted Successfully!</p>
                                                <p className="text-xs font-semibold text-green-600/80">Values auto-filled below.</p>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center gap-2 py-4">
                                                <Receipt className={`w-8 h-8 ${isDragging ? 'text-gray-900' : 'text-gray-400'} transition-colors`} />
                                                <div>
                                                    <p className="text-sm font-bold text-gray-700">Quick Scan Receipt</p>
                                                    <p className="text-xs font-medium text-gray-500 mt-1">Drag & drop or click to upload</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <form onSubmit={handleAddTransaction} className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <button
                                                type="button"
                                                onClick={() => setTxnType("Income")}
                                                className={`py-3 rounded-full text-sm font-bold border transition-all shadow-none ${txnType === 'Income' ? 'bg-green-50 border-green-200 text-green-700 shadow-soft' : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300 hover:shadow-soft'}`}
                                            >
                                                Income
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setTxnType("Expense")}
                                                className={`py-3 rounded-full text-sm font-bold border transition-all shadow-none ${txnType === 'Expense' ? 'bg-red-50 border-red-200 text-red-700 shadow-soft' : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300 hover:shadow-soft'}`}
                                            >
                                                Expense
                                            </button>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">Amount (₹)</label>
                                            <input
                                                type="number"
                                                value={amt}
                                                onChange={(e) => setAmt(e.target.value)}
                                                placeholder="0.00"
                                                className="w-full text-lg font-bold p-3 px-5 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-900/40 focus:border-gray-900 transition-all shadow-soft-inner"
                                                autoFocus
                                                required
                                            />
                                        </div>

                                        <div>
                                            <div className="flex items-center justify-between mb-2">
                                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide">Description</label>
                                                {isListening && (
                                                    <span className="flex items-center gap-1.5 text-xs font-bold text-red-500 animate-pulse">
                                                        <div className="w-2 h-2 rounded-full bg-red-500"></div> Listening...
                                                    </span>
                                                )}
                                            </div>
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    value={desc}
                                                    onChange={(e) => setDesc(e.target.value)}
                                                    placeholder="e.g. Server costs, Product Sale"
                                                    className="w-full text-sm font-semibold p-3 px-5 pr-12 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-900/40 focus:border-gray-900 transition-all shadow-soft-inner"
                                                    required
                                                />
                                                {recognitionRef.current && (
                                                    <button
                                                        type="button"
                                                        onClick={toggleListening}
                                                        className={`absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full transition-colors ${isListening ? 'bg-red-100 text-red-500' : 'text-gray-400 hover:text-gray-900 hover:bg-gray-100'}`}
                                                    >
                                                        {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        <div>
                                            <div className="flex items-center justify-between mb-2">
                                                <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">Category</label>
                                                <AnimatePresence>
                                                    {isAutoCategorizing && (
                                                        <motion.div
                                                            initial={{ opacity: 0 }}
                                                            animate={{ opacity: 1 }}
                                                            exit={{ opacity: 0 }}
                                                            className="flex items-center gap-1.5 text-xs font-semibold text-gray-900"
                                                        >
                                                            <Sparkles className="w-3.5 h-3.5 animate-pulse" /> AI Categorizing...
                                                        </motion.div>
                                                    )}
                                                    {!isAutoCategorizing && showAiBadge && (
                                                        <motion.div
                                                            initial={{ opacity: 0, scale: 0.8 }}
                                                            animate={{ opacity: 1, scale: 1 }}
                                                            exit={{ opacity: 0, scale: 0.8 }}
                                                            className="flex items-center gap-1.5 bg-gray-100 text-gray-900 px-2.5 py-1 rounded-full text-xs font-bold"
                                                        >
                                                            <Sparkles className="w-3 h-3" /> Auto-selected
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                            <div className="relative">
                                                <select
                                                    value={cat}
                                                    onChange={(e) => {
                                                        setCat(e.target.value);
                                                        setShowAiBadge(false); // Manual override hides badge
                                                    }}
                                                    className={`w-full text-sm font-semibold p-3 px-5 pr-10 bg-gray-50 border rounded-full focus:outline-none focus:ring-2 focus:ring-gray-900/40 transition-all appearance-none shadow-soft-inner ${showAiBadge ? 'border-gray-900 shadow-[0_0_0_2px_rgba(0,0,0,0.05)]' : 'border-gray-200 focus:border-gray-900'}`}
                                                >
                                                    {customCategories.map((c) => (
                                                        <option key={c} value={c}>{c}</option>
                                                    ))}
                                                </select>
                                                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                                                    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                                </div>
                                            </div>
                                        </div>

                                        <button
                                            type="submit"
                                            className="w-full bg-gray-900 text-white font-bold py-4 rounded-full hover:bg-black hover:-translate-y-0.5 transition-all shadow-soft hover:shadow-soft-lg mt-4"
                                        >
                                            Save Transaction
                                        </button>
                                    </form>
                                </div>
                            </motion.div>
                        </div>
                    )
                    }
                </AnimatePresence >

                {/* Categories Management Modal */}
                <AnimatePresence>
                    {isCategoriesModalOpen && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 bg-background/80 backdrop-blur-sm"
                                onClick={() => setIsCategoriesModalOpen(false)}
                            />
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                className="relative bg-white border border-border rounded-[24px] shadow-2xl p-8 w-full max-w-md z-10 mx-4"
                            >
                                <button
                                    onClick={() => setIsCategoriesModalOpen(false)}
                                    className="absolute top-4 right-4 p-2 text-gray-400 hover:text-foreground hover:bg-gray-100 rounded-full transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>

                                <div className="mb-6 flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
                                        <Filter className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-foreground">Manage Categories</h2>
                                        <p className="text-xs text-gray-500 mt-0.5">Customize your ledger categorization</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={newCategory}
                                            onChange={(e) => setNewCategory(e.target.value)}
                                            placeholder="New Category Name"
                                            className="flex-1 text-sm font-medium p-3 bg-gray-50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all"
                                        />
                                        <button
                                            onClick={handleAddCategory}
                                            className="bg-accent text-white px-4 rounded-xl font-semibold hover:bg-accent/90 transition-colors"
                                        >
                                            Add
                                        </button>
                                    </div>

                                    <div className="mt-4 border border-border/80 rounded-xl overflow-hidden max-h-[300px] overflow-y-auto">
                                        {customCategories.length > 0 ? (
                                            <ul className="divide-y divide-border/50">
                                                {customCategories.map((c) => (
                                                    <li key={c} className="flex items-center justify-between p-3 hover:bg-gray-50">
                                                        <span className="text-sm font-medium text-gray-700">{c}</span>
                                                        <button
                                                            onClick={() => handleRemoveCategory(c)}
                                                            className="text-red-500 hover:text-red-700 p-1 rounded-md hover:bg-red-50 transition-colors"
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </button>
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p className="p-4 text-center text-sm text-gray-500">No categories defined.</p>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </div >
        </div >
    );
}
