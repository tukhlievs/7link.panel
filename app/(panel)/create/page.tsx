"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  ListChecks,
  Lock,
  Plus,
  Trash,
  ArrowLeft,
  CaretRight,
  SpinnerGap,
} from "@phosphor-icons/react";
import { createLink } from "@/lib/mock-store";
import { TYPE_META, type Condition, type LinkType } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const CATEGORIES: { type: LinkType; icon: typeof ShieldCheck }[] = [
  { type: "turnstile", icon: ShieldCheck },
  { type: "conditions", icon: ListChecks },
  { type: "password", icon: Lock },
];

export default function CreatePage() {
  const router = useRouter();
  const [type, setType] = useState<LinkType | null>(null);
  const [destination, setDestination] = useState("");
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [maxClicks, setMaxClicks] = useState("");
  const [password, setPassword] = useState("");
  const [conditions, setConditions] = useState<Condition[]>([
    { label: "", url: "" },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!type) return;
    setError(null);

    if (!destination.trim()) {
      setError("Destination URL is required.");
      return;
    }
    if (type === "password" && !password.trim()) {
      setError("Password is required for this link type.");
      return;
    }
    if (
      type === "conditions" &&
      conditions.filter((c) => c.url.trim()).length === 0
    ) {
      setError("Add at least one condition link.");
      return;
    }

    setLoading(true);
    createLink({
      type,
      destinationUrl: destination,
      title,
      slug: slug || undefined,
      maxClicks: maxClicks ? Number(maxClicks) : null,
      conditions,
      password,
    });
    router.push("/");
  }

  if (!type) {
    return (
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft size={16} weight="bold" />
          Back
        </Link>
        <h1 className="mt-4 text-2xl font-semibold tracking-tight text-foreground">
          Create a link
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Choose how visitors get through to your destination.
        </p>

        <div className="mt-6 space-y-3">
          {CATEGORIES.map(({ type: t, icon: Icon }) => (
            <button
              key={t}
              type="button"
              onClick={() => setType(t)}
              className="card-designer flex w-full items-center gap-4 rounded-2xl p-5 text-left"
            >
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon size={22} weight="duotone" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-semibold tracking-tight text-foreground">
                  {TYPE_META[t].label}
                </span>
                <span className="mt-0.5 block text-sm text-muted-foreground">
                  {TYPE_META[t].description}
                </span>
              </span>
              <CaretRight size={18} className="shrink-0 text-muted-foreground" />
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => setType(null)}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft size={16} weight="bold" />
        Categories
      </button>
      <h1 className="mt-4 text-2xl font-semibold tracking-tight text-foreground">
        {TYPE_META[type].label}
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        {TYPE_META[type].description}
      </p>

      <form onSubmit={submit} className="card-designer mt-6 space-y-5 rounded-2xl p-6">
        <div className="space-y-1.5">
          <Label htmlFor="destination">Destination URL</Label>
          <Input
            id="destination"
            required
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="yoursite.com/page"
            className="h-11 rounded-xl"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="title">Title (optional)</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Spring campaign"
            className="h-11 rounded-xl"
          />
        </div>

        {type === "turnstile" && (
          <div className="space-y-1.5">
            <Label htmlFor="maxClicks">Max visitors (leave blank = unlimited)</Label>
            <Input
              id="maxClicks"
              type="number"
              min={1}
              value={maxClicks}
              onChange={(e) => setMaxClicks(e.target.value)}
              placeholder="Unlimited"
              className="h-11 rounded-xl"
            />
            <p className="text-xs text-muted-foreground">
              Once the cap is reached the link stops letting people through.
            </p>
          </div>
        )}

        {type === "password" && (
          <div className="space-y-1.5">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Set a password"
              className="h-11 rounded-xl"
            />
          </div>
        )}

        {type === "conditions" && (
          <div className="space-y-2.5">
            <Label>Required links</Label>
            <p className="-mt-1 text-xs text-muted-foreground">
              The visitor must open each of these, then wait 3 seconds before the
              redirect unlocks.
            </p>
            {conditions.map((c, i) => (
              <div key={i} className="flex items-center gap-2">
                <Input
                  value={c.label}
                  onChange={(e) => {
                    const next = [...conditions];
                    next[i] = { ...next[i], label: e.target.value };
                    setConditions(next);
                  }}
                  placeholder="Label"
                  className="h-11 w-28 shrink-0 rounded-xl"
                />
                <Input
                  value={c.url}
                  onChange={(e) => {
                    const next = [...conditions];
                    next[i] = { ...next[i], url: e.target.value };
                    setConditions(next);
                  }}
                  placeholder="https://service.com/subscribe"
                  className="h-11 flex-1 rounded-xl"
                />
                {conditions.length > 1 && (
                  <button
                    type="button"
                    onClick={() =>
                      setConditions(conditions.filter((_, j) => j !== i))
                    }
                    className="flex size-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-destructive"
                  >
                    <Trash size={16} />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => setConditions([...conditions, { label: "", url: "" }])}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
            >
              <Plus size={14} weight="bold" />
              Add link
            </button>
          </div>
        )}

        <div className="space-y-1.5">
          <Label htmlFor="slug">Custom slug (optional)</Label>
          <Input
            id="slug"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="auto-generated"
            className="h-11 rounded-xl font-mono"
          />
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <Button
          type="submit"
          disabled={loading}
          className="h-11 w-full gap-2 rounded-xl text-[0.95rem] shadow-blue-btn"
        >
          {loading && <SpinnerGap size={18} className="animate-spin" />}
          Create link
        </Button>
      </form>
    </div>
  );
}
