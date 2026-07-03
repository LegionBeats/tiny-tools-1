import type { MomentumGap } from "./types";

// Legion Beats destinations. Replace with the real URLs before launch.
// MAKE_URL = where an artist gets their next release made with Legion (beats + mixing + studio).
// STARTER_URL = the free entry offer (free beat) for artists with nothing out yet.
export const MAKE_URL = "https://legionbeats.com";
export const STARTER_URL = "https://legionbeats.com";

// "beatstore" = the main paid path (make your next release with Legion).
// "beatpack"  = the free starter path.
export const BEATSTORE_CTA: NonNullable<MomentumGap["cta"]> = {
  label: "Get your next release made with Legion",
  kind: "beatstore",
};
export const BEATPACK_CTA: NonNullable<MomentumGap["cta"]> = {
  label: "Start with a free beat",
  kind: "beatpack",
};

export function ctaHref(kind: "beatstore" | "beatpack"): string {
  return kind === "beatstore" ? MAKE_URL : STARTER_URL;
}
