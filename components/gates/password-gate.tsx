"use client";

import { useState } from "react";
import { SpinnerGap, ArrowRight } from "@phosphor-icons/react";
import { registerClick } from "@/lib/mock-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { LinkRow } from "@/lib/types";

export function PasswordGate({ link }: { link: LinkRow }) {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (password.trim() !== (link.password ?? "")) {
      setError("Wrong password.");
      return;
    }
    setLoading(true);
    const dest = registerClick(link.slug);
    if (dest) window.location.href = dest;
    else {
      setError("This link is no longer available.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="w-full space-y-3">
      <Input
        type="password"
        required
        autoFocus
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter password"
        className="h-12 rounded-xl text-center"
      />
      {error && <p className="text-center text-sm text-destructive">{error}</p>}
      <Button
        type="submit"
        disabled={loading}
        className="h-12 w-full gap-2 rounded-xl text-[0.95rem] shadow-blue-btn"
      >
        {loading ? (
          <SpinnerGap size={18} className="animate-spin" />
        ) : (
          <>
            Continue
            <ArrowRight size={17} weight="bold" />
          </>
        )}
      </Button>
    </form>
  );
}
