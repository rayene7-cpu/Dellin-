"use client";
import { useMemo, useState } from "react";

const regions = [
  "Prefrontal Cortex","Anterior Cingulate Cortex","Amygdala","Hippocampus","Basal Ganglia",
  "Cerebellum","Insula","Parietal Lobe","Temporal Lobe","Occipital Lobe","Brainstem"
];

export function BrainMap() {
  const values = useMemo(() => Object.fromEntries(regions.map(r => [r, Math.floor(Math.random()*100)])), []);
  const [active, setActive] = useState(regions[0]);
  return (
    <section className="card">
      <h2 className="text-xl font-bold text-pink-600">Brain Map</h2>
      <p className="text-sm mb-3">Hidden multiplicity, visible unity.</p>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {regions.map((r) => (
          <button key={r} className="region-pill text-left" onClick={() => setActive(r)}>
            <div>{r}</div><div className="text-xs">activity {values[r]}%</div>
          </button>
        ))}
      </div>
      <div className="mt-4 p-3 rounded-xl bg-pink-50 border border-pink-200">
        <h3 className="font-semibold">{active}</h3>
        <p className="text-sm">Live signals, linked memory, reasoning pressure, and connected files are shown here.</p>
      </div>
    </section>
  );
}
