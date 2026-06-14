"use client";

import { useState } from "react";
import { SpinnerGap, ArrowRight } from "@phosphor-icons/react";
import { resolvePassword } from "@/app/l/[slug]/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function PasswordGate({ slug }: { slug: string }) {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await resolvePassword(slug, password);
    if ("url" in res) {
      window.location.href = res.url;
    } else {
      setError(res.error);
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
