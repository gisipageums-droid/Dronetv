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
        // ui/alert, ui/tabs, ui/switch, etc.) - these components already ship
        // real light/dark CSS custom properties in each template's own
        // globals.css (:root { --card: ...; } / :root.dark { --card: ...; }),
        // but tailwind.config.js never mapped Tailwind classes to them, so
        // bg-card/bg-background/bg-popover/bg-muted/etc. silently resolved to
        // transparent everywhere (invisible modal backgrounds, unreadable
        // overlapping text, low-contrast nav buttons). Referencing var(...)
        // here - not hardcoded hex - so each template's own light/dark values
        // keep being respected, and templates that don't define these
        // variables are unaffected (var() with no match resolves the same
        // transparent way it already did, so this can't regress anything).
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        card: {
          DEFAULT: 'var(--card)',
          foreground: 'var(--card-foreground)',
        },
        popover: {
          DEFAULT: 'var(--popover)',
          foreground: 'var(--popover-foreground)',
        },
        primary: {
          DEFAULT: 'var(--primary)',
          foreground: 'var(--primary-foreground)',
        },
        secondary: {
          DEFAULT: 'var(--secondary)',
          foreground: 'var(--secondary-foreground)',
        },
        muted: {
          DEFAULT: 'var(--muted)',
          foreground: 'var(--muted-foreground)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          foreground: 'var(--accent-foreground)',
        },
        destructive: {
          DEFAULT: 'var(--destructive)',
          foreground: 'var(--destructive-foreground)',
        },
        border: 'var(--border)',
        input: 'var(--input)',
        ring: 'var(--ring)',
      },
    },
  },
  plugins: [],
  darkMode: 'class',  
};
