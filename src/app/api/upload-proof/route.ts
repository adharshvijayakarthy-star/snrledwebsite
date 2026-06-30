import { createClient } from "@supabase/supabase-js";
import { apiSuccess, apiError } from "@/lib/api-response";
import { generateFileName } from "@/lib/utils";
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

const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/jpg"];
const MAX_SIZE = 5 * 1024 * 1024;
const BUCKET_NAME = "payment-proofs";

async function ensureProofBucket(supabase: any) {
  try {
    const { error } = await supabase.storage.getBucket(BUCKET_NAME);
    if (!error) return;

    if (error.status === 404 || error.message?.includes("not exist") || error.message?.includes("does not exist")) {
      await supabase.storage.createBucket(BUCKET_NAME, {
        public: true,
        fileSizeLimit: MAX_SIZE,
        allowedMimeTypes: ALLOWED_TYPES,
      });
    }
  } catch {
    // Ignore bucket creation issues and let the upload fail loudly if needed.
  }
}

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const { allowed } = rateLimit(`upload:${ip}`, 5, 10 * 60 * 1000);
  if (!allowed) {
    return apiError("Too many uploads. Please try again later.", "RATE_LIMIT", 429);
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const registrationId = formData.get("registrationId") as string;

    if (!file || !registrationId) {
      return apiError("Missing file or registration ID.", "VALIDATION_ERROR");
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return apiError("Please upload PNG or JPEG only.", "INVALID_FILE_TYPE");
    }

    if (file.size > MAX_SIZE) {
      return apiError("File must be under 5MB.", "FILE_TOO_LARGE");
    }

    const ext = file.name.split(".").pop() || "jpg";
    const fileName = generateFileName(registrationId, ext);
    const buffer = Buffer.from(await file.arrayBuffer());

    const supabase = getSupabase();

    if (supabase) {
      await ensureProofBucket(supabase);

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(fileName, buffer, {
          contentType: file.type,
          upsert: true,
        });

      if (uploadError) {
        console.error("Upload error:", uploadError);
        return apiError("Upload failed. Please try again.", "UPLOAD_ERROR", 500);
      }

      const { data: publicUrlData } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(uploadData.path);

      const { error: updateError } = await supabase
        .from("registrations")
        .update({ screenshot_url: publicUrlData.publicUrl })
        .eq("registration_id", registrationId);

      if (updateError) {
        console.error("Update error:", updateError);
        return apiError("Something went wrong. Please try again.", "DB_ERROR", 500);
      }

      return apiSuccess({ path: publicUrlData.publicUrl });
    }

    // Memory/demo fallback
    return apiSuccess({ path: fileName });
  } catch (error) {
    console.error("Upload error:", error);
    return apiError("Something went wrong. Please try again.", "INTERNAL_ERROR", 500);
  }
}
