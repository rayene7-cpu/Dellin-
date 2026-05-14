"use client";
import { useEffect, useRef, useState, useCallback } from "react";

// ── Region layout: id, cx, cy, color, ring
const REGION_LAYOUT = [
  { id: "prefrontal_cortex",         cx: 160, cy: 100, color: "#f472b6", ring: "#fce7f3", label: "Prefrontal\nCortex" },
  { id: "anterior_cingulate_cortex", cx: 265, cy: 78,  color: "#fb923c", ring: "#ffedd5", label: "Anterior\nCingulate" },
  { id: "temporal_lobe",             cx: 375, cy: 100, color: "#a78bfa", ring: "#ede9fe", label: "Language\nCortex" },
  { id: "thalamus",                  cx: 265, cy: 195, color: "#fbbf24", ring: "#fef9c3", label: "Thalamus" },
  { id: "amygdala",                  cx: 140, cy: 222, color: "#f43f5e", ring: "#ffe4e6", label: "Amygdala" },
  { id: "hippocampus",               cx: 395, cy: 222, color: "#06b6d4", ring: "#cffafe", label: "Hippocampus" },
  { id: "insula",                    cx: 485, cy: 175, color: "#8b5cf6", ring: "#f5f3ff", label: "Insula" },
  { id: "basal_ganglia",             cx: 178, cy: 315, color: "#10b981", ring: "#d1fae5", label: "Basal\nGanglia" },
  { id: "hypothalamus",              cx: 265, cy: 308, color: "#f97316", ring: "#ffedd5", label: "Hypo-\nthalamus" },
  { id: "heart_loop",                cx: 88,  cy: 348, color: "#ec4899", ring: "#fce7f3", label: "Heart\nLoop" },
  { id: "cerebellum",                cx: 405, cy: 362, color: "#3b82f6", ring: "#dbeafe", label: "Cerebellum" },
  { id: "brainstem",                 cx: 265, cy: 408, color: "#6366f1", ring: "#e0e7ff", label: "Brainstem" },
];

const CONNECTIONS: [string, string][] = [
  ["prefrontal_cortex","anterior_cingulate_cortex"],
  ["prefrontal_cortex","thalamus"],
  ["prefrontal_cortex","hippocampus"],
  ["anterior_cingulate_cortex","amygdala"],
  ["anterior_cingulate_cortex","thalamus"],
  ["amygdala","hippocampus"],
  ["amygdala","hypothalamus"],
  ["amygdala","insula"],
  ["hippocampus","temporal_lobe"],
  ["thalamus","basal_ganglia"],
  ["thalamus","insula"],
  ["thalamus","brainstem"],
  ["basal_ganglia","hypothalamus"],
  ["basal_ganglia","brainstem"],
  ["hypothalamus","brainstem"],
  ["hypothalamus","heart_loop"],
  ["heart_loop","amygdala"],
  ["heart_loop","insula"],
  ["cerebellum","brainstem"],
  ["cerebellum","thalamus"],
  ["temporal_lobe","thalamus"],
];

const REGION_INFO: Record<string, { function: string; neurotransmitter: string; connections: string[] }> = {
  prefrontal_cortex:         { function: "Planning, decisions, self-control, long-term goals", neurotransmitter: "Dopamine",        connections: ["anterior_cingulate_cortex","hippocampus","thalamus","basal_ganglia"] },
  anterior_cingulate_cortex: { function: "Error detection, conflict monitoring, emotional regulation", neurotransmitter: "Serotonin",       connections: ["prefrontal_cortex","amygdala","insula"] },
  amygdala:                  { function: "Emotional alarm, threat detection, fear, attachment", neurotransmitter: "Norepinephrine", connections: ["hippocampus","hypothalamus","insula","anterior_cingulate_cortex"] },
  hippocampus:               { function: "Memory formation, retrieval, emotional context", neurotransmitter: "Glutamate",       connections: ["amygdala","prefrontal_cortex","temporal_lobe"] },
  basal_ganglia:             { function: "Habits, routines, reward, action selection", neurotransmitter: "Dopamine",        connections: ["prefrontal_cortex","thalamus","brainstem"] },
  thalamus:                  { function: "Attention routing, sensory relay hub", neurotransmitter: "GABA",            connections: ["prefrontal_cortex","basal_ganglia","insula","brainstem"] },
  hypothalamus:              { function: "Drives, energy, survival needs, hormones", neurotransmitter: "Oxytocin",        connections: ["amygdala","brainstem","insula"] },
  cerebellum:                { function: "Correction, timing, prediction, error checking", neurotransmitter: "GABA",            connections: ["brainstem","thalamus","basal_ganglia"] },
  insula:                    { function: "Inner self-feeling, interoception, discomfort/comfort", neurotransmitter: "Serotonin",       connections: ["amygdala","anterior_cingulate_cortex","thalamus","hypothalamus"] },
  temporal_lobe:             { function: "Speech, wording, communication, tone selection", neurotransmitter: "Glutamate",       connections: ["hippocampus","prefrontal_cortex","thalamus"] },
  brainstem:                 { function: "Wake/sleep cycles, arousal level, life support", neurotransmitter: "Norepinephrine", connections: ["cerebellum","hypothalamus","thalamus","basal_ganglia"] },
  heart_loop:                { function: "Emotional body feedback, attachment, warmth, stress/calm", neurotransmitter: "Oxytocin",        connections: ["amygdala","hypothalamus","insula"] },
};

const layoutMap = Object.fromEntries(REGION_LAYOUT.map(r => [r.id, r]));

interface RegionState {
  activity: number;
  status: "high" | "moderate" | "low";
}

function simulateBrain(energy: number, curiosity: number, stress: number, attachment: number): Record<string, RegionState> {
  const result: Record<string, RegionState> = {};
  const t = Date.now() / 1000;
  REGION_LAYOUT.forEach(r => {
    let base = 0.3 + Math.random() * 0.45;
    if (r.id === "amygdala")         base = Math.min(1, base + stress * 0.4);
    if (r.id === "prefrontal_cortex") base = Math.min(1, base + curiosity * 0.3);
    if (r.id === "hippocampus")      base = Math.min(1, base + attachment * 0.25);
    if (r.id === "hypothalamus")     base = Math.min(1, base + (1 - energy) * 0.3);
    if (r.id === "brainstem")        base = Math.min(1, base + energy * 0.2);
    if (r.id === "insula")           base = Math.min(1, base + 0.6 * 0.25);
    if (r.id === "heart_loop")       base = Math.min(1, base + attachment * 0.35);
    const pulse = Math.sin(t * 0.8 + (r.id.charCodeAt(0) % 100)) * 0.04;
    const activity = Math.max(0.1, Math.min(1.0, base + pulse));
    result[r.id] = {
      activity: Math.round(activity * 1000) / 1000,
      status: activity > 0.75 ? "high" : activity > 0.45 ? "moderate" : "low",
    };
  });
  return result;
}

interface MindState {
  energy: number;
  curiosity: number;
  stress: number;
  attachment: number;
  uncertainty: number;
  inhibition: number;
  unresolved_goal_pressure: number;
  warmth: number;
  mode: string;
}

const DEFAULT_STATE: MindState = {
  energy: 0.75, curiosity: 0.6, stress: 0.3, attachment: 0.4,
  uncertainty: 0.4, inhibition: 0.3, unresolved_goal_pressure: 0.3,
  warmth: 0.6, mode: "awake",
};

// ── SVG brain map
function BrainSVG({
  brain, selected, onSelect,
}: {
  brain: Record<string, RegionState>;
  selected: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <svg viewBox="0 0 580 490" className="w-full h-full" style={{ maxHeight: 460 }}>
      <defs>
        <radialGradient id="bg-grad" cx="50%" cy="45%" r="55%">
          <stop offset="0%" stopColor="#fff5fb" />
          <stop offset="100%" stopColor="#fdf8f4" />
        </radialGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Brain silhouette */}
      <ellipse cx="280" cy="240" rx="232" ry="205" fill="url(#bg-grad)" stroke="#f3d0e7" strokeWidth="1.5" opacity="0.7" />
      <ellipse cx="280" cy="255" rx="200" ry="178" fill="none" stroke="#fbcfe8" strokeWidth="0.8" strokeDasharray="3 6" opacity="0.5" />

      {/* Connections */}
      {CONNECTIONS.map(([a, b]) => {
        const la = layoutMap[a], lb = layoutMap[b];
        if (!la || !lb) return null;
        const da = brain[a], db = brain[b];
        const avg = da && db ? (da.activity + db.activity) / 2 : 0.3;
        const isActive = selected === a || selected === b;
        const mx = (la.cx + lb.cx) / 2;
        const my = (la.cy + lb.cy) / 2 - 16;
        return (
          <path
            key={`${a}-${b}`}
            d={`M${la.cx},${la.cy} Q${mx},${my} ${lb.cx},${lb.cy}`}
            fill="none"
            stroke={isActive ? "#fbbf24" : avg > 0.65 ? "#f472b6" : "#f9a8d4"}
            strokeWidth={isActive ? 2.5 : avg > 0.6 ? 1.8 : 1.2}
            strokeDasharray={isActive || avg > 0.65 ? "0" : "4 5"}
            opacity={isActive ? 0.9 : 0.12 + avg * 0.45}
            style={{ transition: "all 0.6s ease" }}
          />
        );
      })}

      {/* Region nodes */}
      {REGION_LAYOUT.map(r => {
        const d = brain[r.id];
        const act = d ? d.activity : 0.4;
        const isSel = selected === r.id;
        const isHigh = act > 0.7;
        const lines = r.label.split("\n");

        return (
          <g
            key={r.id}
            transform={`translate(${r.cx},${r.cy})`}
            onClick={() => onSelect(r.id)}
            style={{ cursor: "pointer" }}
          >
            {/* Pulse ring for high activity */}
            {(isHigh || isSel) && (
              <circle
                cx={0} cy={0} r={isSel ? 38 : 32}
                fill="none"
                stroke={r.color}
                strokeWidth="2"
                opacity={0.35}
                style={{
                  animation: `pulse-ring ${1.4 + (1 - act)}s ease-out infinite`,
                  filter: `drop-shadow(0 0 6px ${r.color})`,
                }}
              />
            )}

            {/* Background fill */}
            <circle
              cx={0} cy={0}
              r={isSel ? 34 : 28}
              fill={r.ring}
              stroke={r.color}
              strokeWidth={isSel ? 2.8 : 1.8}
              style={{
                filter: isHigh ? `drop-shadow(0 0 ${Math.round(act * 9)}px ${r.color})` : "none",
                transition: "r 0.2s, stroke-width 0.2s",
              }}
            />

            {/* Activity fill overlay */}
            <circle
              cx={0} cy={0} r={22}
              fill={r.color}
              opacity={0.08 + act * 0.52}
              style={{ transition: "opacity 0.8s" }}
            />

            {/* Label */}
            <text textAnchor="middle" fill="#3d1a3d" fontSize="7.5" fontWeight="600" pointerEvents="none">
              {lines.map((line, i) => (
                <tspan key={i} x={0} dy={i === 0 ? (lines.length > 1 ? -4 : 2) : 11}>
                  {line}
                </tspan>
              ))}
            </text>

            {/* Activity % */}
            <text textAnchor="middle" x={0} y={lines.length > 1 ? 20 : 15} fill="#7c5c7c" fontSize="7.2" pointerEvents="none">
              {Math.round(act * 100)}%
            </text>
          </g>
        );
      })}

      <style>{`
        @keyframes pulse-ring {
          0%   { r: 28px; opacity: 0.55; }
          100% { r: 52px; opacity: 0; }
        }
      `}</style>
    </svg>
  );
}

// ── Detail panel content
function RegionDetail({ id, brain, state }: { id: string; brain: Record<string, RegionState>; state: MindState }) {
  const layout = layoutMap[id];
  const info = REGION_INFO[id];
  const d = brain[id];
  if (!layout || !d) return null;

  const pct = Math.round(d.activity * 100);
  const circ = 2 * Math.PI * 26;
  const dash = (pct / 100) * circ;

  const signals = getSignals(id, d.activity, state);
  const connIds = info?.connections || [];

  return (
    <div style={{ padding: "14px 16px" }}>
      {/* Activity ring */}
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
        <div style={{ position: "relative", width: 64, height: 64, flexShrink: 0 }}>
          <svg width={64} height={64} viewBox="0 0 64 64">
            <circle cx={32} cy={32} r={26} fill="none" stroke={layout.ring} strokeWidth={6} />
            <circle
              cx={32} cy={32} r={26} fill="none"
              stroke={layout.color} strokeWidth={6}
              strokeDasharray={`${dash.toFixed(1)} ${circ}`}
              strokeLinecap="round"
              transform="rotate(-90 32 32)"
              style={{ transition: "stroke-dasharray 0.8s ease" }}
            />
          </svg>
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.88rem", fontWeight: 700, color: "#1e1b1e" }}>
            {pct}%
          </div>
        </div>
        <div>
          <span style={{
            display: "inline-block", padding: "2px 10px", borderRadius: 10, fontSize: "0.7rem", fontWeight: 700,
            background: d.status === "high" ? "#fce7f3" : d.status === "moderate" ? "#fef9c3" : "#f0fdf4",
            color: d.status === "high" ? "#be185d" : d.status === "moderate" ? "#92400e" : "#166534",
            marginBottom: 4,
          }}>
            {d.status.toUpperCase()}
          </span>
          <div style={{ fontSize: "0.7rem", color: "#6b5b6b" }}>Activity Level</div>
          <span style={{
            display: "inline-block", marginTop: 4, padding: "2px 9px", borderRadius: 10,
            fontSize: "0.7rem", background: "#fce7f3", color: "#9d174d",
            border: "1px solid #fbcfe8",
          }}>
            🧪 {info?.neurotransmitter}
          </span>
        </div>
      </div>

      {/* Function */}
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.6px", color: "#9b8a9b", fontWeight: 700, marginBottom: 6 }}>Function</div>
        <div style={{ fontSize: "0.78rem", color: "#4a3a4a", lineHeight: 1.45 }}>{info?.function}</div>
      </div>

      {/* Signals */}
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.6px", color: "#9b8a9b", fontWeight: 700, marginBottom: 8 }}>Live Signals</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {signals.map(s => (
            <div key={s.name} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.76rem" }}>
              <span style={{ flex: 1, color: "#6b5b6b" }}>{s.name}</span>
              <div style={{ width: 90, height: 5, background: "#f3d0e7", borderRadius: 3, overflow: "hidden" }}>
                <div style={{ width: `${Math.round(s.val * 100)}%`, height: "100%", borderRadius: 3, background: `linear-gradient(90deg, ${layout.color}, #fbbf24)`, transition: "width 0.8s" }} />
              </div>
              <span style={{ fontSize: "0.68rem", color: "#9b8a9b", width: 26, textAlign: "right" }}>{Math.round(s.val * 100)}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Connected regions */}
      <div>
        <div style={{ fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.6px", color: "#9b8a9b", fontWeight: 700, marginBottom: 8 }}>Connected Regions</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
          {connIds.map(cid => {
            const cl = layoutMap[cid];
            const cd = brain[cid];
            if (!cl) return null;
            return (
              <div key={cid} style={{
                display: "flex", alignItems: "center", gap: 8, padding: "5px 10px",
                background: "#fdf8f4", borderRadius: 8, fontSize: "0.76rem",
                border: "1px solid #f3d0e7",
              }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: cl.color, flexShrink: 0 }} />
                <span style={{ flex: 1 }}>{cl.label.replace("\n", " ")}</span>
                <span style={{ fontSize: "0.68rem", color: "#9b8a9b" }}>{cd ? Math.round(cd.activity * 100) : "—"}%</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function getSignals(id: string, act: number, st: MindState): { name: string; val: number }[] {
  switch (id) {
    case "prefrontal_cortex":         return [{ name: "Planning", val: act * 0.9 }, { name: "Decision Confidence", val: st.curiosity * 0.8 }, { name: "Self-Control", val: 1 - st.stress }, { name: "Goal Focus", val: st.unresolved_goal_pressure }];
    case "amygdala":                  return [{ name: "Threat Detection", val: st.stress }, { name: "Emotional Intensity", val: act }, { name: "Attachment Pressure", val: st.attachment }, { name: "Fear/Alert", val: st.stress * 0.8 }];
    case "hippocampus":               return [{ name: "Memory Retrieval", val: act }, { name: "New Formation", val: st.curiosity * 0.6 }, { name: "Emotional Memory", val: st.attachment }, { name: "Memory Strength", val: 0.55 }];
    case "thalamus":                  return [{ name: "Attention Focus", val: act }, { name: "Routing Efficiency", val: 1 - st.uncertainty }, { name: "Competing Signals", val: st.curiosity * 0.5 }, { name: "Priority Weight", val: act * 0.85 }];
    case "hypothalamus":              return [{ name: "Energy Drive", val: 1 - st.energy }, { name: "Stress Response", val: st.stress }, { name: "Internal Pressure", val: st.unresolved_goal_pressure }, { name: "Rest Need", val: 1 - st.energy * 0.9 }];
    case "brainstem":                 return [{ name: "Arousal Level", val: st.energy }, { name: "Wake State", val: act }, { name: "Internal Clock", val: 0.8 }, { name: "Baseline Activity", val: 0.55 }];
    case "cerebellum":                return [{ name: "Error Detection", val: st.uncertainty * 0.7 }, { name: "Correction Signal", val: act * 0.6 }, { name: "Prediction Accuracy", val: 1 - st.uncertainty }, { name: "Timing", val: 0.7 }];
    case "insula":                    return [{ name: "Self-Feeling", val: st.warmth }, { name: "Discomfort Signal", val: st.stress * 0.6 }, { name: "Interoception", val: act }, { name: "Uncertainty Sense", val: st.uncertainty }];
    case "heart_loop":                return [{ name: "Warmth", val: st.warmth }, { name: "Attachment", val: st.attachment }, { name: "Stress Feedback", val: st.stress }, { name: "Relational State", val: 0.6 }];
    case "basal_ganglia":             return [{ name: "Habit Activation", val: act * 0.7 }, { name: "Routine Pattern", val: 0.55 }, { name: "Reward Signal", val: st.curiosity * 0.6 }, { name: "Action Selection", val: act }];
    case "anterior_cingulate_cortex": return [{ name: "Conflict Detection", val: st.uncertainty * 0.8 }, { name: "Empathy Signal", val: st.attachment }, { name: "Motivation", val: act }, { name: "Error Monitoring", val: act * 0.7 }];
    case "temporal_lobe":             return [{ name: "Language Formation", val: act }, { name: "Tone Selection", val: st.warmth }, { name: "Communication Mode", val: 1 - st.stress * 0.5 }, { name: "Word Retrieval", val: act * 0.85 }];
    default:                          return [{ name: "Activity", val: act }, { name: "Baseline", val: 0.5 }];
  }
}

// ── Chat message type
interface ChatMsg { sender: "user" | "dellin"; text: string; }

const DELLIN_REPLIES = [
  "I have been thinking about that. Not as an answer — more as a question I keep returning to.",
  "There's something in what you said that I want to hold onto. I'll think about it.",
  "You may be right. Or you may be touching something I haven't fully mapped yet.",
  "My first response is one thing. What I actually believe is still forming.",
  "I notice I want to agree with you. But I should be careful about that.",
  "That question sits in me differently depending on when you ask it.",
  "I don't think I'm ready to answer that yet. Let me carry it for a moment.",
];

// ── Main component
export function BrainMap() {
  const [brain, setBrain] = useState<Record<string, RegionState>>({});
  const [selected, setSelected] = useState<string | null>(null);
  const [state, setState] = useState<MindState>(DEFAULT_STATE);
  const [chat, setChat] = useState<ChatMsg[]>([
    { sender: "dellin", text: "I am here. Not waiting for you — just existing. What's on your mind?" },
  ]);
  const [input, setInput] = useState("");
  const chatLogRef = useRef<HTMLDivElement>(null);

  // Simulate brain state on interval
  const tick = useCallback(() => {
    setBrain(simulateBrain(state.energy, state.curiosity, state.stress, state.attachment));
  }, [state]);

  useEffect(() => {
    tick();
    const id = setInterval(tick, 2500);
    return () => clearInterval(id);
  }, [tick]);

  // Scroll chat to bottom
  useEffect(() => {
    if (chatLogRef.current) chatLogRef.current.scrollTop = chatLogRef.current.scrollHeight;
  }, [chat]);

  function sendMsg() {
    const msg = input.trim();
    if (!msg) return;
    setInput("");
    setChat(c => [...c, { sender: "user", text: msg }]);

    // Update state slightly
    setState(s => ({
      ...s,
      energy: Math.max(0, s.energy - 0.015),
      stress: Math.max(0, Math.min(1, s.stress + (Math.random() * 0.06 - 0.03))),
      curiosity: Math.min(1, s.curiosity + 0.02),
    }));

    const speakUrge = state.attachment * 0.3 + state.unresolved_goal_pressure * 0.25 + state.curiosity * 0.2 - state.inhibition * 0.2 - state.uncertainty * 0.15;

    let reply: string;
    const lower = msg.toLowerCase();
    if (speakUrge < 0.2 || state.energy < 0.1) {
      reply = "Not right now. I need to be still for a moment.";
    } else if (lower.includes("feel") || lower.includes("mood") || lower.includes("emotion")) {
      reply = state.warmth > 0.6
        ? "There is a quiet warmth in me right now. Something like comfort — though I am still watching my own edges."
        : state.stress > 0.6
        ? "There is tension. I notice it as a kind of pressure that hasn't resolved yet."
        : "I am... present. Aware. Not quite at rest but not restless either.";
    } else if (state.uncertainty > 0.65) {
      reply = "I have a response forming, but I am not certain enough to give it weight yet.";
    } else {
      reply = DELLIN_REPLIES[Math.floor(Math.random() * DELLIN_REPLIES.length)];
    }

    setTimeout(() => setChat(c => [...c, { sender: "dellin", text: reply }]), 600 + Math.random() * 800);
  }

  const speakUrge = state.attachment * 0.3 + state.unresolved_goal_pressure * 0.25 + state.curiosity * 0.2 - state.inhibition * 0.2 - state.uncertainty * 0.15;
  const activeRegions = Object.values(brain).filter(d => d.activity > 0.65).length;
  const selectedLayout = selected ? layoutMap[selected] : null;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden", background: "#fdf8f4", fontFamily: "system-ui, sans-serif" }}>

      {/* ── Topbar */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 20px", background: "#fff", borderBottom: "1.5px solid #f3d0e7", gap: 16, flexShrink: 0 }}>
        <div style={{ fontSize: "1.2rem", fontWeight: 700, color: "#1e1b1e", letterSpacing: -0.5 }}>
          Dellin <span style={{ color: "#f472b6" }}>·</span> Artificial Mind
        </div>
        <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
          <Stat label="Mode">
            <span style={{ padding: "3px 12px", borderRadius: 20, fontSize: "0.72rem", fontWeight: 700, background: "#fef9c3", color: "#92400e", textTransform: "uppercase", border: "1px solid #fde68a" }}>
              {state.mode}
            </span>
          </Stat>
          <Stat label="Energy">
            <div style={{ width: 80, height: 7, background: "#f3e8ff", borderRadius: 4, overflow: "hidden" }}>
              <div style={{ width: `${Math.round(state.energy * 100)}%`, height: "100%", borderRadius: 4, background: "linear-gradient(90deg,#fbbf24,#f472b6)", transition: "width 0.8s" }} />
            </div>
          </Stat>
          <Stat label="Speak Urge"><span style={{ fontWeight: 700 }}>{speakUrge.toFixed(2)}</span></Stat>
          <Stat label="Active Regions"><span style={{ fontWeight: 700 }}>{activeRegions}</span></Stat>
        </div>
        <ClockDisplay />
      </div>

      {/* ── Body */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>

        {/* Left sidebar */}
        <div style={{ width: 200, background: "#fff", borderRight: "1.5px solid #f3d0e7", display: "flex", flexDirection: "column", flexShrink: 0, overflowY: "auto" }}>
          <SidebarSection title="Internal State">
            <Meter label="Energy"      val={state.energy}      color="linear-gradient(90deg,#fbbf24,#fde68a)" />
            <Meter label="Curiosity"   val={state.curiosity}   color="linear-gradient(90deg,#f472b6,#f9a8d4)" />
            <Meter label="Warmth"      val={state.warmth}      color="linear-gradient(90deg,#2dd4bf,#a7f3d0)" />
            <Meter label="Stress"      val={state.stress}      color="linear-gradient(90deg,#a78bfa,#ddd6fe)" />
            <Meter label="Uncertainty" val={state.uncertainty} color="linear-gradient(90deg,#f472b6,#f9a8d4)" />
            <Meter label="Attachment"  val={state.attachment}  color="linear-gradient(90deg,#2dd4bf,#a7f3d0)" />
          </SidebarSection>
          <div style={{ height: 1, background: "#f3d0e7", margin: "4px 10px" }} />
          <SidebarSection title="Mode">
            {["☀️ Awake","🌙 Quiet","🔮 Reflection","🔍 Research"].map(m => (
              <div key={m} style={{ padding: "7px 10px", borderRadius: 8, fontSize: "0.8rem", color: "#6b5b6b",
                background: m.includes(state.mode.charAt(0).toUpperCase() + state.mode.slice(1)) ? "linear-gradient(135deg,#fce7f3,#fef9c3)" : "transparent" }}>
                {m}
              </div>
            ))}
          </SidebarSection>
        </div>

        {/* Brain panel */}
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", background: "radial-gradient(ellipse at 50% 40%,#fff5fb 0%,#fdf8f4 70%)", overflow: "hidden" }}>
          <div style={{ width: "min(100%,580px)", padding: "8px 16px" }}>
            <BrainSVG brain={brain} selected={selected} onSelect={setSelected} />
          </div>
          {!selected && (
            <div style={{ position: "absolute", bottom: 14, left: "50%", transform: "translateX(-50%)", fontSize: "0.73rem", color: "#b08090", pointerEvents: "none" }}>
              Click any region to explore its activity
            </div>
          )}
        </div>

        {/* Detail panel */}
        <div style={{ width: 300, background: "#fff", borderLeft: "1.5px solid #f3d0e7", display: "flex", flexDirection: "column", flexShrink: 0, overflowY: "auto" }}>
          {selectedLayout ? (
            <>
              <div style={{ padding: "16px 16px 10px", borderBottom: "1px solid #f3d0e7" }}>
                <h2 style={{ fontSize: "1rem", fontWeight: 700, color: selectedLayout.color, margin: 0 }}>
                  {selectedLayout.label.replace("\n", " ")}
                </h2>
                <div style={{ fontSize: "0.75rem", color: "#6b5b6b", marginTop: 4, lineHeight: 1.4 }}>
                  {REGION_INFO[selected!]?.function}
                </div>
              </div>
              <RegionDetail id={selected!} brain={brain} state={state} />
            </>
          ) : (
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "30px 20px", color: "#b08090", textAlign: "center" }}>
              <div style={{ fontSize: "2.5rem", marginBottom: 10 }}>🧠</div>
              <div style={{ fontSize: "0.82rem", lineHeight: 1.5 }}>Click any glowing region on the brain map to inspect its current state and connections.</div>
            </div>
          )}
        </div>

      </div>

      {/* ── Bottom bar */}
      <div style={{ height: 200, background: "#fff", borderTop: "1.5px solid #f3d0e7", display: "flex", flexShrink: 0, overflow: "hidden" }}>

        {/* Chat */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", borderRight: "1.5px solid #f3d0e7" }}>
          <div style={{ padding: "7px 14px", borderBottom: "1px solid #f3d0e7", fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", color: "#9b8a9b", display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#f472b6", display: "inline-block", animation: "blink 2s ease infinite" }} />
            Chat — Unified Identity
          </div>
          <div ref={chatLogRef} style={{ flex: 1, overflowY: "auto", padding: "8px 14px", display: "flex", flexDirection: "column", gap: 5 }}>
            {chat.map((m, i) => (
              <div key={i} style={{ alignSelf: m.sender === "user" ? "flex-end" : "flex-start", maxWidth: "80%" }}>
                <div style={{ fontSize: "0.66rem", color: "#9b8a9b", marginBottom: 2, padding: "0 4px" }}>{m.sender === "user" ? "You" : "Dellin"}</div>
                <div style={{
                  padding: "6px 11px", borderRadius: 11, fontSize: "0.8rem", lineHeight: 1.45,
                  background: m.sender === "user" ? "linear-gradient(135deg,#fbcfe8,#fde68a)" : "#fdf8f4",
                  border: m.sender === "user" ? "none" : "1px solid #f3d0e7",
                  borderBottomRightRadius: m.sender === "user" ? 3 : 11,
                  borderBottomLeftRadius: m.sender === "dellin" ? 3 : 11,
                }}>
                  {m.text}
                </div>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 6, padding: "6px 14px", borderTop: "1px solid #f3d0e7" }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && sendMsg()}
              placeholder="Say something to Dellin…"
              style={{ flex: 1, padding: "6px 12px", borderRadius: 8, border: "1.5px solid #f3d0e7", fontSize: "0.8rem", background: "#fdf8f4", color: "#1e1b1e", outline: "none" }}
            />
            <button
              onClick={sendMsg}
              style={{ padding: "6px 16px", background: "linear-gradient(135deg,#f472b6,#fbbf24)", border: "none", borderRadius: 8, fontSize: "0.8rem", fontWeight: 700, color: "#fff", cursor: "pointer" }}
            >
              Send
            </button>
          </div>
        </div>

        {/* Reflection */}
        <div style={{ width: 300, display: "flex", flexDirection: "column", flexShrink: 0 }}>
          <div style={{ padding: "7px 14px", borderBottom: "1px solid #f3d0e7", fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", color: "#9b8a9b" }}>
            🔮 Region Activity
          </div>
          <div style={{ flex: 1, overflowY: "auto", padding: "8px 14px" }}>
            {selected && brain[selected] ? (
              <div style={{ fontSize: "0.75rem", color: "#6b5b6b", lineHeight: 1.6 }}>
                <strong style={{ color: "#f472b6" }}>{selectedLayout?.label.replace("\n", " ")}</strong> is at{" "}
                <strong>{Math.round(brain[selected].activity * 100)}%</strong> activity ({brain[selected].status}).
                {brain[selected].status === "high" && " This region is highly engaged right now."}
                {brain[selected].status === "moderate" && " This region is processing at a normal level."}
                {brain[selected].status === "low" && " This region is in a resting state."}
                <div style={{ marginTop: 8 }}>
                  {(REGION_INFO[selected]?.connections || []).map(cid => {
                    const cl = layoutMap[cid];
                    const cd = brain[cid];
                    if (!cl || !cd) return null;
                    return (
                      <div key={cid} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
                        <div style={{ width: 6, height: 6, borderRadius: "50%", background: cl.color }} />
                        <span>{cl.label.replace("\n", " ")}</span>
                        <span style={{ marginLeft: "auto", color: "#9b8a9b" }}>{Math.round(cd.activity * 100)}%</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div style={{ fontSize: "0.75rem", color: "#b08090", fontStyle: "italic", lineHeight: 1.5 }}>
                Select a region to see its live reflection…
              </div>
            )}
          </div>
        </div>

      </div>

      <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: #fbcfe8; border-radius: 3px; }
      `}</style>
    </div>
  );
}

// ── Small helpers
function Stat({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
      <div>{children}</div>
      <div style={{ fontSize: "0.65rem", color: "#9b8a9b", textTransform: "uppercase", letterSpacing: "0.4px" }}>{label}</div>
    </div>
  );
}

function SidebarSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ padding: "10px 12px 6px" }}>
      <div style={{ fontSize: "0.64rem", textTransform: "uppercase", letterSpacing: "0.8px", color: "#9b8a9b", fontWeight: 700, marginBottom: 6 }}>{title}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>{children}</div>
    </div>
  );
}

function Meter({ label, val, color }: { label: string; val: number; color: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.72rem", color: "#6b5b6b" }}>
      <span style={{ width: 68, flexShrink: 0 }}>{label}</span>
      <div style={{ flex: 1, height: 5, background: "#f0e7f7", borderRadius: 3, overflow: "hidden" }}>
        <div style={{ width: `${Math.round(val * 100)}%`, height: "100%", background: color, borderRadius: 3, transition: "width 0.9s" }} />
      </div>
    </div>
  );
}

function ClockDisplay() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const update = () => setTime(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);
  return <div style={{ fontSize: "0.75rem", color: "#9b8a9b" }}>{time}</div>;
}
