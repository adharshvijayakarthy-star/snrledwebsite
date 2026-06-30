import { clearAdminSession } from "@/lib/security/auth";
import { apiSuccess } from "@/lib/api-response";

export async function POST() {
  await clearAdminSession();
  return apiSuccess({ loggedOut: true });
}
