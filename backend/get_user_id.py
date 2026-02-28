"""
Helper script to get your User ID from Supabase
"""

from database import db

print("=" * 70)
print("🔍 Finding your User ID")
print("=" * 70)
print()

try:
    # Try to get user ID from existing transaction
    response = db.table("transactions").select("user_id").limit(1).execute()
    
    if response.data and len(response.data) > 0:
        user_id = response.data[0]["user_id"]
        print("✅ Found User ID from existing transaction:")
        print()
        print(f"    {user_id}")
        print()
        print("=" * 70)
        print("📋 How to use this User ID:")
        print("=" * 70)
        print()
        print("1. Set as environment variable (recommended):")
        print(f"   export SIMULATOR_USER_ID={user_id}")
        print()
        print("   Or on Windows CMD:")
        print(f"   set SIMULATOR_USER_ID={user_id}")
        print()
        print("   Or on Windows PowerShell:")
        print(f"   $env:SIMULATOR_USER_ID='{user_id}'")
        print()
        print("2. Use directly with simulator:")
        print(f"   python transaction_simulator.py --user {user_id}")
        print()
    else:
        print("⚠️  No transactions found in database.")
        print()
        print("=" * 70)
        print("📝 To get your User ID:")
        print("=" * 70)
        print()
        print("1. Open the Flo Finance app in your browser")
        print("2. Open Developer Tools (Press F12)")
        print("3. Go to Console tab")
        print("4. Type this command:")
        print()
        print("   (await supabase.auth.getUser()).data.user.id")
        print()
        print("5. Copy the ID that appears")
        print("6. Create a transaction manually in the app")
        print("7. Run this script again")
        print()
        
except Exception as e:
    print(f"❌ Error connecting to database: {e}")
    print()
    print("Make sure your .env file is configured with Supabase credentials")
    print()

print("=" * 70)
