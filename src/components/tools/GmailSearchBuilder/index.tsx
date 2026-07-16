import { useMemo, useState } from "react";
import { ToolCard } from "../ToolCard";

const inputClass =
  "neu-inset-sm rounded-2xl px-4 py-3 w-full bg-transparent outline-none text-[#3D4852] text-base placeholder:text-[#9AA3B2] focus:ring-2 focus:ring-[#6C63FF]";

const labelClass = "block text-sm font-semibold text-[#3D4852] mb-2";
const hintClass = "mt-1.5 text-xs text-[#9AA3B2]";

type AttachmentFilter = "any" | "has" | "no";
type ReadFilter = "any" | "unread" | "read";

interface Chip {
  key: string;
  label: string;
  onRemove: () => void;
}

function quoteIfNeeded(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return "";
  return /\s/.test(trimmed) ? `"${trimmed}"` : trimmed;
}

function toGmailDate(value: string): string {
  // input type=date returns YYYY-MM-DD; Gmail wants YYYY/MM/DD
  return value.replace(/-/g, "/");
}

export function GmailSearchBuilder() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [allWords, setAllWords] = useState("");
  const [exactPhrase, setExactPhrase] = useState("");
  const [anyWords, setAnyWords] = useState("");
  const [excludeWords, setExcludeWords] = useState("");
  const [label, setLabel] = useState("");
  const [inFolder, setInFolder] = useState("");
  const [after, setAfter] = useState("");
  const [before, setBefore] = useState("");
  const [attachment, setAttachment] = useState<AttachmentFilter>("any");
  const [filename, setFilename] = useState("");
  const [readState, setReadState] = useState<ReadFilter>("any");
  const [starred, setStarred] = useState(false);
  const [largerThanMb, setLargerThanMb] = useState("");
  const [copied, setCopied] = useState(false);

  const { query, chips } = useMemo(() => {
    const parts: string[] = [];
    const chips: Chip[] = [];

    const push = (part: string, chipLabel: string, clear: () => void) => {
      if (!part) return;
      parts.push(part);
      chips.push({ key: chipLabel, label: chipLabel, onRemove: clear });
    };

    if (from.trim()) push(`from:${from.trim()}`, `from: ${from.trim()}`, () => setFrom(""));
    if (to.trim()) push(`to:${to.trim()}`, `to: ${to.trim()}`, () => setTo(""));
    if (subject.trim()) {
      const s = quoteIfNeeded(subject);
      push(`subject:${s}`, `subject: ${subject.trim()}`, () => setSubject(""));
    }
    if (allWords.trim()) {
      const words = allWords.trim().split(/\s+/);
      words.forEach((w) => parts.push(w));
      chips.push({ key: "all", label: `all: ${allWords.trim()}`, onRemove: () => setAllWords("") });
    }
    if (exactPhrase.trim()) {
      parts.push(`"${exactPhrase.trim()}"`);
      chips.push({ key: "exact", label: `exact: "${exactPhrase.trim()}"`, onRemove: () => setExactPhrase("") });
    }
    if (anyWords.trim()) {
      const words = anyWords.trim().split(/\s+/);
      if (words.length === 1) {
        parts.push(words[0]);
      } else {
        parts.push(`{${words.join(" ")}}`);
      }
      chips.push({ key: "any", label: `any: ${anyWords.trim()}`, onRemove: () => setAnyWords("") });
    }
    if (excludeWords.trim()) {
      excludeWords.trim().split(/\s+/).forEach((w) => parts.push(`-${w}`));
      chips.push({ key: "exclude", label: `exclude: ${excludeWords.trim()}`, onRemove: () => setExcludeWords("") });
    }
    if (label.trim()) push(`label:${label.trim()}`, `label: ${label.trim()}`, () => setLabel(""));
    if (inFolder.trim()) push(`in:${inFolder.trim()}`, `in: ${inFolder.trim()}`, () => setInFolder(""));
    if (after) push(`after:${toGmailDate(after)}`, `after: ${after}`, () => setAfter(""));
    if (before) push(`before:${toGmailDate(before)}`, `before: ${before}`, () => setBefore(""));
    if (attachment === "has") push("has:attachment", "has attachment", () => setAttachment("any"));
    if (attachment === "no") push("-has:attachment", "no attachment", () => setAttachment("any"));
    if (filename.trim()) push(`filename:${filename.trim()}`, `filename: ${filename.trim()}`, () => setFilename(""));
    if (readState === "unread") push("is:unread", "unread", () => setReadState("any"));
    if (readState === "read") push("is:read", "read", () => setReadState("any"));
    if (starred) push("is:starred", "starred", () => setStarred(false));
    if (largerThanMb.trim() && !isNaN(Number(largerThanMb))) {
      push(`larger:${largerThanMb.trim()}M`, `larger than ${largerThanMb.trim()} MB`, () => setLargerThanMb(""));
    }

    return { query: parts.join(" "), chips };
  }, [
    from, to, subject, allWords, exactPhrase, anyWords, excludeWords,
    label, inFolder, after, before, attachment, filename, readState, starred, largerThanMb,
  ]);

  const searchUrl = query
    ? `https://mail.google.com/mail/u/0/?search=${encodeURIComponent(query)}`
    : "";

  const handleCopy = async () => {
    if (!query) return;
    try {
      await navigator.clipboard.writeText(query);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // ignore
    }
  };

  const handleReset = () => {
    setFrom(""); setTo(""); setSubject("");
    setAllWords(""); setExactPhrase(""); setAnyWords(""); setExcludeWords("");
    setLabel(""); setInFolder(""); setAfter(""); setBefore("");
    setAttachment("any"); setFilename(""); setReadState("any");
    setStarred(false); setLargerThanMb("");
  };

  return (
    <ToolCard
      title="Gmail Advanced Search Builder"
      subtitle="Fill in the fields you care about and get a ready-to-use Gmail search — no operator syntax to memorize."
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="gs-from" className={labelClass}>From</label>
            <input id="gs-from" type="text" value={from} onChange={(e) => setFrom(e.target.value)} placeholder="alice@example.com" className={inputClass} />
          </div>
          <div>
            <label htmlFor="gs-to" className={labelClass}>To</label>
            <input id="gs-to" type="text" value={to} onChange={(e) => setTo(e.target.value)} placeholder="bob@example.com" className={inputClass} />
          </div>
        </div>

        <div>
          <label htmlFor="gs-subject" className={labelClass}>Subject contains</label>
          <input id="gs-subject" type="text" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="invoice, receipt, meeting notes…" className={inputClass} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="gs-all" className={labelClass}>Has all of these words</label>
            <input id="gs-all" type="text" value={allWords} onChange={(e) => setAllWords(e.target.value)} placeholder="quarterly report" className={inputClass} />
            <p className={hintClass}>Every word must appear.</p>
          </div>
          <div>
            <label htmlFor="gs-exact" className={labelClass}>Has this exact phrase</label>
            <input id="gs-exact" type="text" value={exactPhrase} onChange={(e) => setExactPhrase(e.target.value)} placeholder="thanks for signing up" className={inputClass} />
          </div>
          <div>
            <label htmlFor="gs-any" className={labelClass}>Has any of these words</label>
            <input id="gs-any" type="text" value={anyWords} onChange={(e) => setAnyWords(e.target.value)} placeholder="urgent asap important" className={inputClass} />
            <p className={hintClass}>Matches if any one appears.</p>
          </div>
          <div>
            <label htmlFor="gs-exclude" className={labelClass}>Doesn't have</label>
            <input id="gs-exclude" type="text" value={excludeWords} onChange={(e) => setExcludeWords(e.target.value)} placeholder="newsletter promo" className={inputClass} />
            <p className={hintClass}>Excludes these words.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="gs-after" className={labelClass}>After date</label>
            <input id="gs-after" type="date" value={after} onChange={(e) => setAfter(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label htmlFor="gs-before" className={labelClass}>Before date</label>
            <input id="gs-before" type="date" value={before} onChange={(e) => setBefore(e.target.value)} className={inputClass} />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="gs-label" className={labelClass}>Label</label>
            <input id="gs-label" type="text" value={label} onChange={(e) => setLabel(e.target.value)} placeholder="clients" className={inputClass} />
          </div>
          <div>
            <label htmlFor="gs-in" className={labelClass}>In folder</label>
            <select id="gs-in" value={inFolder} onChange={(e) => setInFolder(e.target.value)} className={inputClass}>
              <option value="">Any</option>
              <option value="inbox">Inbox</option>
              <option value="sent">Sent</option>
              <option value="drafts">Drafts</option>
              <option value="spam">Spam</option>
              <option value="trash">Trash</option>
              <option value="anywhere">Anywhere (incl. spam/trash)</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="gs-attach" className={labelClass}>Attachments</label>
            <select id="gs-attach" value={attachment} onChange={(e) => setAttachment(e.target.value as AttachmentFilter)} className={inputClass}>
              <option value="any">Any</option>
              <option value="has">Has attachment</option>
              <option value="no">No attachment</option>
            </select>
          </div>
          <div>
            <label htmlFor="gs-filename" className={labelClass}>Filename or type</label>
            <input id="gs-filename" type="text" value={filename} onChange={(e) => setFilename(e.target.value)} placeholder="pdf, invoice.docx" className={inputClass} />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="gs-read" className={labelClass}>Read status</label>
            <select id="gs-read" value={readState} onChange={(e) => setReadState(e.target.value as ReadFilter)} className={inputClass}>
              <option value="any">Any</option>
              <option value="unread">Unread only</option>
              <option value="read">Read only</option>
            </select>
          </div>
          <div>
            <label htmlFor="gs-larger" className={labelClass}>Larger than (MB)</label>
            <input id="gs-larger" type="number" min="0" value={largerThanMb} onChange={(e) => setLargerThanMb(e.target.value)} placeholder="10" className={inputClass} />
          </div>
        </div>

        <label className="flex items-center gap-3 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={starred}
            onChange={(e) => setStarred(e.target.checked)}
            className="h-4 w-4 accent-[#6C63FF]"
          />
          <span className="text-sm font-semibold text-[#3D4852]">Starred only</span>
        </label>

        {query && (
          <div className="pt-4 space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="h-px bg-gradient-to-r from-transparent via-[#c8cfdb] to-transparent" />

            {chips.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {chips.map((chip) => (
                  <button
                    key={chip.key}
                    type="button"
                    onClick={chip.onRemove}
                    className="neu-extruded-sm rounded-full px-3 py-1.5 text-xs font-semibold text-[#3D4852] hover:text-[#6C63FF] transition-colors"
                    title="Click to remove"
                  >
                    {chip.label} <span className="ml-1 text-[#9AA3B2]">×</span>
                  </button>
                ))}
              </div>
            )}

            <div>
              <p className="text-sm text-[#6B7280] mb-3">Your Gmail search query</p>
              <div className="neu-inset rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                <code className="flex-1 text-sm font-mono text-[#3D4852] break-all">{query}</code>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="neu-extruded-sm rounded-xl px-5 py-2.5 text-sm font-semibold text-[#6C63FF] hover:-translate-y-0.5 active:translate-y-0.5 transition-transform whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6C63FF]"
                >
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href={searchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="neu-extruded-sm rounded-2xl px-6 py-3 text-sm font-semibold text-[#6C63FF] text-center hover:-translate-y-0.5 active:translate-y-0.5 transition-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6C63FF]"
              >
                Open in Gmail →
              </a>
              <button
                type="button"
                onClick={handleReset}
                className="neu-inset-sm rounded-2xl px-6 py-3 text-sm font-semibold text-[#6B7280] hover:text-[#3D4852] transition-colors"
              >
                Reset all fields
              </button>
            </div>
          </div>
        )}

        {!query && (
          <p className="text-sm text-[#9AA3B2]">
            Fill in one or more fields above to build your search.
          </p>
        )}
      </div>
    </ToolCard>
  );
}
