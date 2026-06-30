"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "snrled_registration_draft";

export interface RegistrationDraft {
  step: number;
  name: string;
  phone: string;
  instagram: string;
  gender: "stag" | "doe" | "";
  peopleCount: number;
  amount: number;
  pricingPhase: string;
  updatedAt: string;
}

const defaultDraft: RegistrationDraft = {
  step: 1,
  name: "",
  phone: "",
  instagram: "",
  gender: "",
  peopleCount: 1,
  amount: 0,
  pricingPhase: "phase1",
  updatedAt: new Date().toISOString(),
};

export function useRegistrationDraft() {
  const [draft, setDraft] = useState<RegistrationDraft>(defaultDraft);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    queueMicrotask(() => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) setDraft(JSON.parse(stored));
      } catch {
        // ignore
      }
      setLoaded(true);
    });
  }, []);

  const saveDraft = (updates: Partial<RegistrationDraft>) => {
    setDraft((prev) => {
      const next = { ...prev, ...updates, updatedAt: new Date().toISOString() };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  const clearDraft = () => {
    localStorage.removeItem(STORAGE_KEY);
    setDraft(defaultDraft);
  };

  return { draft, saveDraft, clearDraft, loaded };
}
