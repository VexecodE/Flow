"""
Test EMI Email Reminder Functionality
Run this to test the email reminder system
"""

import asyncio
import httpx

async def test_email_reminder():
    """Test sending EMI reminder email"""
    
    base_url = "http://localhost:8000/api"
    
    # 1. Test SMTP connection
    print("1️⃣  Testing email configuration...")
    async with httpx.AsyncClient() as client:
        response = await client.get(f"{base_url}/reminders/test-email")
        result = response.json()
        print(f"   Status: {result['status']}")
        print(f"   Message: {result['message']}")
        print(f"   Demo Mode: {result['demo_mode']}")
        print()
    
    # 2. Send test EMI reminder
    print("2️⃣  Sending EMI reminder email...")
    test_data = {
        "user_email": "test@example.com",  # Change to your email
        "loan_type": "Home Loan",
        "bank_name": "HDFC Bank",
        "amount": 45200.0,
        "due_days": 5,
        "due_date": "2026-03-05"
    }
    
    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{base_url}/reminders/emi",
            json=test_data
        )
        result = response.json()
        
        if result['success']:
            print(f"   ✅ Success!")
            print(f"   Recipient: {result['recipient']}")
            print(f"   Message: {result['message']}")
            print(f"   Simulated: {result.get('simulated', False)}")
            print(f"   Timestamp: {result['timestamp']}")
        else:
            print(f"   ❌ Failed: {result.get('message', 'Unknown error')}")
        print()
    
    # 3. Test toggle endpoint
    print("3️⃣  Testing toggle reminder endpoint...")
    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{base_url}/reminders/emi/toggle?enabled=true",
            json=test_data
        )
        result = response.json()
        
        if result['success']:
            print(f"   ✅ Reminder enabled!")
            print(f"   Status: {result['enabled']}")
            print(f"   Message: {result['message']}")
        else:
            print(f"   ❌ Failed")
        print()

if __name__ == "__main__":
    print("=" * 60)
    print("EMI Email Reminder Test")
    print("=" * 60)
    print()
    
    print("📧 Testing email reminder functionality...")
    print("Make sure the backend is running: python main.py")
    print()
    
    asyncio.run(test_email_reminder())
    
    print()
    print("=" * 60)
    print("✅ Test Complete!")
    print("=" * 60)
    print()
    print("📝 Notes:")
    print("- If SMTP is not configured, emails will be simulated")
    print("- Check the backend console for email logs")
    print("- To enable real emails, configure SMTP in .env file")
    print()
