export interface ArtistSummary {
  id: number; // Deezer artist id
  name: string;
  imageUrl: string | null;
  fans: number; // Deezer nb_fan
  albumCount: number; // Deezer nb_album
}

export interface ReleaseInfo {
  totalReleases: number;
  latestReleaseDate: string | null; // ISO yyyy-mm-dd, or null if no releases
  daysSinceLatest: number | null;
  releasesLast12Months: number;
  releasesLast24Months: number;
}

export interface SimilarArtist {
  name: string;
  fans: number; // Deezer nb_fan for the peer
}

export interface AuditData {
  artist: ArtistSummary;
  releases: ReleaseInfo;
  similar: SimilarArtist[];
}

export interface MomentumGap {
  id: string;
  severity: "critical" | "warning" | "ok";
  headline: string;
  detail: string;
  cta: { label: string; kind: "beatstore" | "beatpack" } | null;
}

export interface MomentumResult {
  score: number; // 0-100
  band: "cold" | "warming" | "hot";
  headline: string;
  gaps: MomentumGap[];
}
