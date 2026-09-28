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
      title="Grab the favicon (logo) from any website"
      subtitle="Type in any website and instantly see its little tab icon/logo — preview it, and download it in a click!"
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
            Icon for <span className="font-mono text-[#3D4852]">{domain}</span>
          </p>
          <div className="neu-inset rounded-2xl p-6 flex flex-col items-center gap-4">
            <div className="h-32 flex items-center justify-center">
              <img
                src={`https://www.google.com/s2/favicons?domain=${domain}&sz=128`}
                alt={`${domain} favicon`}
                className="max-h-32 max-w-32"
              />
            </div>
            <a
              href={`/api/public/favicon?source=google&sz=128&domain=${domain}`}
              download
              className="neu-extruded-sm rounded-xl px-6 py-2.5 text-sm font-semibold text-[#6C63FF] hover:-translate-y-0.5 active:translate-y-0.5 transition-transform"
            >
              Download
            </a>
          </div>
        </div>
      )}
    </ToolCard>
  );
}
