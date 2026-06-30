"use client";

import { useEffect, useState } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { formatCurrency } from "@/lib/utils";
import type { DashboardStats } from "@/types";
import { getPhaseLabel } from "@/lib/pricing";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/dashboard")
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setStats(data.data);
        setLoading(false);
      });
  }, []);

  const cards = stats
    ? [
        { label: "Total Registrations", value: stats.totalRegistrations },
        { label: "Verified", value: stats.verified },
        { label: "Pending", value: stats.pending },
        { label: "Revenue", value: formatCurrency(stats.revenue) },
        { label: "Current Phase", value: getPhaseLabel(stats.currentPhase) },
        {
          label: "Until Phase 2",
          value: `${stats.remainingUntilPhase2} Remaining`,
        },
      ]
    : [];

  return (
    <div>
      <h1 className="text-3xl font-bold text-highlight">Dashboard</h1>
      <p className="mt-2 text-sm text-silver">Live event control at a glance.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <GlassCard key={i} className="h-24 animate-pulse" />
            ))
          : cards.map((card) => (
              <GlassCard key={card.label} hover>
                <p className="text-xs uppercase tracking-widest text-silver">
                  {card.label}
                </p>
                <p className="mt-3 text-3xl font-bold text-highlight">
                  {card.value}
                </p>
              </GlassCard>
            ))}
      </div>

      <GlassCard className="mt-8">
        <h3 className="font-semibold text-highlight">Live Status</h3>
        <div className="mt-4 flex flex-wrap gap-4 text-sm">
          {["Website Online", "Database Connected", "Storage Connected"].map((item) => (
            <span key={item} className="flex items-center gap-2 text-success">
              <span className="h-2 w-2 rounded-full bg-success" />
              {item}
            </span>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
