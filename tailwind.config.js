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
      },
    },
  },
  plugins: [],
  darkMode: 'class',  
};
