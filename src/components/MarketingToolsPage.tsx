import { SmsOptInTool } from "./tools/SmsOptInTool";

const tools = [{ id: "sms-optin", Component: SmsOptInTool }];

export function MarketingToolsPage() {
  return (
    <div className="min-h-screen bg-[#E0E5EC] text-[#3D4852]">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-12 sm:py-20">
        <header className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 neu-extruded-sm rounded-full px-4 py-1.5 mb-6">
            <span className="h-2 w-2 rounded-full bg-[#6C63FF]" />
            <span className="text-xs font-semibold tracking-wider uppercase text-[#6B7280]">
              Marketing Tools
            </span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-extrabold tracking-tight text-[#3D4852]">
            Tiny tools for big audiences.
          </h1>
          <p className="mt-4 text-base sm:text-lg text-[#6B7280] max-w-xl mx-auto leading-relaxed">
            A growing toolbox for creators and small businesses. Quick to use, no signup, no fuss.
          </p>
        </header>

        <div className="space-y-10">
          {tools.map(({ id, Component }) => (
            <Component key={id} />
          ))}
        </div>

        <footer className="mt-16 text-center text-xs text-[#9AA3B2]">
          More tools coming soon.
        </footer>
      </div>
    </div>
  );
}
