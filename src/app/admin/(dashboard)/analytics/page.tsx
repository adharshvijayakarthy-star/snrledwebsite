"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { GlassCard } from "@/components/ui/glass-card";
import type { DashboardStats } from "@/types";

const COLORS = ["#3EE7E5", "#D8D8D8", "#FF5555"];

export default function AnalyticsPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    fetch("/api/admin/dashboard")
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setStats(data.data);
      });
  }, []);

  const genderData = stats
    ? [
        { name: "Stag", value: stats.maleCount },
        { name: "Doe", value: stats.femaleCount },
      ]
    : [];

  const statusData = stats
    ? [
        { name: "Verified", value: stats.verified },
        { name: "Pending", value: stats.pending },
        { name: "Rejected", value: stats.rejected },
      ]
    : [];

  return (
    <div>
      <h1 className="text-2xl font-bold text-highlight">Analytics</h1>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <GlassCard>
          <h3 className="mb-4 font-semibold text-highlight">Gender Split</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={genderData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                dataKey="value"
              >
                {genderData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: "rgba(11,11,15,0.9)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 12,
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </GlassCard>

        <GlassCard>
          <h3 className="mb-4 font-semibold text-highlight">Verification Status</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={statusData}>
              <XAxis dataKey="name" stroke="#BDBDBD" fontSize={12} />
              <YAxis stroke="#BDBDBD" fontSize={12} />
              <Tooltip
                contentStyle={{
                  background: "rgba(11,11,15,0.9)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 12,
                }}
              />
              <Bar dataKey="value" fill="#3EE7E5" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </GlassCard>
      </div>
    </div>
  );
}
