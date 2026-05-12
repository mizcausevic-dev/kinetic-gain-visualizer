# Kinetic Gain Protocol Suite — Unified Visualizer

One web app, five specs. Paste any document from the [Kinetic Gain Protocol Suite](https://github.com/mizcausevic-dev?q=spec) and the visualizer auto-detects the spec by inspecting the top-level `*_version` field, then dispatches to the appropriate spec-aware renderer.

**Live:** https://mizcausevic-dev.github.io/kinetic-gain-visualizer/

## Supported specs

| Spec | Detect via | Repository |
|---|---|---|
| AEO Protocol | `aeo_version` | [aeo-protocol-spec](https://github.com/mizcausevic-dev/aeo-protocol-spec) |
| Prompt Provenance | `provenance_version` | [prompt-provenance-spec](https://github.com/mizcausevic-dev/prompt-provenance-spec) |
| Agent Cards | `agent_card_version` | [agent-cards-spec](https://github.com/mizcausevic-dev/agent-cards-spec) |
| AI Evidence Format | `evidence_version` | [ai-evidence-format-spec](https://github.com/mizcausevic-dev/ai-evidence-format-spec) |
| MCP Tool Cards | `tool_card_version` | [mcp-tool-card-spec](https://github.com/mizcausevic-dev/mcp-tool-card-spec) |

Documents without a recognized version field render as raw JSON with a hint about which fields the visualizer looks for.

## Deep-link URLs

- `?view=visualize` — default view (rendered card layout)
- `?view=editor` — JSON editor with "Load example" gallery for all 5 specs
- `?view=about` — overview of the Suite + the detection contract

## Run locally

```bash
npm install
npm run dev
```

Opens at `http://localhost:3001` with the AEO reference Person example pre-loaded.

## Stack

- React 19 · TypeScript · Vite 6 · Tailwind CSS 4 · Lucide icons
- Zero runtime dependencies beyond the framework
- One detection function (`src/detect.ts`), one renderer per spec (`src/renderers/`)

## Adding a new spec

1. Add an entry to `SPECS` in `src/detect.ts` with the `versionField` to look for
2. Add a default example to `src/examples.ts`
3. Create `src/renderers/MySpecRenderer.tsx` consuming the document type
4. Wire it into the switch in `src/App.tsx`

No build-system changes required.

## License

AGPL-3.0.

---

**Connect:** [LinkedIn](https://www.linkedin.com/in/mirzacausevic/) · [Kinetic Gain](https://kineticgain.com) · [Medium](https://medium.com/@mizcausevic/) · [Skills](https://mizcausevic.com/skills/)
