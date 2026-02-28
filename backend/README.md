# Flo Finance Backend - Transaction API & Smart Insights

Complete FastAPI backend for the **Transaction Navbar** and **Smart Insights** in the Flo Finance application.

## 📁 Folder Structure

```
backend/
├── main.py                      # Main FastAPI application
├── database.py                  # Supabase database client (singleton)
├── transaction_simulator.py     # Transaction simulator (generates test data)
├── test_backend.py              # Backend API tests
├── test_insights.py             # Smart Insights API tests
├── requirements.txt             # Python dependencies
├── .env                         # Environment variables (create this!)
├── .env.example                 # Example environment file
├── transactions/                # Transaction module
│   ├── __init__.py              # Module exports
│   ├── models.py                # Pydantic data models
│   ├── service.py               # Business logic layer
│   └── routes.py                # API endpoints (FastAPI routes)
└── insights/                    # Smart Insights module
    ├── __init__.py              # Module exports
    ├── models.py                # Insight data models
    ├── service.py               # Analysis & prediction logic
    ├── routes.py                # Insights API endpoints
    └── README.md                # Insights documentation
```

## 🚀 Setup Instructions

### 1. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Configure Environment Variables

Create a `.env` file in the `backend/` directory:

```bash
cp .env.example .env
```

Then edit `.env` with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Ollama Configuration (for AI Insights)
OLLAMA_URL=http://localhost:11434/api/generate
OLLAMA_MODEL=tinyllama
```

### 3. Setup Ollama (Optional - for AI Insights)

Smart Insights uses **Ollama** for local AI-powered recommendations. This is optional - the system falls back to statistical analysis if Ollama is not available.

**Install Ollama:**

1. Download and install Ollama from [https://ollama.ai](https://ollama.ai)

2. Pull the tinyllama model:
```bash
ollama pull tinyllama
```

3. Verify Ollama is running:
```bash
ollama list
```

4. Test the integration:
```bash
python test_ollama.py
```

**Expected output:**
```
✅ Ollama server is running!
📦 Available models: 1
   - tinyllama:latest
🤖 Testing Ollama text generation...
✅ Ollama Response:
[AI-generated financial tips]
```

**If Ollama is not installed:**
- Smart Insights will automatically fall back to statistical analysis
- You'll see: `⚠️ Ollama not available, using statistical insights only`
- All features work without Ollama, just without AI-powered recommendations

### 4. Setup Email Reminders (Optional - for EMI Notifications)

**CIBIL Growth Engine** includes email reminder functionality for EMI payments. This is optional - the system works in demo/simulation mode without SMTP configuration.

**Configure SMTP (Gmail Example):**

1. Generate an App Password (not your regular Gmail password):
   - Go to: https://myaccount.google.com/apppasswords
   - Select "Mail" and your device
   - Copy the 16-character password

2. Update your `.env` file:
```env
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password-here
FROM_EMAIL=noreply@flofinance.com
```

3. Test email configuration:
```bash
python test_email_reminders.py
```

**Demo Mode (Without SMTP):**
- If SMTP credentials are not configured, emails will be simulated
- Email content is logged to console for testing
- All functionality works without sending actual emails
- Perfect for hackathons and demos!

**Email Features:**
- ✅ Automatic email to logged-in user
- ✅ Beautiful HTML email template
- ✅ EMI details with due date and amount
- ✅ Direct link back to Flo Finance app
- ✅ Toggle on/off from the UI
- ✅ Instant confirmation when enabled

### 5. Run the Server

```bash
python main.py
```

The API will be available at:
- **API Base**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs (Swagger UI)
- **ReDoc**: http://localhost:8000/redoc

## 📡 API Endpoints

### Transaction CRUD Operations

| Method | Endpoint | Description | Used By |
|--------|----------|-------------|---------|
| `GET` | `/api/transactions` | Get all transactions with filters | Transaction table |
| `GET` | `/api/transactions/{id}` | Get single transaction | Detail view |
| `POST` | `/api/transactions` | Create new transaction | Add Entry button |
| `POST` | `/api/transactions/bulk` | Create multiple transactions | Receipt scanner |
| `PUT` | `/api/transactions/{id}` | Update transaction | Edit button |
| `DELETE` | `/api/transactions/{id}` | Delete transaction | Delete button |

### Statistics & Analytics

| Method | Endpoint | Description | Used By |
|--------|----------|-------------|---------|
| `GET` | `/api/transactions/stats/summary` | Get transaction statistics | Dashboard cards |
| `GET` | `/api/transactions/categories/list` | Get all categories | Category dropdown |
| `GET` | `/api/transactions/search/query` | Search transactions | Search bar |

### Smart Insights (AI-Powered Analysis)

| Method | Endpoint | Description | Used By |
|--------|----------|-------------|---------|
| `GET` | `/api/insights/smart` | Complete insights with predictions | Insights page |
| `GET` | `/api/insights/summary` | Quick summary message | Dashboard widget |
| `GET` | `/api/insights/predictions` | Next month predictions | Budget planner |
| `GET` | `/api/insights/spending-patterns` | Category spending analysis | Analytics charts |
| `GET` | `/api/insights/budget-recommendations` | Recommended budgets | Budget setup |
| `GET` | `/api/insights/anomalies` | Unusual transaction detection | Alerts |
| `GET` | `/api/insights/recommendations` | Personalized tips | Insights page |

**📚 [View Full Insights Documentation](insights/README.md)**

## 📝 API Usage Examples

### 1. Get All Transactions (with filters)

```bash
# Get all transactions for a user
curl "http://localhost:8000/api/transactions?user_id=user123"

# Filter by category
curl "http://localhost:8000/api/transactions?user_id=user123&category=Food"

# Filter by date range
curl "http://localhost:8000/api/transactions?user_id=user123&date_from=2026-01-01&date_to=2026-01-31"

# Search in description
curl "http://localhost:8000/api/transactions?user_id=user123&search=groceries"
```

### 2. Create a Transaction

```bash
curl -X POST "http://localhost:8000/api/transactions" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "user123",
    "date": "2026-02-28",
    "description": "Grocery shopping",
    "category": "Food & Dining",
    "amount": 45.50,
    "type": "Expense",
    "status": "Completed",
    "source": "manual"
  }'
```

### 3. Update a Transaction

```bash
curl -X PUT "http://localhost:8000/api/transactions/txn_id_123" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 50.00,
    "category": "Groceries"
  }'
```

### 4. Delete a Transaction

```bash
curl -X DELETE "http://localhost:8000/api/transactions/txn_id_123"
```

### 5. Get Statistics

```bash
curl "http://localhost:8000/api/transactions/stats/summary?user_id=user123"
```

Response:
```json
{
  "total_income": 5000.00,
  "total_expense": 2340.50,
  "balance": 2659.50,
  "transaction_count": 45,
  "top_categories": [
    {"category": "Food & Dining", "amount": 850.00},
    {"category": "Transportation", "amount": 420.00}
  ],
  "monthly_trend": [
    {"month": "2026-01", "income": 2500, "expense": 1200},
    {"month": "2026-02", "income": 2500, "expense": 1140.50}
  ]
}
```

## 🔧 Transaction Navbar Components

### Files Connected to Backend:

#### Frontend (Next.js):
- **`components/LedgerClient.tsx`** - Main transaction table component
- **`app/api/ledger/transactions/route.ts`** - Next.js API middleware
- **`context/FinanceContext.tsx`** - State management

#### Backend (FastAPI):
- **`transactions/models.py`** - Data validation & types
- **`transactions/service.py`** - Business logic (CRUD operations)
- **`transactions/routes.py`** - API endpoints exposed to frontend
- **`database.py`** - Supabase connection

## 🔄 How It Works

```
Frontend Component (LedgerClient.tsx)
         ↓
    fetch() call
         ↓
Next.js API Route (optional middleware)
         ↓
FastAPI Backend (localhost:8000/api)
         ↓
Transaction Router (routes.py)
         ↓
Transaction Service (service.py)
         ↓
Supabase Client (database.py)
         ↓
Supabase Database
```

## 📊 Database Schema

Expected Supabase table structure:

```sql
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR NOT NULL,
    date DATE NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    type VARCHAR CHECK (type IN ('Income', 'Expense')),
    status VARCHAR DEFAULT 'Completed',
    invoice_ref VARCHAR,
    source VARCHAR CHECK (source IN ('manual', 'voice', 'receipt', 'scan')),
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP
);

-- Create index for faster queries
CREATE INDEX idx_user_transactions ON transactions(user_id, date DESC);
CREATE INDEX idx_category ON transactions(category);
```

## 🎲 Transaction Simulator

The simulator generates realistic test transactions automatically to help you test the application.

### Quick Start

**Generate 5 test transactions immediately:**
```bash
python transaction_simulator.py --mode batch --count 5
```

**Generate one transaction:**
```bash
python transaction_simulator.py --mode once
```

**Continuous mode (every 30 minutes):**
```bash
python transaction_simulator.py --mode continuous --interval 30
```

### Simulator Modes

| Mode | Description | Command |
|------|-------------|---------|
| **batch** | Generate multiple transactions quickly | `--mode batch --count 10` |
| **once** | Generate a single transaction | `--mode once` |
| **continuous** | Generate transactions at intervals | `--mode continuous --interval 30` |

### Options

- `--mode`: Simulator mode (continuous, batch, once)
- `--interval`: Minutes between transactions (default: 30)
- `--count`: Number of transactions in batch mode (default: 5)
- `--user`: User ID (default: auto - uses first user from DB)

### Example Output

```
🚀 BATCH MODE: Generating 5 transactions
💸 [Expense] $87.45 - Coffee Shop
   📊 Total simulated: 1 transactions
💰 [Income] $4250.00 - Salary Payment
   📊 Total simulated: 2 transactions
💸 [Expense] $145.30 - AWS Cloud Services
   📊 Total simulated: 3 transactions
```

### Transaction Types Generated

The simulator creates realistic transactions including:
- 💰 **Income**: Salary, Freelance, Client Payments
- 💸 **Expenses**: Software subscriptions, Marketing, Infrastructure, Food, Services

All transactions automatically:
- ✅ Update your total balance
- ✅ Appear in recent transactions
- ✅ Get categorized properly
- ✅ Show in the frontend immediately

## 🧠 Testing Smart Insights

Run the insights test to see AI-powered analysis:

```bash
python test_insights.py
```

This will show you:
- 📊 Spending patterns and trends
- 📈 Next month predictions
- 💡 Personalized recommendations
- ⚠️  Anomaly detection  
- 🎯 Budget recommendations

Example output:
```
🧠 SMART INSIGHTS API TEST

📊 SUMMARY:
   Total Income: $15,000.00
   Total Expenses: $12,000.00
   Net Savings: $3,000.00
   Savings Rate: 20.0%
   
📈 PREDICTIONS:
   Next Month Income: $16,500.00
   Next Month Expenses: $12,600.00
   Predicted Savings: $3,900.00
   
🎯 TOP SPENDING CATEGORIES:
   1. Software: $450.00 avg (8 txns, 30% of total)
      Trend: STABLE
   2. Marketing: $320.00 avg (5 txns, 13.3% of total)
      Trend: INCREASING
      
💡 RECOMMENDATIONS:
   1. ✅ Your finances look healthy!
   2. 📈 Spending is increasing in: Marketing. Monitor closely.
   3. 💰 Set up automatic savings transfers on payday.
```

View interactive API docs: http://localhost:8000/docs

## 🧪 Testing the API

Visit http://localhost:8000/docs for interactive API testing with Swagger UI.

## 🔐 Security Notes

- The current setup uses Supabase anon key (safe for client-side use)
- Add authentication middleware for production
- Validate user ownership before modifying transactions
- Use Row Level Security (RLS) in Supabase for additional protection

## 📦 Key Features

### Transactions
✅ Complete CRUD operations for transactions  
✅ Advanced filtering (by date, category, type, search)  
✅ Bulk transaction creation (for receipt scanning)  
✅ Real-time statistics calculation  
✅ Category management  
✅ Search functionality  

### Smart Insights (NEW! 🧠)
✅ AI-powered spending pattern analysis  
✅ Next month income & expense predictions  
✅ Automated anomaly detection  
✅ Personalized budget recommendations  
✅ Trend analysis (increasing/decreasing/stable)  
✅ ActionabTransactions API**: Visit http://localhost:8000/docs
4. **Test Smart Insights**: `python test_insights.py`
5. **Generate Test Data**: `python transaction_simulator.py --mode batch --count 10`

### Developer Experience
✅ Auto-generated API documentation (Swagger)  
✅ Type-safe Pydantic models  
✅ Error handling with proper HTTP status codes  
✅ Transaction simulator for testing  
✅ Comprehensive test scripts  

## 🚦 Development Workflow

1. **Start Backend**: `python main.py` (port 8000)
2. **Start Frontend**: `npm run dev` (port 3000)
3. **Test API**: Visit http://localhost:8000/docs
4. **Connect Frontend**: Update fetch URLs to `http://localhost:8000/api/transactions`

## 📝 Next Steps

1. ✅ Backend API is complete
2. 🔄 Connect `LedgerClient.tsx` to use these endpoints
3. 🔄 Update `FinanceContext.tsx` to fetch from backend
4. 🔄 Add authentication middleware
5. 🔄 Deploy backend to production

---

**Built for Flo Finance Transaction Navbar** 🚀
