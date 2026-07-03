import { describe, it, expect } from "vitest";
import { computeMomentumScore } from "./score";
import type { AuditData } from "./types";

const base = (over: Partial<AuditData>): AuditData => ({
  artist: { id: 1, name: "Test Artist", imageUrl: null, fans: 5000, albumCount: 10 },
  releases: { totalReleases: 10, latestReleaseDate: "2026-06-01", daysSinceLatest: 30, releasesLast12Months: 4, releasesLast24Months: 8 },
  similar: [{ name: "Peer A", fans: 6000 }, { name: "Peer B", fans: 4000 }, { name: "Peer C", fans: 5000 }],
  ...over,
});

describe("computeMomentumScore", () => {
  it("scores a hot, active artist high", () => {
    const r = computeMomentumScore(
      base({ artist: { id: 1, name: "Hot", imageUrl: null, fans: 2_000_000, albumCount: 30 },
             releases: { totalReleases: 25, latestReleaseDate: "2026-06-23", daysSinceLatest: 10, releasesLast12Months: 8, releasesLast24Months: 16 } }),
    );
    expect(r.score).toBeGreaterThan(66);
    expect(r.band).toBe("hot");
  });

  it("scores a cold, stale catalog low and flags it critical", () => {
    const r = computeMomentumScore(
      base({ artist: { id: 1, name: "Cold", imageUrl: null, fans: 500, albumCount: 6 },
             releases: { totalReleases: 6, latestReleaseDate: "2025-01-01", daysSinceLatest: 500, releasesLast12Months: 0, releasesLast24Months: 1 } }),
    );
    expect(r.score).toBeLessThan(34);
    expect(r.band).toBe("cold");
    expect(r.gaps.find((g) => g.id === "cold-catalog")?.severity).toBe("critical");
  });

  it("handles an artist with zero releases", () => {
    const r = computeMomentumScore(
      base({ artist: { id: 1, name: "New", imageUrl: null, fans: 0, albumCount: 0 },
             releases: { totalReleases: 0, latestReleaseDate: null, daysSinceLatest: null, releasesLast12Months: 0, releasesLast24Months: 0 } }),
    );
    expect(r.score).toBe(0);
    expect(r.gaps.some((g) => g.id === "no-releases")).toBe(true);
  });

  it("always includes at least one CTA gap even for a strong artist with no similar list", () => {
    const r = computeMomentumScore(
      base({ similar: [],
             artist: { id: 1, name: "Strong", imageUrl: null, fans: 2_000_000, albumCount: 30 },
             releases: { totalReleases: 30, latestReleaseDate: "2026-06-25", daysSinceLatest: 8, releasesLast12Months: 10, releasesLast24Months: 20 } }),
    );
    expect(r.gaps.some((g) => g.cta !== null)).toBe(true);
  });
});
