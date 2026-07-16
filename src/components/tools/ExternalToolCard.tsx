import { ToolCard } from "./ToolCard";

interface ExternalToolCardProps {
  title: string;
  description: string;
  url: string;
  linkText: string;
}

export function ExternalToolCard({ title, description, url, linkText }: ExternalToolCardProps) {
  return (
    <ToolCard
      title={title}
      subtitle={description}
    >
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 neu-extruded-sm rounded-2xl px-6 py-3 text-sm font-semibold text-[#6C63FF] hover:-translate-y-0.5 active:translate-y-0.5 transition-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6C63FF]"
      >
        {linkText}
        <span aria-hidden="true">→</span>
      </a>
    </ToolCard>
  );
}
