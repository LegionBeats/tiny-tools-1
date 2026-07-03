import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { ToolCard } from "../ToolCard";
import { searchArtists } from "@/lib/artist-audit/api";
import type { ArtistSummary } from "@/lib/artist-audit/types";

function formatFans(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, "")}M fans`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1).replace(/\.0$/, "")}K fans`;
  return `${n} fans`;
}

function useDebounced<T>(value: T, delay: number): T {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return v;
}

export function ArtistAudit() {
  const [query, setQuery] = useState("");
  const debounced = useDebounced(query.trim(), 350);
  const navigate = useNavigate();

  const enabled = debounced.length > 1;
  const { data, isFetching } = useQuery({
    queryKey: ["artist-search", debounced],
    queryFn: () => searchArtists(debounced),
    enabled,
    staleTime: 60_000,
  });

  const results = (data ?? []).slice(0, 6);

  const handlePick = (artist: ArtistSummary) => {
    navigate({
      to: "/tools/artist-audit/$artistId",
      params: { artistId: String(artist.id) },
    });
  };

  return (
    <ToolCard
      title="Your Artist Momentum Audit"
      subtitle="See how your release momentum really looks — and exactly what's holding it back. One search, no signup."
    >
      <div className="space-y-6">
        <div>
          <label htmlFor="artist-audit-search" className="block text-sm font-semibold text-[#3D4852] mb-2">
            Find your artist
          </label>
          <input
            id="artist-audit-search"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search your artist name…"
            autoComplete="off"
            className="neu-inset-sm rounded-2xl px-4 py-3 w-full bg-transparent outline-none text-[#3D4852] text-base placeholder:text-[#9AA3B2] focus:ring-2 focus:ring-[#6C63FF]"
          />
          <p className="mt-2 text-xs text-[#6B7280]">
            We pull from public streaming data — no login needed.
          </p>
        </div>

        {enabled && isFetching && (
          <p className="text-sm text-[#9AA3B2] animate-pulse">Searching…</p>
        )}

        {enabled && !isFetching && results.length === 0 && (
          <p className="text-sm text-[#6B7280]">
            No artists found. Try a different spelling.
          </p>
        )}

        {results.length > 0 && (
          <ul className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {results.map((artist) => (
              <li key={artist.id}>
                <button
                  type="button"
                  onClick={() => handlePick(artist)}
                  className="neu-extruded-sm rounded-2xl w-full text-left px-4 py-3 flex items-center gap-4 transition-transform duration-200 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6C63FF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#E0E5EC]"
                >
                  {artist.imageUrl ? (
                    <img
                      src={artist.imageUrl}
                      alt=""
                      width={48}
                      height={48}
                      className="w-12 h-12 rounded-full object-cover shrink-0"
                      loading="lazy"
                    />
                  ) : (
                    <span
                      aria-hidden="true"
                      className="neu-inset w-12 h-12 rounded-full flex items-center justify-center text-[#6C63FF] font-semibold text-lg shrink-0"
                    >
                      {artist.name.charAt(0).toUpperCase()}
                    </span>
                  )}
                  <span className="flex-1 min-w-0">
                    <span className="block font-semibold text-[#3D4852] truncate">
                      {artist.name}
                    </span>
                    <span className="block text-xs text-[#6B7280] mt-0.5">
                      {formatFans(artist.fans)}
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </ToolCard>
  );
}
