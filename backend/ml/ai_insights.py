import os
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

class TrustInsightsAI:
    def __init__(self):
        self.client = Groq(api_key=os.getenv("GROQ_API_KEY"))
        self.model = "llama-3.3-70b-versatile"
    
    def generate_personalized_insights(self, prediction_data: dict, features: dict) -> str:
        """Generate personalized AI insights using Groq"""
        
        risk_level = prediction_data.get("risk_level", "Unknown")
        risk_probability = prediction_data.get("risk_probability", 0)
        confidence = prediction_data.get("confidence", 0)
        risk_factors = prediction_data.get("feature_analysis", {}).get("risk_factors", [])
        positive_factors = prediction_data.get("feature_analysis", {}).get("positive_factors", [])
        
        # Detailed analysis for better AI understanding
        delivery_status = "consistently early" if features['delay_days'] < 0 else ("on-time" if features['delay_days'] == 0 else f"{features['delay_days']:.1f} days late on average")
        rating_status = "excellent (4.5+)" if features['rating'] >= 4.5 else ("good (4.0-4.5)" if features['rating'] >= 4.0 else "needs improvement")
        
        # Build context
        if "High" in risk_level:
            context = f"""You are an expert career coach for freelance engineers. Analyze this engineer's profile and provide SPECIFIC, ACTIONABLE advice to improve their reliability.

CURRENT SITUATION (High Risk):
- Delivery: {delivery_status}
- Client Rating: {features['rating']:.1f}/5.0 ({rating_status})
- Past Disputes: {features['disputes']}
- Repeat Clients: {"Yes" if features['repeat_client'] == 1 else "No"}
- Team Projects: {features['collab_count']}
- Income Pattern: {"Unstable - varies significantly" if features['income_volatility'] > 0.5 else ("Somewhat variable" if features['income_volatility'] > 0.2 else "Stable")}

IDENTIFIED ISSUES:
{chr(10).join(f"- {factor}" for factor in risk_factors) if risk_factors else "- General reliability concerns"}

TASK: Give 4 specific actions to IMMEDIATELY improve reliability and reduce risk:
1. Address their biggest weakness first
2. Quick wins they can implement this week
3. Long-term habit changes
4. Mindset or process improvements

Rules:
- Be brutally honest but constructive
- Each tip must be 20-30 words max
- Start with an action emoji
- Reference their actual numbers
- No generic advice - be SPECIFIC to their situation

Format: Just list 1-4, no extra text."""
        else:
            context = f"""You are an elite career strategist for top freelance engineers. This engineer is already LOW RISK and reliable. Help them become EXCEPTIONAL.

CURRENT STRENGTHS (Low Risk):
- Delivery: {delivery_status}
- Client Rating: {features['rating']:.1f}/5.0 ({rating_status})
- Past Disputes: {features['disputes']}
- Repeat Clients: {"Yes ✓" if features['repeat_client'] == 1 else "Not yet"}
- Team Projects: {features['collab_count']}
- Income Pattern: {"Unstable - varies significantly" if features['income_volatility'] > 0.5 else ("Somewhat variable" if features['income_volatility'] > 0.2 else "Very stable")}

WHAT'S WORKING:
{chr(10).join(f"- {factor}" for factor in positive_factors) if positive_factors else "- Strong overall performance"}

AREAS TO OPTIMIZE:
{chr(10).join(f"- {factor}" for factor in risk_factors) if risk_factors else "- Minor optimization opportunities"}

TASK: Give 4 advanced strategies to go from GOOD to WORLD-CLASS:
1. Leverage their strengths for premium positioning
2. Scale their success (systemize what works)
3. Build authority and reputation
4. Address any remaining weak spots

Rules:
- Think like a top 1% performer - ambitious goals
- Each tip must be 20-30 words max
- Start with a growth emoji
- Reference their actual numbers
- Push them to the next level - be aspirational

Format: Just list 1-4, no extra text."""

        try:
            print(f"🤖 Calling Groq AI for {risk_level} profile...")
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {
                        "role": "system",
                        "content": "You are a world-class career advisor. Be specific, actionable, and reference the engineer's actual metrics. Avoid generic advice."
                    },
                    {
                        "role": "user",
                        "content": context
                    }
                ],
                temperature=0.8,
                max_tokens=400
            )
            
            result = response.choices[0].message.content.strip()
            print(f"✅ Groq AI response received ({len(result)} chars)")
            return result
        
        except Exception as e:
            print(f"❌ Groq AI insights error: {e}")
            print(f"   Using fallback recommendations")
            # Fallback to basic recommendations
            return self._fallback_recommendations(risk_level, features)
    
    def _fallback_recommendations(self, risk_level: str, features: dict) -> str:
        """Fallback recommendations if Groq fails - personalized based on actual data"""
        
        # Analyze the actual features
        has_delays = features['delay_days'] > 1
        low_rating = features['rating'] < 4.0
        has_disputes = features['disputes'] > 0
        no_repeats = features['repeat_client'] == 0
        low_collabs = features['collab_count'] < 3
        high_volatility = features['income_volatility'] > 0.4
        
        if "High" in risk_level:
            tips = []
            
            # Prioritize based on actual issues
            if has_delays:
                tips.append(f"⏰ 1. Set delivery buffers - you're averaging {features['delay_days']:.1f} days late. Add 20% time to estimates.")
            elif low_rating:
                tips.append(f"⭐ 1. Boost rating from {features['rating']:.1f} - underpromise and overdeliver, request feedback mid-project.")
            else:
                tips.append("🎯 1. Improve delivery consistency - set realistic deadlines and communicate proactively if delays occur.")
            
            if has_disputes:
                tips.append(f"⚖️ 2. Prevent conflicts - {features['disputes']} past dispute(s) hurts trust. Document agreements and check in weekly.")
            elif no_repeats:
                tips.append("🔁 2. Build repeat business - follow up 2 weeks after delivery, offer maintenance packages.")
            else:
                tips.append("📊 2. Document your process - create templates and checklists to ensure consistent quality.")
            
            if low_collabs:
                tips.append(f"🤝 3. Join team projects - only {features['collab_count']} so far. Collaborations build credibility and skills.")
            elif high_volatility:
                tips.append(f"💰 3. Stabilize income - volatility is {features['income_volatility']:.2f}. Get retainer clients or recurring work.")
            else:
                tips.append("💼 3. Build your reputation - gather testimonials and case studies from satisfied clients.")
            
            tips.append("📈 4. Track metrics weekly - monitor delivery time, client satisfaction, and income to spot issues early.")
            
            return "\n".join(tips)
        
        else:  # Low Risk - Going from good to great
            tips = []
            
            # Leverage their strengths
            if features['rating'] >= 4.5:
                tips.append(f"🚀 1. Monetize your {features['rating']:.1f} rating - charge 30-50% premium and target high-value clients.")
            else:
                tips.append(f"⭐ 1. Push to 4.8+ rating (currently {features['rating']:.1f}) - implement a 'delight factor' in every delivery.")
            
            if features['delay_days'] < 0:
                tips.append(f"⚡ 2. Your early delivery ({abs(features['delay_days']):.1f} days avg) is a competitive advantage - market it!")
            elif features['delay_days'] <= 1:
                tips.append("⏱️ 2. Aim for consistent early delivery - it differentiates you in a crowded market.")
            else:
                tips.append(f"⏰ 2. Tighten delivery from {features['delay_days']:.1f} days late to early - sets you apart from competitors.")
            
            if features['collab_count'] >= 5:
                tips.append(f"🌐 3. With {features['collab_count']} collabs, start a team or agency - scale your expertise.")
            elif no_repeats:
                tips.append("🔁 3. Convert to repeat clients - create a VIP program or retainer offering for 2-3x revenue.")
            else:
                tips.append("👥 3. Build strategic partnerships - collaborate with top talent to access higher-tier projects.")
            
            if high_volatility:
                tips.append(f"💎 4. Smooth income volatility ({features['income_volatility']:.2f}) - secure 2-3 recurring revenue streams.")
            else:
                tips.append("📚 4. Document and teach your system - create courses or content to build authority and passive income.")
            
            return "\n".join(tips)

# Global instance
trust_insights_ai = TrustInsightsAI()
