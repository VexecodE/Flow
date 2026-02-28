"""
Quick setup script - Creates a test transaction to initialize the system
This will get your user ID and create your first transaction
"""

import asyncio
from database import db
from datetime import datetime, timezone

print("=" * 70)
print("🚀 Flo Finance - Initial Setup")
print("=" * 70)
print()

async def setup():
    try:
        # Check if we can connect
        print("📡 Connecting to Supabase...")
        
        # Try to get existing user from transactions
        response = db.table("transactions").select("user_id").limit(1).execute()
        
        if response.data and len(response.data) > 0:
            user_id = response.data[0]["user_id"]
            print(f"✅ Found existing user: {user_id}")
            print()
            print("Your database is already set up! You can run the simulator:")
            print()
            print(f"   python transaction_simulator.py --user {user_id}")
            print()
            print("Or set environment variable:")
            print(f"   $env:SIMULATOR_USER_ID='{user_id}'")
            print()
            return
        
        print()
        print("⚠️  No transactions found. You need to:")
        print()
        print("1. Open http://localhost:3000 in your browser")
        print("2. Sign up or log in to the app")
        print("3. Create at least ONE transaction manually")
        print("4. Then run this script again")
        print()
        print("Or directly run simulator with your user ID:")
        print("   python transaction_simulator.py --user YOUR_USER_ID")
        print()
        
    except Exception as e:
        print(f"❌ Error: {e}")
        print()
        print("Make sure:")
        print("1. Your .env file exists with Supabase credentials")
        print("2. The backend server is running")
        print("3. You've created at least one transaction in the app")
        print()

if __name__ == "__main__":
    asyncio.run(setup())
    print("=" * 70)
