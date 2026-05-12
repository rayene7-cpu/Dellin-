export function CreatorDashboard() {
  return (
    <section className="card">
      <h2 className="text-xl font-bold text-pink-600">Creator Dashboard</h2>
      <div className="text-sm grid grid-cols-2 gap-2 mt-2">
        <div className="p-2 rounded bg-yellow-50">Mode: Awake</div>
        <div className="p-2 rounded bg-pink-50">Speak urge: 0.41</div>
        <div className="p-2 rounded bg-yellow-50">Research urge: 0.58</div>
        <div className="p-2 rounded bg-pink-50">Attention: Hippocampus</div>
      </div>
    </section>
  );
}
