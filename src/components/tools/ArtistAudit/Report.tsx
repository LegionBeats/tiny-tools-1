import type { AuditData, MomentumResult } from "@/lib/artist-audit/types";
import { ctaHref } from "@/lib/artist-audit/config";
import { CaptureForm } from "./CaptureForm";

function formatFans(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1).replace(/\.0$/, "")}K`;
  return String(n);
}

const SEVERITY_DOT: Record<string, string> = {
  critical: "bg-[#c0564a]",
  warning: "bg-[#6C63FF]",
  ok: "bg-[#38B2AC]",
};

function scoreColor(band: MomentumResult["band"]): string {
  if (band === "hot") return "text-[#6C63FF]";
  if (band === "warming") return "text-[#6B7280]";
  return "text-[#c0564a]";
}

interface ReportProps {
  data: AuditData;
  result: MomentumResult;
}

export function Report({ data, result }: ReportProps) {
  const { artist, similar } = data;
  const catalogLine = `${formatFans(artist.fans)} fans · ${artist.albumCount} release${artist.albumCount === 1 ? "" : "s"}`;

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
      {/* 1. Artist header */}
      <header className="text-center flex flex-col items-center">
        {artist.imageUrl ? (
          <div className="neu-extruded rounded-3xl p-2 inline-block">
            <img
              src={artist.imageUrl}
              alt={artist.name}
              width={96}
              height={96}
              className="w-24 h-24 rounded-2xl object-cover"
            />
          </div>
        ) : (
          <span
            aria-hidden="true"
            className="neu-inset w-24 h-24 rounded-full flex items-center justify-center text-[#6C63FF] font-display text-3xl font-extrabold"
          >
            {artist.name.charAt(0).toUpperCase()}
          </span>
        )}
        <h1 className="mt-6 font-display text-3xl sm:text-4xl font-extrabold text-[#3D4852] tracking-tight">
          {artist.name}
        </h1>
        <p className="mt-2 text-sm text-[#6B7280]">{catalogLine}</p>
      </header>

      {/* 2. Score */}
      <section className="flex flex-col items-center text-center">
        <div className="neu-extruded rounded-full w-[200px] h-[200px] flex flex-col items-center justify-center">
          <div className={`font-display text-6xl font-extrabold leading-none ${scoreColor(result.band)}`}>
            {result.score}
          </div>
          <div className="mt-1 text-xs text-[#9AA3B2]">/ 100</div>
          <div className="mt-2 text-[10px] uppercase tracking-[0.2em] text-[#6B7280] font-semibold">
            Momentum Score
          </div>
        </div>
        <p className="mt-6 text-lg sm:text-xl font-semibold text-[#3D4852] max-w-xl">
          {result.headline}
        </p>
      </section>

      {/* 3. Gaps */}
      <section className="space-y-4">
        {result.gaps.map((gap) => (
          <article key={gap.id} className="neu-inset rounded-3xl p-6">
            <div className="flex items-start gap-3">
              <span
                aria-hidden="true"
                className={`mt-2 h-2 w-2 rounded-full shrink-0 ${SEVERITY_DOT[gap.severity] ?? "bg-[#6B7280]"}`}
              />
              <h3 className="font-semibold text-[#3D4852] text-base sm:text-lg">
                {gap.headline}
              </h3>
            </div>
            <p className="mt-2 pl-5 text-sm text-[#6B7280] leading-relaxed">
              {gap.detail}
            </p>
            {gap.cta && (
              <div className="mt-4 pl-5">
                <a
                  href={ctaHref(gap.cta.kind)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="neu-extruded-sm rounded-2xl px-5 py-2.5 text-sm font-semibold text-[#6C63FF] hover:-translate-y-0.5 transition-transform inline-block focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6C63FF]"
                >
                  {gap.cta.label}
                </a>
              </div>
            )}
          </article>
        ))}
      </section>

      {/* 4. Artists in your lane */}
      {similar.length > 0 && (
        <section className="neu-extruded rounded-3xl p-6">
          <h2 className="font-semibold text-[#3D4852] text-lg">Artists in your lane</h2>
          <p className="mt-1 text-sm text-[#6B7280]">
            These are the artists you're competing with for the same ears.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            {similar.slice(0, 5).map((s) => (
              <span
                key={s.name}
                className="neu-inset-sm rounded-full px-4 py-2 text-sm text-[#3D4852]"
              >
                <span className="font-semibold">{s.name}</span>
                <span className="text-[#6B7280] ml-2">{formatFans(s.fans)} fans</span>
              </span>
            ))}
          </div>
        </section>
      )}

      {/* 5. Capture + final CTA */}
      <CaptureForm
        artistId={String(artist.id)}
        artistName={artist.name}
        score={result.score}
      />

      <div className="text-center">
        <a
          href={ctaHref("beatstore")}
          target="_blank"
          rel="noopener noreferrer"
          className="neu-extruded-sm rounded-2xl px-6 py-3 text-sm font-semibold text-[#6C63FF] hover:-translate-y-0.5 transition-transform inline-block focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6C63FF]"
        >
          Get your next release done with Legion
        </a>
      </div>
    </div>
  );
}
