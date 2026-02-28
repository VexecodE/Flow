import pandas as pd
import numpy as np
import joblib
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import (
    roc_auc_score, 
    accuracy_score, 
    classification_report, 
    confusion_matrix,
    precision_recall_curve,
    roc_curve
)

print("="*70)
print("🔥 ENGINEER RELIABILITY RISK MODEL - TRAINING & EVALUATION 🔥")
print("="*70)

# Load dataset
print("\n📂 Loading dataset...")
data = pd.read_csv("engineer_reliability_dataset.csv")
print(f"✅ Loaded {len(data)} samples with {data.shape[1]} features")

# Display basic info
print(f"\n📊 Dataset Overview:")
print(f"   Features: {list(data.columns[:-1])}")
print(f"   Target: reliability_risk")

# Check target distribution
risk_dist = data['reliability_risk'].value_counts()
print(f"\n🎯 Target Distribution:")
print(f"   Low Risk (0):  {risk_dist.get(0, 0)} samples ({risk_dist.get(0, 0)/len(data)*100:.1f}%)")
print(f"   High Risk (1): {risk_dist.get(1, 0)} samples ({risk_dist.get(1, 0)/len(data)*100:.1f}%)")

# Split features and target
X = data.drop("reliability_risk", axis=1)
y = data["reliability_risk"]

# Train/test split (stratified to preserve class balance)
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

print(f"\n📂 Data Split:")
print(f"   Training:   {len(X_train)} samples ({len(X_train)/len(data)*100:.0f}%)")
print(f"   Testing:    {len(X_test)} samples ({len(X_test)/len(data)*100:.0f}%)")

# Train model
print("\n" + "="*70)
print("🚀 TRAINING RANDOM FOREST MODEL")
print("="*70)

model = RandomForestClassifier(
    n_estimators=200,
    max_depth=10,
    min_samples_split=10,
    min_samples_leaf=5,
    random_state=42,
    class_weight='balanced',  # Handle class imbalance
    n_jobs=-1  # Use all CPU cores
)

print("\n⏳ Training in progress...")
model.fit(X_train, y_train)
print("✅ Model training complete!")

# Make predictions
y_pred = model.predict(X_test)
y_pred_proba = model.predict_proba(X_test)[:, 1]

# Calculate metrics
print("\n" + "="*70)
print("📊 MODEL PERFORMANCE METRICS")
print("="*70)

accuracy = accuracy_score(y_test, y_pred)
auc = roc_auc_score(y_test, y_pred_proba)

print(f"\n🎯 Core Metrics:")
print(f"   Accuracy:  {accuracy*100:.2f}%")
print(f"   AUC-ROC:   {auc:.3f}")

# Performance interpretation
print(f"\n💡 Performance Assessment:")
if accuracy >= 0.80 and auc >= 0.80:
    print(f"   ✅✅ EXCELLENT - Production ready!")
elif accuracy >= 0.70 and auc >= 0.75:
    print(f"   ✅ GOOD - Suitable for deployment")
elif accuracy >= 0.60:
    print(f"   ⚠️  FAIR - May need tuning")
else:
    print(f"   ❌ POOR - Needs improvement")

# Confusion Matrix
print("\n" + "="*70)
print("🎯 CONFUSION MATRIX")
print("="*70)
cm = confusion_matrix(y_test, y_pred)
print(f"\n                    Predicted")
print(f"                Low Risk  High Risk")
print(f"Actual Low Risk    {cm[0,0]:4d}      {cm[0,1]:4d}")
print(f"     High Risk    {cm[1,0]:4d}      {cm[1,1]:4d}")

# Calculate detailed metrics
tn, fp, fn, tp = cm.ravel()
precision = tp / (tp + fp) if (tp + fp) > 0 else 0
recall = tp / (tp + fn) if (tp + fn) > 0 else 0
specificity = tn / (tn + fp) if (tn + fp) > 0 else 0
f1 = 2 * (precision * recall) / (precision + recall) if (precision + recall) > 0 else 0

print(f"\n📌 Detailed Metrics for High Risk Detection:")
print(f"   Precision:   {precision*100:.1f}% (when model predicts HIGH, it's correct)")
print(f"   Recall:      {recall*100:.1f}% (model catches this % of actual high risk)")
print(f"   Specificity: {specificity*100:.1f}% (correctly identifies low risk)")
print(f"   F1-Score:    {f1:.3f} (harmonic mean of precision & recall)")

# Classification Report
print("\n" + "="*70)
print("📋 CLASSIFICATION REPORT")
print("="*70)
print("\n" + classification_report(
    y_test, y_pred,
    target_names=["Low Risk (0)", "High Risk (1)"],
    digits=3
))

# Feature Importance
print("="*70)
print("🔑 FEATURE IMPORTANCE ANALYSIS")
print("="*70)
print("\nWhat factors drive reliability risk?")

feature_importance = pd.DataFrame({
    'Feature': X.columns,
    'Importance': model.feature_importances_
}).sort_values('Importance', ascending=False)

print("\nRanked by influence:")
for idx, row in feature_importance.iterrows():
    bar_length = int(row['Importance'] * 50)
    bar = '█' * bar_length
    print(f"  {row['Feature']:20s} {row['Importance']:.3f} {bar}")

# Top 3 features
top_3 = feature_importance.head(3)['Feature'].tolist()
print(f"\n🏆 Top 3 Risk Drivers: {', '.join(top_3)}")

# Model characteristics
print("\n" + "="*70)
print("🔧 MODEL CHARACTERISTICS")
print("="*70)
print(f"   Algorithm:        Random Forest")
print(f"   Trees:            {model.n_estimators}")
print(f"   Max Depth:        {model.max_depth}")
print(f"   Features Used:    {X.shape[1]}")
print(f"   Training Samples: {len(X_train)}")

# Save model
print("\n" + "="*70)
print("💾 SAVING MODEL")
print("="*70)
joblib.dump(model, "trust_model.pkl")
print("✅ Model saved as: trust_model.pkl")

# Save feature names for future predictions
feature_info = {
    'feature_names': list(X.columns),
    'model_version': '1.0',
    'training_date': pd.Timestamp.now().strftime('%Y-%m-%d'),
    'n_samples': len(data),
    'accuracy': float(accuracy),
    'auc': float(auc)
}
joblib.dump(feature_info, "model_metadata.pkl")
print("✅ Metadata saved as: model_metadata.pkl")

# Final Summary
print("\n" + "="*70)
print("🔥 TRAINING COMPLETE - MODEL READY FOR DEPLOYMENT! 🔥")
print("="*70)

print(f"\n📊 Final Summary:")
print(f"   ✅ Model Accuracy:     {accuracy*100:.1f}%")
print(f"   ✅ AUC Score:          {auc:.3f}")
print(f"   ✅ High Risk Recall:   {recall*100:.1f}%")
print(f"   ✅ Model File:         trust_model.pkl")

print(f"\n💡 Next Steps:")
print(f"   1. Use model for real-time engineer risk scoring")
print(f"   2. Deploy as API endpoint in your backend")
print(f"   3. Monitor predictions vs actual outcomes")
print(f"   4. Retrain monthly with fresh data")

print(f"\n🚀 Ready to score engineer reliability like a credit score! 🚀\n")
