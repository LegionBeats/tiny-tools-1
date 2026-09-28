import { createFileRoute } from "@tanstack/react-router";

const DOMAIN_RE = /^(?=.{1,253}$)([a-z0-9-]{1,63}\.)+[a-z]{2,63}$/i;

export const Route = createFileRoute("/api/public/favicon")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const params = new URL(request.url).searchParams;
        const domain = (params.get("domain") ?? "").toLowerCase();
        const source = params.get("source");
        const size = params.get("sz") ?? "128";
        if (!DOMAIN_RE.test(domain) || !["google", "ddg"].includes(source ?? "") || !["32", "64", "128"].includes(size)) {
          return new Response("Invalid request", { status: 400 });
        }
        const upstream =
          source === "google"
            ? `https://www.google.com/s2/favicons?domain=${domain}&sz=${size}`
            : `https://icons.duckduckgo.com/ip3/${domain}.ico`;
        const res = await fetch(upstream);
        if (!res.ok) return new Response("Icon not found", { status: 404 });
        const ext = source === "google" ? "png" : "ico";
        const name = source === "google" ? `${domain}-favicon-${size}.${ext}` : `${domain}-favicon.${ext}`;
        return new Response(res.body, {
          headers: {
            "Content-Type": res.headers.get("Content-Type") ?? "image/png",
            "Content-Disposition": `attachment; filename="${name}"`,
            "Cache-Control": "public, max-age=86400",
          },
        });
      },
    },
  },
});
