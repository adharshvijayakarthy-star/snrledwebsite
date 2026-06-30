// In-memory store for demo mode when Supabase is not configured
export const memoryStore = {
  registrations: [] as Array<{
    registration_id: string;
    phone: string;
    name: string;
    instagram: string;
    gender: string;
    people_count: number;
    pricing_phase: string;
    amount: number;
    verification_status: string;
    payment_status: string;
    screenshot_url: string | null;
    created_at: string;
    id: string;
  }>,
  counter: 0,
};
