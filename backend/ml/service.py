import joblib
import numpy as np
from pathlib import Path

class TrustModelService:
    def __init__(self):
        self.model = None
        self.model_path = Path(__file__).parent / "trust_model.pkl"
        self.load_model()
    
    def load_model(self):
        """Load the trained model"""
        try:
            if self.model_path.exists():
                self.model = joblib.load(self.model_path)
                print(f"✅ Trust model loaded from {self.model_path}")
            else:
                print(f"⚠️  Model not found at {self.model_path}")
                print(f"   Please place trust_model.pkl in backend/ml/ folder")
        except Exception as e:
            print(f"❌ Error loading model: {e}")
            self.model = None
    
    def predict_trust(self, features: dict):
        """
        Predict engineer reliability risk
        
        Args:
            features: dict with keys:
                - delay_days: float
                - rating: float
                - disputes: int
                - repeat_client: int (0 or 1)
                - collab_count: int
                - income_volatility: float
        
        Returns:
            dict with prediction results
        """
        if self.model is None:
            raise ValueError("Model not loaded. Please ensure trust_model.pkl exists in backend/ml/")
        
        # Prepare input in correct order
        input_data = np.array([[
            features["delay_days"],
            features["rating"],
            features["disputes"],
            features["repeat_client"],
            features["collab_count"],
            features["income_volatility"],
        ]])
        
        # Get prediction
        prediction = self.model.predict(input_data)[0]
        prediction_proba = self.model.predict_proba(input_data)[0]
        
        # Calculate risk probability (probability of class 1 - High Risk)
        risk_probability = float(prediction_proba[1])
        confidence = float(max(prediction_proba))
        
        # Determine risk level
        if prediction == 0:
            risk_level = "Low Risk"
            recommendation = "✅ This engineer shows strong reliability signals. Safe to collaborate."
        else:
            risk_level = "High Risk"
            recommendation = "⚠️  Exercise caution. Consider closer monitoring or milestone-based payments."
        
        return {
            "reliability_risk": int(prediction),
            "risk_probability": round(risk_probability * 100, 2),
            "risk_level": risk_level,
            "confidence": round(confidence * 100, 2),
            "recommendation": recommendation,
            "feature_analysis": self._analyze_features(features)
        }
    
    def _analyze_features(self, features: dict):
        """Analyze which features contribute to risk"""
        risk_factors = []
        positive_factors = []
        
        # Analyze each feature
        if features["delay_days"] > 2:
            risk_factors.append(f"High delivery delays ({features['delay_days']:.1f} days avg)")
        elif features["delay_days"] < 0:
            positive_factors.append("Consistently early deliveries")
        
        if features["rating"] >= 4.5:
            positive_factors.append(f"Excellent rating ({features['rating']:.1f}/5.0)")
        elif features["rating"] < 3.5:
            risk_factors.append(f"Low client rating ({features['rating']:.1f}/5.0)")
        
        if features["disputes"] > 0:
            risk_factors.append(f"{features['disputes']} past dispute(s)")
        else:
            positive_factors.append("No dispute history")
        
        if features["repeat_client"] == 1:
            positive_factors.append("Has repeat clients")
        else:
            risk_factors.append("No repeat clients yet")
        
        if features["collab_count"] >= 5:
            positive_factors.append(f"High collaboration count ({features['collab_count']})")
        elif features["collab_count"] <= 1:
            risk_factors.append("Limited collaboration experience")
        
        if features["income_volatility"] > 0.5:
            risk_factors.append("High income volatility")
        elif features["income_volatility"] < 0.2:
            positive_factors.append("Stable income pattern")
        
        return {
            "risk_factors": risk_factors,
            "positive_factors": positive_factors
        }

# Global service instance
trust_service = TrustModelService()
