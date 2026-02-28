# Architecture Overview - Transaction Flow

## 🎯 How It Works

### Manual Transaction Entry (Frontend → Supabase Direct)
```
User creates transaction in UI
    ↓
Next.js API Route (/app/api/ledger/transactions/route.ts)
    ↓
Supabase Client (with user auth)
    ↓
Database (with RLS protection)
    ↓
FinanceContext updates
    ↓
UI shows new transaction
```

### Simulator Transactions (Backend → Supabase → Frontend)
```
Simulator script runs
    ↓
FastAPI Backend (with service_role key)
    ↓
Supabase Database (bypasses RLS)
    ↓
Frontend polls/reloads
    ↓
FinanceContext fetches from Supabase
    ↓
UI shows simulated transactions
    ↓
Balance reduces automatically
```

## 📊 Data Flow

**All transactions (manual + simulated) → Stored in same Supabase table**

### Frontend reads from:
- ✅ Supabase directly (FinanceContext)
- ❌ NOT from FastAPI backend

### Backend (FastAPI) is used for:
- ✅ Transaction simulator ONLY
- ✅ Creates transactions with service_role key
- ❌ NOT for manual user transactions

## 🔧 Configuration

**Frontend (.env.local):**
```env
NEXT_PUBLIC_USE_BACKEND_API=false    # Manual transactions use Next.js routes
NEXT_PUBLIC_API_URL=http://localhost:8000  # For potential future features
```

**Backend (.env):**
```env
SUPABASE_SERVICE_ROLE_KEY=xxx    # Bypasses RLS for simulator
```

## ✨ Benefits

1. **Manual Entry**: Uses existing Next.js setup with proper auth
2. **Simulator**: Uses FastAPI with service_role for testing
3. **Single Source**: All data in Supabase, easy to query
4. **Security**: RLS protects user data, service_role only for backend
5. **Real-time**: Frontend sees all transactions regardless of source

## 🚀 Usage

**Start Backend (for simulator):**
```bash
cd backend
python main.py
```

**Run Simulator:**
```bash
cd backend
python transaction_simulator.py --mode batch --count 5
```

**Frontend automatically shows:**
- ✅ Manual transactions (created by user)
- ✅ Simulated transactions (created by backend)
- ✅ Balance updates in real-time
- ✅ All transactions in Recent Transactions list
