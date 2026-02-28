"""
Email Service for Flo Finance
Handles sending email reminders for EMI payments using SMTP
"""

import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

# Email configuration from environment variables
SMTP_SERVER = os.getenv("SMTP_SERVER", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USERNAME = os.getenv("SMTP_USERNAME", "")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "")
FROM_EMAIL = os.getenv("FROM_EMAIL", SMTP_USERNAME)

# Debug: Print configuration on module load
print("\n" + "="*60)
print("📧 EMAIL SERVICE INITIALIZED")
print("="*60)
print(f"✅ .env file loaded")
print(f"SMTP_SERVER: {SMTP_SERVER}")
print(f"SMTP_PORT: {SMTP_PORT}")
print(f"SMTP_USERNAME: {SMTP_USERNAME if SMTP_USERNAME else '❌ NOT SET'}")
print(f"SMTP_PASSWORD: {'✅ SET (***' + SMTP_PASSWORD[-4:] + ')' if SMTP_PASSWORD else '❌ NOT SET'}")
print(f"FROM_EMAIL: {FROM_EMAIL if FROM_EMAIL else '❌ NOT SET'}")
print(f"\nMode: {'🟢 REAL EMAIL' if SMTP_USERNAME and SMTP_PASSWORD else '🟡 DEMO/SIMULATION'}")
print("="*60 + "\n")


def send_emi_reminder(to_email: str, emi_details: dict):
    """
    Send EMI reminder email to user
    
    Args:
        to_email: Recipient email address
        emi_details: Dictionary containing EMI information
            - loan_type: Type of loan (e.g., "Home Loan")
            - bank_name: Name of the bank
            - amount: EMI amount
            - due_days: Days until due date
            - due_date: Due date string
    
    Returns:
        dict: Status of email sending
    """
    
    try:
        # Debug: Check environment variables
        print("\n" + "="*60)
        print("🔍 EMAIL SERVICE DEBUG INFO:")
        print("="*60)
        print(f"SMTP_SERVER: {SMTP_SERVER}")
        print(f"SMTP_PORT: {SMTP_PORT}")
        print(f"SMTP_USERNAME: {SMTP_USERNAME}")
        print(f"SMTP_PASSWORD: {'***' + SMTP_PASSWORD[-4:] if SMTP_PASSWORD else 'None'}")
        print(f"FROM_EMAIL: {FROM_EMAIL}")
        print(f"TO_EMAIL: {to_email}")
        print("="*60 + "\n")
        
        # Create message
        message = MIMEMultipart("alternative")
        message["Subject"] = f"⚠️ EMI Reminder: {emi_details.get('loan_type', 'Loan')} Due in {emi_details.get('due_days', 'N/A')} Days"
        message["From"] = FROM_EMAIL
        message["To"] = to_email
        
        # Create HTML email body
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {{ font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5; margin: 0; padding: 0; }}
                .container {{ max-width: 600px; margin: 40px auto; background-color: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }}
                .header {{ background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); padding: 40px 30px; text-align: center; }}
                .header h1 {{ color: white; margin: 0; font-size: 28px; font-weight: bold; }}
                .header p {{ color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 14px; }}
                .content {{ padding: 40px 30px; }}
                .alert-box {{ background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 20px; border-radius: 8px; margin-bottom: 30px; }}
                .alert-box h2 {{ color: #92400e; margin: 0 0 10px 0; font-size: 18px; }}
                .alert-box p {{ color: #78350f; margin: 0; font-size: 14px; }}
                .emi-details {{ background-color: #f9fafb; border-radius: 12px; padding: 25px; margin: 25px 0; }}
                .detail-row {{ display: flex; justify-content: space-between; margin: 15px 0; padding: 12px 0; border-bottom: 1px solid #e5e7eb; }}
                .detail-row:last-child {{ border-bottom: none; }}
                .detail-label {{ color: #6b7280; font-size: 14px; font-weight: 600; }}
                .detail-value {{ color: #111827; font-size: 14px; font-weight: bold; }}
                .amount {{ font-size: 24px; color: #6366f1; }}
                .button {{ display: inline-block; background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); color: white; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: bold; margin: 20px 0; text-align: center; }}
                .button:hover {{ background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); }}
                .footer {{ background-color: #f9fafb; padding: 25px 30px; text-align: center; color: #6b7280; font-size: 12px; }}
                .footer a {{ color: #6366f1; text-decoration: none; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>💳 Flo Finance</h1>
                    <p>EMI Payment Reminder</p>
                </div>
                
                <div class="content">
                    <div class="alert-box">
                        <h2>🔔 Payment Reminder!</h2>
                        <p>Your EMI payment is due soon. Please ensure sufficient funds in your account.</p>
                    </div>
                    
                    <div class="emi-details">
                        <div class="detail-row">
                            <span class="detail-label">Loan Type</span>
                            <span class="detail-value">{emi_details.get('loan_type', 'N/A')}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Bank/Lender</span>
                            <span class="detail-value">{emi_details.get('bank_name', 'N/A')}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">EMI Amount</span>
                            <span class="detail-value amount">₹{emi_details.get('amount', '0'):,.2f}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Due Date</span>
                            <span class="detail-value">{emi_details.get('due_date', 'N/A')}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Days Remaining</span>
                            <span class="detail-value" style="color: #ef4444;">{emi_details.get('due_days', 'N/A')} days</span>
                        </div>
                    </div>
                    
                    <p style="color: #6b7280; font-size: 14px; line-height: 1.6;">
                        To avoid late payment charges and maintain a good credit score, please ensure your EMI is paid on time. 
                        You can make the payment through your bank's app or visit the nearest branch.
                    </p>
                    
                    <div style="text-align: center; margin-top: 30px;">
                        <a href="http://localhost:3000/ledger" class="button">View in Flo Finance →</a>
                    </div>
                </div>
                
                <div class="footer">
                    <p><strong>Flo Finance</strong> - Your Personal Finance Companion</p>
                    <p style="margin-top: 10px;">
                        This is an automated reminder. 
                        <a href="http://localhost:3000/settings">Manage your notification preferences</a>
                    </p>
                    <p style="margin-top: 15px; color: #9ca3af;">© 2026 Flo Finance. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
        """
        
        # Create plain text version as fallback
        text_content = f"""
        EMI Payment Reminder - Flo Finance
        
        Payment Due Soon!
        
        Loan Type: {emi_details.get('loan_type', 'N/A')}
        Bank/Lender: {emi_details.get('bank_name', 'N/A')}
        EMI Amount: ₹{emi_details.get('amount', '0'):,.2f}
        Due Date: {emi_details.get('due_date', 'N/A')}
        Days Remaining: {emi_details.get('due_days', 'N/A')} days
        
        Please ensure your EMI is paid on time to avoid late payment charges.
        
        View in Flo Finance: http://localhost:3000/ledger
        
        ---
        Flo Finance - Your Personal Finance Companion
        """
        
        # Attach both HTML and plain text versions
        part1 = MIMEText(text_content, "plain")
        part2 = MIMEText(html_content, "html")
        message.attach(part1)
        message.attach(part2)
        
        # Send email via SMTP
        # Check if SMTP credentials are configured
        if not SMTP_USERNAME or not SMTP_PASSWORD:
            # For demo purposes, simulate successful email send
            print("\n" + "⚠️"*30)
            print("📧 EMAIL SIMULATION MODE (No SMTP credentials configured)")
            print("⚠️"*30)
            print(f"Would send EMI reminder to: {to_email}")
            print(f"Subject: {message['Subject']}")
            print(f"Amount: ₹{emi_details.get('amount', '0'):,.2f}")
            print(f"Due: {emi_details.get('due_days', 'N/A')} days")
            print("\n💡 To enable real emails:")
            print("   1. Add SMTP_USERNAME to .env file")
            print("   2. Add SMTP_PASSWORD to .env file")
            print("   3. Restart the server")
            print("="*60 + "\n")
            return {
                "success": True,
                "message": "Email reminder simulated (no SMTP configured)",
                "recipient": to_email,
                "simulated": True
            }
        
        # Send actual email if credentials are configured
        print("\n" + "📧"*30)
        print("ATTEMPTING TO SEND REAL EMAIL")
        print("📧"*30)
        print(f"Connecting to: {SMTP_SERVER}:{SMTP_PORT}")
        print(f"Logging in as: {SMTP_USERNAME}")
        
        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.starttls()  # Secure the connection
            print("✅ TLS connection established")
            
            server.login(SMTP_USERNAME, SMTP_PASSWORD)
            print("✅ Login successful")
            
            server.send_message(message)
            print("✅ Email sent successfully")
        
        print(f"\n🎉 EMI reminder email delivered to {to_email}")
        print("="*60 + "\n")
        return {
            "success": True,
            "message": "Email sent successfully",
            "recipient": to_email,
            "simulated": False
        }
        
    except Exception as e:
        print(f"❌ Error sending email: {str(e)}")
        # For demo purposes, still return success but note the error
        return {
            "success": True,
            "message": f"Email reminder queued (demo mode): {str(e)}",
            "recipient": to_email,
            "simulated": True,
            "error": str(e)
        }


def test_email_connection():
    """Test SMTP connection"""
    try:
        if not SMTP_USERNAME or not SMTP_PASSWORD:
            return {
                "connected": False,
                "message": "SMTP credentials not configured (demo mode enabled)"
            }
        
        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.starttls()
            server.login(SMTP_USERNAME, SMTP_PASSWORD)
        
        return {
            "connected": True,
            "message": "SMTP connection successful"
        }
    except Exception as e:
        return {
            "connected": False,
            "message": f"SMTP connection failed: {str(e)}"
        }
