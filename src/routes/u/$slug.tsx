import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ProfileCard, type CardTheme, type ProfileData } from "@/components/tools/LinkedInProfileCard/ProfileCard";

async function fetchProfile(slug: string): Promise<ProfileData> {
  const { data, error } = await supabase
    .from("linkedin_profiles")
    .select("full_name, headline, company, location, about, skills, theme")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  if (!data) throw notFound();
  return {
    full_name: data.full_name,
    headline: data.headline ?? "",
    company: data.company ?? "",
    location: data.location ?? "",
    about: data.about ?? "",
    skills: data.skills ?? [],
    theme: (data.theme as CardTheme) ?? "editorial",
  };
}

const profileQueryOptions = (slug: string) =>
  queryOptions({
    queryKey: ["profile", slug],
    queryFn: () => fetchProfile(slug),
  });

export const Route = createFileRoute("/u/$slug")({
  loader: ({ params, context }) =>
    context.queryClient.ensureQueryData(profileQueryOptions(params.slug)),
  head: ({ params }) => ({
    meta: [
      { title: `${params.slug} — Profile Card` },
      { name: "description", content: "A shareable profile card." },
      { property: "og:title", content: `${params.slug} — Profile Card` },
      { property: "og:description", content: "A shareable profile card." },
    ],
  }),
  component: PublicProfilePage,
  errorComponent: ({ error }) => (
    <FallbackShell>
      <p className="text-[#3D4852] font-semibold">Couldn't load this profile.</p>
      <p className="text-xs text-[#6B7280] mt-2">{error.message}</p>
    </FallbackShell>
  ),
  notFoundComponent: () => (
    <FallbackShell>
      <p className="text-[#3D4852] font-semibold">Profile not found.</p>
      <p className="text-sm text-[#6B7280] mt-2">
        This link may have been mistyped or removed.
      </p>
    </FallbackShell>
  ),
});

function PublicProfilePage() {
  const { slug } = Route.useParams();
  const { data } = useSuspenseQuery(profileQueryOptions(slug));

  return (
    <div className="min-h-screen bg-[#E0E5EC] text-[#3D4852]">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 py-12 sm:py-20">
        <ProfileCard data={data} />
        <div className="mt-8 text-center">
          <Link
            to="/"
            className="neu-extruded-sm rounded-2xl px-5 py-2.5 text-sm font-semibold text-[#6C63FF] hover:-translate-y-0.5 transition-transform inline-block focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6C63FF]"
          >
            Make your own
          </Link>
        </div>
      </div>
    </div>
  );
}

function FallbackShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#E0E5EC] text-[#3D4852]">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 py-20">
        <div className="neu-extruded rounded-3xl p-8 text-center">
          {children}
          <div className="mt-6">
            <Link
              to="/"
              className="neu-extruded-sm rounded-2xl px-5 py-2.5 text-sm font-semibold text-[#6C63FF] hover:-translate-y-0.5 transition-transform inline-block"
            >
              Back to tools
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
