// constants/theme.ts

export const THEME = {
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
    accent: '#C6FF3D', // Neon Lime (Actions, CTA, Streaks)
    accentHover: '#B2EB2F',
    gold: '#FFD166', // Gold réservé aux Coachs Certifiés & Trophées
    danger: '#FF5A5F',
    blue: '#3B82F6',
    cyan: '#06B6D4',
    fire: '#FF5722',
    purple: '#A855F7',
  },
  radius: {
    xs: 6,
    sm: 10,
    md: 14,
    card: 16,
    lg: 20,
    xl: 26,
    pill: 9999,
  },
  typography: {
    display: { fontSize: 28, fontWeight: '700' as const, color: '#F5F5F7' },
    heading: { fontSize: 20, fontWeight: '600' as const, color: '#F5F5F7' },
    subheading: { fontSize: 16, fontWeight: '600' as const, color: '#F5F5F7' },
    body: { fontSize: 14, fontWeight: '400' as const, color: '#9A9AA5' },
    bodyBold: { fontSize: 14, fontWeight: '600' as const, color: '#F5F5F7' },
    caption: { fontSize: 12, fontWeight: '500' as const, color: '#6B6B78' },
    captionAccent: { fontSize: 12, fontWeight: '700' as const, color: '#C6FF3D' },
  },
};
