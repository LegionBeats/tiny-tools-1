CREATE TABLE public.linkedin_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  headline TEXT NOT NULL DEFAULT '',
  company TEXT NOT NULL DEFAULT '',
  location TEXT NOT NULL DEFAULT '',
  about TEXT NOT NULL DEFAULT '',
  skills TEXT[] NOT NULL DEFAULT '{}',
  theme TEXT NOT NULL DEFAULT 'editorial',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT ON public.linkedin_profiles TO anon;
GRANT SELECT, INSERT ON public.linkedin_profiles TO authenticated;
GRANT ALL ON public.linkedin_profiles TO service_role;

ALTER TABLE public.linkedin_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view profiles"
  ON public.linkedin_profiles FOR SELECT
  USING (true);

CREATE POLICY "Anyone can create profiles"
  ON public.linkedin_profiles FOR INSERT
  WITH CHECK (
    char_length(full_name) BETWEEN 1 AND 100
    AND char_length(slug) BETWEEN 1 AND 80
    AND char_length(headline) <= 200
    AND char_length(company) <= 100
    AND char_length(location) <= 100
    AND char_length(about) <= 2000
    AND array_length(skills, 1) IS NULL OR array_length(skills, 1) <= 20
  );

CREATE INDEX linkedin_profiles_slug_idx ON public.linkedin_profiles(slug);