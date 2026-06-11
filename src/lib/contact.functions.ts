import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const ContactSchema = z.object({
  name: z.string().trim().min(1).max(120),
  company: z.string().trim().max(160).optional().or(z.literal("")),
  email: z.string().trim().email().max(254),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  city: z.string().trim().max(120).optional().or(z.literal("")),
  event_date: z.string().trim().max(20).optional().or(z.literal("")),
  intent: z.string().trim().max(60).optional().or(z.literal("")),
  callback: z.boolean().default(false),
  message: z.string().trim().max(4000).optional().or(z.literal("")),
});

export const submitContact = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => ContactSchema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("contact_submissions").insert({
      name: data.name,
      company: data.company || null,
      email: data.email,
      phone: data.phone || null,
      city: data.city || null,
      event_date: data.event_date || null,
      intent: data.intent || null,
      callback: data.callback,
      message: data.message || null,
      source: "web",
      status: "new",
    });
    if (error) {
      console.error("[submitContact] insert failed", error);
      throw new Error("Could not file your mission brief. Please try again.");
    }
    return { ok: true };
  });
