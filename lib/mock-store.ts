"use client";

import type { Condition, LinkRow, LinkType } from "@/lib/types";

const KEY = "sevenlink_mock_links";

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

const SEED: LinkRow[] = [
  {
    id: "seed-1",
    user_id: "demo",
    slug: "launch",
    title: "Product launch",
    destination_url: "https://www.producthunt.com",
    type: "turnstile",
    max_clicks: null,
    click_count: 1280,
    conditions: [],
    password: null,
    active: true,
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: "seed-2",
    user_id: "demo",
    slug: "vip",
    title: "VIP access",
    destination_url: "https://t.me/yourchannel",
    type: "password",
    max_clicks: null,
    click_count: 342,
    conditions: [],
    password: "letmein",
    active: true,
    created_at: new Date(Date.now() - 86400000 * 6).toISOString(),
  },
  {
    id: "seed-3",
    user_id: "demo",
    slug: "promo",
    title: "Spring promo",
    destination_url: "https://shop.example.com/sale",
    type: "conditions",
    max_clicks: 500,
    click_count: 87,
    conditions: [
      { label: "Follow on X", url: "https://x.com" },
      { label: "Subscribe", url: "https://youtube.com" },
    ],
    password: null,
    active: true,
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
];

function read(): LinkRow[] {
  if (typeof window === "undefined") return SEED;
  const raw = window.localStorage.getItem(KEY);
  if (!raw) {
    window.localStorage.setItem(KEY, JSON.stringify(SEED));
    return SEED;
  }
  try {
    return JSON.parse(raw) as LinkRow[];
  } catch {
    return SEED;
  }
}

function write(links: LinkRow[]) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(KEY, JSON.stringify(links));
  }
}

export function getLinks(): LinkRow[] {
  return read();
}

export function getLinkBySlug(slug: string): LinkRow | undefined {
  return read().find((l) => l.slug === slug);
}

export function createLink(input: {
  type: LinkType;
  destinationUrl: string;
  title?: string;
  slug?: string;
  maxClicks?: number | null;
  conditions?: Condition[];
  password?: string;
}): LinkRow {
  const links = read();
  const normalize = (v: string) =>
    /^https?:\/\//i.test(v.trim()) ? v.trim() : `https://${v.trim()}`;

  const row: LinkRow = {
    id: uid(),
    user_id: "demo",
    slug: input.slug?.trim() || uid(),
    title: input.title?.trim() || "",
    destination_url: normalize(input.destinationUrl),
    type: input.type,
    max_clicks:
      input.type === "turnstile" && input.maxClicks && input.maxClicks > 0
        ? Math.floor(input.maxClicks)
        : null,
    click_count: 0,
    conditions:
      input.type === "conditions"
        ? (input.conditions ?? [])
            .map((c) => ({ label: c.label.trim(), url: normalize(c.url) }))
            .filter((c) => c.url)
        : [],
    password: input.type === "password" ? (input.password ?? "").trim() : null,
    active: true,
    created_at: new Date().toISOString(),
  };
  write([row, ...links]);
  return row;
}

export function deleteLink(id: string) {
  write(read().filter((l) => l.id !== id));
}

export function setActive(id: string, active: boolean) {
  write(read().map((l) => (l.id === id ? { ...l, active } : l)));
}

export function registerClick(slug: string): string | null {
  const links = read();
  const link = links.find((l) => l.slug === slug);
  if (!link || !link.active) return null;
  if (link.max_clicks !== null && link.click_count >= link.max_clicks) {
    return null;
  }
  write(
    links.map((l) =>
      l.id === link.id ? { ...l, click_count: l.click_count + 1 } : l,
    ),
  );
  return link.destination_url;
}
