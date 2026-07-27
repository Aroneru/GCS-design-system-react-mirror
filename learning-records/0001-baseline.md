# Baseline: comfortable with React, new to design-system component craft

Established at kickoff (2026-07-27). The learner has real React experience —
builds components, uses props and `useState`/`useEffect` — but has not built
**design-system-grade** components (shared, reusable primitives with a deliberate
public API). Mission is *deep understanding*, so teach the *why* from first
principles, not just patterns.

## Implications
- Skip React basics (JSX, hooks intro). Start at the mindset shift: a design-system
  component's value is its **public interface**, not its internal implementation.
- First skill to teach: designing a props API as a small typed vocabulary
  (variant/size over booleans). This is the highest-leverage foundation.
- Stack: React 19 + TypeScript + Vite, no CSS framework yet — keep examples
  framework-agnostic (plain CSS classes / CSS variables).
