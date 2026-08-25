/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'dark-bg': '#0a0a0f',
        'dark-card': '#12121a',
        'dark-surface': '#181824',
        'dark-border': '#2a2a3c',
        'dark-hover': '#1e1e2e',
        'neon-cyan': '#06b6d4',
        'neon-purple': '#a855f7',
        'neon-blue': '#3b82f6',
        'neon-amber': '#f59e0b',
      },
      fontFamily: {
        sans: ['"IBM Plex Sans Arabic"', 'sans-serif'],
        heading: ['Cairo', 'sans-serif'],
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { opacity: '0.6', transform: 'translate(-50%, -50%) scale(1)' },
          '50%': { opacity: '1', transform: 'translate(-50%, -50%) scale(1.15)' },
        },
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'pulse-glow': 'pulse-glow 6s ease-in-out infinite',
        'fade-up': 'fade-up 0.6s ease-out both',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
