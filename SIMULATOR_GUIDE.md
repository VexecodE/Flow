# 🎲 Transaction Simulator Guide

Generate realistic test transactions automatically to demo your Flo Finance application.

## 🚀 Quick Start

### Option 1: Using the Helper Scripts (Easiest)

**Windows CMD:**
```bash
run-simulator.bat
```

**PowerShell:**
```powershell
.\run-simulator.ps1
```

Then choose from the menu:
1. Generate 5 test transactions (quick batch)
2. Generate 10 test transactions
3. Generate 1 transaction
4. Start continuous mode (every 30 minutes)

### Option 2: Direct Command Line

**Generate 5 transactions immediately:**
```bash
cd backend
python transaction_simulator.py --mode batch --count 5
```

**Generate a single transaction:**
```bash
python transaction_simulator.py --mode once
```

**Continuous mode (one transaction every 30 minutes):**
```bash
python transaction_simulator.py --mode continuous --interval 30
```

## 📊 What It Does

The simulator creates realistic transactions that:
- ✅ **Update your balance** - Income increases, expenses decrease
- ✅ **Show in frontend** - Appear immediately in Recent Transactions
- ✅ **Properly categorized** - Sales, Infrastructure, Marketing, Software, Food, etc.
- ✅ **Realistic amounts** - Varied amounts based on transaction type
- ✅ **Timestamped** - Uses current date/time

## 💰 Transaction Types

### Income Transactions
- Salary Payment: $3,000 - $5,000
- Freelance Project: $500 - $1,500
- Client Payment: $800 - $2,000

### Expense Transactions
- **Infrastructure**: AWS Cloud Services ($50-$200), Domain Registration ($10-$50)
- **Marketing**: Google Ads ($100-$500), LinkedIn Ads ($100-$400)
- **Software**: GitHub Pro ($4-$20), Zoom Premium ($14-$30), Figma Team ($12-$45)
- **Food**: Coffee Shop ($5-$25), Lunch Meeting ($30-$80), Restaurant Dinner ($40-$120)
- **Other**: Office Supplies ($20-$100), Uber Ride ($8-$35)

## 🎯 Usage Scenarios

### Testing the App
```bash
# Generate 10 quick transactions to populate your dashboard
python transaction_simulator.py --mode batch --count 10
```

### Demo/Presentation
```bash
# Start continuous mode, get new transactions every 30 minutes
python transaction_simulator.py --mode continuous --interval 30
```

### Quick Check
```bash
# Just add one transaction to test
python transaction_simulator.py --mode once
```

## ⚙️ Command Options

| Option | Description | Default | Example |
|--------|-------------|---------|---------|
| `--mode` | Simulator mode | continuous | `--mode batch` |
| `--interval` | Minutes between transactions | 30 | `--interval 15` |
| `--count` | Transactions in batch mode | 5 | `--count 20` |
| `--user` | User ID | auto | `--user abc123` |

## 📝 Example Output

```
======================================================================
🚀 BATCH MODE: Generating 5 transactions
======================================================================
💸 [Expense] $87.45 - Coffee Shop
   📊 Total simulated: 1 transactions
💰 [Income] $4250.00 - Salary Payment
   📊 Total simulated: 2 transactions
💸 [Expense] $145.30 - AWS Cloud Services
   📊 Total simulated: 3 transactions
💸 [Expense] $245.00 - Google Ads Campaign
   📊 Total simulated: 4 transactions
💰 [Income] $1200.50 - Freelance Project
   📊 Total simulated: 5 transactions

======================================================================
✅ Batch complete: 5 transactions generated
======================================================================
```

## 🔧 Troubleshooting

### "No module named 'database'"
Make sure you're in the backend directory:
```bash
cd backend
python transaction_simulator.py --mode batch --count 5
```

### "Supabase credentials not found"
Ensure your `.env` file exists in the `backend/` directory with:
```env
NEXT_PUBLIC_SUPABASE_URL=your-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key
```

### Transactions not showing in frontend
1. Make sure the backend API is running (`python main.py`)
2. Make sure the frontend is running (`npm run dev`)
3. Refresh your browser
4. Check that `NEXT_PUBLIC_USE_BACKEND_API=true` in `.env.local`

## 🛑 Stopping the Simulator

If running in continuous mode, press **Ctrl+C** to stop gracefully.

```
🛑 SIMULATOR STOPPED
📈 Total transactions generated: 12
======================================================================
```

## 🎨 Customizing Transactions

Edit `backend/transaction_simulator.py` to customize:
- Transaction amounts (line 15-32)
- Transaction descriptions
- Categories
- Time intervals
- Transaction types

Example:
```python
{"description": "Custom Payment", "category": "Custom", "type": "Income", "amount_range": (100, 500)}
```

---

**Pro Tip**: Use continuous mode during demos to show real-time transaction updates! 🚀
