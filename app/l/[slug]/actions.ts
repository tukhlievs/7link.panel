"use server";

import { createAdminClient } from "@/lib/supabase/admin";

type Result = { url: string } | { error: string };

async function passDestination(slug: string): Promise<Result> {
  const admin = createAdminClient();
  // register_click атомарно инкрементит и возвращает destination, либо null если лимит/выключено
  const { data, error } = await admin.rpc("register_click", { p_slug: slug });
  if (error || !data) {
    return { error: "This link is no longer available." };
  }
  return { url: data as string };
}

export async function resolveTurnstile(
  slug: string,
  token: string,
): Promise<Result> {
  if (!token) return { error: "Please complete the verification." };

  const body = new URLSearchParams();
  body.append("secret", process.env.TURNSTILE_SECRET_KEY ?? "");
  body.append("response", token);

  const verify = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    { method: "POST", body },
  );
  const outcome = (await verify.json()) as { success: boolean };
  if (!outcome.success) {
    return { error: "Verification failed. Please try again." };
  }

  return passDestination(slug);
}

export async function resolvePassword(
  slug: string,
  password: string,
): Promise<Result> {
  const admin = createAdminClient();
  const { data } = await admin
    .from("links")
    .select("password, active")
    .eq("slug", slug)
    .maybeSingle();

  if (!data || !data.active) {
    return { error: "This link is no longer available." };
  }
  if ((data.password ?? "") !== password.trim()) {
    return { error: "Wrong password." };
  }

  return passDestination(slug);
}

export async function resolveConditions(slug: string): Promise<Result> {
  return passDestination(slug);
}
