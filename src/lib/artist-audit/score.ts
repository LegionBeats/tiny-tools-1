import type { AuditData, MomentumResult, MomentumGap, SimilarArtist } from "./types";
import { BEATSTORE_CTA, BEATPACK_CTA } from "./config";

// Weights sum to 100. These encode the marketing judgment of what "momentum"
// means — tune them freely; the tests assert bands/ranges, not exact totals.
export const WEIGHTS = { recency: 35, cadence: 30, depth: 15, reach: 20 } as const;

const clamp01 = (n: number) => Math.max(0, Math.min(1, n));

// Reach = the artist's fanbase relative to the peers Deezer says are adjacent,
// on a log scale (forgiving so small artists aren't crushed to zero). Falls back
// to an absolute log scale (~1M fans = full credit) when there are no peers.
function computeReach(fans: number, similar: SimilarArtist[]): number {
  const peer = similar.map((s) => s.fans).filter((f) => f > 0).sort((a, b) => a - b);
  const peerMedian = peer.length ? peer[Math.floor(peer.length / 2)] : 0;
  if (peerMedian > 0) return clamp01(Math.log10(fans + 1) / Math.log10(peerMedian + 1));
  return clamp01(Math.log10(fans + 1) / 6);
}

export function computeMomentumScore(data: AuditData): MomentumResult {
  const { releases, artist, similar } = data;

  const recency =
    releases.daysSinceLatest === null ? 0 : clamp01(1 - releases.daysSinceLatest / 365);
  const cadence = clamp01(releases.releasesLast12Months / 6);
  const depth =
    releases.totalReleases <= 0
      ? 0
      : clamp01(Math.log10(releases.totalReleases + 1) / Math.log10(21));
  const reach = computeReach(artist.fans, similar);

  const score = Math.round(
    recency * WEIGHTS.recency +
      cadence * WEIGHTS.cadence +
      depth * WEIGHTS.depth +
      reach * WEIGHTS.reach,
  );

  const band: MomentumResult["band"] = score <= 33 ? "cold" : score <= 66 ? "warming" : "hot";
  const headline =
    band === "cold"
      ? `${artist.name}'s momentum has stalled`
      : band === "warming"
        ? `${artist.name} is building — but leaving momentum on the table`
        : `${artist.name} has real momentum`;

  return { score, band, headline, gaps: buildGaps(data) };
}

function buildGaps(data: AuditData): MomentumGap[] {
  const { releases, similar } = data;
  const gaps: MomentumGap[] = [];
  const months =
    releases.daysSinceLatest === null ? null : Math.floor(releases.daysSinceLatest / 30);

  if (releases.daysSinceLatest === null) {
    gaps.push({
      id: "no-releases",
      severity: "critical",
      headline: "You have no releases we can find yet",
      detail:
        "The algorithm and your fans can only react to music that exists. The fastest way to start building momentum is to put out your first record.",
      cta: BEATPACK_CTA,
    });
  } else if (releases.daysSinceLatest > 365) {
    gaps.push({
      id: "cold-catalog",
      severity: "critical",
      headline: `Your catalog has been quiet for ${months} months`,
      detail:
        "After about six months of silence, streaming platforms stop actively pushing an artist and fans drift. A fresh release restarts the engine.",
      cta: BEATSTORE_CTA,
    });
  } else if (releases.daysSinceLatest > 120) {
    gaps.push({
      id: "slowing-catalog",
      severity: "warning",
      headline: `It's been ${months} months since your last drop`,
      detail:
        "Momentum fades between releases. Getting your next record out in the next few weeks keeps you in rotation.",
      cta: BEATSTORE_CTA,
    });
  }

  if (releases.releasesLast12Months < 4) {
    const n = releases.releasesLast12Months;
    gaps.push({
      id: "low-cadence",
      severity: "warning",
      headline: `You've released ${n} time${n === 1 ? "" : "s"} in the last year`,
      detail:
        "The artists who break out ship close to monthly. A steady beat supply is the difference between one-off drops and a real release schedule.",
      cta: BEATSTORE_CTA,
    });
  }

  if (releases.totalReleases < 5) {
    gaps.push({
      id: "thin-catalog",
      severity: "warning",
      headline: "Your catalog is still thin",
      detail:
        "A deeper catalog gives new listeners more to binge and more entry points from search and playlists. More finished records is the lever.",
      cta: BEATSTORE_CTA,
    });
  }

  if (similar.length > 0) {
    const names = similar.slice(0, 3).map((s) => s.name).join(", ");
    gaps.push({
      id: "peers-shipping",
      severity: "warning",
      headline: "Artists in your lane are releasing more than you",
      detail: `Fans who listen to ${names} are one algorithmic step from you — but only if you're releasing when they come looking.`,
      cta: null,
    });
  }

  if (!gaps.some((g) => g.cta)) {
    gaps.push({
      id: "keep-shipping",
      severity: "ok",
      headline: "Keep the momentum going",
      detail:
        "You're moving — the way to compound it is to never let the catalog go cold. Line up your next record now.",
      cta: BEATSTORE_CTA,
    });
  }

  return gaps;
}
