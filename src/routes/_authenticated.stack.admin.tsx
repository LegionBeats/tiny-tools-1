import { createFileRoute } from "@tanstack/react-router";
import { SoftwareDirectoryAdmin } from "@/components/SoftwareDirectoryAdmin";

export const Route = createFileRoute("/_authenticated/stack/admin")({
  head: () => ({
    meta: [
      { title: "Add Software Recommendation" },
      {
        name: "description",
        content: "Admin form for adding new software recommendations.",
      },
      { property: "og:title", content: "Add Software Recommendation" },
      {
        property: "og:description",
        content: "Admin form for adding new software recommendations.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: SoftwareDirectoryAdmin,
});
