"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  ShieldCheck,
  ListChecks,
  Lock,
  Warning,
  SpinnerGap,
} from "@phosphor-icons/react";
import { Logo } from "@/components/logo";
import { TurnstileGate } from "@/components/gates/turnstile-gate";
import { ConditionsGate } from "@/components/gates/conditions-gate";
import { PasswordGate } from "@/components/gates/password-gate";
import { getLinkBySlug } from "@/lib/mock-store";
import type { LinkRow, LinkType } from "@/lib/types";

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="mesh-light flex min-h-dvh items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="card-designer rounded-3xl p-7 sm:p-9">{children}</div>
        <p className="mt-5 flex items-center justify-center gap-1.5 text-center text-xs text-muted-foreground">
          <Logo className="text-primary [&_svg]:size-3.5" />
          Protected by 7Link
        </p>
      </div>
    </main>
  );
}

function Notice({ title, text }: { title: string; text: string }) {
  return (
    <div className="flex flex-col items-center text-center">
      <span className="flex size-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
        <Warning size={26} weight="duotone" />
      </span>
      <h1 className="mt-4 text-lg font-semibold tracking-tight text-foreground">
        {title}
      </h1>
      <p className="mt-1.5 text-sm text-muted-foreground">{text}</p>
    </div>
  );
}

const HEADINGS: Record<
  LinkType,
  { icon: React.ReactNode; title: string; text: string }
> = {
  turnstile: {
    icon: <ShieldCheck size={26} weight="duotone" />,
    title: "Quick security check",
    text: "Confirm you're human to continue to your destination.",
  },
  conditions: {
    icon: <ListChecks size={26} weight="duotone" />,
    title: "Almost there",
    text: "Open the links below to unlock your destination.",
  },
  password: {
    icon: <Lock size={26} weight="duotone" />,
    title: "Password required",
    text: "Enter the password to continue.",
  },
};

export default function RedirectPage() {
  const params = useParams();
  const slug = String(params.slug ?? "");
  const [link, setLink] = useState<LinkRow | null | undefined>(undefined);

  useEffect(() => {
    setLink(getLinkBySlug(slug) ?? null);
  }, [slug]);

  if (link === undefined) {
    return (
      <Shell>
        <div className="flex items-center justify-center py-6 text-muted-foreground">
          <SpinnerGap size={22} className="animate-spin" />
        </div>
      </Shell>
    );
  }

  if (!link || !link.active) {
    return (
      <Shell>
        <Notice
          title="Link not available"
          text="This link doesn't exist or has been paused by its owner."
        />
      </Shell>
    );
  }

  if (link.max_clicks !== null && link.click_count >= link.max_clicks) {
    return (
      <Shell>
        <Notice
          title="This link is closed"
          text="It has reached the maximum number of visitors."
        />
      </Shell>
    );
  }

  const head = HEADINGS[link.type];

  return (
    <Shell>
      <div className="flex flex-col items-center text-center">
        <span className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          {head.icon}
        </span>
        <h1 className="mt-4 text-lg font-semibold tracking-tight text-foreground">
          {link.title || head.title}
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">{head.text}</p>
      </div>

      <div className="mt-7 flex justify-center">
        {link.type === "turnstile" && <TurnstileGate link={link} />}
        {link.type === "conditions" && <ConditionsGate link={link} />}
        {link.type === "password" && <PasswordGate link={link} />}
      </div>
    </Shell>
  );
}
