from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from .models import (
    TransactionCreate,
    TransactionUpdate,
    TransactionResponse,
    TransactionFilter,
    TransactionStats
)
from .service import TransactionService

router = APIRouter(prefix="/transactions", tags=["Transactions"])

# ====================
# TRANSACTION NAVBAR ENDPOINTS
# ====================

@router.get("", response_model=List[TransactionResponse])
async def get_all_transactions(
    user_id: Optional[str] = Query(None, description="Filter by user ID"),
    category: Optional[str] = Query(None, description="Filter by category"),
    type: Optional[str] = Query(None, description="Filter by type (Income/Expense)"),
    date_from: Optional[str] = Query(None, description="Filter from date (YYYY-MM-DD)"),
    date_to: Optional[str] = Query(None, description="Filter to date (YYYY-MM-DD)"),
    search: Optional[str] = Query(None, description="Search in description")
):
    """
    **Get all transactions with optional filters**
    
    Used by: Transaction table in Ledger navbar
    
    Returns: List of transactions ordered by date (newest first)
    """
    try:
        filters = TransactionFilter(
            user_id=user_id,
            category=category,
            type=type,
            date_from=date_from,
            date_to=date_to,
            search=search
        )
        transactions = await TransactionService.get_all_transactions(filters)
        return transactions
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{transaction_id}", response_model=TransactionResponse)
async def get_transaction(transaction_id: str):
    """
    **Get a single transaction by ID**
    
    Used by: Transaction detail view, Edit modal
    """
    try:
        transaction = await TransactionService.get_transaction_by_id(transaction_id)
        if not transaction:
            raise HTTPException(status_code=404, detail="Transaction not found")
        return transaction
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("", response_model=TransactionResponse, status_code=201)
async def create_transaction(transaction: TransactionCreate):
    """
    **Create a new transaction**
    
    Used by: "Add Entry" button in transaction navbar
    
    Request body should include:
    - date: Transaction date (YYYY-MM-DD)
    - description: Transaction description
    - category: Category name
    - amount: Transaction amount
    - type: "Income" or "Expense"
    - user_id: User identifier
    """
    try:
        new_transaction = await TransactionService.create_transaction(transaction)
        return new_transaction
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/bulk", response_model=List[TransactionResponse], status_code=201)
async def create_bulk_transactions(transactions: List[TransactionCreate]):
    """
    **Create multiple transactions at once**
    
    Used by: Receipt scanner, CSV import, Batch upload
    """
    try:
        new_transactions = await TransactionService.bulk_create_transactions(transactions)
        return new_transactions
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.put("/{transaction_id}", response_model=TransactionResponse)
async def update_transaction(transaction_id: str, update_data: TransactionUpdate):
    """
    **Update an existing transaction**
    
    Used by: Edit button in transaction row
    
    Only fields provided in the request will be updated
    """
    try:
        updated = await TransactionService.update_transaction(transaction_id, update_data)
        if not updated:
            raise HTTPException(status_code=404, detail="Transaction not found or no changes made")
        return updated
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/{transaction_id}", status_code=200)
async def delete_transaction(transaction_id: str):
    """
    **Delete a transaction**
    
    Used by: Delete button in transaction row
    """
    try:
        success = await TransactionService.delete_transaction(transaction_id)
        if not success:
            raise HTTPException(status_code=404, detail="Transaction not found")
        return {"success": True, "message": "Transaction deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ====================
# STATISTICS & ANALYTICS
# ====================

@router.get("/stats/summary", response_model=TransactionStats)
async def get_transaction_stats(user_id: str = Query(..., description="User ID (required)")):
    """
    **Get transaction statistics and summary**
    
    Used by: Dashboard summary cards in Ledger page
    
    Returns:
    - total_income: Sum of all income
    - total_expense: Sum of all expenses
    - balance: Net balance (income - expense)
    - transaction_count: Total number of transactions
    - top_categories: Top 5 expense categories
    - monthly_trend: Monthly income/expense breakdown
    """
    try:
        stats = await TransactionService.get_statistics(user_id)
        return stats
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/categories/list")
async def get_categories(user_id: str = Query(..., description="User ID (required)")):
    """
    **Get all unique categories for a user**
    
    Used by: Category dropdown in Add/Edit transaction modal
    """
    try:
        categories = await TransactionService.get_categories(user_id)
        return {"categories": categories}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/search/query")
async def search_transactions(
    user_id: str = Query(..., description="User ID (required)"),
    q: str = Query(..., description="Search query")
):
    """
    **Search transactions by description or category**
    
    Used by: Search bar in transaction navbar
    """
    try:
        results = await TransactionService.search_transactions(user_id, q)
        return {"results": results, "count": len(results)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
