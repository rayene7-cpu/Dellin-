export function MemoryView() {
  return (
    <section className="card">
      <h2 className="text-xl font-bold text-pink-600">Memory View</h2>
      <div className="text-sm space-y-2 mt-2">
        <div className="p-2 rounded bg-yellow-50">Episodic: user asked to run on Replit (strength 0.82)</div>
        <div className="p-2 rounded bg-pink-50">Research memory: Next.js stack required (confidence 0.91)</div>
      </div>
    </section>
  );
}
