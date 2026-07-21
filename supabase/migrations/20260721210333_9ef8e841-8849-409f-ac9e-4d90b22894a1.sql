ALTER TABLE public.software_recommendations ADD COLUMN owner_id UUID NOT NULL;

-- Replace the permissive authenticated policy with an owner-scoped policy.
DROP POLICY IF EXISTS "Authenticated users can manage software recommendations" ON public.software_recommendations;

CREATE POLICY "Owners can manage their software recommendations"
  ON public.software_recommendations FOR ALL
  TO authenticated USING (auth.uid() = owner_id) WITH CHECK (auth.uid() = owner_id);