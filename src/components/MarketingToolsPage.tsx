import { SmsOptInTool } from "./tools/SmsOptInTool";
import { ArtistAudit } from "./tools/ArtistAudit";
import { LinkedInProfileCardTool } from "./tools/LinkedInProfileCard";
import { FindMyEmailTool } from "./tools/FindMyEmailTool";
import { GmailSearchBuilder } from "./tools/GmailSearchBuilder";
import { ExternalToolCard } from "./tools/ExternalToolCard";
import { SiteNav, SiteFooterNav } from "./SiteNav";


const tools = [
  { id: "sms-optin", Component: SmsOptInTool },
  { id: "artist-audit", Component: ArtistAudit },
  { id: "linkedin-profile-card", Component: LinkedInProfileCardTool },
  { id: "find-my-email", Component: FindMyEmailTool },
  { id: "gmail-search-builder", Component: GmailSearchBuilder },
];

export function MarketingToolsPage() {
  return (
    <div className="min-h-screen bg-[#E0E5EC] text-[#3D4852]">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12 sm:py-20">
        <SiteNav />
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          {tools.map(({ id, Component }) => (
            <Component key={id} />
          ))}
          <ExternalToolCard
            title="Roast My Beat"
            description="Get honest feedback on your music from a community of creators. External tool — link out to give it a try."
            url="https://roast-my-beat.netlify.app/"
            linkText="Try Roast My Beat"
          />
        </div>

        <SiteFooterNav />
      </div>
    </div>
  );
}

