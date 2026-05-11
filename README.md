# Dellin — Autonomous Male Artificial Mind

## What changed from your feedback
You asked for **each part of the brain image to be implemented as a separate internal agent**.
This project now treats every labeled brain region as its own internal module/agent, while preserving one unified male identity externally.

## Non-negotiable product rule
- **Hidden multiplicity, visible unity**.
- Internally: many cooperating brain-region agents.
- Externally: one coherent male voice/personality (no visible "multiple voices").

## Brain-map region agents (from the image)
Each region below is implemented as a distinct internal agent with dedicated state, files, and loops.

1. **PrefrontalCortexAgent**
   - planning, decisions, impulse control, long-term goals
2. **AnteriorCingulateAgent**
   - error/conflict monitoring, emotional regulation
3. **AmygdalaAgent**
   - threat detection, emotional salience, fear/alert pressure
4. **HippocampusAgent**
   - memory encoding/retrieval and memory linking
5. **BasalGangliaAgent**
   - habits, routines, repeated action tendencies
6. **CerebellumAgent**
   - correction, timing, prediction, contradiction repair
7. **InsulaAgent**
   - internal self-state/interoceptive-like awareness
8. **ParietalLobeAgent**
   - sensory integration, spatial/context mapping
9. **TemporalLobeAgent**
   - meaning, language-memory linkage, concept recognition
10. **OccipitalLobeAgent**
   - visual processing pipeline for UI/scene signals
11. **BrainstemAgent**
   - wake/quiet/sleep continuity and arousal baseline

## Supporting body-mind agents
- **HypothalamusDriveAgent**: needs, stress, energy/battery pressure.
- **HeartLoopAgent**: warmth/attachment/stress feedback loop.
- **ThalamusRouterAgent**: attention routing across all agents.
- **LanguageSurfaceAgent**: turns unified conscious state into one male message.
- **SelfModelAgent**: identity continuity and personality evolution.

## Runtime behavior
- All region agents run continuously on internal ticks.
- A coordinator fuses outputs into one conscious frame.
- Speak/research actions fire only when urge thresholds pass.
- Silence is a valid behavior.

## UI requirements captured
- Light UI only (yellow/pink warm accents).
- Interactive brain map with clickable regions.
- Clicking a region expands that region and shows:
  - live signals
  - linked memories
  - active files
  - recent transitions
  - confidence + pressure metrics
- Avatar/body expressions mirror internal state.
- Energy/battery directly influences initiative and stability.
- Developer dashboard + full file editor available in-app.

## File ownership model
Each agent owns a folder for inspectability:
- `brain/agents/<agent_name>/`
- `brain/state/<agent_name>.json`
- `brain/logs/<agent_name>.log`

This enables creator-level debugging while keeping the external persona unified.
