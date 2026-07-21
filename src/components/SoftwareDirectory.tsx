import { useState } from "react";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { getRecommendations } from "@/lib/software-recommendations.functions";
import { SiteNav, SiteFooterNav } from "./SiteNav";

export const recommendationsQueryOptions = () =>
  queryOptions({
    queryKey: ["software-recommendations"],
    queryFn: () => getRecommendations(),
  });

export function SoftwareDirectory() {
  const { data: recommendations } = useSuspenseQuery(
    recommendationsQueryOptions(),
  );
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("all");

  const categories = Array.from(
    new Set(recommendations.map((r) => r.category)),
  ).sort();

  const filtered = recommendations.filter((r) => {
    const term = search.trim().toLowerCase();
    const matchesSearch =
      term === "" ||
      r.name.toLowerCase().includes(term) ||
      r.description.toLowerCase().includes(term) ||
      r.tags.some((t) => t.toLowerCase().includes(term)) ||
      r.category.toLowerCase().includes(term);
    const matchesCategory = category === "all" || r.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[#E0E5EC] text-[#3D4852]">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12 sm:py-20">
        <SiteNav />
        <header className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 neu-extruded-sm rounded-full px-4 py-1.5 mb-6">
            <span className="h-2 w-2 rounded-full bg-[#6C63FF]" />
            <span className="text-xs font-semibold tracking-wider uppercase text-[#6B7280]">
              Software Stack
            </span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-extrabold tracking-tight text-[#3D4852]">
            Software Stack
          </h1>
          <p className="mt-4 text-base sm:text-lg text-[#6B7280] max-w-xl mx-auto leading-relaxed">
            A curated list of tools I use and recommend for creators, small
            businesses, and music makers.
          </p>
        </header>

        {/* Filters */}
        <div className="mb-10 flex flex-col sm:flex-row gap-4">
          <div className="neu-inset-sm rounded-2xl px-4 py-3 flex-1">
            <input
              type="text"
              placeholder="Search tools..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent outline-none text-[#3D4852] placeholder:text-[#9AA3B2]"
            />
          </div>
          <div className="neu-inset-sm rounded-2xl px-4 py-3 flex items-center">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="bg-transparent outline-none text-[#3D4852] font-medium text-sm"
            >
              <option value="all">All categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filtered.map((rec) => (
            <article
              key={rec.id}
              className="neu-extruded rounded-3xl p-6 sm:p-8 flex flex-col"
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold tracking-wide uppercase text-[#6C63FF] neu-inset-sm">
                  {rec.category}
                </span>
                <img
                  src={
                    rec.logo_url ||
                    `https://www.google.com/s2/favicons?domain=${encodeURIComponent(rec.url)}&sz=128`
                  }
                  alt={`${rec.name} logo`}
                  className="h-10 w-10 object-contain rounded-lg"
                  loading="lazy"
                />
              </div>
              <h2 className="font-display text-2xl font-bold text-[#3D4852] mb-2">
                {rec.name}
              </h2>
              <p className="text-[#6B7280] leading-relaxed mb-4 flex-1">
                {rec.description}
              </p>
              {rec.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {rec.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs font-medium text-[#6B7280] neu-inset-sm rounded-lg px-2 py-1"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              <a
                href={rec.affiliate_url || rec.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 neu-extruded-sm rounded-2xl px-6 py-3 text-sm font-semibold text-[#6C63FF] hover:-translate-y-0.5 active:translate-y-0.5 transition-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6C63FF] self-start"
              >
                Check it out
                <span aria-hidden="true">→</span>
              </a>
            </article>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20 text-[#6B7280]">
            No tools match your search.
          </div>
        )}

        <SiteFooterNav />
      </div>
    </div>
  );
}
