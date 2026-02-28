"""
Reminder API Routes
Handles email reminders for EMI payments
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr
from datetime import datetime, timedelta
import sys
import os

# Add parent directory to path to import email_service
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from email_service import send_emi_reminder, test_email_connection

router = APIRouter(tags=["Reminders"])


class EMIReminderRequest(BaseModel):
    """Request model for EMI reminder"""
    user_email: EmailStr
    loan_type: str = "Home Loan"
    bank_name: str = "HDFC Bank"
    amount: float = 45200.0
    due_days: int = 5
    due_date: str = None
    
    class Config:
        json_schema_extra = {
            "example": {
                "user_email": "user@example.com",
                "loan_type": "Home Loan",
                "bank_name": "HDFC Bank",
                "amount": 45200.0,
                "due_days": 5,
                "due_date": "2026-03-05"
            }
        }


@router.post("/reminders/emi")
async def send_emi_reminder_email(request: EMIReminderRequest):
    """
    Send EMI reminder email to user
    
    - **user_email**: User's email address (from Supabase auth)
    - **loan_type**: Type of loan (e.g., "Home Loan", "Car Loan")
    - **bank_name**: Name of the lending institution
    - **amount**: EMI amount in INR
    - **due_days**: Number of days until payment is due
    - **due_date**: Due date in YYYY-MM-DD format (optional)
    """
    
    try:
        # Calculate due date if not provided
        if not request.due_date:
            due_date = datetime.now() + timedelta(days=request.due_days)
            due_date_str = due_date.strftime("%B %d, %Y")
        else:
            # Parse and format the provided date
            try:
                due_date = datetime.strptime(request.due_date, "%Y-%m-%d")
                due_date_str = due_date.strftime("%B %d, %Y")
            except ValueError:
                due_date_str = request.due_date
        
        # Prepare EMI details
        emi_details = {
            "loan_type": request.loan_type,
            "bank_name": request.bank_name,
            "amount": request.amount,
            "due_days": request.due_days,
            "due_date": due_date_str
        }
        
        # Send email
        result = send_emi_reminder(request.user_email, emi_details)
        
        return {
            "success": True,
            "message": result.get("message", "Email reminder sent"),
            "recipient": request.user_email,
            "details": emi_details,
            "simulated": result.get("simulated", False),
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to send email reminder: {str(e)}"
        )


@router.get("/reminders/test-email")
async def test_email_config():
    """
    Test email configuration and SMTP connection
    """
    result = test_email_connection()
    return {
        "status": "connected" if result["connected"] else "disconnected",
        "message": result["message"],
        "smtp_configured": result["connected"],
        "demo_mode": not result["connected"]
    }


@router.post("/reminders/emi/toggle")
async def toggle_emi_reminder(request: EMIReminderRequest, enabled: bool = True):
    """
    Toggle EMI reminder on/off
    
    - **enabled**: True to enable reminder, False to disable
    - If enabled=True, sends immediate confirmation email
    """
    
    if enabled:
        # Send confirmation email when reminder is enabled
        result = await send_emi_reminder_email(request)
        return {
            "success": True,
            "enabled": True,
            "message": "EMI reminder enabled and confirmation email sent",
            "email_result": result
        }
    else:
        return {
            "success": True,
            "enabled": False,
            "message": "EMI reminder disabled",
            "recipient": request.user_email
        }
