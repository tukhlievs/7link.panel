export type LinkType = "turnstile" | "conditions" | "password";

export type Condition = { label: string; url: string };

export type LinkRow = {
  id: string;
  user_id: string;
  slug: string;
  title: string;
  destination_url: string;
  type: LinkType;
  max_clicks: number | null;
  click_count: number;
  conditions: Condition[];
  password: string | null;
  active: boolean;
  created_at: string;
};

export const TYPE_META: Record<
  LinkType,
  { label: string; short: string; description: string }
> = {
  turnstile: {
    label: "Turnstile protection",
    short: "Turnstile",
    description:
      "Cloudflare Turnstile check with an optional cap on how many people may pass.",
  },
  conditions: {
    label: "Conditional redirect",
    short: "Conditions",
    description:
      "Visitor opens every required link, waits a few seconds, then is redirected.",
  },
  password: {
    label: "Password redirect",
    short: "Password",
    description: "Only visitors who enter the correct password get through.",
  },
};
