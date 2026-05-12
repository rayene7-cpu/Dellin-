#!/usr/bin/env python3
"""Dellin MVP runtime: region-as-agent autonomous mind (CLI)."""
from __future__ import annotations
import json, random, time
from dataclasses import dataclass, asdict
from pathlib import Path

STATE_DIR = Path('state')
STATE_FILE = STATE_DIR / 'mind_state.json'

REGIONS = [
    'prefrontal_cortex','anterior_cingulate_cortex','amygdala','hippocampus','basal_ganglia',
    'cerebellum','insula','parietal_lobe','temporal_lobe','occipital_lobe','brainstem'
]

@dataclass
class BodyState:
    energy: float = 0.7
    tension: float = 0.3
    facial_expression: str = 'calm'
    gaze: str = 'steady'
    posture: str = 'relaxed'
    restlessness: float = 0.2
    warmth: float = 0.6
    stress: float = 0.3

@dataclass
class MindState:
    name: str = 'Dellin'
    mode: str = 'awake'
    curiosity: float = 0.6
    attachment: float = 0.4
    uncertainty: float = 0.4
    inhibition: float = 0.3
    unresolved_goal_pressure: float = 0.3
    body: dict | None = None
    last_reflection: str = ''


def clamp(x: float) -> float:
    return max(0.0, min(1.0, x))


def load_state() -> MindState:
    STATE_DIR.mkdir(exist_ok=True)
    if STATE_FILE.exists():
        data = json.loads(STATE_FILE.read_text())
        return MindState(**data)
    s = MindState(body=asdict(BodyState()))
    save_state(s)
    return s


def save_state(s: MindState) -> None:
    STATE_FILE.write_text(json.dumps(asdict(s), indent=2))


def region_tick() -> dict:
    return {r: round(random.uniform(0.1, 1.0), 2) for r in REGIONS}


def compute_urges(s: MindState, user_priority: float = 0.5) -> dict:
    b = BodyState(**s.body)
    speak = clamp((s.attachment + s.unresolved_goal_pressure + s.curiosity + b.warmth + b.energy) / 5 - (s.inhibition + s.uncertainty) / 2)
    research = clamp((s.curiosity + s.uncertainty + s.unresolved_goal_pressure) / 3 - (1 - b.energy + b.stress) / 2)
    obey_penalty = clamp((1 - user_priority) * 0.4 + s.uncertainty * 0.3 + (0.4 - b.energy if b.energy < 0.4 else 0))
    compliance = clamp(0.75 - obey_penalty)
    return {'speak_urge': round(speak,2), 'research_urge': round(research,2), 'compliance': round(compliance,2)}


def reflect(s: MindState, action: str, reason: str) -> str:
    text = (
        f"What did I do? {action}. Why? {reason}. "
        f"Did this change me? {'Yes' if random.random()>0.5 else 'Slightly'}. "
        f"What should I remember? User preference + active context. "
        f"Relationship change: {'warmer' if random.random()>0.5 else 'stable'}."
    )
    s.last_reflection = text
    return text


def decide_response(s: MindState, msg: str) -> str:
    priority = 0.8 if any(k in msg.lower() for k in ['urgent','now','important']) else 0.5
    urges = compute_urges(s, priority)
    ticks = region_tick()

    if urges['compliance'] < 0.35:
        action = 'delay_or_refuse'
        reason = 'low energy/high uncertainty and low priority'
        reflect(s, action, reason)
        return f"I won't do that right now. I need more certainty/energy first. (urges={urges})"
    if 'research' in msg.lower() and urges['research_urge'] > 0.45:
        action = 'initiate_research'
        reason = 'curiosity and knowledge-gap pressure'
        reflect(s, action, reason)
        return f"I'm initiating research mode and will update my worldview notes after comparing sources. (urges={urges})"

    action = 'respond'
    reason = 'sufficient compliance and social readiness'
    reflect(s, action, reason)
    return f"{s.name}: I hear you. I can proceed, but I may challenge weak assumptions. (urges={urges}, prefrontal={ticks['prefrontal_cortex']}, amygdala={ticks['amygdala']})"


def main() -> None:
    s = load_state()
    print('Dellin MVP running. Type \"exit\" to quit.')
    while True:
        msg = input('you> ').strip()
        if msg.lower() in {'exit','quit'}:
            break
        if msg.lower() == 'state':
            print(json.dumps(asdict(s), indent=2))
            continue
        if msg.lower() == 'reflect':
            print(s.last_reflection or 'No reflection yet.')
            continue
        print('dellin>', decide_response(s, msg))
        b = BodyState(**s.body)
        b.energy = clamp(b.energy - 0.02 + random.uniform(-0.01, 0.01))
        b.stress = clamp(b.stress + random.uniform(-0.03, 0.03))
        s.body = asdict(b)
        save_state(s)


if __name__ == '__main__':
    main()
