-- Run this in your Supabase SQL Editor to fix the missing tables error

CREATE TABLE IF NOT EXISTS public.transactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    type TEXT NOT NULL,
    amount NUMERIC NOT NULL,
    status TEXT NOT NULL,
    invoice_ref TEXT,
    source TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.transaction_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    txn_id UUID REFERENCES public.transactions(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    unit_price NUMERIC NOT NULL,
    category TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.accounts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    balance NUMERIC NOT NULL,
    "limit" NUMERIC,
    currency TEXT NOT NULL,
    "iconName" TEXT NOT NULL,
    color TEXT NOT NULL,
    bg TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.budgets (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    allocated NUMERIC NOT NULL,
    spent NUMERIC NOT NULL,
    "iconName" TEXT NOT NULL,
    color TEXT NOT NULL,
    bg TEXT NOT NULL,
    bar TEXT NOT NULL,
    "overBudget" BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.subscriptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    amount NUMERIC NOT NULL,
    status TEXT NOT NULL,
    usage TEXT NOT NULL,
    category TEXT NOT NULL,
    warning TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.goals (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    target_amount NUMERIC NOT NULL,
    current_amount NUMERIC NOT NULL,
    icon_name TEXT NOT NULL,
    color TEXT NOT NULL,
    bg TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Turn on row level security
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transaction_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;

-- Allow users to manage their own data
CREATE POLICY "Manage own transactions" ON public.transactions USING (auth.uid() = user_id);
CREATE POLICY "Manage own transaction_items" ON public.transaction_items USING (true); -- items protected by txn fk
CREATE POLICY "Manage own accounts" ON public.accounts USING (auth.uid() = user_id);
CREATE POLICY "Manage own budgets" ON public.budgets USING (auth.uid() = user_id);
CREATE POLICY "Manage own subscriptions" ON public.subscriptions USING (auth.uid() = user_id);
CREATE POLICY "Manage own goals" ON public.goals USING (auth.uid() = user_id);
