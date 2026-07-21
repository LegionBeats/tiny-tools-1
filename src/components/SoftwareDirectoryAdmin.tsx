import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useNavigate } from "@tanstack/react-router";
import {
  createRecommendation,
  type RecommendationInput,
} from "@/lib/software-recommendations.functions";
import { SiteNav, SiteFooterNav } from "./SiteNav";

type FormState = {
  name: string;
  description: string;
  url: string;
  affiliate_url: string;
  category: string;
  tags: string;
  logo_url: string;
};

const EMPTY_FORM: FormState = {
  name: "",
  description: "",
  url: "",
  affiliate_url: "",
  category: "",
  tags: "",
  logo_url: "",
};

export function SoftwareDirectoryAdmin() {
  const navigate = useNavigate();
  const add = useServerFn(createRecommendation);

  const [form, setForm] = useState(EMPTY_FORM);
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setError("");

    try {
      const input: RecommendationInput = {
        name: form.name.trim(),
        description: form.description.trim(),
        url: form.url.trim(),
        affiliate_url: form.affiliate_url.trim() || null,
        category: form.category.trim(),
        tags: form.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        logo_url: form.logo_url.trim() || null,
      };
      await add({ data: input });
      setStatus("success");
      setTimeout(() => {
        navigate({ to: "/stack" });
      }, 800);
    } catch (err) {
      setStatus("error");
      setError(
        err instanceof Error ? err.message : "Something went wrong. Try again.",
      );
    }
  };

  const inputClass =
    "neu-inset-sm rounded-2xl px-4 py-3 w-full bg-transparent outline-none text-[#3D4852] text-base placeholder:text-[#9AA3B2] focus:ring-2 focus:ring-[#6C63FF]";

  return (
    <div className="min-h-screen bg-[#E0E5EC] text-[#3D4852]">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 py-12 sm:py-20">
        <header className="text-center mb-12">
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#3D4852]">
            Add a software recommendation
          </h1>
          <p className="mt-2 text-[#6B7280]">
            Curated tools for the Software Stack page.
          </p>
        </header>

        <form
          onSubmit={handleSubmit}
          className="neu-extruded rounded-3xl p-6 sm:p-10 space-y-6"
        >
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-semibold text-[#3D4852] mb-2"
            >
              Name
            </label>
            <input
              id="name"
              name="name"
              required
              type="text"
              value={form.name}
              onChange={handleChange}
              className={inputClass}
              placeholder="e.g. Notion"
            />
          </div>

          <div>
            <label
              htmlFor="category"
              className="block text-sm font-semibold text-[#3D4852] mb-2"
            >
              Category
            </label>
            <input
              id="category"
              name="category"
              required
              type="text"
              value={form.category}
              onChange={handleChange}
              className={inputClass}
              placeholder="e.g. Productivity"
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-semibold text-[#3D4852] mb-2"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              required
              rows={3}
              value={form.description}
              onChange={handleChange}
              className={inputClass}
              placeholder="What does it do and why do you recommend it?"
            />
          </div>

          <div>
            <label
              htmlFor="url"
              className="block text-sm font-semibold text-[#3D4852] mb-2"
            >
              URL
            </label>
            <input
              id="url"
              name="url"
              required
              type="url"
              value={form.url}
              onChange={handleChange}
              className={inputClass}
              placeholder="https://example.com"
            />
          </div>

          <div>
            <label
              htmlFor="affiliate_url"
              className="block text-sm font-semibold text-[#3D4852] mb-2"
            >
              Affiliate URL (optional)
            </label>
            <input
              id="affiliate_url"
              name="affiliate_url"
              type="url"
              value={form.affiliate_url}
              onChange={handleChange}
              className={inputClass}
              placeholder="https://example.com?ref=you"
            />
          </div>

          <div>
            <label
              htmlFor="tags"
              className="block text-sm font-semibold text-[#3D4852] mb-2"
            >
              Tags (comma-separated)
            </label>
            <input
              id="tags"
              name="tags"
              type="text"
              value={form.tags}
              onChange={handleChange}
              className={inputClass}
              placeholder="collaboration, notes, free-plan"
            />
          </div>

          <div>
            <label
              htmlFor="logo_url"
              className="block text-sm font-semibold text-[#3D4852] mb-2"
            >
              Logo URL (optional)
            </label>
            <input
              id="logo_url"
              name="logo_url"
              type="url"
              value={form.logo_url}
              onChange={handleChange}
              className={inputClass}
              placeholder="https://example.com/logo.png"
            />
          </div>

          {status === "error" && (
            <p className="text-sm text-red-600 font-medium">{error}</p>
          )}

          {status === "success" && (
            <p className="text-sm text-green-600 font-medium">
              Saved! Redirecting...
            </p>
          )}

          <button
            type="submit"
            disabled={status === "loading" || status === "success"}
            className="w-full neu-extruded-sm rounded-2xl py-4 text-base font-semibold text-[#6C63FF] hover:-translate-y-0.5 active:translate-y-0.5 transition-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6C63FF] disabled:opacity-60"
          >
            {status === "loading" ? "Saving..." : "Add to Stack"}
          </button>
        </form>
      </div>
    </div>
  );
}
