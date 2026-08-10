/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      // DroneTv Design System v1.0 — see DESIGN_SYSTEM.md. Only these tokens
      // are approved brand colors; do not add ad-hoc colors here or inline.
      colors: {
        brand: {
          yellow: '#F8C400',
          'yellow-soft': '#FFD84D',
          gold: '#E8B400',
          herostart: '#FFFBEA',
        },
        ink: {
          DEFAULT: '#111111',
          charcoal: '#222222',
          dark: '#404040',
          medium: '#6B7280',
          light: '#E5E7EB',
          offwhite: '#FAFAFA',
          paragraph: '#666666',
          caption: '#8B8B8B',
          link: '#C98F00',
          premiumend: '#2A2A2A',
        },
        surface: {
          main: '#FFF8D6',
          alt: '#FFF3B0',
          card: '#FFFFFF',
          cardborder: '#EFEFEF',
          premium: '#1C1C1C',
          darksection: '#111111',
        },
        status: {
          success: '#22C55E',
          warning: '#F59E0B',
          error: '#DC2626',
          info: '#2563EB',
        },
        badge: {
          premium: '#FFF1C2',
          'premium-text': '#A66A00',
        },
        // shadcn/ui-style tokens used throughout the company/professional/event
        // T2 template components (Product/Services/Blog modals, ui/card,
        // ui/alert, ui/tabs, ui/switch, etc.) - tailwind.config.js never mapped
        // Tailwind classes to these at all, so bg-card/bg-background/bg-primary/
        // etc. silently resolved to transparent everywhere (invisible modal
        // backgrounds, unreadable overlapping text, low-contrast nav buttons).
        // Some templates' globals.css define real light/dark CSS custom
        // properties for these (:root { --card: ...; } / :root.dark {...}),
        // which var(--x, fallback) respects when present - but several template
        // entry points (confirmed: mainCompanyPreview/t2/src/App.tsx) never
        // actually import their own globals.css, so the variable is undefined
        // there. The fallback (second var() argument, DESIGN_SYSTEM.md's light
        // values) is what actually renders for those - not just a safety net.
        background: 'var(--background, #FFFFFF)',
        foreground: 'var(--foreground, #111111)',
        card: {
          DEFAULT: 'var(--card, #FFFFFF)',
          foreground: 'var(--card-foreground, #111111)',
        },
        popover: {
          DEFAULT: 'var(--popover, #FFFFFF)',
          foreground: 'var(--popover-foreground, #111111)',
        },
        primary: {
          DEFAULT: 'var(--primary, #F8C400)',
          foreground: 'var(--primary-foreground, #111111)',
        },
        secondary: {
          DEFAULT: 'var(--secondary, #FFD84D)',
          foreground: 'var(--secondary-foreground, #111111)',
        },
        muted: {
          DEFAULT: 'var(--muted, #E5E7EB)',
          foreground: 'var(--muted-foreground, #6B7280)',
        },
        accent: {
          DEFAULT: 'var(--accent, #FFF3B0)',
          foreground: 'var(--accent-foreground, #111111)',
        },
        destructive: {
          DEFAULT: 'var(--destructive, #DC2626)',
          foreground: 'var(--destructive-foreground, #FFFFFF)',
        },
        border: 'var(--border, #EFEFEF)',
        input: 'var(--input, #DDDDDD)',
        ring: 'var(--ring, #F8C400)',
      },
    },
  },
  plugins: [],
  darkMode: 'class',  
};
