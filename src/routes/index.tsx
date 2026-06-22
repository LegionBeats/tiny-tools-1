import { createFileRoute } from "@tanstack/react-router";
import { MarketingToolsPage } from "../components/MarketingToolsPage";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Marketing Tools — Free tools for creators & small businesses" },
      {
        name: "description",
        content:
          "A growing collection of free marketing tools. Start with the SMS opt-in link & QR code generator — grow your text list in one tap.",
      },
      { property: "og:title", content: "Marketing Tools" },
      {
        property: "og:description",
        content:
          "Free marketing tools for creators and small businesses. Generate an SMS opt-in link and QR code in seconds.",
      },
    ],
  }),
  component: MarketingToolsPage,
});
