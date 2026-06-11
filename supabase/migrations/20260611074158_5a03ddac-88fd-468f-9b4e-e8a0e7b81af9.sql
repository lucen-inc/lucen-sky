
-- RLS policy USING/CHECK expressions evaluate as the querying user;
-- they need EXECUTE on the SECURITY DEFINER helper.
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;
-- anon does not need it: all policies that reference has_role() are TO authenticated.
