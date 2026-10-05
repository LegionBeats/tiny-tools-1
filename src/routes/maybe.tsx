import { createFileRoute } from "@tanstack/react-router";
import { SiteNav, SiteFooterNav } from "@/components/SiteNav";
import { MaybeList } from "@/components/MaybeList";

export const Route = createFileRoute("/maybe")({
  head: () => ({
    meta: [
      { title: "Maybe List — Tool ideas on the horizon" },
      { name: "description", content: "Tool ideas being considered for Tiny Tools." },
      { property: "og:title", content: "Maybe List — Tool ideas on the horizon" },
      { property: "og:description", content: "Tool ideas being considered for Tiny Tools." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: MaybePage,
});

function MaybePage() {
  return (
    <div className="min-h-screen bg-[#E0E5EC] text-[#3D4852]">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-12 sm:py-20">
        <SiteNav />
        <MaybeList />
        <SiteFooterNav />
      </div>
    </div>
  );
}
