import type { EventConfig, Gender, PricingPhase } from "@/types";
import { defaultEventConfig } from "@/constants/event-config";

export function getActivePhase(
  registrationCount: number,
  phaseSwitchLimit: number,
  currentPhase?: PricingPhase
): PricingPhase {
  if (registrationCount >= phaseSwitchLimit) return "phase2";
  if (currentPhase === "phase2") return "phase1";
  return "phase1";
}

export function calculatePrice(
  gender: Gender,
  phase: PricingPhase,
  config: EventConfig = defaultEventConfig
): number {
  const tier = config.pricing[phase];
  if (!tier) return 0;
  return gender === "stag" ? tier.stag : tier.doe;
}

export function calculateTotalAmount(
  gender: Gender,
  peopleCount: number,
  phase: PricingPhase,
  config: EventConfig = defaultEventConfig
): number {
  const unitPrice = calculatePrice(gender, phase, config);
  return unitPrice * peopleCount;
}

export function getRemainingUntilPhase2(
  registrationCount: number,
  phaseSwitchLimit: number
): number {
  return Math.max(0, phaseSwitchLimit - registrationCount);
}

export function isPhaseSelectable(phase: PricingPhase): boolean {
  return phase === "phase1" || phase === "phase2";
}

export function getPhaseLabel(phase: PricingPhase): string {
  const labels: Record<PricingPhase, string> = {
    early_bird: "Early Bird",
    phase1: "Phase 1",
    phase2: "Phase 2",
    walkin: "Walk-In",
  };
  return labels[phase];
}
