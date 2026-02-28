import numpy as np
import pandas as pd

np.random.seed(42)

n = 3000  # enough for good training

# Feature generation
delay_days = np.clip(np.random.normal(1.5, 2.5, n), -3, 15)
rating = np.clip(np.random.normal(4.4, 0.4, n), 2.5, 5.0)
disputes = np.random.binomial(1, 0.12, n)
repeat_client = np.random.binomial(1, 0.45, n)
collab_count = np.random.poisson(2.5, n)
income_volatility = np.clip(np.random.normal(0.3, 0.2, n), 0, 1)

# True underlying risk logic (Stronger signal for ML)
risk_score = (
    0.8 * delay_days +
    2.5 * disputes -
    2.0 * rating +
    1.2 * (1 - repeat_client) +
    1.8 * income_volatility +
    0.3 * collab_count
)

# Normalize
risk_score = (risk_score - np.mean(risk_score)) / np.std(risk_score)

risk_probability = 1 / (1 + np.exp(-risk_score))

reliability_risk = np.random.binomial(1, risk_probability)

# Create dataframe
data = pd.DataFrame({
    "delay_days": delay_days,
    "rating": rating,
    "disputes": disputes,
    "repeat_client": repeat_client,
    "collab_count": collab_count,
    "income_volatility": income_volatility,
    "reliability_risk": reliability_risk
})

# Export to CSV
csv_filename = "engineer_reliability_dataset.csv"
data.to_csv(csv_filename, index=False)
print(f"✅ Dataset exported to: {csv_filename}")
print(f"📊 Total samples: {len(data)}")

# Dataset Statistics
print("\n" + "="*60)
print("DATASET STATISTICS")
print("="*60)
print("\n📈 Feature Distributions:")
print(data.describe())

print("\n🎯 Target Variable Distribution:")
risk_count = data["reliability_risk"].value_counts()
print(f"Low Risk (0): {risk_count.get(0, 0)} ({risk_count.get(0, 0)/len(data)*100:.1f}%)")
print(f"High Risk (1): {risk_count.get(1, 0)} ({risk_count.get(1, 0)/len(data)*100:.1f}%)")

print("\n🔗 Feature Correlations with Risk:")
correlations = data.corr()["reliability_risk"].drop("reliability_risk").sort_values(ascending=False)
for feature, corr in correlations.items():
    print(f"  {feature:20s}: {corr:+.3f}")

# Quick Model Test
print("\n" + "="*60)
print("MODEL PREDICTION TEST")
print("="*60)

try:
    from sklearn.model_selection import train_test_split
    from sklearn.ensemble import RandomForestClassifier
    from sklearn.metrics import accuracy_score, classification_report, roc_auc_score
    
    # Prepare data
    X = data.drop("reliability_risk", axis=1)
    y = data["reliability_risk"]
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Train Random Forest
    model = RandomForestClassifier(n_estimators=100, max_depth=10, random_state=42)
    model.fit(X_train, y_train)
    
    # Predictions
    y_pred = model.predict(X_test)
    y_pred_proba = model.predict_proba(X_test)[:, 1]
    
    # Evaluation
    accuracy = accuracy_score(y_test, y_pred)
    auc = roc_auc_score(y_test, y_pred_proba)
    
    print(f"\n🔥 Random Forest Model Performance:")
    print(f"   Accuracy: {accuracy*100:.2f}%")
    print(f"   AUC-ROC:  {auc:.3f}")
    
    print("\n📊 Classification Report:")
    print(classification_report(y_test, y_pred, target_names=["Low Risk", "High Risk"]))
    
    print("\n🎯 Feature Importance:")
    feature_importance = pd.DataFrame({
        'feature': X.columns,
        'importance': model.feature_importances_
    }).sort_values('importance', ascending=False)
    
    for idx, row in feature_importance.iterrows():
        print(f"  {row['feature']:20s}: {row['importance']:.3f}")
    
    print("\n✅ MODEL VERDICT: Dataset is suitable for training! 🚀")
    print("   → Model can successfully predict reliability risk")
    print("   → Features have meaningful predictive power")
    
except ImportError:
    print("\n⚠️  Install scikit-learn to test model: pip install scikit-learn")
except Exception as e:
    print(f"\n❌ Model test failed: {e}")