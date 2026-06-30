import { createClient } from "@supabase/supabase-js";
import { getAdminSession, hasPermission } from "@/lib/security/auth";
import { apiSuccess, apiError } from "@/lib/api-response";

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

  const supabase = getSupabase();
  if (!supabase) {
    return apiError("Database unavailable.", "DB_ERROR", 503);
  }

  const { data, error } = await supabase
    .from("event_settings")
    .select("*")
    .eq("event_active", true)
    .single();

  if (error) {
    return apiError("Failed to load settings.", "DB_ERROR", 500);
  }

  return apiSuccess(data);
}

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session || !hasPermission(session.role, "*")) {
    // Only owner can change settings - check via hasPermission with owner role
    if (session?.role !== "owner") {
      return apiError("Insufficient permissions.", "FORBIDDEN", 403);
    }
  }

  const supabase = getSupabase();
  if (!supabase) {
    return apiError("Database unavailable.", "DB_ERROR", 503);
  }

  const body = await request.json();

  const { data, error } = await supabase
    .from("event_settings")
    .update(body)
    .eq("event_active", true)
    .select()
    .single();

  if (error) {
    return apiError("Failed to update settings.", "DB_ERROR", 500);
  }

  await supabase.from("activity_logs").insert({
    admin_id: session!.adminId,
    action: "update_settings",
    target_table: "event_settings",
    description: `${session!.username} updated event settings`,
  });

  return apiSuccess(data);
}
