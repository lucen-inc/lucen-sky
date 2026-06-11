import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

async function assertStaff(context: any) {
  const { data: isAdmin } = await context.supabase.rpc("has_role", {
    _user_id: context.userId,
    _role: "admin",
  });
  const { data: isEditor } = await context.supabase.rpc("has_role", {
    _user_id: context.userId,
    _role: "editor",
  });
  if (!isAdmin && !isEditor) throw new Error("Forbidden");
  return { isAdmin: Boolean(isAdmin), isEditor: Boolean(isEditor) };
}

export const listSubmissions = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertStaff(context);
    const { data, error } = await context.supabase
      .from("contact_submissions")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200);
    if (error) throw error;
    return data ?? [];
  });

export const updateSubmissionStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({ id: z.string().uuid(), status: z.enum(["new", "in_review", "won", "lost", "archived"]) }).parse(d),
  )
  .handler(async ({ context, data }) => {
    await assertStaff(context);
    const { error } = await context.supabase
      .from("contact_submissions")
      .update({ status: data.status })
      .eq("id", data.id);
    if (error) throw error;
    return { ok: true };
  });

export const listOnboarding = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertStaff(context);
    const { data, error } = await context.supabase
      .from("client_onboarding")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200);
    if (error) throw error;
    return data ?? [];
  });

export const createOnboarding = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z
      .object({
        submission_id: z.string().uuid().optional().nullable(),
        client_name: z.string().min(1).max(160),
        stage: z.enum(["lead", "qualified", "proposal", "contract", "live", "delivered", "lost"]).default("lead"),
        estimated_value: z.number().nonnegative().optional().nullable(),
        notes: z.string().max(4000).optional().nullable(),
      })
      .parse(d),
  )
  .handler(async ({ context, data }) => {
    await assertStaff(context);
    const { error } = await context.supabase.from("client_onboarding").insert(data);
    if (error) throw error;
    return { ok: true };
  });

export const updateOnboardingStage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z
      .object({
        id: z.string().uuid(),
        stage: z.enum(["lead", "qualified", "proposal", "contract", "live", "delivered", "lost"]),
      })
      .parse(d),
  )
  .handler(async ({ context, data }) => {
    await assertStaff(context);
    const { error } = await context.supabase
      .from("client_onboarding")
      .update({ stage: data.stage })
      .eq("id", data.id);
    if (error) throw error;
    return { ok: true };
  });

export const getSiteInfo = createServerFn({ method: "GET" }).handler(async () => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin.from("site_info").select("key,value");
  if (error) throw error;
  const out: Record<string, any> = {};
  for (const row of data ?? []) out[row.key] = row.value;
  return out;
});

export const updateSiteInfo = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({ key: z.string().min(1).max(60), value: z.any() }).parse(d),
  )
  .handler(async ({ context, data }) => {
    const { isAdmin } = await assertStaff(context);
    if (!isAdmin) throw new Error("Admin only");
    const { error } = await context.supabase
      .from("site_info")
      .upsert({ key: data.key, value: data.value, updated_by: context.userId });
    if (error) throw error;
    return { ok: true };
  });

export const getMyRole = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data } = await context.supabase.from("user_roles").select("role").eq("user_id", context.userId);
    return { roles: (data ?? []).map((r: any) => r.role) };
  });
