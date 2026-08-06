GRANT ALL ON public.unlock_codes TO service_role;
REVOKE ALL ON public.unlock_codes FROM anon, authenticated;
ALTER TABLE public.unlock_codes ENABLE ROW LEVEL SECURITY;