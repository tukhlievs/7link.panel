"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { House, Plus, SignOut, CaretRight } from "@phosphor-icons/react";

const DEMO = { name: "Demo", email: "demo@7link.click" };

const MENU = [
  { href: "/", label: "Your links", icon: House },
  { href: "/create", label: "Create link", icon: Plus },
];

const MARKETING_URL = process.env.NEXT_PUBLIC_MARKETING_URL ?? "";
const LEGAL = [
  { href: `${MARKETING_URL}/terms`, label: "Terms" },
  { href: `${MARKETING_URL}/privacy`, label: "Privacy" },
  { href: `${MARKETING_URL}/privacy`, label: "Cookies" },
];

export default function AccountPage() {
  const router = useRouter();
  const initial = DEMO.name.charAt(0).toUpperCase();

  return (
    <div className="mx-auto max-w-md">
      <div className="flex flex-col items-center text-center">
        <span className="flex size-20 items-center justify-center rounded-full border border-border bg-muted text-2xl font-semibold text-foreground">
          {initial}
        </span>
        <h1 className="mt-4 text-xl font-semibold tracking-tight text-foreground">
          {DEMO.name}
        </h1>
        <p className="mt-0.5 text-sm text-muted-foreground">{DEMO.email}</p>
      </div>

      <div className="card-designer mt-8 overflow-hidden rounded-2xl p-0">
        {MENU.map(({ href, label, icon: Icon }, i) => (
          <Link
            key={href + label}
            href={href}
            className={`flex items-center gap-3 px-5 py-4 transition-colors hover:bg-muted/60 ${
              i !== 0 ? "border-t border-border" : ""
            }`}
          >
            <Icon size={20} weight="duotone" className="text-muted-foreground" />
            <span className="flex-1 text-[0.95rem] font-medium text-foreground">
              {label}
            </span>
            <CaretRight size={18} className="text-muted-foreground" />
          </Link>
        ))}
      </div>

      <button
        type="button"
        onClick={() => router.push("/")}
        className="card-designer mt-4 flex w-full items-center gap-3 rounded-2xl px-5 py-4 text-left transition-colors hover:bg-destructive/5"
      >
        <SignOut size={20} weight="duotone" className="text-destructive" />
        <span className="flex-1 text-[0.95rem] font-medium text-destructive">
          Sign out
        </span>
      </button>

      <div className="mt-10 flex items-center justify-center gap-4 text-xs text-muted-foreground">
        {LEGAL.map((l) => (
          <a
            key={l.label}
            href={l.href}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground"
          >
            {l.label}
          </a>
        ))}
      </div>
    </div>
  );
}
