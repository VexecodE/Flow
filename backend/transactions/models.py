from pydantic import BaseModel, Field
from typing import Optional, Literal
from datetime import datetime

class TransactionBase(BaseModel):
    """Base transaction model with common fields"""
    date: str
    description: str
    category: str
    amount: float
    type: Literal["Income", "Expense"]
    status: str = "Completed"
    invoice_ref: Optional[str] = None
    source: Literal["manual", "voice", "receipt", "scan"] = "manual"
    notes: Optional[str] = None

class TransactionCreate(TransactionBase):
    """Model for creating a new transaction"""
    user_id: str

class TransactionUpdate(BaseModel):
    """Model for updating a transaction (all fields optional)"""
    date: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    amount: Optional[float] = None
    type: Optional[Literal["Income", "Expense"]] = None
    status: Optional[str] = None
    notes: Optional[str] = None
    invoice_ref: Optional[str] = None

class TransactionResponse(TransactionBase):
    """Model for transaction response"""
    id: str
    user_id: str
    created_at: str
    updated_at: Optional[str] = None

    class Config:
        from_attributes = True

class TransactionFilter(BaseModel):
    """Model for filtering transactions"""
    user_id: Optional[str] = None
    category: Optional[str] = None
    type: Optional[Literal["Income", "Expense"]] = None
    date_from: Optional[str] = None
    date_to: Optional[str] = None
    search: Optional[str] = None

class TransactionStats(BaseModel):
    """Model for transaction statistics"""
    total_income: float
    total_expense: float
    balance: float
    transaction_count: int
    top_categories: list
    monthly_trend: list
