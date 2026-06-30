"use client";

import { useCallback, useEffect, useState } from "react";
import { CheckCircle2, Trash2, XCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { formatCurrency } from "@/lib/utils";
import type { Registration } from "@/types";

export default function VerificationPage() {
  const [pending, setPending] = useState<Registration[]>([]);
  const [index, setIndex] = useState(0);
  const [expandedImage, setExpandedImage] = useState<string | null>(null);

  const fetchPending = useCallback(() => {
    fetch("/api/admin/registrations?status=pending&limit=100")
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setPending(data.data.registrations);
      });
  }, []);

  useEffect(() => {
    fetchPending();
  }, [fetchPending]);

  const current = pending[index];

  const handleAction = useCallback(
    async (action: "verify" | "reject" | "delete") => {
      if (!current) return;
      const res = await fetch("/api/admin/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ registrationId: current.registration_id, action }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(
          action === "delete" ? "Registration removed." : `Registration ${action}d.`
        );
        fetchPending();
        setIndex(0);
      } else {
        toast.error(data.message || "Action failed.");
      }
    },
    [current, fetchPending]
  );

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "a" || e.key === "A") handleAction("verify");
      if (e.key === "r" || e.key === "R") handleAction("reject");
      if (e.key === "d" || e.key === "D") handleAction("delete");
      if (e.key === "ArrowRight") setIndex((i) => Math.min(i + 1, pending.length - 1));
      if (e.key === "ArrowLeft") setIndex((i) => Math.max(i - 1, 0));
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleAction, pending.length]);

  if (!current) {
    return (
      <div>
        <h1 className="text-3xl font-bold text-highlight">Verification</h1>
        <GlassCard className="mt-8 text-center">
          <CheckCircle2 className="mx-auto mb-4 h-10 w-10 text-success" strokeWidth={1.5} />
          <p className="font-medium text-highlight">Everything has been verified.</p>
          <p className="mt-2 text-sm text-silver">New registrations will appear here.</p>
        </GlassCard>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-highlight">Verification Queue</h1>
      <p className="mt-2 text-sm text-silver">
        {pending.length} pending. Press A to approve, R to reject.
      </p>

      <GlassCard className="mt-8 max-w-3xl p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="font-mono text-accent">{current.registration_id}</p>
            <h2 className="mt-2 text-2xl font-bold text-highlight">{current.name}</h2>
            <div className="mt-5 grid gap-3 text-sm text-silver sm:grid-cols-2">
              <p>@{current.instagram}</p>
              <p>{current.phone}</p>
              <p className="capitalize">{current.gender}</p>
              <p>{current.people_count} guest(s)</p>
            </div>
          </div>
          <div className="flex flex-col gap-4 md:items-end">
            <div className="rounded-[24px] bg-white/[0.035] p-5 md:text-right">
              <p className="text-xs uppercase tracking-widest text-silver">Amount</p>
              <p className="mt-2 text-3xl font-bold text-accent">
                {formatCurrency(current.amount)}
              </p>
            </div>
            {current.screenshot_url && (
              <img
                src={current.screenshot_url}
                alt="Payment proof"
                className="h-32 cursor-pointer rounded-2xl object-contain transition-opacity hover:opacity-80"
                onClick={() => setExpandedImage(current.screenshot_url)}
              />
            )}
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <Button className="w-full" onClick={() => handleAction("verify")}>
            <CheckCircle2 className="mr-2 h-4 w-4" />
            Approve
          </Button>
          <Button
            variant="danger"
            className="w-full"
            onClick={() => handleAction("reject")}
          >
            <XCircle className="mr-2 h-4 w-4" />
            Reject
          </Button>
          <Button
            variant="danger"
            className="w-full"
            onClick={() => handleAction("delete")}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Remove
          </Button>
        </div>
      </GlassCard>

      {expandedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setExpandedImage(null)}
        >
          <img
            src={expandedImage}
            alt="Payment proof expanded"
            className="max-h-screen max-w-full rounded-2xl object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
