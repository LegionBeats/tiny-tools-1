import { useMemo, useRef, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { ToolCard } from "../ToolCard";
import { COUNTRIES, DEFAULT_COUNTRY } from "./countries";

function formatPhoneDisplay(digits: string, dial: string): string {
  // Light US-style grouping when dial is 1 and 10 digits, otherwise group in 3s.
  if (dial === "1" && digits.length <= 10) {
    const a = digits.slice(0, 3);
    const b = digits.slice(3, 6);
    const c = digits.slice(6, 10);
    return [a, b, c].filter(Boolean).join(" ");
  }
  return digits.replace(/(.{3})/g, "$1 ").trim();
}

export function SmsOptInTool() {
  const [countryCode, setCountryCode] = useState(DEFAULT_COUNTRY.code);
  const [phone, setPhone] = useState("");
  const [keyword, setKeyword] = useState("JOIN");
  const [result, setResult] = useState<{ link: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const [showPhoneError, setShowPhoneError] = useState(false);
  const qrWrapRef = useRef<HTMLDivElement>(null);

  const country = useMemo(
    () => COUNTRIES.find((c) => c.code === countryCode) ?? DEFAULT_COUNTRY,
    [countryCode],
  );

  const digits = phone.replace(/\D/g, "");
  const canGenerate = digits.length >= 7 && keyword.trim().length > 0;

  const handleGenerate = () => {
    if (!canGenerate) {
      setShowPhoneError(digits.length < 7);
      return;
    }
    const body = encodeURIComponent(keyword.trim());
    const link = `sms:+${country.dial}${digits}?body=${body}`;
    setResult({ link });
    setCopied(false);
    setShowPhoneError(false);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(e.target.value);
    if (showPhoneError) setShowPhoneError(false);
  };

  const handleCopy = async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result.link);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // ignore
    }
  };

  const handleDownload = () => {
    const canvas = qrWrapRef.current?.querySelector("canvas");
    if (!canvas) return;
    const url = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = `sms-optin-${keyword.trim().toLowerCase() || "qr"}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <ToolCard
      title={'Want to "take over" potential customers\' phones?'}
      subtitle={
        <ul className="list-disc pl-5 space-y-1">
          <li>
            Have <em>your</em> subscribe word already written in a text that's going to <em>your</em> SMS signup number.
          </li>
          <li>Literally all they have to do is hit send and you've got another subscriber.</li>
          <li>It's like magic ✨</li>
          <li>For your customized QR code, just enter your number + optin keyword.</li>
        </ul>
      }
    >
      <div className="space-y-6">
        {/* Phone */}
        <div>
          <label className="block text-sm font-semibold text-[#3D4852] mb-2">
            Your phone number
          </label>
          <div className="flex gap-3">
            <div className="neu-inset-sm rounded-2xl px-3 py-3 flex items-center">
              <select
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                className="bg-transparent outline-none text-[#3D4852] font-medium text-sm pr-1 focus:ring-2 focus:ring-[#6C63FF] rounded-md"
                aria-label="Country code"
              >
                {COUNTRIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.flag} +{c.dial}
                  </option>
                ))}
              </select>
            </div>
            <input
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              placeholder="555 123 4567"
              value={formatPhoneDisplay(digits, country.dial)}
              onChange={handlePhoneChange}
              className={[
                "neu-inset-sm rounded-2xl px-4 py-3 flex-1 bg-transparent outline-none text-[#3D4852] text-base placeholder:text-[#9AA3B2] focus:ring-2",
                showPhoneError
                  ? "ring-2 ring-red-500 focus:ring-red-500"
                  : "focus:ring-[#6C63FF]",
              ].join(" ")}
              aria-invalid={showPhoneError}
            />
          </div>
          <p className="mt-2 text-xs text-[#6B7280]">
            The number your audience will text to opt in.
          </p>
          {showPhoneError && (
            <p className="mt-2 text-xs text-red-600 font-medium">
              Please enter a valid phone number to generate your QR code.
            </p>
          )}
        </div>

        {/* Keyword */}
        <div>
          <label className="block text-sm font-semibold text-[#3D4852] mb-2">
            Opt-in keyword
          </label>
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value.toUpperCase())}
            maxLength={32}
            className="neu-inset-sm rounded-2xl px-4 py-3 w-full bg-transparent outline-none text-[#3D4852] text-base tracking-wide font-medium focus:ring-2 focus:ring-[#6C63FF]"
          />
          <p className="mt-2 text-xs text-[#6B7280]">
            This message gets pre-filled for your audience. Common choices: JOIN, YES, SUBSCRIBE
          </p>
        </div>

        {/* Generate */}
        <button
          type="button"
          onClick={handleGenerate}
          className={[
            "w-full rounded-2xl py-4 text-base font-semibold tracking-wide transition-all duration-200",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6C63FF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#E0E5EC]",
            canGenerate
              ? "neu-extruded-sm text-[#6C63FF] hover:-translate-y-0.5 active:translate-y-0.5 active:[box-shadow:inset_4px_4px_8px_rgba(163,177,198,0.6),inset_-4px_-4px_8px_rgba(255,255,255,0.9)] cursor-pointer"
              : "neu-inset-sm text-[#9AA3B2] cursor-not-allowed",
          ].join(" ")}
        >
          Generate
        </button>

        {/* Output */}
        {result && (
          <div className="pt-4 space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="h-px bg-gradient-to-r from-transparent via-[#c8cfdb] to-transparent" />

            {/* Link */}
            <div>
              <p className="text-sm text-[#6B7280] mb-3">
                Add this to your link in bio, website, funnels, landing pages, or anywhere online.
              </p>
              <div className="neu-inset rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                <code className="font-mono text-sm sm:text-base text-[#3D4852] break-all flex-1 select-all">
                  {result.link}
                </code>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="neu-extruded-sm rounded-xl px-5 py-2.5 text-sm font-semibold text-[#6C63FF] hover:-translate-y-0.5 active:translate-y-0.5 transition-transform whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6C63FF]"
                >
                  {copied ? "Copied!" : "Copy Link"}
                </button>
              </div>
            </div>

            {/* QR */}
            <div className="flex flex-col items-center text-center">
              <div
                ref={qrWrapRef}
                className="neu-extruded rounded-3xl p-6 sm:p-8 inline-block"
              >
                <QRCodeCanvas
                  value={result.link}
                  size={240}
                  bgColor="#E0E5EC"
                  fgColor="#3D4852"
                  level="M"
                  marginSize={2}
                />
              </div>
              <button
                type="button"
                onClick={handleDownload}
                className="mt-6 neu-extruded-sm rounded-2xl px-6 py-3 text-sm font-semibold text-[#6C63FF] hover:-translate-y-0.5 active:translate-y-0.5 transition-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6C63FF]"
              >
                Download QR Code
              </button>
              <ul className="mt-6 space-y-2 text-sm text-[#6B7280] max-w-md">
                <li>
                  <span className="font-semibold text-[#3D4852]">Share it digitally</span> — drop it on your website, emails, or social posts.
                </li>
                <li>
                  <span className="font-semibold text-[#3D4852]">Print it</span> — add it to flyers, business cards, packaging, or handouts.
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </ToolCard>
  );
}
