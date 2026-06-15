"use client";

import { useState } from "react";
import { SpinnerGap, Check, Cloud } from "@phosphor-icons/react";
import { registerClick } from "@/lib/mock-store";
import type { LinkRow } from "@/lib/types";

export function TurnstileGate({ link }: { link: LinkRow }) {
  const [state, setState] = useState<"idle" | "checking" | "done" | "error">(
    "idle",
  );

  function verify() {
    if (state !== "idle") return;
    setState("checking");
    setTimeout(() => {
      const dest = registerClick(link.slug);
      if (dest) {
        setState("done");
        window.location.href = dest;
      } else {
        setState("error");
      }
    }, 900);
  }

  return (
    <div className="w-full">
      <button
        type="button"
        onClick={verify}
        className="flex w-full items-center gap-3 rounded-xl border border-border bg-background px-4 py-4 text-left transition-colors hover:border-primary/40"
      >
        <span
          className={`flex size-6 items-center justify-center rounded-md border ${
            state === "done"
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border text-transparent"
          }`}
        >
          {state === "checking" ? (
            <SpinnerGap size={14} className="animate-spin text-primary" />
          ) : (
            <Check size={13} weight="bold" />
          )}
        </span>
        <span className="flex-1 text-sm font-medium text-foreground">
          {state === "checking" || state === "done"
            ? "Verifying…"
            : "Verify you are human"}
        </span>
        <span className="flex items-center gap-1.5 text-muted-foreground">
          <Cloud size={16} weight="fill" />
          <span className="text-[11px]">Turnstile</span>
        </span>
      </button>
      {state === "error" && (
        <p className="mt-4 text-center text-sm text-destructive">
          This link is no longer available.
        </p>
      )}
    </div>
  );
}
