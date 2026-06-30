"use client";

import { useCallback, useEffect, useState } from "react";
import { Search, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { formatCurrency } from "@/lib/utils";
import type { Registration, VerificationStatus } from "@/types";
import { cn } from "@/lib/utils";

const statusStyles: Record<VerificationStatus, string> = {
  pending: "border-warning/30 bg-warning/[0.06] text-warning",
  verified: "border-success/30 bg-success/[0.06] text-success",
  rejected: "border-danger/30 bg-danger/[0.06] text-danger",
};

export default function RegistrationsPage() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState<Registration | null>(null);

  const fetchRegistrations = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams({ search, status: filter });
    fetch(`/api/admin/registrations?${params}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setRegistrations(data.data.registrations);
        setLoading(false);
      });
  }, [filter, search]);

  useEffect(() => {
    queueMicrotask(fetchRegistrations);
  }, [fetchRegistrations]);

  const handleVerify = async (id: string, action: "verify" | "reject") => {
    const res = await fetch("/api/admin/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ registrationId: id, action }),
    });
    const data = await res.json();
    if (data.success) {
      toast.success(`Registration ${action}d.`);
      fetchRegistrations();
      setSelected(null);
    } else {
      toast.error(data.message);
    }
  };

  const handleDelete = async (id: string) => {
    const res = await fetch("/api/admin/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ registrationId: id, action: "delete" }),
    });
    const data = await res.json();
    if (data.success) {
      toast.success("Registration removed.");
      fetchRegistrations();
      setSelected(null);
    } else {
      toast.error(data.message);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-highlight">Registrations</h1>
      <p className="mt-2 text-sm text-silver">
        Search, review, and manage every access request.
      </p>

      <div className="mt-6 flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-silver" />
          <input
            type="text"
            placeholder="Search name, phone, Instagram, ID"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchRegistrations()}
            className="w-full rounded-2xl glass py-3 pl-10 pr-4 text-sm text-highlight focus:outline-none focus:ring-2 focus:ring-accent/40"
          />
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="rounded-2xl glass px-4 py-3 text-sm text-highlight focus:outline-none focus:ring-2 focus:ring-accent/40"
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="verified">Verified</option>
          <option value="rejected">Rejected</option>
        </select>
        <Button variant="secondary" onClick={fetchRegistrations}>
          Search
        </Button>
      </div>

      <GlassCard className="mt-6 overflow-x-auto p-0">
        <table className="w-full min-w-[760px] text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wider text-silver">
              <th className="p-4">ID</th>
              <th className="p-4">Name</th>
              <th className="p-4">Phone</th>
              <th className="p-4">Amount</th>
              <th className="p-4">Status</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-silver">
                  Loading registrations
                </td>
              </tr>
            ) : registrations.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-silver">
                  No registrations yet.
                </td>
              </tr>
            ) : (
              registrations.map((reg) => (
                <tr
                  key={reg.id}
                  className="cursor-pointer border-t border-white/5 transition-colors hover:bg-white/[0.025]"
                  onClick={() => setSelected(reg)}
                >
                  <td className="p-4 font-mono text-accent">{reg.registration_id}</td>
                  <td className="p-4 text-highlight">{reg.name}</td>
                  <td className="p-4 text-silver">{reg.phone}</td>
                  <td className="p-4 text-highlight">{formatCurrency(reg.amount)}</td>
                  <td className="p-4">
                    <span
                      className={cn(
                        "inline-flex rounded-full border px-3 py-1 text-xs capitalize",
                        statusStyles[reg.verification_status]
                      )}
                    >
                      {reg.verification_status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-wrap gap-2">
                      {reg.verification_status === "pending" && (
                        <>
                          <Button
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleVerify(reg.registration_id, "verify");
                            }}
                          >
                            Verify
                          </Button>
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleVerify(reg.registration_id, "reject");
                            }}
                          >
                            Reject
                          </Button>
                        </>
                      )}
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(reg.registration_id);
                        }}
                      >
                        Remove
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </GlassCard>

      {selected && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/55 backdrop-blur-sm">
          <GlassCard className="h-full w-full max-w-md overflow-y-auto rounded-none p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-mono text-sm text-accent">
                  {selected.registration_id}
                </p>
                <h2 className="mt-1 text-xl font-bold text-highlight">
                  {selected.name}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setSelected(null)}
                aria-label="Close registration details"
                className="glass flex h-10 w-10 items-center justify-center rounded-[16px] text-silver hover:text-highlight"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-8 space-y-4 text-sm">
              {[
                { label: "Phone", value: selected.phone },
                { label: "Instagram", value: `@${selected.instagram}` },
                { label: "Gender", value: selected.gender },
                { label: "People", value: String(selected.people_count) },
                { label: "Amount", value: formatCurrency(selected.amount) },
                { label: "Status", value: selected.verification_status },
              ].map((item) => (
                <div key={item.label} className="rounded-2xl bg-white/[0.035] p-4">
                  <p className="text-xs uppercase tracking-widest text-silver">
                    {item.label}
                  </p>
                  <p className="mt-1 text-highlight">{item.value}</p>
                </div>
              ))}
            </div>
            {selected.screenshot_url && (
              <div className="mt-8 rounded-2xl bg-white/[0.035] p-4">
                <p className="text-xs uppercase tracking-widest text-silver">Payment proof</p>
                <img
                  src={selected.screenshot_url}
                  alt="Payment proof"
                  className="mt-3 max-h-72 w-full rounded-2xl object-contain"
                />
              </div>
            )}
            <div className="mt-8">
              <Button
                variant="danger"
                className="w-full"
                onClick={() => handleDelete(selected.registration_id)}
              >
                Remove registration
              </Button>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
}
