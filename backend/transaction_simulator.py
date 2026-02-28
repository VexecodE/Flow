"""
Transaction Simulator for Flo Finance
Generates realistic transactions every 30 minutes to simulate real-world usage
"""

import asyncio
import random
from datetime import datetime, timedelta, timezone
from database import db
import sys
import os

# Realistic transaction templates
TRANSACTION_TEMPLATES = [
    # Income transactions
    {"description": "Salary Payment", "category": "Sales", "type": "Income", "amount_range": (3000, 5000)},
    {"description": "Freelance Project", "category": "Sales", "type": "Income", "amount_range": (500, 1500)},
    {"description": "Client Payment", "category": "Sales", "type": "Income", "amount_range": (800, 2000)},
    
    # Expense transactions
    {"description": "AWS Cloud Services", "category": "Infrastructure", "type": "Expense", "amount_range": (50, 200)},
    {"description": "Google Ads Campaign", "category": "Marketing", "type": "Expense", "amount_range": (100, 500)},
    {"description": "Office Supplies", "category": "Other", "type": "Expense", "amount_range": (20, 100)},
    {"description": "Coffee Shop", "category": "Food", "type": "Expense", "amount_range": (5, 25)},
    {"description": "Lunch Meeting", "category": "Food", "type": "Expense", "amount_range": (30, 80)},
    {"description": "GitHub Pro Subscription", "category": "Software", "type": "Expense", "amount_range": (4, 20)},
    {"description": "Zoom Premium", "category": "Software", "type": "Expense", "amount_range": (14, 30)},
    {"description": "Figma Team Plan", "category": "Software", "type": "Expense", "amount_range": (12, 45)},
    {"description": "Domain Registration", "category": "Infrastructure", "type": "Expense", "amount_range": (10, 50)},
    {"description": "LinkedIn Ads", "category": "Marketing", "type": "Expense", "amount_range": (100, 400)},
    {"description": "Uber Ride", "category": "Other", "type": "Expense", "amount_range": (8, 35)},
    {"description": "Restaurant Dinner", "category": "Food", "type": "Expense", "amount_range": (40, 120)},
]

class TransactionSimulator:
    def __init__(self, user_id: str = "simulator-user"):
        self.user_id = user_id
        self.running = False
        self.transaction_count = 0
        
    async def generate_transaction(self):
        """Generate a single random transaction"""
        template = random.choice(TRANSACTION_TEMPLATES)
        
        # Generate random amount within range
        amount = round(random.uniform(*template["amount_range"]), 2)
        
        # For expenses, make amount negative
        if template["type"] == "Expense":
            amount = -abs(amount)
        else:
            amount = abs(amount)
        
        transaction = {
            "date": datetime.now().strftime("%Y-%m-%d"),
            "description": template["description"],
            "category": template["category"],
            "type": template["type"],
            "amount": amount,
            "status": "Completed",
            "source": "simulator",
            "user_id": self.user_id,
            "created_at": datetime.now(timezone.utc).isoformat(),
        }
        
        return transaction
    
    async def insert_transaction(self, transaction):
        """Insert transaction into database"""
        try:
            response = db.table("transactions").insert(transaction).execute()
            if response.data:
                self.transaction_count += 1
                return response.data[0]
            return None
        except Exception as e:
            print(f"❌ Error inserting transaction: {e}")
            return None
    
    async def run_once(self):
        """Generate and insert one transaction"""
        transaction = await self.generate_transaction()
        result = await self.insert_transaction(transaction)
        
        if result:
            txn_type = transaction["type"]
            amount = transaction["amount"]
            desc = transaction["description"]
            
            emoji = "💰" if txn_type == "Income" else "💸"
            color = "\033[92m" if txn_type == "Income" else "\033[91m"
            reset = "\033[0m"
            
            print(f"{emoji} {color}[{txn_type}]{reset} ${abs(amount):.2f} - {desc}")
            print(f"   📊 Total simulated: {self.transaction_count} transactions")
            return True
        return False
    
    async def run_continuous(self, interval_minutes: int = 30):
        """Run simulator continuously with specified interval"""
        self.running = True
        print("=" * 70)
        print("🚀 TRANSACTION SIMULATOR STARTED")
        print("=" * 70)
        print(f"⏱️  Interval: Every {interval_minutes} minutes")
        print(f"👤 User ID: {self.user_id}")
        print(f"🔗 Connected to Supabase")
        print("=" * 70)
        print("\nGenerating transactions...\n")
        
        try:
            while self.running:
                await self.run_once()
                
                # Wait for the specified interval
                wait_seconds = interval_minutes * 60
                next_run = datetime.now() + timedelta(seconds=wait_seconds)
                print(f"⏳ Next transaction at: {next_run.strftime('%H:%M:%S')}\n")
                
                await asyncio.sleep(wait_seconds)
                
        except KeyboardInterrupt:
            print("\n" + "=" * 70)
            print("🛑 SIMULATOR STOPPED")
            print(f"📈 Total transactions generated: {self.transaction_count}")
            print("=" * 70)
            self.running = False
    
    async def run_batch(self, count: int = 5, delay_seconds: int = 2):
        """Generate multiple transactions quickly for testing"""
        print("=" * 70)
        print(f"🚀 BATCH MODE: Generating {count} transactions")
        print("=" * 70)
        
        for i in range(count):
            await self.run_once()
            if i < count - 1:
                await asyncio.sleep(delay_seconds)
        
        print("\n" + "=" * 70)
        print(f"✅ Batch complete: {count} transactions generated")
        print("=" * 70)

async def main():
    """Main entry point"""
    import argparse
    
    parser = argparse.ArgumentParser(description="Transaction Simulator for Flo Finance")
    parser.add_argument("--mode", choices=["continuous", "batch", "once"], default="continuous",
                      help="Simulator mode (default: continuous)")
    parser.add_argument("--interval", type=int, default=30,
                      help="Interval in minutes for continuous mode (default: 30)")
    parser.add_argument("--count", type=int, default=5,
                      help="Number of transactions for batch mode (default: 5)")
    parser.add_argument("--user", type=str, default="auto",
                      help="User ID (default: auto - gets first user from DB)")
    
    args = parser.parse_args()
    
    # Get user ID
    user_id = args.user
    if user_id == "auto":
        try:
            # First try to get from transactions
            response = db.table("transactions").select("user_id").limit(1).execute()
            if response.data and len(response.data) > 0:
                user_id = response.data[0]["user_id"]
                print(f"🔍 Using existing user ID from transactions: {user_id[:8]}...")
            else:
                # No transactions yet - instruct user to create one first
                print("\n" + "="*70)
                print("⚠️  NO TRANSACTIONS FOUND")
                print("="*70)
                print("\nThe simulator needs a real user ID from your database.")
                print("\n📝 Please do this first:")
                print("   1. Open http://localhost:3000 in your browser")
                print("   2. Log in or sign up")
                print("   3. Go to the Ledger page")
                print("   4. Create ONE transaction manually (any amount)")
                print("   5. Come back and run the simulator again")
                print("\nOr provide a user ID directly:")
                print("   python transaction_simulator.py --user YOUR_USER_ID")
                print("="*70 + "\n")
                sys.exit(1)
        except Exception as e:
            print(f"❌ Could not connect to database: {e}")
            print("\nMake sure:")
            print("  - Backend .env file has Supabase credentials")
            print("  - You can access the database")
            sys.exit(1)
    
    simulator = TransactionSimulator(user_id=user_id)
    
    if args.mode == "once":
        await simulator.run_once()
    elif args.mode == "batch":
        await simulator.run_batch(count=args.count)
    else:
        await simulator.run_continuous(interval_minutes=args.interval)

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\n👋 Goodbye!")
        sys.exit(0)
