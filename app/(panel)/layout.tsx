import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Logo } from "@/components/logo";

export const dynamic = "force-dynamic";

export default async function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const email = user.email ?? "";
  const name =
    (user.user_metadata?.full_name as string | undefined) ?? email;
  const avatar = user.user_metadata?.avatar_url as string | undefined;
  const initial = (name || email || "?").charAt(0).toUpperCase();

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
            className="flex size-9 items-center justify-center overflow-hidden rounded-full border border-border bg-muted text-sm font-semibold text-foreground transition-colors hover:border-primary/40"
          >
            {avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={avatar} alt="" className="size-full object-cover" />
            ) : (
              initial
            )}
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-8 sm:px-6 sm:py-10">
        {children}
      </main>
    </div>
  );
}
