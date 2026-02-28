# Flo Finance - Personal Finance Management

A modern, full-stack personal finance application with AI-powered features, transaction tracking, and real-time analytics.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Python 3.8+
- Supabase account

### 1. Install Dependencies

**Frontend:**
```bash
npm install
```

**Backend:**
```bash
cd backend
pip install -r requirements.txt
```

### 2. Configure Environment

Create `.env.local` in the root directory:
```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_USE_BACKEND_API=true
```

### 3. Start the Application

**Terminal 1 - Backend API:**
```bash
cd backend
python main.py
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

**Terminal 3 - Transaction Simulator (Optional):**
```bash
# Windows
run-simulator.bat

# Or PowerShell
.\run-simulator.ps1

# Or directly
cd backend
python transaction_simulator.py --mode batch --count 5
```

Access the application:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

## 🎲 Transaction Simulator

Generate realistic test transactions to see your app in action:

```bash
# Quick batch of 5 transactions
python backend/transaction_simulator.py --mode batch --count 5

# Single transaction
python backend/transaction_simulator.py --mode once

# Continuous mode (every 30 minutes)
python backend/transaction_simulator.py --mode continuous --interval 30
```

The simulator generates:
- 💰 Income transactions (Salary, Freelance, Client Payments)
- 💸 Expense transactions (Software, Marketing, Infrastructure, Food)
- ✅ Automatically updates balance
- ✅ Shows in recent transactions
- ✅ Categorized properly

## 📁 Project Structure

```
Flow/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── ledger/            # Transaction ledger page
│   └── ...                # Other pages
├── backend/               # FastAPI backend
│   ├── main.py           # Backend server
│   ├── database.py       # Supabase client
│   ├── transaction_simulator.py  # Test data generator
│   └── transactions/     # Transaction module
├── components/           # React components
├── context/             # React context providers
├── lib/                # Utility libraries
│   └── api.ts         # Backend API client
└── utils/              # Helper functions
```

## ✨ Features

### Transaction Management
- ✅ Create, read, update, delete transactions
- ✅ AI-powered categorization
- ✅ Voice input for transactions
- ✅ Receipt scanning with OCR
- ✅ Bulk transaction import

### Analytics & Insights
- ✅ Real-time balance tracking
- ✅ Category-based expense breakdown
- ✅ Monthly trends and statistics
- ✅ Budget tracking

### Backend API
- ✅ FastAPI backend with full CRUD operations
- ✅ Automatic API documentation (Swagger)
- ✅ Transaction filtering and search
- ✅ Statistics and analytics endpoints

## 🛠️ Tech Stack

**Frontend:**
- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- Framer Motion
- Recharts

**Backend:**
- FastAPI
- Python 3.8+
- Supabase (PostgreSQL)
- Pydantic

## 📚 Documentation

- [Backend API Documentation](backend/README.md)
- API Interactive Docs: http://localhost:8000/docs

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
