# Architecture — Region-as-Agent Cognitive Runtime

## Design correction applied
Per user direction, the architecture is explicitly **region-granular**:
**every labeled part in the provided brain map is a separate internal agent**.

## Topology

```text
Region Agents (11+ support agents)
        ↓
ThalamusRouterAgent (attention arbitration)
        ↓
ConsciousFrameAssembler
        ↓
LanguageSurfaceAgent (single male outward identity)
        ↓
Chat/UI output
```

## Region agent contract
All brain-region agents implement this internal contract:

```ts
type RegionAgent = {
  id: string;
  tick(input: AgentInput): AgentOutput;
  state: RegionState;
  confidence: number;
  pressure: number;
  inhibition: number;
  lastUpdatedAt: string;
};
```

## Required region agents

```ts
type RegionAgentId =
  | "prefrontal_cortex"
  | "anterior_cingulate_cortex"
  | "amygdala"
  | "hippocampus"
  | "basal_ganglia"
  | "cerebellum"
  | "insula"
  | "parietal_lobe"
  | "temporal_lobe"
  | "occipital_lobe"
  | "brainstem";
```

## Support agents

```ts
type SupportAgentId =
  | "thalamus_router"
  | "hypothalamus_drive"
  | "heart_loop"
  | "language_surface"
  | "self_model";
```

## Orchestration cycle
1. Collect external and internal signals.
2. Run all region agents in parallel.
3. Thalamus router scores competing signals and selects attention weights.
4. Conscious frame assembler fuses weighted outputs.
5. Urge engine computes `speak_urge`, `research_urge`, and `silence_urge`.
6. If threshold exceeded, action executor triggers speech/research/planning.
7. Memory + personality systems persist updates.

## Data contracts

```ts
type RegionState = {
  id: string;
  activation: number; // 0..1
  trend: "rising" | "falling" | "stable";
  summary: string;
  activeSignals: string[];
  linkedMemoryIds: string[];
  connectedFilePaths: string[];
  lastTransitionAt: string;
};

type UrgeState = {
  speakUrge: number;
  researchUrge: number;
  silenceUrge: number;
  drivers: Record<string, number>;
};

type MemoryRecord = {
  id: string;
  type:
    | "working"
    | "short_term"
    | "episodic"
    | "semantic"
    | "emotional"
    | "procedural"
    | "identity"
    | "relational"
    | "research"
    | "dream";
  strength: number;
  emotionalWeight: number;
  confidence: number;
  decay: number;
  createdAt: string;
  lastUsedAt: string;
  connectedMemoryIds: string[];
};
```

## UI binding rule
Every brain-map node in the UI must bind to exactly one region agent ID and render live agent state (not static text).

## Why this is still one mind
Although internally split into many agents, only the conscious frame may speak outwardly.
No separate agent voices are exposed to the user.
