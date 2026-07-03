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

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const { q } = await req.json();
    if (!q || typeof q !== "string" || !q.trim()) return json({ error: "missing_q" }, 400);

    const r = await fetch(`https://api.deezer.com/search/artist?q=${encodeURIComponent(q)}&limit=6`);
    const j = await r.json();
    const artists = (j.data ?? []).map((a: any) => ({
      id: a.id,
      name: a.name,
      imageUrl: a.picture_medium ?? a.picture ?? null,
      fans: a.nb_fan ?? 0,
      albumCount: a.nb_album ?? 0,
    }));
    return json({ artists });
  } catch (e) {
    return json({ error: "search_failed", detail: String(e) }, 500);
  }
});
