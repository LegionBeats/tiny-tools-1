import type { ReactNode } from "react";

interface ToolCardProps {
  title: string;
  subtitle?: ReactNode;
  children: ReactNode;
}

export function ToolCard({ title, subtitle, children }: ToolCardProps) {
  return (
    <section className="neu-extruded rounded-3xl p-6 sm:p-10">
      <header className="mb-8">
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#3D4852] tracking-tight">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-2 text-[#6B7280] text-sm sm:text-base leading-relaxed">
            {subtitle}
          </p>
        )}
      </header>
      {children}
    </section>
  );
}
