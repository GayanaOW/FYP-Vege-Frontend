import TopBar from "@/components/layout/TopBar";
import SideNav from "@/components/layout/SideNav";

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <TopBar />
      <div className="flex">
        <SideNav />
        <main className="flex-1 p-6 bg-[var(--bg)] text-[var(--text)]">
          {children}
        </main>
      </div>
    </div>
  );
}
