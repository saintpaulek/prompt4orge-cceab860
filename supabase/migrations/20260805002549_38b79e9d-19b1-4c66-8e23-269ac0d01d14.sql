CREATE TABLE public.unlock_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  is_used boolean NOT NULL DEFAULT false,
  used_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  note text
);
CREATE INDEX unlock_codes_code_idx ON public.unlock_codes (code);
GRANT ALL ON public.unlock_codes TO service_role;
ALTER TABLE public.unlock_codes ENABLE ROW LEVEL SECURITY;