import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

class SupabaseDB:
    """Singleton Supabase client for database operations"""
    _instance = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(SupabaseDB, cls).__new__(cls)
            url: str = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
            
            # Try to use service role key first (for backend operations that bypass RLS)
            # If not available, fall back to anon key
            key: str = os.environ.get("SUPABASE_SERVICE_ROLE_KEY") or os.environ.get("NEXT_PUBLIC_SUPABASE_ANON_KEY")
            
            if not url or not key:
                raise ValueError("Supabase credentials not found in environment variables")
            
            # Log which key type is being used
            key_type = "SERVICE_ROLE" if os.environ.get("SUPABASE_SERVICE_ROLE_KEY") else "ANON"
            print(f"🔐 Supabase connected with {key_type} key")
            
            cls._instance.client: Client = create_client(url, key) # type: ignore
        return cls._instance
    
    def get_client(self) -> Client:
        return self.client

# Singleton instance - import this in your services
db = SupabaseDB().get_client()
