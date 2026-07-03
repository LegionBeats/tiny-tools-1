import type { MomentumGap } from "./types";

// Legion Beats destinations. Replace with the real URLs before launch.
export const BEATSTORE_URL = "https://legionbeats.com/beats";
export const BEATPACK_URL = "https://legionbeats.com/free-pack";

export const BEATSTORE_CTA: NonNullable<MomentumGap["cta"]> = {
  label: "Find a beat to record on",
  kind: "beatstore",
};
export const BEATPACK_CTA: NonNullable<MomentumGap["cta"]> = {
  label: "Get a free beat to start",
  kind: "beatpack",
};

export function ctaHref(kind: "beatstore" | "beatpack"): string {
  return kind === "beatstore" ? BEATSTORE_URL : BEATPACK_URL;
}
