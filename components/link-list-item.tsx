"use client";

import { useState, useTransition } from "react";
import {
  Copy,
  Check,
  Trash,
  ShieldCheck,
  ListChecks,
  Lock,
  Pause,
  Play,
  ArrowSquareOut,
} from "@phosphor-icons/react";
import { deleteLink, setActive } from "@/app/(panel)/actions";
import type { LinkRow, LinkType } from "@/lib/types";

const TYPE_ICON: Record<LinkType, typeof ShieldCheck> = {
  turnstile: ShieldCheck,
  conditions: ListChecks,
  password: Lock,
};

const TYPE_LABEL: Record<LinkType, string> = {
  turnstile: "Turnstile",
  conditions: "Conditions",
  password: "Password",
};

export function LinkListItem({ link }: { link: LinkRow }) {
  const [copied, setCopied] = useState(false);
  const [pending, startTransition] = useTransition();
  const TypeIcon = TYPE_ICON[link.type];

  const base =
    process.env.NEXT_PUBLIC_LINK_BASE_URL ||
    (typeof window !== "undefined" ? window.location.origin : "");
  const shortUrl = `${base}/l/${link.slug}`;

  async function copy() {
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // буфер обмена недоступен — игнорируем
    }
  }

  return (
    <div
      className={`card-designer rounded-2xl p-4 sm:p-5 ${
        link.active ? "" : "opacity-60"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2 py-0.5 text-[11px] font-medium text-secondary-foreground">
              <TypeIcon size={12} weight="fill" />
              {TYPE_LABEL[link.type]}
            </span>
            {!link.active && (
              <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                Paused
              </span>
            )}
          </div>
          <p className="mt-2 truncate font-mono text-sm font-medium text-foreground">
            /l/{link.slug}
          </p>
          <a
            href={link.destination_url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-0.5 inline-flex max-w-full items-center gap-1 truncate text-xs text-muted-foreground hover:text-primary"
          >
            <span className="truncate">{link.destination_url}</span>
            <ArrowSquareOut size={12} className="shrink-0" />
          </a>
        </div>

        <div className="shrink-0 text-right">
          <p className="font-mono text-lg font-semibold tracking-tight text-foreground">
            {link.click_count.toLocaleString("en-US")}
          </p>
          <p className="text-[11px] text-muted-foreground">
            {link.max_clicks ? `of ${link.max_clicks.toLocaleString("en-US")}` : "clicks"}
          </p>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2 border-t border-border pt-3">
        <button
          type="button"
          onClick={copy}
          className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted"
        >
          {copied ? (
            <Check size={14} weight="bold" className="text-primary" />
          ) : (
            <Copy size={14} weight="bold" />
          )}
          {copied ? "Copied" : "Copy link"}
        </button>

        <button
          type="button"
          disabled={pending}
          onClick={() => startTransition(() => setActive(link.id, !link.active))}
          className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          {link.active ? <Pause size={14} weight="fill" /> : <Play size={14} weight="fill" />}
          {link.active ? "Pause" : "Resume"}
        </button>

        <button
          type="button"
          disabled={pending}
          onClick={() => {
            if (confirm("Delete this link? This cannot be undone.")) {
              startTransition(() => deleteLink(link.id));
            }
          }}
          className="ml-auto inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-destructive transition-colors hover:bg-destructive/10"
        >
          <Trash size={14} weight="bold" />
          Delete
        </button>
      </div>
    </div>
  );
}
