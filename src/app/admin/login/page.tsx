"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GlassCard } from "@/components/ui/glass-card";
import { AnimatedBackground } from "@/components/animations/animated-background";
import { toast } from "sonner";
import { BrandLogo } from "@/components/ui/brand-logo";

export default function AdminLoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ username: "", password: "", rememberMe: false });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (data.success) {
        toast.success("Welcome back.");
        router.push("/admin");
      } else {
        toast.error(data.message || "Login failed.");
      }
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AnimatedBackground />
      <div className="relative z-10 flex min-h-screen items-center justify-center px-6 py-16">
        <GlassCard className="w-full max-w-md p-8">
          <BrandLogo size="wizard" className="mb-8 opacity-80" />
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
            Operations
          </p>
          <h1 className="mt-4 text-3xl font-bold text-highlight">Admin Access</h1>
          <p className="mt-3 text-sm leading-6 text-silver">
            Manage registrations, verification, pricing, and event settings.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <Input
              label="Username"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              required
            />
            <Input
              label="Password"
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
            <label className="flex items-center gap-3 rounded-2xl bg-white/[0.025] p-4 text-sm text-silver">
              <input
                type="checkbox"
                checked={form.rememberMe}
                onChange={(e) => setForm({ ...form, rememberMe: e.target.checked })}
                className="accent-accent"
              />
              Remember this session
            </label>
            <Button type="submit" className="w-full" size="lg" loading={loading}>
              Enter Dashboard
            </Button>
          </form>
        </GlassCard>
      </div>
    </>
  );
}
