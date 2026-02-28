from database import db
from .models import TransactionCreate, TransactionUpdate, TransactionFilter
from typing import List, Optional, Dict
from datetime import datetime, timezone
from collections import defaultdict

class TransactionService:
    """Service class for transaction business logic"""
    
    @staticmethod
    async def get_all_transactions(filters: TransactionFilter) -> List[Dict]:
        """
        Get all transactions with optional filters
        Used by: Transaction Navbar table
        """
        try:
            query = db.table("transactions").select("*")
            
            # Apply filters
            if filters.user_id:
                query = query.eq("user_id", filters.user_id)
            
            if filters.category:
                query = query.eq("category", filters.category)
            
            if filters.type:
                query = query.eq("type", filters.type)
            
            if filters.date_from:
                query = query.gte("date", filters.date_from)
            
            if filters.date_to:
                query = query.lte("date", filters.date_to)
            
            if filters.search:
                query = query.ilike("description", f"%{filters.search}%")
            
            response = query.order("date", desc=True).execute()
            return response.data
        except Exception as e:
            raise Exception(f"Error fetching transactions: {str(e)}")
    
    @staticmethod
    async def get_transaction_by_id(transaction_id: str) -> Optional[Dict]:
        """Get a single transaction by ID"""
        try:
            response = db.table("transactions").select("*").eq("id", transaction_id).execute()
            return response.data[0] if response.data else None
        except Exception as e:
            raise Exception(f"Error fetching transaction: {str(e)}")
    
    @staticmethod
    async def create_transaction(transaction: TransactionCreate) -> Dict:
        """
        Create a new transaction
        Used by: Add Entry button in Navbar
        """
        try:
            data = transaction.dict()
            data["created_at"] = datetime.now(timezone.utc).isoformat()
            
            response = db.table("transactions").insert(data).execute()
            
            if not response.data:
                raise Exception("Failed to create transaction")
            
            return response.data[0]
        except Exception as e:
            raise Exception(f"Error creating transaction: {str(e)}")
    
    @staticmethod
    async def bulk_create_transactions(transactions: List[TransactionCreate]) -> List[Dict]:
        """
        Create multiple transactions at once
        Used by: Receipt Scanner, CSV Import
        """
        try:
            data = [t.dict() for t in transactions]
            for item in data:
                item["created_at"] = datetime.now(timezone.utc).isoformat()
            
            response = db.table("transactions").insert(data).execute()
            return response.data
        except Exception as e:
            raise Exception(f"Error bulk creating transactions: {str(e)}")
    
    @staticmethod
    async def update_transaction(transaction_id: str, update_data: TransactionUpdate) -> Optional[Dict]:
        """
        Update an existing transaction
        Used by: Edit action in transaction row
        """
        try:
            data = update_data.dict(exclude_unset=True)
            if data:  # Only update if there's data
                data["updated_at"] = datetime.now(timezone.utc).isoformat()
                
                response = db.table("transactions").update(data).eq("id", transaction_id).execute()
                return response.data[0] if response.data else None
            return None
        except Exception as e:
            raise Exception(f"Error updating transaction: {str(e)}")
    
    @staticmethod
    async def delete_transaction(transaction_id: str) -> bool:
        """
        Delete a transaction
        Used by: Delete button in transaction row
        """
        try:
            response = db.table("transactions").delete().eq("id", transaction_id).execute()
            return len(response.data) > 0
        except Exception as e:
            raise Exception(f"Error deleting transaction: {str(e)}")
    
    @staticmethod
    async def get_statistics(user_id: str) -> Dict:
        """
        Get transaction statistics for dashboard cards
        Used by: Summary cards in Ledger page
        """
        try:
            response = db.table("transactions").select("*").eq("user_id", user_id).execute()
            transactions = response.data
            
            # Calculate totals
            total_income = sum(t["amount"] for t in transactions if t["type"] == "Income")
            total_expense = sum(abs(t["amount"]) for t in transactions if t["type"] == "Expense")
            balance = total_income - total_expense
            
            # Category breakdown
            category_map = defaultdict(float)
            for t in transactions:
                if t["type"] == "Expense":
                    category_map[t["category"]] += abs(t["amount"])
            
            top_categories = sorted(
                [{"category": cat, "amount": amt} for cat, amt in category_map.items()],
                key=lambda x: x["amount"],
                reverse=True
            )[:5]
            
            # Monthly trend (simplified)
            monthly_map = defaultdict(lambda: {"income": 0, "expense": 0})
            for t in transactions:
                month = t["date"][:7]  # Extract YYYY-MM
                if t["type"] == "Income":
                    monthly_map[month]["income"] += t["amount"]
                else:
                    monthly_map[month]["expense"] += abs(t["amount"])
            
            monthly_trend = [
                {"month": month, **values}
                for month, values in sorted(monthly_map.items())
            ]
            
            return {
                "total_income": total_income,
                "total_expense": total_expense,
                "balance": balance,
                "transaction_count": len(transactions),
                "top_categories": top_categories,
                "monthly_trend": monthly_trend
            }
        except Exception as e:
            raise Exception(f"Error calculating statistics: {str(e)}")
    
    @staticmethod
    async def get_categories(user_id: str) -> List[str]:
        """
        Get all unique categories for a user
        Used by: Category dropdown in Add/Edit modal
        """
        try:
            response = db.table("transactions").select("category").eq("user_id", user_id).execute()
            categories = set(t["category"] for t in response.data if t.get("category"))
            return sorted(list(categories))
        except Exception as e:
            raise Exception(f"Error fetching categories: {str(e)}")
    
    @staticmethod
    async def search_transactions(user_id: str, query: str) -> List[Dict]:
        """
        Search transactions by description or category
        Used by: Search bar in transaction navbar
        """
        try:
            response = (
                db.table("transactions")
                .select("*")
                .eq("user_id", user_id)
                .or_(f"description.ilike.%{query}%,category.ilike.%{query}%")
                .order("date", desc=True)
                .execute()
            )
            return response.data
        except Exception as e:
            raise Exception(f"Error searching transactions: {str(e)}")
