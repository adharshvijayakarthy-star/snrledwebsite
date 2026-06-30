"use client";

import { useEffect, useState } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function EventSettingsPage() {
  const [settings, setSettings] = useState<Record<string, unknown>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setSettings(data.data);
        setLoading(false);
      });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    const res = await fetch("/api/admin/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    const data = await res.json();
    if (data.success) {
      toast.success("Settings updated.");
    } else {
      toast.error(data.message || "Failed to save.");
    }
    setSaving(false);
  };

  const update = (key: string, value: unknown) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  if (loading) {
    return <GlassCard className="h-64 animate-pulse" />;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-highlight">Event Settings</h1>
      <p className="mt-2 text-sm text-silver">Configure the event without redeploying.</p>

      <div className="mt-8 space-y-8">
        <GlassCard>
          <h3 className="text-lg font-semibold text-highlight">Event Details</h3>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <Input
              label="Event Name"
              value={String(settings.event_name || "")}
              onChange={(e) => update("event_name", e.target.value)}
            />
            <Input
              label="Tagline"
              value={String(settings.tagline || "")}
              onChange={(e) => update("tagline", e.target.value)}
            />
            <Input
              label="Event Date"
              type="date"
              value={String(settings.event_date || "").split("T")[0]}
              onChange={(e) => update("event_date", e.target.value)}
            />
            <Input
              label="UPI ID"
              value={String(settings.upi_placeholder || "")}
              onChange={(e) => update("upi_placeholder", e.target.value)}
            />
          </div>
        </GlassCard>

        <GlassCard>
          <h3 className="text-lg font-semibold text-highlight">Pricing</h3>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <Input
              label="Phase 1 Stag (INR)"
              type="number"
              value={String(settings.phase1_stag || "")}
              onChange={(e) => update("phase1_stag", parseInt(e.target.value))}
            />
            <Input
              label="Phase 1 Doe (INR)"
              type="number"
              value={String(settings.phase1_doe || "")}
              onChange={(e) => update("phase1_doe", parseInt(e.target.value))}
            />
            <Input
              label="Phase 2 Stag (INR)"
              type="number"
              value={String(settings.phase2_stag || "")}
              onChange={(e) => update("phase2_stag", parseInt(e.target.value))}
            />
            <Input
              label="Phase 2 Doe (INR)"
              type="number"
              value={String(settings.phase2_doe || "")}
              onChange={(e) => update("phase2_doe", parseInt(e.target.value))}
            />
          </div>
        </GlassCard>

        <GlassCard>
          <h3 className="text-lg font-semibold text-highlight">Registration Limits</h3>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <Input
              label="Max Guests"
              type="number"
              value={String(settings.registration_limit || "")}
              onChange={(e) => update("registration_limit", parseInt(e.target.value))}
            />
            <Input
              label="Phase Switch At"
              type="number"
              value={String(settings.phase_switch_limit || "")}
              onChange={(e) => update("phase_switch_limit", parseInt(e.target.value))}
            />
          </div>
        </GlassCard>

        <Button size="lg" loading={saving} onClick={handleSave}>
          Save Settings
        </Button>
      </div>
    </div>
  );
}
