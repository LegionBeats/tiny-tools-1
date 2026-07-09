import { useState, type FormEvent } from "react";
import { captureLead } from "@/lib/artist-audit/api";

interface CaptureFormProps {
  artistId: string;
  artistName: string;
  score: number;
  heading?: string;
  subline?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function CaptureForm({
  artistId,
  artistName,
  score,
  heading = "Send me this report",
  subline = "Get your Momentum Audit in your inbox so you can act on it later.",
}: CaptureFormProps) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!EMAIL_RE.test(trimmed) || trimmed.length > 255) {
      setError("Enter a valid email.");
      return;
    }
    setError(null);
    setStatus("sending");
    try {
      await captureLead({ email: trimmed, artistId, artistName, score });
      setStatus("sent");
    } catch {
      setStatus("idle");
      setError("Couldn't send that — try again.");
    }
  };

  if (status === "sent") {
    return (
      <div className="neu-inset rounded-3xl p-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
        <div className="flex items-center gap-3">
          <svg
            viewBox="0 0 20 20"
            aria-hidden="true"
            className="w-6 h-6 text-[#38B2AC] shrink-0"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4 10.5 L8.5 15 L16 6" />
          </svg>
          <p className="font-semibold text-[#3D4852]">Sent — check your inbox.</p>
        </div>
      </div>
    );
  }

  const sending = status === "sending";

  return (
    <div className="neu-inset rounded-3xl p-6">
      <h3 className="font-semibold text-[#3D4852] text-lg">Send me this report</h3>
      <p className="mt-1 text-sm text-[#6B7280]">
        Get your Momentum Audit in your inbox so you can act on it later.
      </p>
      <form onSubmit={handleSubmit} className="mt-4 flex flex-col sm:flex-row gap-3" noValidate>
        <label htmlFor="capture-email" className="sr-only">
          Email address
        </label>
        <input
          id="capture-email"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="you@email.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (error) setError(null);
          }}
          disabled={sending}
          maxLength={255}
          className="neu-inset-sm rounded-2xl px-4 py-3 w-full bg-transparent outline-none text-[#3D4852] placeholder:text-[#9AA3B2] focus:ring-2 focus:ring-[#6C63FF] disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={sending}
          className="neu-extruded-sm rounded-2xl px-5 py-3 text-sm font-semibold text-[#6C63FF] hover:-translate-y-0.5 active:translate-y-0.5 transition-transform whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6C63FF] disabled:opacity-60 disabled:hover:translate-y-0"
        >
          {sending ? "Sending…" : "Email my report"}
        </button>
      </form>
      {error && (
        <p role="alert" className="mt-3 text-sm text-[#c0564a]">
          {error}
        </p>
      )}
    </div>
  );
}
