import { initialsOf } from "./slug";

export type CardTheme = "editorial" | "bold" | "mono";

export interface ProfileData {
  full_name: string;
  headline: string;
  company: string;
  location: string;
  about: string;
  skills: string[];
  theme: CardTheme;
}

const THEMES: Record<
  CardTheme,
  {
    banner: string;
    card: string;
    name: string;
    headline: string;
    meta: string;
    aboutLabel: string;
    aboutText: string;
    skillPill: string;
    avatarRing: string;
    avatarBg: string;
    avatarText: string;
    font: string;
  }
> = {
  editorial: {
    banner: "bg-gradient-to-br from-[#6C63FF] via-[#8B7FFF] to-[#F3A0C4]",
    card: "bg-white",
    name: "text-[#1a1a1a] font-serif",
    headline: "text-[#4a4a4a]",
    meta: "text-[#6B7280]",
    aboutLabel: "text-[#6C63FF] tracking-[0.2em] text-xs font-semibold uppercase",
    aboutText: "text-[#3D4852] leading-relaxed",
    skillPill: "bg-[#F3F0FF] text-[#6C63FF] border border-[#E0DAFF]",
    avatarRing: "ring-4 ring-white",
    avatarBg: "bg-white",
    avatarText: "text-[#6C63FF] font-serif",
    font: "",
  },
  bold: {
    banner: "bg-gradient-to-br from-[#FF3D71] via-[#FF7A00] to-[#FFC800]",
    card: "bg-[#0F0F14]",
    name: "text-white",
    headline: "text-[#FFC800]",
    meta: "text-[#9AA3B2]",
    aboutLabel: "text-[#FF7A00] tracking-[0.2em] text-xs font-black uppercase",
    aboutText: "text-[#E5E7EB] leading-relaxed",
    skillPill: "bg-[#FF3D71] text-white border border-[#FF7A00]",
    avatarRing: "ring-4 ring-[#0F0F14]",
    avatarBg: "bg-[#0F0F14]",
    avatarText: "text-[#FFC800] font-black",
    font: "",
  },
  mono: {
    banner: "bg-gradient-to-br from-[#1a1a1a] via-[#2d2d2d] to-[#4a4a4a]",
    card: "bg-[#FAFAF7]",
    name: "text-[#0a0a0a] font-mono",
    headline: "text-[#3a3a3a] font-mono",
    meta: "text-[#6B7280] font-mono",
    aboutLabel: "text-[#0a0a0a] tracking-[0.3em] text-xs font-bold uppercase font-mono",
    aboutText: "text-[#2a2a2a] leading-relaxed font-mono",
    skillPill: "bg-transparent text-[#0a0a0a] border border-[#0a0a0a] font-mono",
    avatarRing: "ring-4 ring-[#FAFAF7]",
    avatarBg: "bg-[#0a0a0a]",
    avatarText: "text-white font-mono",
    font: "",
  },
};

export function ProfileCard({ data }: { data: ProfileData }) {
  const t = THEMES[data.theme] ?? THEMES.editorial;
  const name = data.full_name || "Your Name";
  const initials = initialsOf(name);
  const meta = [data.company, data.location].filter(Boolean).join(" · ");

  return (
    <div className={`rounded-3xl overflow-hidden shadow-xl ${t.card}`}>
      <div className={`h-28 sm:h-32 relative ${t.banner}`}>
        <div className="absolute -bottom-10 left-6 sm:left-8">
          <div
            className={`h-20 w-20 sm:h-24 sm:w-24 rounded-full ${t.avatarBg} ${t.avatarRing} flex items-center justify-center text-2xl sm:text-3xl`}
          >
            <span className={t.avatarText}>{initials}</span>
          </div>
        </div>
      </div>

      <div className="pt-14 sm:pt-16 px-6 sm:px-8 pb-8">
        <h3 className={`text-2xl sm:text-3xl font-bold tracking-tight ${t.name}`}>
          {name}
        </h3>
        {data.headline && (
          <p className={`mt-1 text-base sm:text-lg ${t.headline}`}>{data.headline}</p>
        )}
        {meta && <p className={`mt-1 text-sm ${t.meta}`}>{meta}</p>}

        {data.about && (
          <div className="mt-6">
            <div className={t.aboutLabel}>About</div>
            <p className={`mt-2 text-sm sm:text-base whitespace-pre-line ${t.aboutText}`}>
              {data.about}
            </p>
          </div>
        )}

        {data.skills.length > 0 && (
          <div className="mt-6">
            <div className={t.aboutLabel}>Skills</div>
            <div className="mt-3 flex flex-wrap gap-2">
              {data.skills.map((s) => (
                <span
                  key={s}
                  className={`px-3 py-1 rounded-full text-xs font-medium ${t.skillPill}`}
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
