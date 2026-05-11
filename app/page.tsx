import { AvatarPanel } from "@/components/AvatarPanel";
import { BrainMap } from "@/components/BrainMap";
import { CreatorDashboard } from "@/components/CreatorDashboard";
import { FileExplorer } from "@/components/FileExplorer";
import { MemoryView } from "@/components/MemoryView";
import { PersonalityView } from "@/components/PersonalityView";

export default function Page() {
  return (
    <main className="min-h-screen p-4 md:p-6">
      <header className="mb-4 p-4 rounded-2xl bg-gradient-to-r from-yellow-200 to-pink-200">
        <h1 className="text-3xl font-extrabold text-slate-800">Dellin — Autonomous Mind Dashboard</h1>
        <p className="text-sm">Light neural UI (yellow/pink), region agents, unified visible identity.</p>
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="md:col-span-2"><BrainMap /></div>
        <AvatarPanel />
        <CreatorDashboard />
        <MemoryView />
        <PersonalityView />
        <div className="md:col-span-3"><FileExplorer /></div>
      </div>
    </main>
  );
}
