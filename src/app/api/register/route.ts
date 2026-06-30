import { createClient } from "@supabase/supabase-js";
import { memoryStore } from "@/lib/memory-store";
import { formatRegistrationId } from "@/lib/utils";
import { sanitizeInput, normalizePhone, normalizeInstagram } from "@/lib/utils";
import { fullRegistrationSchema } from "@/lib/validation/schemas";
import { apiSuccess, apiError } from "@/lib/api-response";
import { rateLimit, getClientIp } from "@/lib/security/rate-limit";

function getSupabase() {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.SUPABASE_SERVICE_ROLE_KEY
  ) {
    return null;
  }
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { persistSession: false } }
  );
}

// In-memory fallback for demo without Supabase
export async function POST(request: Request) {
  const ip = getClientIp(request);
  const { allowed } = rateLimit(`register:${ip}`, 5, 10 * 60 * 1000);
  if (!allowed) {
    return apiError("Too many requests. Please try again later.", "RATE_LIMIT", 429);
  }

  try {
    const body = await request.json();
    const parsed = fullRegistrationSchema.safeParse({
      name: sanitizeInput(body.name || ""),
      phone: normalizePhone(body.phone || ""),
      instagram: normalizeInstagram(body.instagram || ""),
      gender: body.gender,
      peopleCount: body.peopleCount,
    });

    if (!parsed.success) {
      return apiError("Invalid registration data.", "VALIDATION_ERROR");
    }

    const { name, phone, instagram, gender, peopleCount } = parsed.data;
    const amount = body.amount;
    const pricingPhase = body.pricingPhase;

    const supabase = getSupabase();

    if (supabase) {
      const { data: existing } = await supabase
        .from("registrations")
        .select("registration_id")
        .eq("phone", phone)
        .maybeSingle();

      if (existing?.registration_id) {
        return apiSuccess({
          registrationId: existing.registration_id,
          existing: true,
        });
      }

      const { data: regIdResult } = await supabase.rpc("generate_registration_id");
      const registrationId = regIdResult || formatRegistrationId(memoryStore.counter + 1);

      const { data, error } = await supabase
        .from("registrations")
        .insert({
          registration_id: registrationId,
          name,
          phone,
          instagram,
          gender,
          people_count: peopleCount,
          pricing_phase: pricingPhase,
          amount,
          payment_status: "pending",
          verification_status: "pending",
        })
        .select("registration_id")
        .single();

      if (error) {
        console.error("Registration error:", error);
        if (error.code === "23505") {
          return apiError(
            "This phone number has already been registered.",
            "DUPLICATE_PHONE"
          );
        }
        return apiError("Something went wrong. Please try again.", "DB_ERROR", 500);
      }

      const { count: registrationCount } = await supabase
        .from("registrations")
        .select("id", { count: "exact", head: true });

      const { data: settingsRows } = await supabase
        .from("event_settings")
        .select("id, phase_switch_limit")
        .eq("event_active", true)
        .limit(1);

      const settings = settingsRows?.[0];
      if (settings) {
        const nextPhase = (registrationCount ?? 0) >= (settings.phase_switch_limit ?? 60)
          ? "phase2"
          : "phase1";

        await supabase
          .from("event_settings")
          .update({
            current_registration_count: registrationCount ?? 0,
            current_phase: nextPhase,
          })
          .eq("id", settings.id);
      }

      return apiSuccess({ registrationId: data.registration_id });
    }

    // Memory fallback
    if (memoryStore.registrations.some((r) => r.phone === phone)) {
      return apiError(
        "This phone number has already been registered.",
        "DUPLICATE_PHONE"
      );
    }

    memoryStore.counter += 1;
    const registrationId = formatRegistrationId(memoryStore.counter);
    memoryStore.registrations.push({
      id: crypto.randomUUID(),
      registration_id: registrationId,
      phone,
      name,
      instagram,
      gender,
      people_count: peopleCount,
      pricing_phase: pricingPhase,
      amount,
      verification_status: "pending",
      payment_status: "pending",
      screenshot_url: null,
      created_at: new Date().toISOString(),
    });

    return apiSuccess({ registrationId });
  } catch (error) {
    console.error("Register error:", error);
    return apiError("Something went wrong. Please try again.", "INTERNAL_ERROR", 500);
  }
}
