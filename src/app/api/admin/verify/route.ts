import { createClient } from "@supabase/supabase-js";
import { getAdminSession, hasPermission } from "@/lib/security/auth";
import { apiSuccess, apiError } from "@/lib/api-response";
import { memoryStore } from "@/lib/memory-store";

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

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session || !hasPermission(session.role, "verify")) {
    return apiError("Unauthorized.", "UNAUTHORIZED", 401);
  }

  const { registrationId, action, notes } = await request.json();
  if (!registrationId || !action) {
    return apiError("Missing required fields.", "VALIDATION_ERROR");
  }

  if (action === "delete" || action === "remove") {
    const supabase = getSupabase();
    if (!supabase) {
      const index = memoryStore.registrations.findIndex(
        (r) => r.registration_id === registrationId
      );
      if (index === -1) {
        return apiError("Registration not found.", "NOT_FOUND", 404);
      }
      memoryStore.registrations.splice(index, 1);
      return apiSuccess({ registrationId, status: "deleted" });
    }

    const { data, error } = await supabase
      .from("registrations")
      .delete()
      .eq("registration_id", registrationId)
      .select("id");

    if (error || !data?.length) {
      return apiError("Registration not found.", "NOT_FOUND", 404);
    }

    const { count: remainingCount } = await supabase
      .from("registrations")
      .select("id", { count: "exact", head: true });

    const { data: settingsRows } = await supabase
      .from("event_settings")
      .select("id, phase_switch_limit")
      .eq("event_active", true)
      .limit(1);

    const settings = settingsRows?.[0];
    if (settings) {
      const nextPhase = (remainingCount ?? 0) >= (settings.phase_switch_limit ?? 60)
        ? "phase2"
        : "phase1";

      await supabase
        .from("event_settings")
        .update({
          current_registration_count: remainingCount ?? 0,
          current_phase: nextPhase,
        })
        .eq("id", settings.id);
    }

    await supabase.from("activity_logs").insert({
      admin_id: session.adminId,
      action: "delete_registration",
      target_table: "registrations",
      target_id: registrationId,
      description: `${session.username} removed ${registrationId}`,
    });

    return apiSuccess({ registrationId, status: "deleted" });
  }

  const supabase = getSupabase();
  if (!supabase) {
    const reg = memoryStore.registrations.find(
      (r) => r.registration_id === registrationId
    );
    if (!reg) {
      return apiError("Registration not found.", "NOT_FOUND", 404);
    }
    const status = action === "verify" ? "verified" : "rejected";
    reg.verification_status = status;
    reg.payment_status = status;
    return apiSuccess({ registrationId, status });
  }

  const status = action === "verify" ? "verified" : "rejected";

  const { error } = await supabase
    .from("registrations")
    .update({
      verification_status: status,
      payment_status: status,
      verification_notes: notes || null,
    })
    .eq("registration_id", registrationId);

  if (error) {
    return apiError("Failed to update registration.", "DB_ERROR", 500);
  }

  await supabase.from("activity_logs").insert({
    admin_id: session.adminId,
    action: action === "verify" ? "verify_registration" : "reject_registration",
    target_table: "registrations",
    target_id: registrationId,
    description: `${session.username} ${action}d ${registrationId}`,
  });

  return apiSuccess({ registrationId, status });
}
