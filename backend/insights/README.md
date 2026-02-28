# 🧠 Smart Insights API - Documentation

The Smart Insights module analyzes your transaction history and provides:
- **Spending patterns** by category
- **Income & expense trends**
- **Predictions** for next month
- **Budget recommendations**  
- **Anomaly detection** (unusual transactions)
- **Personalized recommendations**

## 🚀 Quick Start

### 1. Make Sure Backend is Running
```bash
cd backend
python main.py
```

### 2. Test the Insights API
```bash
python test_insights.py
```

## 📊 API Endpoints

All endpoints require a `user_id` parameter.

### Full Smart Insights
```bash
GET /api/insights/smart?user_id=USER_ID&days=90
```

**Response:** Complete insights package with all analysis

**Example:**
```bash
curl "http://localhost:8000/api/insights/smart?user_id=abc123&days=90"
```

### Quick Summary
```bash
GET /api/insights/summary?user_id=USER_ID
```

Returns a brief, actionable summary message.

### Spending Patterns
```bash
GET /api/insights/spending-patterns?user_id=USER_ID&days=30
```

Detailed breakdown of spending by category with trends.

### Predictions
```bash
GET /api/insights/predictions?user_id=USER_ID&days=90
```

Predicts next month's income, expenses, and savings.

### Budget Recommendations
```bash
GET /api/insights/budget-recommendations?user_id=USER_ID&days=60
```

Recommended budget allocation per category.

### Anomaly Detection
```bash
GET /api/insights/anomalies?user_id=USER_ID&days=30
```

Detects unusually high transactions.

### Recommendations
```bash
GET /api/insights/recommendations?user_id=USER_ID&days=60
```

Personalized financial recommendations.

## 📈 What Each Insight Provides

### 1. **Spending Patterns**
- Average amount per category
- Transaction frequency
- Trend (increasing/decreasing/stable)
- Percentage of total spending

### 2. **Predictions**
- Next month income (with 10% growth factor)
- Next month expenses (with 5% growth factor)
- Predicted savings
- Category-specific predictions

### 3. **Budget Recommendations**
- Recommended budget per category (with 10% buffer)
- Confidence level based on transaction count
- Predicted amounts

### 4. **Anomaly Detection**
- Transactions > 2 standard deviations above mean
- Reason for being flagged
- Amount comparison to average

### 5. **Recommendations**
Examples:
- "Your savings rate is low. Try to save at least 10-20% of income."
- "Marketing accounts for 35% of spending. Consider reviewing these expenses."
- "Spending is increasing in: Food, Software. Monitor these categories."

## 🔧 Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `user_id` | string | **required** | User identifier |
| `days` | integer | 90 | Number of days to analyze (7-365) |

## 💡 Example Response

```json
{
  "total_income": 15000.00,
  "total_expenses": 12000.00,
  "net_savings": 3000.00,
  "savings_rate": 20.0,
  
  "top_spending_categories": [
    {
      "category": "Software",
      "average_amount": 450.00,
      "frequency": 8,
      "trend": "stable",
      "percentage_of_total": 30.0
    }
  ],
  
  "predicted_next_month_spending": 12600.00,
  "predicted_next_month_income": 16500.00,
  "predicted_savings": 3900.00,
  
  "income_trend": "increasing",
  "expense_trend": "stable",
  
  "recommendations": [
    "✅ Your finances look healthy! Keep up the good habits.",
    "💰 Set up automatic savings transfers on payday.",
    "📊 Review your budget monthly and adjust as needed."
  ],
  
  "unusual_transactions": [
    {
      "transaction_id": "abc-123",
      "description": "AWS Services",
      "amount": 2500.00,
      "reason": "Unusually high transaction - 400% above average"
    }
  ]
}
```

## 🧪 Testing

### Using the Test Script
```bash
cd backend
python test_insights.py
```

### Manual Testing with curl
```bash
# Get full insights
curl "http://localhost:8000/api/insights/smart?user_id=YOUR_USER_ID&days=90"

# Get quick summary
curl "http://localhost:8000/api/insights/summary?user_id=YOUR_USER_ID"

# Get predictions
curl "http://localhost:8000/api/insights/predictions?user_id=YOUR_USER_ID&days=90"
```

### Interactive API Documentation
Visit: http://localhost:8000/docs

Click on **Smart Insights** section to try all endpoints with a UI.

## 🎯 Use Cases

### Dashboard Widget
```javascript
// Fetch quick summary for dashboard
const response = await fetch(
  `http://localhost:8000/api/insights/summary?user_id=${userId}`
);
const summary = await response.json();
// Display: summary.message, summary.key_metric
```

### Insights Page
```javascript
// Fetch full insights for detailed page
const response = await fetch(
  `http://localhost:8000/api/insights/smart?user_id=${userId}&days=90`
);
const insights = await response.json();
// Display charts, recommendations, predictions
```

### Budget Planner
```javascript
// Get budget recommendations
const response = await fetch(
  `http://localhost:8000/api/insights/budget-recommendations?user_id=${userId}`
);
const { recommendations, total_recommended } = await response.json();
// Populate budget form with recommendations
```

## 🔮 Prediction Algorithm

### Income Prediction
- Average monthly income from past data
- Apply 10% growth factor (optimistic)

### Expense Prediction
- Average monthly expenses from past data
- Apply 5% growth factor (conservative)
- Category-specific predictions based on recent trends

### Trend Analysis
- Split transactions into two halves (older vs recent)
- Compare averages
- Classify as increasing (>10% higher), decreasing (>10% lower), or stable

### Anomaly Detection
- Calculate mean and standard deviation of transaction amounts
- Flag transactions > 2 standard deviations above mean
- Provide percentage comparison to average

## 📊 Minimum Data Requirements

- **Minimum transactions:** 1 (will provide basic stats)
- **Recommended for trends:** 10+ transactions
- **Recommended for predictions:** 30+ transactions over 60+ days
- **Anomaly detection:** 5+ transactions

## 🔄 Integration Steps

1. **Backend is ready** - All endpoints are functional
2. **Test endpoints** - Run `python test_insights.py`
3. **Frontend integration** - Use fetch/axios to call endpoints
4. **Display insights** - Show in dashboard/insights page
5. **Refresh strategy** - Cache insights, refresh every 24 hours

## 📝 Future Enhancements

Potential improvements:
- Machine learning for better predictions
- Seasonal trend detection
- Goal tracking integration
- Automated alerts for anomalies
- Budget variance analysis
- Expense forecasting by day/week

---

**Smart Insights is now ready for frontend integration!** 🎉

Access full API docs: http://localhost:8000/docs
