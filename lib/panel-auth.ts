import { redirect } from "next/navigation";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

// Режим заглушки авторизации: вход не требуется, действуем как демо-пользователь.
// Включается флагом NEXT_PUBLIC_AUTH_STUB=true. По умолчанию — реальный вход.
export const AUTH_STUB = process.env.NEXT_PUBLIC_AUTH_STUB === "true";

const DEMO_USER_ID =
  process.env.DEMO_USER_ID || "00000000-0000-0000-0000-000000000001";

export type PanelUser = {
  id: string;
  email: string;
  name: string;
  avatar?: string;
};

const DEMO_USER: PanelUser = {
  id: DEMO_USER_ID,
  email: "demo@7link.click",
  name: "Demo",
};

export async function requireUser(): Promise<PanelUser> {
  if (AUTH_STUB) return DEMO_USER;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return {
    id: user.id,
    email: user.email ?? "",
    name: (user.user_metadata?.full_name as string | undefined) ?? user.email ?? "",
    avatar: user.user_metadata?.avatar_url as string | undefined,
  };
}

// Контекст для работы со ссылками: клиент + id пользователя.
// В режиме заглушки используем service role (обходит RLS) и демо-id.
export async function panelContext(): Promise<{
  client: SupabaseClient;
  userId: string;
  user: PanelUser;
}> {
  const user = await requireUser();
  const client = AUTH_STUB ? createAdminClient() : await createClient();
  return { client, userId: user.id, user };
}
