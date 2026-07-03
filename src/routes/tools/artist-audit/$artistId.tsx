import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { fetchAudit } from "@/lib/artist-audit/api";
import { computeMomentumScore } from "@/lib/artist-audit/score";
import { ScanAnimation } from "@/components/tools/ArtistAudit/ScanAnimation";
import { Report } from "@/components/tools/ArtistAudit/Report";

export const Route = createFileRoute("/tools/artist-audit/$artistId")({
  head: () => ({
    meta: [
      { title: "Artist Momentum Audit — Legion Beats" },
      {
        name: "description",
        content: "See any artist's release momentum score — free, no signup.",
      },
      { property: "og:title", content: "Artist Momentum Audit — Legion Beats" },
      {
        property: "og:description",
        content: "See any artist's release momentum score — free, no signup.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: "Artist Momentum Audit — Legion Beats" },
      {
        name: "twitter:description",
        content: "See any artist's release momentum score — free, no signup.",
      },
    ],
  }),
  component: AuditReportPage,
});

function AuditReportPage() {
  const { artistId } = Route.useParams();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["artist-audit", artistId],
    queryFn: () => fetchAudit(artistId),
  });

  return (
    <div className="min-h-screen bg-[#E0E5EC] text-[#3D4852]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
        {isLoading && <ScanAnimation />}

        {isError && (
          <div className="neu-extruded rounded-3xl p-8 text-center">
            <p className="text-[#3D4852] font-semibold">
              We couldn't pull that artist right now. Try again in a minute.
            </p>
            <div className="mt-6">
              <Link
                to="/"
                className="neu-extruded-sm rounded-2xl px-5 py-2.5 text-sm font-semibold text-[#6C63FF] hover:-translate-y-0.5 transition-transform inline-block focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6C63FF]"
              >
                Back to tools
              </Link>
            </div>
          </div>
        )}

        {data && <Report data={data} result={computeMomentumScore(data)} />}
      </div>
    </div>
  );
}
