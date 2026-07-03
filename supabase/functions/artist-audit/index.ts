const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function summarizeReleases(dates: string[]) {
  const now = Date.now();
  const DAY = 86_400_000;
  const times = dates.map((d) => Date.parse(d)).filter((t) => !Number.isNaN(t));
  if (times.length === 0) {
    return { totalReleases: 0, latestReleaseDate: null, daysSinceLatest: null, releasesLast12Months: 0, releasesLast24Months: 0 };
  }
  const latest = Math.max(...times);
  const within = (months: number) => times.filter((t) => (now - t) <= months * 30 * DAY).length;
  return {
    totalReleases: times.length,
    latestReleaseDate: new Date(latest).toISOString().slice(0, 10),
    daysSinceLatest: Math.floor((now - latest) / DAY),
    releasesLast12Months: within(12),
    releasesLast24Months: within(24),
  };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const { artistId } = await req.json();
    if (artistId === undefined || artistId === null || artistId === "") {
      return json({ error: "missing_artistId" }, 400);
    }
    const idBase = `https://api.deezer.com/artist/${artistId}`;

    const a: any = await (await fetch(idBase)).json();
    if (a.error) return json({ error: "artist_not_found" }, 404);
    const artist = {
      id: a.id,
      name: a.name,
      imageUrl: a.picture_medium ?? a.picture ?? null,
      fans: a.nb_fan ?? 0,
      albumCount: a.nb_album ?? 0,
    };

    const dates: string[] = [];
    let url: string | null = `${idBase}/albums?limit=100`;
    let guard = 0;
    while (url && guard < 3) {
      const rr: any = await (await fetch(url)).json();
      for (const item of rr.data ?? []) if (item.release_date) dates.push(item.release_date);
      url = rr.next ?? null;
      guard++;
    }
    const releases = summarizeReleases(dates);

    const rel: any = await (await fetch(`${idBase}/related?limit=6`)).json();
    const similar = (rel.data ?? []).map((s: any) => ({ name: s.name, fans: s.nb_fan ?? 0 }));

    return json({ artist, releases, similar });
  } catch (e) {
    return json({ error: "audit_failed", detail: String(e) }, 500);
  }
});
