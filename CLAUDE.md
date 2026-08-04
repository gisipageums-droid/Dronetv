# DroneTv Project Instructions

## Design System — STRICT

This project has a locked design system: **[DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md)**.

Every color, gradient, typography color, button state, badge, spacing value, and border-radius used anywhere in this codebase MUST come from that file. This applies to all new UI work and to any existing component you touch, whether it's a bug fix, a new feature, or a redesign.

- Never introduce a new hex color, gradient, or one-off style outside `DESIGN_SYSTEM.md`.
- If a design need doesn't map cleanly to an existing token (e.g. a new UI pattern), stop and ask rather than inventing a new value.
- Primary brand color is `#F8C400` (yellow) with `#111111` (near-black) as the dark/contrast color — these anchor almost everything. See the file for the full palette, typography colors, button/badge/status colors, spacing scale, and border-radius scale.
- Gradients are reserved for hero sections, premium sections, or special highlights only — not general UI.

Read `DESIGN_SYSTEM.md` before writing or editing any styled component in this repo.

## Styling mechanism — Tailwind classes only

Use Tailwind utility classes (the tokens defined in `tailwind.config.js` — `bg-brand-yellow`, `text-ink`, `bg-surface-main`, etc.) for all styling. Do not write new inline `<style>{...}` blocks, CSS-in-template-string constants, or `style={{...}}` props with hardcoded colors. The whole app should draw from the one Tailwind config, not scattered per-component stylesheets — several older pages (`ProductsPage.tsx`, `ServicesPage.tsx`, `CompaniesPage.tsx`, `Portfolio.tsx`, and some webbuilder templates) still have legacy inline CSS with raw hex codes; when you touch one of those files, migrate what you touch to Tailwind classes rather than adding more inline CSS to it.
