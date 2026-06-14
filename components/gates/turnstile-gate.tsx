"use client";

import { useEffect, useRef, useState } from "react";
import { SpinnerGap, ShieldCheck } from "@phosphor-icons/react";
import { resolveTurnstile } from "@/app/l/[slug]/actions";

type TurnstileApi = {
  render: (
    el: HTMLElement,
    opts: { sitekey: string; callback: (token: string) => void },
  ) => string;
  reset: (id?: string) => void;
  remove: (id?: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

export function TurnstileGate({
  slug,
  siteKey,
}: {
  slug: string;
  siteKey: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<"idle" | "verifying" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let widgetId: string | undefined;

    function render() {
      if (!window.turnstile || !ref.current) return;
      widgetId = window.turnstile.render(ref.current, {
        sitekey: siteKey,
        callback: async (token: string) => {
          setStatus("verifying");
          setError(null);
          const res = await resolveTurnstile(slug, token);
          if ("url" in res) {
            window.location.href = res.url;
          } else {
            setError(res.error);
            setStatus("error");
            window.turnstile?.reset(widgetId);
          }
        },
      });
    }

    if (window.turnstile) {
      render();
    } else {
      const s = document.createElement("script");
      s.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
      s.async = true;
      s.defer = true;
      s.onload = render;
      document.head.appendChild(s);
    }

    return () => {
      if (widgetId && window.turnstile) window.turnstile.remove(widgetId);
    };
  }, [slug, siteKey]);

  return (
    <div className="flex flex-col items-center">
      <div ref={ref} className="min-h-[65px]" />
      {status === "verifying" && (
        <p className="mt-4 inline-flex items-center gap-2 text-sm text-muted-foreground">
          <SpinnerGap size={16} className="animate-spin" />
          Verifying and redirecting…
        </p>
      )}
      {status === "idle" && (
        <p className="mt-4 inline-flex items-center gap-2 text-sm text-muted-foreground">
          <ShieldCheck size={16} weight="fill" className="text-primary" />
          Complete the check to continue
        </p>
      )}
      {error && <p className="mt-4 text-sm text-destructive">{error}</p>}
    </div>
  );
}
