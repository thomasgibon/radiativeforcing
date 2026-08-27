# Project working principles

## Product direction

- `docs/implementation-plan.md` is the canonical product and scientific plan.
- Read the relevant sections before changing narrative order, scientific logic,
  architecture, or interactions.
- Update the plan when an agreed product decision changes.

## Priorities

In case of tension, prioritize:

1. scientific correctness;
2. transparency and auditability;
3. pedagogical clarity;
4. simplicity and maintainability;
5. visual polish.

## Parsimony

- Prefer the smallest implementation that communicates the concept clearly.
- Do not add frameworks, production dependencies, servers, or abstraction
  layers without a demonstrated need.
- Reuse existing components, kernels, visual encodings, and interaction state.
- Remove or avoid visuals and controls that do not support a later concept.
- Introduce one important concept and one primary interaction per narrative scene.

## Scientific auditability

- Treat the tested Python package as the scientific source of truth.
- Generate browser datasets from the Python implementation; do not maintain
  independent opaque equations in JavaScript.
- Keep equations, units, assumptions, model boundaries, and provenance explicit.
- Separate calculation precision from display rounding.
- Add Python/browser parity tests for browser-side integration or convolution.
- Clearly label linearized pulse-model results and their limitations.

## Pedagogy

- Build intuition before introducing technical terminology.
- Reuse familiar curves and colors instead of introducing unexplained shapes.
- Keep the causal chain visible:
  emission → concentration → forcing → climate response.
- Prefer progressive, learning-by-doing explanations over dashboards.
- Every 3D construction must have an understandable 2D and textual equivalent.
- Never let animation or color be the only carrier of meaning.

## Interface

- Preserve semantic colors consistently across the narrative.
- Keep controls directly connected to the quantity they affect.
- Rotation and presentation controls must never alter scientific state.
- Favor readable typography, responsive layouts, and keyboard-accessible inputs.

## Verification

- Run focused tests proportional to the change.
- Use broader test suites only for scientific, shared-state, or cross-cutting changes.
- Report what was tested and any visual or browser verification still needed.

## Change discipline

- Preserve unrelated user edits.
- Do not silently broaden the requested scope.
- When a proposed feature conflicts with these principles, explain the tradeoff
  before implementing it.