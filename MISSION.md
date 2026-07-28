# Mission: Building React Components for a Design System

## Why
I want a deep, durable understanding of how to build the *right kind* of React
component for a design system — components other developers pick up and reuse
without fighting them. I'm building `design-system-react` and I want to move from
"components that work in my app" to "components that hold up as shared, reusable
primitives."

## Success looks like
- I can design a component's public **props API** as a small, typed vocabulary
  (variants, sizes, sensible defaults) rather than a pile of boolean flags.
- I can build components that **compose** cleanly (children, slots, `asChild`/
  polymorphic patterns) instead of accumulating one-off props.
- I can make a component **controllable and accessible** by default (forwarded
  refs, spread props, keyboard + ARIA).
- I can connect components to **design tokens** so the whole system stays visually
  consistent.
- I can explain *why* each choice is right, from first principles — not cargo-cult
  a library's API.

## Constraints
- Learning preference: short lessons, one tangible win each, in English.
- Level: comfortable with React basics (components, props, `useState`/`useEffect`);
  new to design-system-grade component craft.
- Stack in the repo: React 19 + TypeScript + Vite (no CSS framework installed yet).

## Out of scope (for now)
- Publishing/versioning the library to npm, monorepos, Storybook setup.
- Animation libraries, complex data-viz components.
- A specific CSS framework choice (Tailwind/vanilla-extract) — kept open until the
  fundamentals are solid.
