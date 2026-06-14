import Link from "next/link";
import { Plus, LinkSimple } from "@phosphor-icons/react/dist/ssr";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { LinkListItem } from "@/components/link-list-item";
import type { LinkRow } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("links")
    .select("*")
    .order("created_at", { ascending: false });
  const links = (data ?? []) as LinkRow[];

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Your links
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {links.length} {links.length === 1 ? "link" : "links"} · protected
            by 7Link
          </p>
        </div>
        <Button
          render={<Link href="/create" />}
          className="h-10 shrink-0 gap-1.5 rounded-full px-4 text-sm shadow-blue-btn"
        >
          <Plus size={16} weight="bold" />
          Create
        </Button>
      </div>

      {links.length === 0 ? (
        <div className="card-designer mt-8 flex flex-col items-center rounded-2xl px-6 py-16 text-center">
          <span className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <LinkSimple size={24} weight="duotone" />
          </span>
          <h2 className="mt-4 text-lg font-semibold tracking-tight text-foreground">
            No links yet
          </h2>
          <p className="mt-1.5 max-w-xs text-sm text-muted-foreground">
            Create your first protected link and share it anywhere.
          </p>
          <Button
            render={<Link href="/create" />}
            className="mt-6 h-10 gap-1.5 rounded-full px-5 text-sm shadow-blue-btn"
          >
            <Plus size={16} weight="bold" />
            Create link
          </Button>
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {links.map((link) => (
            <LinkListItem key={link.id} link={link} />
          ))}
        </div>
      )}
    </div>
  );
}
