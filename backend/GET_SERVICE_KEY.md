# 🔐 Get Your Supabase Service Role Key

The backend needs a **service role key** to bypass Row-Level Security (RLS) and create transactions.

## Steps to Get Your Service Role Key

### 1. Go to Supabase Dashboard
Visit: https://supabase.com/dashboard

### 2. Select Your Project
Click on your project: **imjbnlcxmkwnsrpfwvtm**

### 3. Navigate to API Settings
- Click **Settings** (⚙️ icon) in the left sidebar
- Click **API**

### 4. Copy the Service Role Key
Look for the section labeled **Project API keys**

You'll see two keys:
- ✅ **anon public** - Already added (safe for client-side)
- 🔐 **service_role** - **Copy this one!** (secret, server-side only)

**⚠️ WARNING: Never expose service_role key in client-side code!**

### 5. Add to Backend .env File
Open `backend/.env` and replace the placeholder:

```env
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...your-actual-service-role-key...
```

### 6. Restart Backend Server
Stop the backend (Ctrl+C) and start it again:
```bash
cd backend
python main.py
```

You should see:
```
🔐 Supabase connected with SERVICE_ROLE key
```

## Alternative: Disable RLS (Not Recommended)

If you want to keep using the anon key for testing, you can temporarily disable RLS:

### In Supabase SQL Editor, run:
```sql
-- Disable RLS for transactions table (DEVELOPMENT ONLY!)
ALTER TABLE transactions DISABLE ROW LEVEL SECURITY;
```

**⚠️ This makes ALL transactions publicly accessible!**
**Only use this for local development/testing**

To re-enable RLS later:
```sql
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
```

---

## What's the Difference?

| Key Type | Usage | Bypasses RLS | Security |
|----------|-------|--------------|----------|
| **anon** | Client-side (browser) | ❌ No | ✅ Safe to expose |
| **service_role** | Server-side only | ✅ Yes | ⚠️ Keep secret! |

The backend acts as a trusted server, so it needs the service_role key to manage data on behalf of users.
