CREATE TABLE public.software_recommendations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  url TEXT NOT NULL,
  affiliate_url TEXT,
  category TEXT NOT NULL,
  tags TEXT[] NOT NULL DEFAULT '{}',
  logo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT SELECT ON public.software_recommendations TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.software_recommendations TO authenticated;
GRANT ALL ON public.software_recommendations TO service_role;

ALTER TABLE public.software_recommendations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view software recommendations"
  ON public.software_recommendations FOR SELECT
  TO public USING (true);

CREATE POLICY "Authenticated users can manage software recommendations"
  ON public.software_recommendations FOR ALL
  TO authenticated USING (true) WITH CHECK (true);

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_software_recommendations_updated_at
  BEFORE UPDATE ON public.software_recommendations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();