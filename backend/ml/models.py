from pydantic import BaseModel

class TrustPredictionRequest(BaseModel):
    delay_days: float
    rating: float
    disputes: int
    repeat_client: int  # 0 or 1
    collab_count: int
    income_volatility: float

class TrustPredictionResponse(BaseModel):
    reliability_risk: int  # 0 = Low Risk, 1 = High Risk
    risk_probability: float
    risk_level: str  # "Low Risk" or "High Risk"
    confidence: float
    recommendation: str
