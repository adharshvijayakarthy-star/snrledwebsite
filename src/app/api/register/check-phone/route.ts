import { createClient } from "@supabase/supabase-js";
import { memoryStore } from "@/lib/memory-store";
import { apiSuccess } from "@/lib/api-response";

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
  const { searchParams } = new URL(request.url);
  const phone = searchParams.get("phone");

  if (!phone || phone.length !== 10) {
    return apiSuccess({ exists: false });
  }

  const supabase = getSupabase();

  if (supabase) {
    const { data } = await supabase
      .from("registrations")
      .select("id")
      .eq("phone", phone)
      .single();

    return apiSuccess({ exists: !!data });
  }

  return apiSuccess({
    exists: memoryStore.registrations.some((r) => r.phone === phone),
  });
}
