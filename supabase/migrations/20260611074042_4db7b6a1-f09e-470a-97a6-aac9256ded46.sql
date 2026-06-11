
-- ROLES
CREATE TYPE public.app_role AS ENUM ('admin', 'editor', 'user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "users see own roles" ON public.user_roles FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins manage roles" ON public.user_roles FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- updated_at trigger fn
CREATE OR REPLACE FUNCTION public.tg_set_updated_at()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- Bootstrap: first signup becomes admin
CREATE OR REPLACE FUNCTION public.bootstrap_first_admin()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin') THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin');
  ELSE
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'user');
  END IF;
  RETURN NEW;
END; $$;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.bootstrap_first_admin();

-- CONTACT SUBMISSIONS
CREATE TABLE public.contact_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  company text,
  email text NOT NULL,
  phone text,
  city text,
  event_date date,
  intent text,
  callback boolean NOT NULL DEFAULT false,
  message text,
  status text NOT NULL DEFAULT 'new',
  source text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.contact_submissions TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.contact_submissions TO authenticated;
GRANT ALL ON public.contact_submissions TO service_role;
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone can submit" ON public.contact_submissions FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "staff read submissions" ON public.contact_submissions FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));
CREATE POLICY "staff update submissions" ON public.contact_submissions FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'))
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));
CREATE POLICY "admins delete submissions" ON public.contact_submissions FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER tg_contact_submissions_updated BEFORE UPDATE ON public.contact_submissions
  FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- CLIENT ONBOARDING
CREATE TABLE public.client_onboarding (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id uuid REFERENCES public.contact_submissions(id) ON DELETE SET NULL,
  client_name text NOT NULL,
  stage text NOT NULL DEFAULT 'lead',
  assignee uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  estimated_value numeric(12,2),
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.client_onboarding TO authenticated;
GRANT ALL ON public.client_onboarding TO service_role;
ALTER TABLE public.client_onboarding ENABLE ROW LEVEL SECURITY;
CREATE POLICY "staff manage onboarding" ON public.client_onboarding FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'))
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));
CREATE TRIGGER tg_client_onboarding_updated BEFORE UPDATE ON public.client_onboarding
  FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- SITE INFO (editable copy / config)
CREATE TABLE public.site_info (
  key text PRIMARY KEY,
  value jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by uuid REFERENCES auth.users(id) ON DELETE SET NULL
);
GRANT SELECT ON public.site_info TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.site_info TO authenticated;
GRANT ALL ON public.site_info TO service_role;
ALTER TABLE public.site_info ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read site_info" ON public.site_info FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "admins write site_info" ON public.site_info FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER tg_site_info_updated BEFORE UPDATE ON public.site_info
  FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- Seed editable site info
INSERT INTO public.site_info (key, value) VALUES
  ('contact', '{"studio_phone":"+254 7-2775-007","ops_phone":"+254 2-0202-345-678","email":"hello@sky.lucene.co","press_email":"press@sky.lucene.co","ops_email":"ops@sky.lucene.co"}'::jsonb),
  ('hero', '{"eyebrow":"Sky-Native Operating System","headline":"Choreograph the sky.","sub":"An OS for autonomous swarms and a studio for manual drone light shows."}'::jsonb)
ON CONFLICT (key) DO NOTHING;
