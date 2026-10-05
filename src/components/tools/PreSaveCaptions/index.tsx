import { useState } from "react";
import { ToolCard } from "../ToolCard";

const inputClass =
  "neu-inset-sm rounded-2xl px-4 py-3 w-full bg-transparent outline-none text-[#3D4852] text-base placeholder:text-[#9AA3B2] focus:ring-2 focus:ring-[#6C63FF]";

type Info = { artist: string; song: string; date: string; link: string; vibe: string };

function formatDate(iso: string): string {
  if (!iso) return "soon";
  const d = new Date(iso + "T12:00:00");
  return d.toLocaleDateString("en-US", { month: "long", day: "numeric" });
}

function tag(s: string) {
  return "#" + s.replace(/[^a-zA-Z0-9]/g, "");
}

export function buildCaptions({ artist, song, date, link, vibe }: Info) {
  const when = formatDate(date);
  const extra = vibe.trim() ? ` ${vibe.trim()}` : "";
  const tags = [tag(song), tag(artist), "#NewMusic", "#PreSave"].filter((t) => t.length > 1).join(" ");
  return [
    {
      platform: "Instagram",
      text: `🚨 "${song}" drops ${when}!${extra}\n\nPre-save it now so it lands in your library the second it's out. Link in bio 🔗\n\n${tags}`,
    },
    {
      platform: "TikTok",
      text: `"${song}" out ${when} 👀${extra} pre-save link in bio 🔥 ${tags}`,
    },
    {
      platform: "X / Threads",
      text: `New single "${song}" drops ${when}.${extra}\n\nPre-save it here 👇\n${link}`,
    },
    {
      platform: "Facebook",
      text: `Big news: my new song "${song}" comes out ${when}!${extra}\n\nIt would mean a lot if you pre-saved it. It takes one tap and it'll show up in your library on release day:\n${link}\n\nThank you for rocking with me 🙏 — ${artist}`,
    },
    {
      platform: "Email / Text",
      text: `Hey! My new song "${song}" comes out ${when}.${extra} Can you do me a quick favor and pre-save it? One tap and it's in your library on release day: ${link}\n\n— ${artist}`,
    },
  ];
}

function CaptionBox({ platform, text }: { platform: string; text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // ignore
    }
  };
  return (
    <div className="neu-inset-sm rounded-2xl p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold tracking-wider uppercase text-[#6C63FF]">{platform}</span>
        <button
          type="button"
          onClick={copy}
          className="neu-extruded-sm rounded-full px-4 py-1.5 text-xs font-semibold text-[#6C63FF] hover:-translate-y-0.5 active:translate-y-0.5 transition-transform"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      <p className="whitespace-pre-line text-sm text-[#3D4852] leading-relaxed">{text}</p>
    </div>
  );
}

export function PreSaveCaptions() {
  const [info, setInfo] = useState<Info>({ artist: "", song: "", date: "", link: "", vibe: "" });
  const [captions, setCaptions] = useState<ReturnType<typeof buildCaptions> | null>(null);
  const [error, setError] = useState(false);

  const set = (k: keyof Info) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setInfo((p) => ({ ...p, [k]: e.target.value }));

  const generate = () => {
    if (!info.artist.trim() || !info.song.trim() || !info.link.trim()) {
      setError(true);
      return;
    }
    setError(false);
    setCaptions(buildCaptions(info));
  };

  const field = (k: keyof Info, label: string, placeholder: string, type = "text") => (
    <div>
      <label htmlFor={`presave-${k}`} className="block text-sm font-semibold text-[#3D4852] mb-2">
        {label}
      </label>
      <input id={`presave-${k}`} type={type} value={info[k]} onChange={set(k)} placeholder={placeholder} className={inputClass} />
    </div>
  );

  return (
    <ToolCard
      title="Pre-Save Captions in Seconds"
      subtitle="Fill in your release details and get ready-to-post captions for every platform."
    >
      <div className="space-y-5">
        {field("artist", "Artist name", "e.g. Legion")}
        {field("song", "Song title", "e.g. Midnight Drive")}
        {field("date", "Release date", "", "date")}
        {field("link", "Pre-save link", "https://...")}
        {field("vibe", "One line about the song (optional)", "e.g. My most personal song yet.")}
        {error && (
          <p className="text-sm font-medium text-red-600">Please add your artist name, song title and pre-save link.</p>
        )}
        <button
          type="button"
          onClick={generate}
          className="w-full neu-extruded-sm rounded-2xl py-4 text-base font-semibold text-[#6C63FF] hover:-translate-y-0.5 active:translate-y-0.5 transition-transform"
        >
          Generate Captions
        </button>
        {captions && (
          <div className="space-y-4 pt-2">
            {captions.map((c) => (
              <CaptionBox key={c.platform} {...c} />
            ))}
          </div>
        )}
      </div>
    </ToolCard>
  );
}
