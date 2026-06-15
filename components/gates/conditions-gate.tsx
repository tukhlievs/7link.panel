"use client";

import { useEffect, useState } from "react";
import { Check, ArrowSquareOut, SpinnerGap } from "@phosphor-icons/react";
import { resolveConditions } from "@/app/l/[slug]/actions";
import type { Condition } from "@/lib/types";

export function ConditionsGate({
  slug,
  conditions,
}: {
  slug: string;
  conditions: Condition[];
}) {
  const [done, setDone] = useState<boolean[]>(() => conditions.map(() => false));
  const [seconds, setSeconds] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const allDone = done.length > 0 && done.every(Boolean);

  function open(i: number) {
    window.open(conditions[i].url, "_blank", "noopener,noreferrer");
    setDone((prev) => prev.map((v, j) => (j === i ? true : v)));
  }

  // Когда все ссылки открыты — запускаем обратный отсчёт 3 секунды
  useEffect(() => {
    if (allDone && seconds === null) setSeconds(3);
  }, [allDone, seconds]);

  useEffect(() => {
    if (seconds === null) return;
    if (seconds <= 0) {
      setLoading(true);
      resolveConditions(slug).then((res) => {
        if ("url" in res) window.location.href = res.url;
        else {
          setError(res.error);
          setLoading(false);
        }
      });
      return;
    }
    const t = setTimeout(() => setSeconds((s) => (s ?? 1) - 1), 1000);
    return () => clearTimeout(t);
  }, [seconds, slug]);

  return (
    <div className="w-full">
      <div className="space-y-2.5">
        {conditions.map((c, i) => (
          <button
            key={i}
            type="button"
            onClick={() => open(i)}
            className="flex w-full items-center gap-3 rounded-xl border border-border bg-background px-4 py-3.5 text-left transition-colors hover:border-primary/40"
          >
            <span
              className={`flex size-6 shrink-0 items-center justify-center rounded-full border ${
                done[i]
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border text-transparent"
              }`}
            >
              <Check size={13} weight="bold" />
            </span>
            <span className="flex-1 truncate text-sm font-medium text-foreground">
              {c.label || c.url}
            </span>
            <ArrowSquareOut size={16} className="shrink-0 text-muted-foreground" />
          </button>
        ))}
      </div>

      <div className="mt-5 text-center text-sm">
        {!allDone && (
          <p className="text-muted-foreground">Open every link to continue.</p>
        )}
        {allDone && seconds !== null && seconds > 0 && (
          <p className="text-muted-foreground">
            Redirecting in {seconds}s…
          </p>
        )}
        {(loading || (allDone && seconds === 0)) && (
          <p className="inline-flex items-center gap-2 text-muted-foreground">
            <SpinnerGap size={16} className="animate-spin" />
            Redirecting…
          </p>
        )}
        {error && <p className="text-destructive">{error}</p>}
      </div>
    </div>
  );
}
