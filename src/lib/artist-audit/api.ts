import type { AuditData, ArtistSummary } from "./types";
import { supabase } from "@/integrations/supabase/client";

export async function searchArtists(q: string): Promise<ArtistSummary[]> {
  const { data, error } = await supabase.functions.invoke("deezer-search", { body: { q } });
  if (error) throw error;
  return ((data as { artists?: ArtistSummary[] })?.artists ?? []) as ArtistSummary[];
}

export async function fetchAudit(artistId: string): Promise<AuditData> {
  const { data, error } = await supabase.functions.invoke("artist-audit", { body: { artistId } });
  if (error) throw error;
  if ((data as { error?: string })?.error) throw new Error((data as { error: string }).error);
  return data as AuditData;
}

export async function captureLead(input: {
  email: string;
  artistId: string;
  artistName: string;
  score: number;
}): Promise<void> {
  const { error } = await supabase.functions.invoke("capture-lead", { body: input });
  if (error) throw error;
}
