import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/security/auth";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAdminSession();

  // Allow login page without session
  // This layout wraps all /admin/* except we'll handle login separately

  if (!session) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-[#050505]">
      <AdminSidebar />
      <main className="lg:ml-64">
        <div className="glass-strong px-6 py-4 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm text-silver">
              {new Date().toLocaleDateString("en-IN", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
            <p className="rounded-full border border-white/10 px-3 py-1 text-sm text-chrome">
              {session.username}
            </p>
          </div>
        </div>
        <div className="p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
