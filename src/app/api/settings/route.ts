import { getEventConfig, getPublicEventConfig } from "@/lib/event-config";
import { apiSuccess } from "@/lib/api-response";
import { getRemainingUntilPhase2 } from "@/lib/pricing";

export async function GET() {
  const config = await getEventConfig();
  const publicConfig = getPublicEventConfig(config);

  return apiSuccess({
    ...publicConfig,
    remainingUntilPhase2: getRemainingUntilPhase2(
      config.currentRegistrationCount,
      config.phaseSwitchLimit
    ),
  });
}
