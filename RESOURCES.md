# React Design System — Resources

## Knowledge

- [React docs: "Passing Props to a Component" — react.dev](https://react.dev/learn/passing-props-to-a-component)
  Primary source on how props flow and how to forward them. Use for: the mental
  model of a component's public interface, spreading props.

- [React docs: "Sharing State Between Components" — react.dev](https://react.dev/learn/sharing-state-between-components)
  Primary source on lifting state and controlled vs. uncontrolled components.
  Use for: making design-system components controllable.

- [Article: "Component API Design" — Spectrum UI](https://ui.spectrumhq.in/blog/component-api-design)
  Practical, opinionated guide: avoid boolean-prop soup, prefer `variant`,
  export prop types, default to `children`. Use for: designing a clean props API.

- [Article: "The 10 Component Commandments" — Kristofer Selbekk (dev.to)](https://dev.to/selbekk/the-10-component-commandments-2a7f)
  Rules of thumb for reusable components (spread rest props, forward refs, sensible
  defaults). Use for: making components feel native to consumers.

- [class-variance-authority (cva) docs](https://cva.style/docs)
  The de-facto pattern for type-safe variant APIs in modern React. Use for:
  scaling from hand-rolled variant maps to a typed, maintainable variant system.

- [Radix UI Primitives](https://www.radix-ui.com/primitives)
  Reference implementation of accessible, composable, unstyled components
  (asChild, controlled/uncontrolled). Use for: studying real composition + a11y APIs.

## Wisdom (Communities)

- [r/reactjs](https://www.reddit.com/r/reactjs/)
  Large, active. Use for: API-design critique, "is this a good component interface?"
- [Reactiflux Discord](https://www.reactiflux.com/)
  Real-time help from practitioners. Use for: quick design-decision gut-checks.

## Gaps
- Need a high-trust primary source specifically on **design tokens** in React
  (CSS variables vs JS objects) — to be filled before the tokens lesson.
