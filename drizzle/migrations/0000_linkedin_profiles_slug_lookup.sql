DROP POLICY IF EXISTS "Anyone can view profiles" ON public.linkedin_profiles;

CREATE OR REPLACE FUNCTION public.get_linkedin_profile(_slug text)
RETURNS TABLE(full_name text, headline text, company text, location text, about text, skills text[], theme text)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT full_name, headline, company, location, about, skills, theme
  FROM public.linkedin_profiles
  WHERE slug = _slug
  LIMIT 1
$$;

REVOKE ALL ON FUNCTION public.get_linkedin_profile(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_linkedin_profile(text) TO anon, authenticated;