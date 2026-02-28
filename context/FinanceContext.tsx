"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Building2, Landmark, CreditCard, Wallet, HomeIcon, Coffee, MonitorSmartphone, Plane, ShoppingBag, Target, Activity } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { TransactionAPI, checkBackendHealth } from '@/lib/api';
import { InsightsAPI, SmartInsightsResponse } from '@/lib/insights-api';

// --- Types ---

export type TransactionType = "Income" | "Expense";
export type TransactionSource = "manual" | "scan" | "voice";

export interface TransactionItem {
    id: string;
    txn_id: string;
    name: string;
    quantity: number;
    unit_price: number;
    category: string;
}

export interface Transaction {
    id: string;
    date: string;
    description: string;
    category: string;        // top-level / primary category
    type: TransactionType;
    amount: number;
    status: "Completed" | "Pending";
    invoice_ref?: string;
    source?: TransactionSource;
    items?: TransactionItem[];
    category_prices?: Record<string, number>;
}

export interface Account {
    id: string;
    name: string;
    type: "Checking" | "Savings" | "Credit Card" | "Digital Asset";
    balance: number;
    limit?: number;
    currency: string;
    iconName: string;
    color: string;
    bg: string;
}

export interface Budget {
    id: string;
    name: string;
    allocated: number;
    spent: number;
    iconName: string;
    color: string;
    bg: string;
    bar: string;
    overBudget?: boolean;
}

export interface Subscription {
    id: string;
    name: string;
    amount: number;
    status: string;
    usage: string;
    category: string;
    warning?: string;
}

export interface Goal {
    id: string;
    name: string;
    target_amount: number;
    current_amount: number;
    icon_name: string;
    color: string;
    bg: string;
}

// --- Context Definition ---

interface FinanceContextType {
    transactions: Transaction[];
    accounts: Account[];
    budgets: Budget[];
    subscriptions: Subscription[];
    goals: Goal[];
    insights: SmartInsightsResponse | null;
    insightsLoading: boolean;

    addTransaction: (txn: Omit<Transaction, "id" | "status">) => Promise<void>;
    syncExternalTransactions: (txns: Transaction[]) => void;
    addAccount: (acc: Omit<Account, "id">) => void;
    addBudget: (bgt: Omit<Budget, "id" | "spent" | "overBudget">) => void;
    addSubscription: (sub: Omit<Subscription, "id">) => void;
    addGoal: (goal: Omit<Goal, "id" | "current_amount">) => void;

    deleteTransaction: (id: string) => void;
    deleteAccount: (id: string) => void;
    deleteBudget: (id: string) => void;
    deleteSubscription: (id: string) => void;
    deleteGoal: (id: string) => void;

    loadInsights: (days?: number, useAI?: boolean) => Promise<void>;
    getIconComponent: (iconName: string) => React.ElementType;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

function mapItem(raw: any): TransactionItem {
    return {
        id: raw.id,
        txn_id: raw.txn_id,
        name: raw.name,
        quantity: Number(raw.quantity),
        unit_price: Number(raw.unit_price),
        category: raw.category,
    };
}

function mapTransaction(raw: any): Transaction {
    const items: TransactionItem[] = (raw.transaction_items ?? []).map(mapItem);
    // Derive category_prices from items if present
    const category_prices: Record<string, number> = {};
    for (const item of items) {
        category_prices[item.category] = (category_prices[item.category] ?? 0) + item.unit_price * item.quantity;
    }
    return {
        ...raw,
        amount: Number(raw.amount),
        items,
        category_prices: Object.keys(category_prices).length > 0 ? category_prices : undefined,
    };
}

export function FinanceProvider({ children }: { children: ReactNode }) {
    const supabase = createClient();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [budgets, setBudgets] = useState<Budget[]>([]);
    const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
    const [goals, setGoals] = useState<Goal[]>([]);
    const [insights, setInsights] = useState<SmartInsightsResponse | null>(null);
    const [insightsLoading, setInsightsLoading] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const [dbError, setDbError] = useState<string | null>(null);
    
    // Check if backend API mode is enabled
    const useBackendAPI = process.env.NEXT_PUBLIC_USE_BACKEND_API === 'true';

    // Initial Load from Supabase or Backend API
    useEffect(() => {
        const loadData = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                // If not logged in, just mark loaded and return to allow redirects or rendering
                setIsLoaded(true);
                return;
            }

            // Load transactions from backend or Supabase
            let txnData: any[] = [];
            if (useBackendAPI) {
                try {
                    const isHealthy = await checkBackendHealth();
                    if (isHealthy) {
                        const backendTxns = await TransactionAPI.getAll({ user_id: user.id });
                        txnData = backendTxns.map((txn: any) => ({
                            ...txn,
                            amount: Number(txn.amount),
                            items: [],
                            category_prices: undefined,
                        }));
                        console.log('✅ Loaded transactions from Backend API');
                    } else {
                        console.warn('⚠️ Backend API unavailable, falling back to Supabase');
                        const txnRes = await supabase
                            .from('transactions')
                            .select('*, transaction_items(*)')
                            .order('created_at', { ascending: false });
                        if (txnRes.data) txnData = txnRes.data.map(mapTransaction);
                    }
                } catch (error) {
                    console.error('Backend API error, falling back to Supabase:', error);
                    const txnRes = await supabase
                        .from('transactions')
                        .select('*, transaction_items(*)')
                        .order('created_at', { ascending: false });
                    if (txnRes.data) txnData = txnRes.data.map(mapTransaction);
                }
            } else {
                const txnRes = await supabase
                    .from('transactions')
                    .select('*, transaction_items(*)')
                    .order('created_at', { ascending: false });
                if (txnRes.data) txnData = txnRes.data.map(mapTransaction);
            }

            // Load other data from Supabase (accounts, budgets, subscriptions, goals)
            const [accRes, bgtRes, subRes, goalsRes] = await Promise.all([
                supabase.from('accounts').select('*').order('created_at', { ascending: true }),
                supabase.from('budgets').select('*').order('created_at', { ascending: true }),
                supabase.from('subscriptions').select('*').order('created_at', { ascending: false }),
                supabase.from('goals').select('*').order('created_at', { ascending: true })
            ]);

            const possibleErrors = [accRes.error, bgtRes.error, subRes.error, goalsRes.error].filter(Boolean);
            if (possibleErrors.length > 0) {
                const errorMessage = possibleErrors.map(e => e?.message).join(" | ");
                console.error("Database Error:", errorMessage);
                setDbError(errorMessage);
                return;
            }

            if (txnData) setTransactions(txnData);
            if (accRes.data) setAccounts(accRes.data.map(a => ({ ...a, balance: Number(a.balance), limit: a.limit ? Number(a.limit) : undefined })));
            if (bgtRes.data) setBudgets(bgtRes.data.map(b => ({ ...b, allocated: Number(b.allocated), spent: Number(b.spent) })));
            if (subRes.data) setSubscriptions(subRes.data.map(s => ({ ...s, amount: Number(s.amount) })));
            if (goalsRes.data) setGoals(goalsRes.data.map(g => ({ ...g, target_amount: Number(g.target_amount), current_amount: Number(g.current_amount) })));

            setIsLoaded(true);
            
            // Load insights if user is authenticated
            if (user) {
                loadInsightsData(user.id);
            }
        };
        loadData();
    }, [supabase, useBackendAPI]);

    // Function to load insights
    const loadInsightsData = async (userId: string, days: number = 90, useAI: boolean = true) => {
        setInsightsLoading(true);
        try {
            const insightsData = await InsightsAPI.getSmartInsights(userId, days, useAI);
            setInsights(insightsData);
        } catch (error) {
            console.error('Error loading insights:', error);
            // Don't set insights to null on error, keep previous data if available
        } finally {
            setInsightsLoading(false);
        }
    };

    // Public function to refresh insights
    const loadInsights = async (days: number = 90, useAI: boolean = true) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            await loadInsightsData(user.id, days, useAI);
        }
    };

    // Actions
    const addTransaction = async (txnData: Omit<Transaction, "id" | "status">) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            console.error("User not authenticated");
            return;
        }

        const items = txnData.items ?? [];
        let insertedTransactions: Transaction[] = [];
        let totalComputedAmount = 0;
        let primaryCategory = txnData.category;

        if (useBackendAPI) {
            // Use Backend API for transactions
            try {
                if (items.length > 0) {
                    // Create separate transactions for each item
                    const transactionsToCreate = items.map(item => ({
                        date: txnData.date,
                        description: item.name,
                        category: item.category || txnData.category,
                        type: txnData.type,
                        amount: item.unit_price * item.quantity,
                        user_id: user.id,
                        invoice_ref: txnData.invoice_ref ?? undefined,
                        source: txnData.source ?? 'manual',
                    }));

                    const createdTxns = await TransactionAPI.bulkCreate(transactionsToCreate);
                    insertedTransactions = createdTxns.map((txn: any) => ({
                        ...txn,
                        status: 'Completed' as const,
                        source: (txn.source as TransactionSource) ?? 'manual',
                        items: [],
                    }));
                    totalComputedAmount = items.reduce((sum, item) => sum + (item.unit_price * item.quantity), 0);
                    primaryCategory = items[0]?.category ?? txnData.category;
                } else {
                    // Single transaction
                    totalComputedAmount = Math.abs(txnData.amount);
                    const createdTxn = await TransactionAPI.create({
                        date: txnData.date,
                        description: txnData.description,
                        category: txnData.category,
                        type: txnData.type,
                        amount: totalComputedAmount,
                        user_id: user.id,
                        invoice_ref: txnData.invoice_ref ?? undefined,
                        source: txnData.source ?? 'manual',
                    });
                    insertedTransactions = [{
                        ...createdTxn,
                        status: 'Completed' as const,
                        source: (createdTxn.source as TransactionSource) ?? 'manual',
                        items: [],
                    }];
                }
                console.log('✅ Created transaction via Backend API');
            } catch (error) {
                console.error('Backend API error during transaction creation:', error);
                return;
            }
        } else {
            // Use Supabase for transactions (original logic)
            if (items.length > 0) {
                for (const item of items) {
                    const itemAmount = item.unit_price * item.quantity;
                    totalComputedAmount += itemAmount;
                    const { data, error } = await supabase.from('transactions').insert([{
                        date: txnData.date,
                        description: item.name,
                        category: item.category || txnData.category,
                        type: txnData.type,
                        amount: itemAmount,
                        status: 'Completed',
                        invoice_ref: txnData.invoice_ref ?? null,
                        source: txnData.source ?? 'manual',
                    }]).select().single();

                    if (error || !data) {
                        console.error("Failed to insert item transaction:", error);
                    } else {
                        insertedTransactions.push(mapTransaction({ ...data, transaction_items: [] }));
                    }
                }
                primaryCategory = items[0]?.category ?? txnData.category;
            } else {
                totalComputedAmount = Math.abs(txnData.amount);
                const { data, error } = await supabase.from('transactions').insert([{
                    date: txnData.date,
                    description: txnData.description,
                    category: txnData.category,
                    type: txnData.type,
                    amount: totalComputedAmount,
                    status: 'Completed',
                    invoice_ref: txnData.invoice_ref ?? null,
                    source: txnData.source ?? 'manual',
                }]).select().single();

                if (error || !data) {
                    console.error("Failed to insert transaction:", error);
                    return;
                }
                insertedTransactions.push(mapTransaction({ ...data, transaction_items: [] }));
            }
        }

        if (insertedTransactions.length > 0) {
            setTransactions(prev => [...insertedTransactions, ...prev]);

            // Smart Budget integration (based on total cost and primary category)
            const matchedBudget = budgets.find(b =>
                primaryCategory === b.name ||
                (primaryCategory === "Software" && b.name === "Tech Subscriptions") ||
                (primaryCategory === "Services" && b.name === "Housing & Utilities")
            );

            if (matchedBudget) {
                const newSpent = matchedBudget.spent + totalComputedAmount;
                const overBudget = newSpent > matchedBudget.allocated;
                const { data: bgtData } = await supabase.from('budgets')
                    .update({ spent: newSpent, overBudget })
                    .eq('id', matchedBudget.id)
                    .select().single();

                if (bgtData) {
                    const updatedBgt = { ...bgtData, allocated: Number(bgtData.allocated), spent: Number(bgtData.spent) };
                    setBudgets(prev => prev.map(b => b.id === updatedBgt.id ? updatedBgt : b));
                }
            }

            // Adjust primary account balance
            const primaryAcc = accounts.find(a => a.type === 'Checking');
            if (primaryAcc) {
                const delta = txnData.type === 'Income' ? totalComputedAmount : -totalComputedAmount;
                const newBalance = primaryAcc.balance + delta;
                const { data: accData } = await supabase.from('accounts')
                    .update({ balance: newBalance })
                    .eq('id', primaryAcc.id)
                    .select().single();

                if (accData) {
                    const updatedAcc = { ...accData, balance: Number(accData.balance), limit: accData.limit ? Number(accData.limit) : undefined };
                    setAccounts(prev => prev.map(a => a.id === updatedAcc.id ? updatedAcc : a));
                }
            }
        }
    };

    const syncExternalTransactions = async (txns: Transaction[]) => {
        if (!txns || txns.length === 0) return;

        // 1. Add to local transaction state
        setTransactions(prev => [...txns, ...prev]);

        // 2. Synthesize total amount and primary category for budget/account sync
        const totalComputedAmount = txns.reduce((sum, t) => sum + Math.abs(t.amount || 0), 0);
        // Assume all scanned items in a batch belong to a similar major event, use the first item's category
        const primaryCategory = txns[0]?.category || 'Other';
        const type = txns[0]?.type || 'Expense'; // Scans are usually expenses

        // 3. Smart Budget integration
        const matchedBudget = budgets.find(b =>
            primaryCategory === b.name ||
            (primaryCategory === "Software" && b.name === "Tech Subscriptions") ||
            (primaryCategory === "Services" && b.name === "Housing & Utilities")
        );

        if (matchedBudget) {
            const newSpent = matchedBudget.spent + totalComputedAmount;
            const overBudget = newSpent > matchedBudget.allocated;

            // Sync budget to Supabase visually based on new calc
            const { data: bgtData } = await supabase.from('budgets')
                .update({ spent: newSpent, overBudget })
                .eq('id', matchedBudget.id)
                .select().single();

            if (bgtData) {
                const updatedBgt = { ...bgtData, allocated: Number(bgtData.allocated), spent: Number(bgtData.spent) };
                setBudgets(prev => prev.map(b => b.id === updatedBgt.id ? updatedBgt : b));
            }
        }

        // 4. Adjust primary account balance
        const primaryAcc = accounts.find(a => a.type === 'Checking');
        if (primaryAcc) {
            const delta = type === 'Income' ? totalComputedAmount : -totalComputedAmount;
            const newBalance = primaryAcc.balance + delta;

            // Sync account balance to Supabase
            const { data: accData } = await supabase.from('accounts')
                .update({ balance: newBalance })
                .eq('id', primaryAcc.id)
                .select().single();

            if (accData) {
                const updatedAcc = { ...accData, balance: Number(accData.balance), limit: accData.limit ? Number(accData.limit) : undefined };
                setAccounts(prev => prev.map(a => a.id === updatedAcc.id ? updatedAcc : a));
            }
        }
    };

    const addAccount = async (accData: Omit<Account, "id">) => {
        const { data } = await supabase.from('accounts').insert([accData]).select().single();
        if (data) {
            setAccounts(prev => [...prev, { ...data, balance: Number(data.balance), limit: data.limit ? Number(data.limit) : undefined }]);
        }
    };

    const addBudget = async (bgtData: Omit<Budget, "id" | "spent" | "overBudget">) => {
        const { data } = await supabase.from('budgets').insert([{
            ...bgtData,
            spent: 0,
            overBudget: false
        }]).select().single();

        if (data) {
            setBudgets(prev => [...prev, { ...data, allocated: Number(data.allocated), spent: Number(data.spent) }]);
        }
    };

    const addSubscription = async (subData: Omit<Subscription, "id">) => {
        const { data } = await supabase.from('subscriptions').insert([subData]).select().single();
        if (data) {
            setSubscriptions(prev => [{ ...data, amount: Number(data.amount) }, ...prev]);
        }
    };

    const addGoal = async (goalData: Omit<Goal, "id" | "current_amount">) => {
        const { data } = await supabase.from('goals').insert([{ ...goalData, current_amount: 0 }]).select().single();
        if (data) {
            setGoals(prev => [...prev, { ...data, target_amount: Number(data.target_amount), current_amount: Number(data.current_amount) }]);
        }
    };

    const deleteTransaction = async (id: string) => {
        if (useBackendAPI) {
            try {
                await TransactionAPI.delete(id);
                setTransactions(prev => prev.filter(t => t.id !== id));
                console.log('✅ Deleted transaction via Backend API');
            } catch (error) {
                console.error('Backend API error during transaction deletion:', error);
            }
        } else {
            // CASCADE on the DB will also delete transaction_items
            await supabase.from('transactions').delete().eq('id', id);
            setTransactions(prev => prev.filter(t => t.id !== id));
        }
    };

    const deleteAccount = async (id: string) => {
        await supabase.from('accounts').delete().eq('id', id);
        setAccounts(prev => prev.filter(a => a.id !== id));
    };

    const deleteBudget = async (id: string) => {
        await supabase.from('budgets').delete().eq('id', id);
        setBudgets(prev => prev.filter(b => b.id !== id));
    };

    const deleteSubscription = async (id: string) => {
        await supabase.from('subscriptions').delete().eq('id', id);
        setSubscriptions(prev => prev.filter(s => s.id !== id));
    };

    const deleteGoal = async (id: string) => {
        await supabase.from('goals').delete().eq('id', id);
        setGoals(prev => prev.filter(g => g.id !== id));
    };

    const getIconComponent = (iconName: string): React.ElementType => {
        const iconMap: Record<string, React.ElementType> = {
            "Building2": Building2, "Landmark": Landmark, "CreditCard": CreditCard,
            "Wallet": Wallet, "HomeIcon": HomeIcon, "Coffee": Coffee,
            "MonitorSmartphone": MonitorSmartphone, "Plane": Plane,
            "ShoppingBag": ShoppingBag, "Target": Target, "Activity": Activity
        };
        return iconMap[iconName] || Wallet;
    };

    if (dbError) {
        return (
            <div className="fixed inset-0 z-50 bg-red-950 flex flex-col items-center justify-center p-20 text-center">
                <h1 className="text-red-500 text-6xl font-black mb-4">CRITICAL DATABASE ERROR</h1>
                <p className="text-red-300 text-2xl font-mono">{dbError}</p>
            </div>
        );
    }

    if (!isLoaded) return null;

    return (
        <FinanceContext.Provider value={{
            transactions, accounts, budgets, subscriptions, goals, insights, insightsLoading,
            addTransaction, syncExternalTransactions, addAccount, addBudget, addSubscription, addGoal,
            deleteTransaction, deleteAccount, deleteBudget, deleteSubscription, deleteGoal,
            loadInsights, getIconComponent
        }}>
            {children}
        </FinanceContext.Provider>
    );
}

export const useFinance = () => {
    const context = useContext(FinanceContext);
    if (context === undefined) {
        throw new Error("useFinance must be used within a FinanceProvider");
    }
    return context;
};
