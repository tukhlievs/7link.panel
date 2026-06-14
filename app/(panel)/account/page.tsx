import Link from "next/link";
import {
  House,
  Plus,
  SignOut,
  CaretRight,
} from "@phosphor-icons/react/dist/ssr";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/app/(panel)/actions";

const MENU = [
  { href: "/", label: "Your links", icon: House },
  { href: "/create", label: "Create link", icon: Plus },
];

const LEGAL = [
  { href: "https://7link.click/terms", label: "Terms" },
  { href: "https://7link.click/privacy", label: "Privacy" },
  { href: "https://7link.click/privacy", label: "Cookies" },
];

export default async function AccountPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const email = user?.email ?? "";
  const name = (user?.user_metadata?.full_name as string | undefined) ?? email;
  const avatar = user?.user_metadata?.avatar_url as string | undefined;
  const initial = (name || email || "?").charAt(0).toUpperCase();

  return (
    <div className="mx-auto max-w-md">
      <div className="flex flex-col items-center text-center">
        <span className="flex size-20 items-center justify-center overflow-hidden rounded-full border border-border bg-muted text-2xl font-semibold text-foreground">
          {avatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={avatar} alt="" className="size-full object-cover" />
          ) : (
            initial
          )}
        </span>
        <h1 className="mt-4 text-xl font-semibold tracking-tight text-foreground">
          {name}
        </h1>
        {email && name !== email && (
          <p className="mt-0.5 text-sm text-muted-foreground">{email}</p>
        )}
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

      <form action={signOut} className="mt-4">
        <button
          type="submit"
          className="card-designer flex w-full items-center gap-3 rounded-2xl px-5 py-4 text-left transition-colors hover:bg-destructive/5"
        >
          <SignOut size={20} weight="duotone" className="text-destructive" />
          <span className="flex-1 text-[0.95rem] font-medium text-destructive">
            Sign out
          </span>
        </button>
      </form>

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
