import { getEventConfig } from "@/lib/event-config";
import { calculatePrice } from "@/lib/pricing";
import { apiSuccess } from "@/lib/api-response";
import { getRemainingUntilPhase2 } from "@/lib/pricing";

export async function GET() {
  const config = await getEventConfig();
  const phase = config.currentPhase;

  return apiSuccess({
    currentPhase: phase,
    pricing: config.pricing,
    stagPrice: calculatePrice("stag", phase, config),
    doePrice: calculatePrice("doe", phase, config),
    remainingUntilPhase2: getRemainingUntilPhase2(
      config.currentRegistrationCount,
      config.phaseSwitchLimit
    ),
    registrationCount: config.currentRegistrationCount,
    phaseSwitchLimit: config.phaseSwitchLimit,
  });
}
