import { createFileRoute } from "@tanstack/react-router";
import { queryOptions } from "@tanstack/react-query";
import { getRecommendations } from "@/lib/software-recommendations.functions";
import {
  SoftwareDirectory,
  recommendationsQueryOptions,
} from "@/components/SoftwareDirectory";

export const Route = createFileRoute("/stack")({
  head: () => ({
    meta: [
      { title: "Software Stack — Tools I use & recommend" },
      {
        name: "description",
        content:
          "A curated list of software I use and recommend for creators, small businesses, and music makers.",
      },
      {
        property: "og:title",
        content: "Software Stack — Tools I use & recommend",
      },
      {
        property: "og:description",
        content:
          "A curated list of software I use and recommend for creators, small businesses, and music makers.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(recommendationsQueryOptions()),
  component: SoftwareDirectory,
  errorComponent: StackErrorComponent,
  notFoundComponent: StackNotFoundComponent,
});

function StackErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  return (
    <div className="min-h-screen bg-[#E0E5EC] text-[#3D4852] flex items-center justify-center px-4">
      <div className="neu-extruded rounded-3xl p-8 max-w-md text-center">
        <h1 className="font-display text-2xl font-bold mb-2">
          Couldn&apos;t load the stack
        </h1>
        <p className="text-[#6B7280] mb-6">
          Something went wrong while fetching the software list.
        </p>
        <button
          onClick={reset}
          className="neu-extruded-sm rounded-2xl px-6 py-3 text-sm font-semibold text-[#6C63FF] hover:-translate-y-0.5 active:translate-y-0.5 transition-transform"
        >
          Try again
        </button>
      </div>
    </div>
  );
}

function StackNotFoundComponent() {
  return (
    <div className="min-h-screen bg-[#E0E5EC] text-[#3D4852] flex items-center justify-center px-4">
      <div className="neu-extruded rounded-3xl p-8 max-w-md text-center">
        <h1 className="font-display text-2xl font-bold mb-2">Not found</h1>
        <p className="text-[#6B7280]">
          The page you&apos;re looking for doesn&apos;t exist.
        </p>
      </div>
    </div>
  );
}
