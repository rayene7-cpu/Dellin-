const files = ["/brain","/memory","/personality","/logs","/ui","/state"];
export function FileExplorer() {
  return (
    <section className="card">
      <h2 className="text-xl font-bold text-pink-600">File Explorer</h2>
      <ul className="mt-2 text-sm space-y-1">{files.map(f => <li key={f} className="p-2 rounded bg-white border">{f}</li>)}</ul>
      <p className="text-xs mt-2">Checkpoint/rollback hooks ready for backend integration.</p>
    </section>
  );
}
