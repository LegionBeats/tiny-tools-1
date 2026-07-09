import { useMemo, useState } from "react";
import { ToolCard } from "../ToolCard";
import { supabase } from "@/integrations/supabase/client";
import { toSlug } from "./slug";
import { ProfileCard, type CardTheme, type ProfileData } from "./ProfileCard";

const THEMES: { id: CardTheme; label: string }[] = [
  { id: "editorial", label: "Editorial" },
  { id: "bold", label: "Bold" },
  { id: "mono", label: "Mono" },
];

const inputBase =
  "w-full neu-inset-sm rounded-2xl px-4 py-3 text-sm text-[#3D4852] placeholder:text-[#9AA3B2] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6C63FF] bg-transparent";

export function LinkedInProfileCardTool() {
  const [fullName, setFullName] = useState("");
  const [headline, setHeadline] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");
  const [about, setAbout] = useState("");
  const [skillsText, setSkillsText] = useState("");
  const [theme, setTheme] = useState<CardTheme>("editorial");
  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [published, setPublished] = useState<{ slug: string; url: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const skills = useMemo(
    () =>
      skillsText
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
        .slice(0, 20),
    [skillsText],
  );

  const slug = useMemo(() => toSlug(fullName) || "your-name", [fullName]);
  const previewUrl = `yourtool.com/u/${slug}`;

  const data: ProfileData = {
    full_name: fullName,
    headline,
    company,
    location,
    about,
    skills,
    theme,
  };

  const canPublish = fullName.trim().length > 0 && !publishing;

  const handlePublish = async () => {
    if (!canPublish) return;
    setPublishing(true);
    setError(null);
    try {
      // Try slug, add suffix on conflict.
      let finalSlug = toSlug(fullName);
      if (!finalSlug) {
        setError("Please enter a name.");
        setPublishing(false);
        return;
      }
      for (let attempt = 0; attempt < 6; attempt++) {
        const candidate =
          attempt === 0 ? finalSlug : `${finalSlug}-${Math.random().toString(36).slice(2, 6)}`;
        const { error: insertErr } = await supabase.from("linkedin_profiles").insert({
          slug: candidate,
          full_name: fullName.trim().slice(0, 100),
          headline: headline.trim().slice(0, 200),
          company: company.trim().slice(0, 100),
          location: location.trim().slice(0, 100),
          about: about.trim().slice(0, 2000),
          skills,
          theme,
        });
        if (!insertErr) {
          const url = `${window.location.origin}/u/${candidate}`;
          setPublished({ slug: candidate, url });
          setPublishing(false);
          return;
        }
        // Unique violation code
        if (insertErr.code !== "23505") {
          setError(insertErr.message);
          setPublishing(false);
          return;
        }
      }
      setError("Couldn't reserve a link. Try a different name.");
      setPublishing(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
      setPublishing(false);
    }
  };

  const handleCopy = async () => {
    if (!published) return;
    await navigator.clipboard.writeText(published.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const handleReset = () => {
    setPublished(null);
    setCopied(false);
  };

  return (
    <ToolCard
      title="LinkedIn Profile Card"
      subtitle="Turn your profile into a shareable brand asset. Manual entry only — we don't scrape LinkedIn."
    >
      {published ? (
        <div className="space-y-6">
          <div className="neu-inset rounded-2xl p-5">
            <div className="text-xs font-semibold tracking-wider uppercase text-[#6B7280]">
              Published
            </div>
            <div className="mt-2 flex flex-col sm:flex-row sm:items-center gap-3">
              <a
                href={published.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#6C63FF] font-semibold break-all hover:underline"
              >
                {published.url}
              </a>
              <button
                type="button"
                onClick={handleCopy}
                className="neu-extruded-sm rounded-xl px-4 py-2 text-xs font-semibold text-[#3D4852] hover:-translate-y-0.5 transition-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6C63FF] sm:ml-auto"
              >
                {copied ? "Copied ✓" : "Copy link"}
              </button>
            </div>
          </div>

          <ProfileCard data={data} />

          <div className="text-center">
            <button
              type="button"
              onClick={handleReset}
              className="text-xs font-semibold text-[#6B7280] hover:text-[#3D4852]"
            >
              ← Back to editor
            </button>
          </div>
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="space-y-4">
            <Field label="Full name">
              <input
                className={inputBase}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Jane Rivera"
                maxLength={100}
              />
            </Field>
            <Field label="Headline">
              <input
                className={inputBase}
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                placeholder="Product designer building tools for creators"
                maxLength={200}
              />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Company">
                <input
                  className={inputBase}
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="Acme"
                  maxLength={100}
                />
              </Field>
              <Field label="Location">
                <input
                  className={inputBase}
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Brooklyn, NY"
                  maxLength={100}
                />
              </Field>
            </div>
            <Field label="About">
              <textarea
                className={`${inputBase} min-h-[120px] resize-y`}
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                placeholder="A short bio — what you do, who you help, what you're building."
                maxLength={2000}
              />
            </Field>
            <Field label="Top skills (comma-separated)">
              <input
                className={inputBase}
                value={skillsText}
                onChange={(e) => setSkillsText(e.target.value)}
                placeholder="Design systems, Figma, Product strategy"
              />
            </Field>

            <div>
              <div className="text-xs font-semibold tracking-wider uppercase text-[#6B7280] mb-2">
                Theme
              </div>
              <div className="flex gap-2">
                {THEMES.map((th) => {
                  const active = theme === th.id;
                  return (
                    <button
                      key={th.id}
                      type="button"
                      onClick={() => setTheme(th.id)}
                      className={`rounded-2xl px-4 py-2 text-sm font-semibold transition-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6C63FF] ${
                        active
                          ? "neu-inset-sm text-[#6C63FF]"
                          : "neu-extruded-sm text-[#3D4852] hover:-translate-y-0.5"
                      }`}
                    >
                      {th.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-2 space-y-2">
              <button
                type="button"
                onClick={handlePublish}
                disabled={!canPublish}
                className="w-full neu-extruded-sm rounded-2xl px-5 py-3 text-sm font-semibold text-[#6C63FF] hover:-translate-y-0.5 transition-transform disabled:opacity-50 disabled:hover:translate-y-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6C63FF]"
              >
                {publishing ? "Publishing…" : "Publish"}
              </button>
              <div className="text-xs text-[#6B7280] text-center">
                Your link:{" "}
                <span className="font-mono text-[#3D4852]">{previewUrl}</span>
              </div>
              {error && (
                <div className="text-xs text-[#B91C1C] text-center">{error}</div>
              )}
            </div>
          </div>

          <div className="lg:sticky lg:top-8 lg:self-start">
            <div className="text-xs font-semibold tracking-wider uppercase text-[#6B7280] mb-3">
              Live preview
            </div>
            <ProfileCard data={data} />
          </div>
        </div>
      )}
    </ToolCard>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="text-xs font-semibold tracking-wider uppercase text-[#6B7280] mb-2">
        {label}
      </div>
      {children}
    </label>
  );
}
