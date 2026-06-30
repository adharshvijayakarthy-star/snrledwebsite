import { createClient } from "@supabase/supabase-js";
import { getAdminSession, hasPermission } from "@/lib/security/auth";
import { apiError } from "@/lib/api-response";
import { exportRegistrationsToExcel, getExportFilename } from "@/lib/excel/export";
import type { Registration } from "@/types";

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
  if (!session || !hasPermission(session.role, "export")) {
    return apiError("Unauthorized.", "UNAUTHORIZED", 401);
  }

  const body = await request.json().catch(() => ({}));
  const filter = body.filter || "all";

  const supabase = getSupabase();
  if (!supabase) {
    return apiError("Database unavailable.", "DB_ERROR", 503);
  }

  let query = supabase.from("registrations").select("*").order("created_at", { ascending: false });

  if (filter !== "all") {
    query = query.eq("verification_status", filter);
  }

  const { data, error } = await query;
  if (error) {
    return apiError("Export failed.", "DB_ERROR", 500);
  }

  const buffer = await exportRegistrationsToExcel((data || []) as Registration[]);
  const filename = getExportFilename();

  await supabase.from("activity_logs").insert({
    admin_id: session.adminId,
    action: "excel_export",
    description: `${session.username} exported ${data?.length || 0} registrations`,
  });

  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
