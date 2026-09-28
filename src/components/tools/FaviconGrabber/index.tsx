import { useState } from "react";
import { ToolCard } from "../ToolCard";

const inputClass =
  "neu-inset-sm rounded-2xl px-4 py-3 w-full bg-transparent outline-none text-[#3D4852] text-base placeholder:text-[#9AA3B2] focus:ring-2 focus:ring-[#6C63FF]";

function extractDomain(input: string): string | null {
  const raw = input.trim();
  if (!raw) return null;
  try {
    const url = new URL(/^[a-z]+:\/\//i.test(raw) ? raw : `https://${raw}`);
    const host = url.hostname.replace(/^www\./, "");
    return host.includes(".") ? host : null;
  } catch {
    return null;
  }
}

function sources(domain: string) {
  return [
    { label: "Google · 128px", url: `https://www.google.com/s2/favicons?domain=${domain}&sz=128`, ext: "png" },
    { label: "Google · 64px", url: `https://www.google.com/s2/favicons?domain=${domain}&sz=64`, ext: "png" },
    { label: "Google · 32px", url: `https://www.google.com/s2/favicons?domain=${domain}&sz=32`, ext: "png" },
    { label: "DuckDuckGo", url: `https://icons.duckduckgo.com/ip3/${domain}.ico`, ext: "ico" },
  ];
}

async function download(url: string, filename: string) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error();
    const blob = await res.blob();
    const href = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = href;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(href);
  } catch {
    window.open(url, "_blank", "noopener,noreferrer");
  }
}

export function FaviconGrabber() {
  const [input, setInput] = useState("");
  const [domain, setDomain] = useState<string | null>(null);
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const d = extractDomain(input);
    setError(!d);
    setDomain(d);
  };

  return (
    <ToolCard
      title="Grab Any Website's Favicon"
      subtitle="Type in a website and instantly see its little tab icon — preview it and download it in a click."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="favicon-url" className="block text-sm font-semibold text-[#3D4852] mb-2">
            Website address
          </label>
          <input
            id="favicon-url"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="example.com"
            className={inputClass}
          />
          {error && (
            <p className="mt-2 text-sm text-red-600">Please enter a valid website, like example.com</p>
          )}
        </div>
        <button
          type="submit"
          className="w-full neu-extruded-sm rounded-2xl px-6 py-3 text-base font-semibold text-[#6C63FF] hover:-translate-y-0.5 active:translate-y-0.5 transition-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6C63FF]"
        >
          Get Favicon
        </button>
      </form>

      {domain && (
        <div className="pt-8 space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
          <p className="text-sm text-[#6B7280]">
            Icons for <span className="font-mono text-[#3D4852]">{domain}</span>
          </p>
          <div className="grid grid-cols-2 gap-4">
            {sources(domain).map((s) => (
              <div key={s.url} className="neu-inset rounded-2xl p-4 flex flex-col items-center gap-3">
                <div className="h-20 flex items-center justify-center">
                  <img src={s.url} alt={`${domain} favicon (${s.label})`} className="max-h-16 max-w-16" />
                </div>
                <span className="text-xs text-[#6B7280]">{s.label}</span>
                <button
                  type="button"
                  onClick={() => download(s.url, `${domain}-favicon-${s.label.replace(/\W+/g, "-").toLowerCase()}.${s.ext}`)}
                  className="neu-extruded-sm rounded-xl px-4 py-2 text-xs font-semibold text-[#6C63FF] hover:-translate-y-0.5 active:translate-y-0.5 transition-transform"
                >
                  Download
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </ToolCard>
  );
}
