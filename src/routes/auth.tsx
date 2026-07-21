import { createFileRoute } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in" },
      { name: "description", content: "Sign in to Tiny Tools admin." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const handleGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin,
      },
    });
  };

  return (
    <div className="min-h-screen bg-[#E0E5EC] text-[#3D4852] flex items-center justify-center px-4">
      <div className="neu-extruded rounded-3xl p-8 sm:p-12 max-w-md w-full text-center">
        <h1 className="font-display text-2xl font-bold text-[#3D4852] mb-2">
          Sign in
        </h1>
        <p className="text-[#6B7280] mb-8">
          Only the admin can add new software recommendations.
        </p>
        <button
          type="button"
          onClick={handleGoogle}
          className="w-full neu-extruded-sm rounded-2xl py-3 text-sm font-semibold text-[#3D4852] hover:-translate-y-0.5 active:translate-y-0.5 transition-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6C63FF]"
        >
          Continue with Google
        </button>
      </div>
    </div>
  );
}
