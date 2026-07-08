# Flux — associative data explorer (early prototype)

Flux is an experiment in **fast, associative data exploration** in the browser:
load a dataset, click values to filter, and watch every other field narrow to
what's still possible — no query language, no round-trips.

This repository is an **early public prototype** (`v0.1`). It shows the core
interaction model and the shell that later work builds on. It is intentionally
small and rough.

## What works today

- Load a CSV (or start from a small built-in sample).
- Automatic split of columns into **dimensions** (categorical) and
  **measures** (numeric).
- **Associative selection:** picking values in one field marks values in every
  other field as *selected*, *available*, or *excluded* — the essence of
  associative analytics — computed in-memory over the loaded rows.
- A simple bar chart (click a bar to select) and a data table, both reactive to
  the current selection.

## On the roadmap (what we're seeking support to build)

- A **natural-language assistant** — the `Assistant` panel is a stub today. The
  goal: ask questions about a dataset in plain language and have the tool answer
  and drive the selection for you. This is the primary direction of planned work.
- A real data engine (columnar, out-of-core) behind the same interaction model.
- More visualization types and dashboard layout.

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production build
```

Requires Node 18+.

## Status & scope

This is a prototype meant to communicate the concept and the interaction model.
It is **not** production software: no persistence, no accounts, no server —
everything runs client-side over the rows you load. See `LICENSE`.
