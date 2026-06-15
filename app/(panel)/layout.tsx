import Link from "next/link";
import { Logo } from "@/components/logo";

const DEMO = { name: "Demo", email: "demo@7link.click" };

export default function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const initial = DEMO.name.charAt(0).toUpperCase();

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-2xl items-center justify-between px-4 sm:px-6">
          <Link
            href="/"
            className="flex items-center gap-2 font-semibold tracking-tight"
          >
            <Logo className="text-primary" />
            <span className="text-[1.05rem]">7Link</span>
          </Link>
          <Link
            href="/account"
            aria-label="Account"
            className="flex size-9 items-center justify-center rounded-full border border-border bg-muted text-sm font-semibold text-foreground transition-colors hover:border-primary/40"
          >
            {initial}
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-8 sm:px-6 sm:py-10">
        {children}
      </main>
    </div>
  );
}
