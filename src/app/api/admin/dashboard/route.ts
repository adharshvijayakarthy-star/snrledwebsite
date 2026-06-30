import { createClient } from "@supabase/supabase-js";
import { getAdminSession } from "@/lib/security/auth";
import { apiSuccess, apiError } from "@/lib/api-response";
import { getEventConfig } from "@/lib/event-config";
import { getRemainingUntilPhase2 } from "@/lib/pricing";
import type { DashboardStats } from "@/types";
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

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return apiError("Unauthorized.", "UNAUTHORIZED", 401);
  }

  const config = await getEventConfig();
  const supabase = getSupabase();

  if (supabase) {
    const { data: registrations } = await supabase
      .from("registrations")
      .select("*");

    const regs = registrations || [];
    const stats: DashboardStats = {
      totalRegistrations: regs.length,
      verified: regs.filter((r) => r.verification_status === "verified").length,
      pending: regs.filter((r) => r.verification_status === "pending").length,
      rejected: regs.filter((r) => r.verification_status === "rejected").length,
      maleCount: regs.filter((r) => r.gender === "stag").length,
      femaleCount: regs.filter((r) => r.gender === "doe").length,
      revenue: regs
        .filter((r) => r.verification_status === "verified")
        .reduce((sum, r) => sum + r.amount, 0),
      currentPhase: config.currentPhase,
      remainingUntilPhase2: getRemainingUntilPhase2(
        config.currentRegistrationCount,
        config.phaseSwitchLimit
      ),
    };

    return apiSuccess(stats);
  }

  return apiSuccess({
    totalRegistrations: memoryStore.registrations.length,
    verified: memoryStore.registrations.filter((r) => r.verification_status === "verified").length,
    pending: memoryStore.registrations.filter((r) => r.verification_status === "pending").length,
    rejected: memoryStore.registrations.filter((r) => r.verification_status === "rejected").length,
    maleCount: memoryStore.registrations.filter((r) => r.gender === "stag").length,
    femaleCount: memoryStore.registrations.filter((r) => r.gender === "doe").length,
    revenue: memoryStore.registrations
      .filter((r) => r.verification_status === "verified")
      .reduce((sum, r) => sum + r.amount, 0),
    currentPhase: config.currentPhase,
    remainingUntilPhase2: getRemainingUntilPhase2(
      memoryStore.registrations.length,
      config.phaseSwitchLimit
    ),
  } satisfies DashboardStats);
}
