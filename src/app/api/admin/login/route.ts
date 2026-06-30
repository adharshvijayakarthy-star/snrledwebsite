import { createClient } from "@supabase/supabase-js";
import { apiSuccess, apiError } from "@/lib/api-response";
import { adminLoginSchema } from "@/lib/validation/schemas";
import {
  createAdminSession,
  verifyPassword,
} from "@/lib/security/auth";
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

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const { allowed } = rateLimit(`admin-login:${ip}`, 5, 15 * 60 * 1000);
  if (!allowed) {
    return apiError("Too many login attempts. Try again later.", "RATE_LIMIT", 429);
  }

  try {
    const body = await request.json();
    const parsed = adminLoginSchema.safeParse(body);
    if (!parsed.success) {
      return apiError("Invalid credentials.", "VALIDATION_ERROR");
    }

    const { username, password } = parsed.data;
    const supabase = getSupabase();

    if (supabase) {
      const { data: admin } = await supabase
        .from("admin_users")
        .select("*")
        .eq("username", username)
        .single();

      if (!admin || !(await verifyPassword(password, admin.password_hash))) {
        return apiError("Invalid username or password.", "AUTH_FAILED", 401);
      }

      await supabase
        .from("admin_users")
        .update({ last_login: new Date().toISOString() })
        .eq("id", admin.id);

      await createAdminSession({
        adminId: admin.id,
        username: admin.username,
        role: admin.role,
      });

      return apiSuccess({ username: admin.username, role: admin.role });
    }

    // Env fallback for demo
    const envUser = process.env.ADMIN_USERNAME || "admin";
    const envPass = process.env.ADMIN_PASSWORD || "snrled2026";

    if (username !== envUser || password !== envPass) {
      return apiError("Invalid username or password.", "AUTH_FAILED", 401);
    }

    await createAdminSession({
      adminId: "demo-admin",
      username: envUser,
      role: "owner",
    });

    return apiSuccess({ username: envUser, role: "owner" });
  } catch (error) {
    console.error("Login error:", error);
    return apiError("Something went wrong. Please try again.", "INTERNAL_ERROR", 500);
  }
}
