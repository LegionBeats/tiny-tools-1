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
    const { email, artistId, artistName, score } = await req.json();
    if (!email || typeof email !== "string") return json({ error: "missing_email" }, 400);

    const token = Deno.env.get("GHL_API_TOKEN");
    const locationId = Deno.env.get("GHL_LOCATION_ID");
    if (!token || !locationId) return json({ error: "ghl_not_configured" }, 500);

    const r = await fetch("https://services.leadconnectorhq.com/contacts/upsert", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        Version: "2021-07-28",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        locationId,
        email,
        source: "Artist Momentum Audit",
        tags: ["artist-audit", `momentum-${score}`],
        customFields: [
          { key: "artist_id", field_value: String(artistId ?? "") },
          { key: "artist_name", field_value: String(artistName ?? "") },
          { key: "momentum_score", field_value: String(score ?? "") },
        ],
      }),
    });
    if (!r.ok) return json({ error: "ghl_failed", status: r.status }, 502);
    return json({ ok: true });
  } catch (e) {
    return json({ error: "capture_failed", detail: String(e) }, 500);
  }
});
