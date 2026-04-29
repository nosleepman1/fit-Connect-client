/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,tsx}', './components/**/*.{js,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        background: '#0B0B0F',
        surface: '#16161D',
        surfaceAlt: '#1E1E27',
        surfaceElevated: '#242432',
        border: '#2A2A35',
        borderLight: '#3A3A4A',
        textPrimary: '#F5F5F7',
        textSecondary: '#9A9AA5',
        textMuted: '#6B6B78',
        accent: '#C6FF3D', // Neon Lime (Action, Streaks, PRs)
        accentHover: '#B2EB2F',
        gold: '#FFD166', // Gold (Coach certifié, Trophées)
        goldMuted: '#997B2A',
        danger: '#FF5A5F',
        blue: '#3B82F6',
        cyan: '#06B6D4',
        fire: '#FF5722',
        purple: '#A855F7',
      },
      borderRadius: {
        card: '16px',
        pill: '999px',
        input: '12px',
      },
    },
  },
  plugins: [],
};
