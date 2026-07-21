import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { Database } from "@/integrations/supabase/types";

export type Recommendation = {
  id: string;
  name: string;
  description: string;
  url: string;
  affiliate_url: string | null;
  category: string;
  tags: string[];
  logo_url: string | null;
  created_at: string;
  updated_at: string;
};

export type RecommendationInput = Omit<
  Recommendation,
  "id" | "created_at" | "updated_at" | "owner_id"
>;

function isNewSupabaseApiKey(value: string): boolean {
  return (
    value.startsWith("sb_publishable_") || value.startsWith("sb_secret_")
  );
}

function createSupabaseFetch(supabaseKey: string): typeof fetch {
  return (input, init) => {
    const headers = new Headers(
      typeof Request !== "undefined" && input instanceof Request
        ? input.headers
        : undefined,
    );

    if (init?.headers) {
      new Headers(init.headers).forEach((value, key) =>
        headers.set(key, value),
      );
    }

    if (
      isNewSupabaseApiKey(supabaseKey) &&
      headers.get("Authorization") === `Bearer ${supabaseKey}`
    ) {
      headers.delete("Authorization");
    }

    headers.set("apikey", supabaseKey);
    return fetch(input, { ...init, headers });
  };
}

function createServerClient() {
  const key = process.env.SUPABASE_PUBLISHABLE_KEY!;
  return createClient<Database>(process.env.SUPABASE_URL!, key, {
    auth: {
      storage: undefined,
      persistSession: false,
      autoRefreshToken: false,
    },
    global: { fetch: createSupabaseFetch(key) },
  });
}

export const getRecommendations = createServerFn({ method: "GET" }).handler(
  async () => {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from("software_recommendations")
      .select(
        "id, name, description, url, affiliate_url, category, tags, logo_url, created_at, updated_at",
      )
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data ?? []) as Recommendation[];
  },
);

export const createRecommendation = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: RecommendationInput) => input)
  .handler(async ({ data, context }) => {
    const { data: inserted, error } = await context.supabase
      .from("software_recommendations")
      .insert({
        name: data.name,
        description: data.description,
        url: data.url,
        affiliate_url: data.affiliate_url,
        category: data.category,
        tags: data.tags,
        logo_url: data.logo_url,
        owner_id: context.userId,
      })
      .select("id")
      .single();
    if (error) throw error;
    return { id: inserted.id };
  });
