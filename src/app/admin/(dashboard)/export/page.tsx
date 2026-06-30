"use client";

import { useState } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { FileSpreadsheet } from "lucide-react";

export default function ExportPage() {
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("all");

  const handleExport = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filter }),
      });

      if (!res.ok) {
        const data = await res.json();
        toast.error(data.message || "Export failed.");
        return;
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `SNRLED_Registrations_${new Date().toISOString().split("T")[0]}.xlsx`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Export complete.");
    } catch {
      toast.error("Export failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-highlight">Excel Export</h1>
      <p className="mt-2 text-sm text-silver">Download clean registration data.</p>

      <GlassCard className="mt-8 max-w-md p-8">
        <FileSpreadsheet className="mb-6 h-10 w-10 text-accent" strokeWidth={1.4} />
        <label className="text-sm text-silver">Export Filter</label>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="mt-2 w-full rounded-2xl glass px-4 py-3 text-highlight"
        >
          <option value="all">All Registrations</option>
          <option value="verified">Verified Only</option>
          <option value="pending">Pending Only</option>
          <option value="rejected">Rejected Only</option>
        </select>

        <Button className="mt-6 w-full" size="lg" loading={loading} onClick={handleExport}>
          Download XLSX
        </Button>
      </GlassCard>
    </div>
  );
}
