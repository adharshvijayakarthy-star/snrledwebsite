import { createClient } from "@supabase/supabase-js";
import { getAdminSession } from "@/lib/security/auth";
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

export async function GET(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return apiError("Unauthorized.", "UNAUTHORIZED", 401);
  }

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "25");
  const status = searchParams.get("status");
  const search = searchParams.get("search");
  const offset = (page - 1) * limit;

  const supabase = getSupabase();
  if (!supabase) {
    return apiSuccess({
      registrations: memoryStore.registrations,
      total: memoryStore.registrations.length,
      page,
      limit,
    });
  }

  let query = supabase
    .from("registrations")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (status && status !== "all") {
    query = query.eq("verification_status", status);
  }

  if (search) {
    query = query.or(
      `name.ilike.%${search}%,phone.ilike.%${search}%,instagram.ilike.%${search}%,registration_id.ilike.%${search}%`
    );
  }

  const { data, count, error } = await query;

  if (error) {
    return apiError("Failed to load registrations.", "DB_ERROR", 500);
  }

  return apiSuccess({
    registrations: data,
    total: count || 0,
    page,
    limit,
  });
}
