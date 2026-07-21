### Recommendation
Add the software directory to the current **Tiny Tools** project as a new standalone route. This is the fastest path and keeps the architecture clean:

- You already have the Supabase backend, auth, and neumorphic design system in place.
- The tool cards are already modular — a directory page can reuse the same visual language and feel like a natural sibling to the existing tools.
- It gives you a real URL to share (`/stack` or `/recommends`) and the option to later spin it out into its own brand/project without rebuilding anything.
- It does not dilute the homepage; the homepage stays focused on interactive tools, and the directory lives on its own route.

If it ever grows into its own brand or needs its own domain, you can extract it cleanly because it will be a self-contained set of components and a single route.

### What we'll build

1. **Database table: `software_recommendations`**
   - `id`, `name`, `description`, `url`, `affiliate_url` (optional), `category`, `tags` (array), `logo_url` (optional), `created_at`.
   - RLS: public read, authenticated write only for you (so you can add entries; anonymous users can never mutate).

2. **Admin route/page: `/stack/admin`**
   - A simple form for you to add new software entries.
   - Not advertised in the main navigation; you navigate to it directly.
   - Protected by auth gate so only your account can use it.

3. **Public directory page: `/stack`**
   - Header with the same neumorphic hero styling as the homepage.
   - Filter/search bar and category pills.
   - Cards for each software entry: name, description, category, tags, and a CTA button.
   - If an `affiliate_url` exists, the CTA uses it; otherwise it uses the plain `url`.
   - Responsive grid matching the rest of the site.

4. **Navigation update**
   - Add a small, subtle link in the homepage header or footer to `/stack` so visitors can discover it without cluttering the main grid.
   - Keep the existing homepage exactly as is; this is a new page, not a replacement.

### Technical approach
- Route files: `src/routes/stack.tsx` (public directory) and `src/routes/stack.admin.tsx` (admin form).
- Data access: use TanStack Query in the route loader + a Supabase `software_recommendations` query.
- Admin write: a `createServerFn` that inserts a new row, protected by `requireSupabaseAuth`.
- Styling: reuse existing `neu-extruded`, `neu-extruded-sm`, `neu-inset-sm`, `font-display`, and accent color tokens so the new page feels native.

### Open decision before we start
- Route name: I suggest `/stack` (e.g., "my stack" / "tools I use"). Alternatives: `/recommends`, `/software`, `/tools/directory`. Let me know if you have a preference, or I can default to `/stack`.
- Initial seed entries: do you want to add the first few entries manually through the admin form, or would you like me to seed them via a migration from a list you provide? Either works; the admin form is probably fastest for you to iterate later.

### After this plan
Once you approve, I'll implement the table, routes, and admin form. No changes to the existing homepage or current tools.