import { useMemo, useState } from "react";
import { ToolCard } from "../ToolCard";

const DEFAULT_BUTTON_TEXT = "Find my confirmation email";

const inputClass =
  "neu-inset-sm rounded-2xl px-4 py-3 w-full bg-transparent outline-none text-[#3D4852] text-base placeholder:text-[#9AA3B2] focus:ring-2 focus:ring-[#6C63FF]";

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function buildGmailSearchUrl(from: string, subject: string): string {
  const parts: string[] = [];
  if (from.trim()) parts.push(`from:${from.trim()}`);
  if (subject.trim()) parts.push(`subject:${subject.trim()}`);
  const query = parts.join(" ");
  return `https://mail.google.com/mail/u/0/?search=${encodeURIComponent(query)}`;
}

function buildEmbedHtml(
  from: string,
  subject: string,
  buttonText: string,
): string {
  const url = buildGmailSearchUrl(from, subject);
  return `<a href="${url}" target="_blank" rel="noopener noreferrer" style="display:inline-block;padding:12px 24px;background:#6C63FF;color:#ffffff;font-family:sans-serif;font-size:16px;font-weight:600;text-decoration:none;border-radius:9999px;box-shadow:0 4px 14px rgba(108,99,255,0.35);">
  ${buttonText.trim() || DEFAULT_BUTTON_TEXT}
</a>`;
}

export function FindMyEmailTool() {
  const [fromAddress, setFromAddress] = useState("");
  const [subjectKeyword, setSubjectKeyword] = useState("");
  const [buttonText, setButtonText] = useState(DEFAULT_BUTTON_TEXT);
  const [copied, setCopied] = useState(false);

  const canShowOutput = isValidEmail(fromAddress);
  const embedHtml = useMemo(
    () => buildEmbedHtml(fromAddress, subjectKeyword, buttonText),
    [fromAddress, subjectKeyword, buttonText],
  );
  const searchUrl = useMemo(
    () => buildGmailSearchUrl(fromAddress, subjectKeyword),
    [fromAddress, subjectKeyword],
  );

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(embedHtml);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // ignore
    }
  };

  return (
    <ToolCard
      title="Help Subscribers Find Your Confirmation Email"
      subtitle="Generate a Gmail-search button your subscribers can click to surface your confirmation email instantly."
    >
      <div className="space-y-6">
        <div>
          <label htmlFor="find-email-from" className="block text-sm font-semibold text-[#3D4852] mb-2">
            Your sender email address
          </label>
          <input
            id="find-email-from"
            type="email"
            value={fromAddress}
            onChange={(e) => setFromAddress(e.target.value)}
            placeholder="hello@yourcompany.com"
            className={inputClass}
          />
          <p className="mt-2 text-xs text-[#6B7280]">
            The "from" address your confirmation email is sent from.
          </p>
        </div>

        <div>
          <label htmlFor="find-email-subject" className="block text-sm font-semibold text-[#3D4852] mb-2">
            Subject keyword
          </label>
          <input
            id="find-email-subject"
            type="text"
            value={subjectKeyword}
            onChange={(e) => setSubjectKeyword(e.target.value)}
            placeholder="Confirm"
            className={inputClass}
          />
          <p className="mt-2 text-xs text-[#6B7280]">
            A word that appears in the confirmation email subject line. Optional, but makes the search much faster.
          </p>
        </div>

        <div>
          <label htmlFor="find-email-button" className="block text-sm font-semibold text-[#3D4852] mb-2">
            Button text
          </label>
          <input
            id="find-email-button"
            type="text"
            value={buttonText}
            onChange={(e) => setButtonText(e.target.value)}
            placeholder={DEFAULT_BUTTON_TEXT}
            maxLength={80}
            className={inputClass}
          />
        </div>

        {canShowOutput && (
          <div className="pt-4 space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="h-px bg-gradient-to-r from-transparent via-[#c8cfdb] to-transparent" />

            <div>
              <p className="text-sm text-[#6B7280] mb-3">
                Live preview — this is exactly what subscribers will see.
              </p>
              <div className="neu-inset rounded-2xl p-6 sm:p-8 flex items-center justify-center">
                <a
                  href={searchUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-block",
                    padding: "12px 24px",
                    background: "#6C63FF",
                    color: "#ffffff",
                    fontFamily: "sans-serif",
                    fontSize: "16px",
                    fontWeight: 600,
                    textDecoration: "none",
                    borderRadius: "9999px",
                    boxShadow: "0 4px 14px rgba(108,99,255,0.35)",
                  }}
                >
                  {buttonText.trim() || DEFAULT_BUTTON_TEXT}
                </a>
              </div>
            </div>

            <div>
              <p className="text-sm text-[#6B7280] mb-3">
                Copy this HTML and paste it into your confirmation page, email, or funnel.
              </p>
              <div className="neu-inset rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-start gap-4">
                <textarea
                  readOnly
                  value={embedHtml}
                  className="flex-1 min-h-[120px] bg-transparent outline-none text-xs font-mono text-[#3D4852] resize-none focus:ring-2 focus:ring-[#6C63FF] rounded-md"
                  aria-label="Embed HTML"
                />
                <button
                  type="button"
                  onClick={handleCopy}
                  className="neu-extruded-sm rounded-xl px-5 py-2.5 text-sm font-semibold text-[#6C63FF] hover:-translate-y-0.5 active:translate-y-0.5 transition-transform whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6C63FF]"
                >
                  {copied ? "Copied!" : "Copy HTML"}
                </button>
              </div>
            </div>
          </div>
        )}

        {!canShowOutput && (
          <p className="text-sm text-[#9AA3B2]">
            Enter a valid sender email address to generate the button and HTML.
          </p>
        )}
      </div>
    </ToolCard>
  );
}
