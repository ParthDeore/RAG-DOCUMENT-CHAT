from supabase import create_client, Client
from app.config import settings

# Uses the SERVICE ROLE key — this file is backend-only.
# Never expose the service key to the frontend/browser.
supabase: Client = create_client(
    settings.supabase_url,
    settings.supabase_service_key,
)
