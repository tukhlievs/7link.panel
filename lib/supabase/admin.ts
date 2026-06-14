import { createClient } from "@supabase/supabase-js";

// Серверный клиент с service role — только для роутов редиректа.
// Никогда не импортировать в клиентские компоненты.
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}
