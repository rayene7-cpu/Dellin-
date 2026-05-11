export function AvatarPanel() {
  return (
    <section className="card">
      <h2 className="text-xl font-bold text-pink-600">Avatar & Body</h2>
      <div className="mt-3 rounded-xl p-4 bg-gradient-to-br from-yellow-100 to-pink-100">
        <p className="font-semibold">Dellin (Unified Male Identity)</p>
        <ul className="text-sm mt-2 space-y-1">
          <li>Energy: 68%</li><li>Tension: 22%</li><li>Warmth: 61%</li><li>Stress: 31%</li>
        </ul>
      </div>
    </section>
  );
}
