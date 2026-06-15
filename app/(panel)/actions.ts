"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AUTH_STUB, panelContext } from "@/lib/panel-auth";
import { generateSlug, normalizeSlug } from "@/lib/slug";
import type { Condition, LinkType } from "@/lib/types";

function normalizeUrl(raw: string) {
  const v = raw.trim();
  if (!v) return "";
  if (/^https?:\/\//i.test(v)) return v;
  return `https://${v}`;
}

type CreateLinkInput = {
  type: LinkType;
  destinationUrl: string;
  title?: string;
  slug?: string;
  maxClicks?: number | null;
  conditions?: Condition[];
  password?: string;
};

export async function createLink(input: CreateLinkInput) {
  const { client, userId } = await panelContext();

  const destination = normalizeUrl(input.destinationUrl);
  if (!destination) return { error: "Destination URL is required." };

  if (input.type === "password" && !input.password?.trim()) {
    return { error: "Password is required for this link type." };
  }

  const conditions =
    input.type === "conditions"
      ? (input.conditions ?? [])
          .map((c) => ({ label: c.label.trim(), url: normalizeUrl(c.url) }))
          .filter((c) => c.url)
      : [];

  if (input.type === "conditions" && conditions.length === 0) {
    return { error: "Add at least one condition link." };
  }

  const base = {
    user_id: userId,
    title: input.title?.trim() || "",
    destination_url: destination,
    type: input.type,
    max_clicks:
      input.type === "turnstile" && input.maxClicks && input.maxClicks > 0
        ? Math.floor(input.maxClicks)
        : null,
    conditions,
    password: input.type === "password" ? (input.password ?? "").trim() : null,
  };

  const custom = input.slug ? normalizeSlug(input.slug) : "";
  let lastError = "";
  for (let attempt = 0; attempt < 4; attempt++) {
    const slug = custom || generateSlug();
    const { error } = await client.from("links").insert({ ...base, slug });
    if (!error) {
      revalidatePath("/");
      redirect("/");
    }
    lastError = error.message;
    if (custom) break;
    if (!/duplicate|unique/i.test(error.message)) break;
  }

  return { error: lastError || "Could not create the link." };
}

export async function deleteLink(id: string) {
  const { client, userId } = await panelContext();
  await client.from("links").delete().eq("id", id).eq("user_id", userId);
  revalidatePath("/");
}

export async function setActive(id: string, active: boolean) {
  const { client, userId } = await panelContext();
  await client
    .from("links")
    .update({ active })
    .eq("id", id)
    .eq("user_id", userId);
  revalidatePath("/");
}

export async function signOut() {
  if (AUTH_STUB) redirect("/");
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
