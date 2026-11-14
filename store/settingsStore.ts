// store/settingsStore.ts
import { create } from 'zustand';

export type ThemeMode = 'OLED_BLACK' | 'MIDNIGHT_CYBER' | 'STEALTH_CARBON' | 'LIGHT_ATHLETIC';
export type AccentColor = '#C6FF3D' | '#06B6D4' | '#FF5722' | '#A855F7' | '#FFD166';
export type WeightUnit = 'KG' | 'LBS';

export interface ThemeConfig {
  id: ThemeMode;
  name: string;
  isLight: boolean;
  background: string;
  surface: string;
  surfaceAlt: string;
  border: string;
  textPrimary: string;
  textSecondary: string;
}

export const THEME_PRESETS: Record<ThemeMode, ThemeConfig> = {
  OLED_BLACK: {
    id: 'OLED_BLACK',
    name: 'OLED Black (Sombre Pur)',
    isLight: false,
    background: '#0B0B0F',
    surface: '#16161D',
    surfaceAlt: '#1E1E27',
    border: '#2A2A35',
    textPrimary: '#F5F5F7',
    textSecondary: '#9A9AA5',
  },
  MIDNIGHT_CYBER: {
    id: 'MIDNIGHT_CYBER',
    name: 'Midnight Cyber (Bleu Nuit)',
    isLight: false,
    background: '#0D1117',
    surface: '#161B22',
    surfaceAlt: '#21262D',
    border: '#30363D',
    textPrimary: '#F0F6FC',
    textSecondary: '#8B949E',
  },
  STEALTH_CARBON: {
    id: 'STEALTH_CARBON',
    name: 'Stealth Carbon (Ardoise)',
    isLight: false,
    background: '#12141A',
    surface: '#1A1D24',
    surfaceAlt: '#242832',
    border: '#323744',
    textPrimary: '#F5F5F7',
    textSecondary: '#9A9AA5',
  },
  LIGHT_ATHLETIC: {
    id: 'LIGHT_ATHLETIC',
    name: 'Light Athletic (Clair Épuré)',
    isLight: true,
    background: '#F8FAFC',
    surface: '#FFFFFF',
    surfaceAlt: '#F1F5F9',
    border: '#E2E8F0',
    textPrimary: '#0F172A',
    textSecondary: '#475569',
  },
};

export const ACCENT_PRESETS = [
  { name: 'Neon Lime', color: '#C6FF3D' as AccentColor },
  { name: 'Electric Cyan', color: '#06B6D4' as AccentColor },
  { name: 'Vibrant Flame', color: '#FF5722' as AccentColor },
  { name: 'Cyber Violet', color: '#A855F7' as AccentColor },
  { name: 'Gold Trophy', color: '#FFD166' as AccentColor },
];

interface SettingsState {
  themeMode: ThemeMode;
  accentColor: AccentColor;
  weightUnit: WeightUnit;
  defaultRestDuration: number;
  hapticFeedback: boolean;
  soundAlerts: boolean;
  autoShareWorkoutToFeed: boolean;
  hideWeightsOnFeed: boolean;
  notificationsPush: boolean;

  setThemeMode: (mode: ThemeMode) => void;
  setAccentColor: (color: AccentColor) => void;
  setWeightUnit: (unit: WeightUnit) => void;
  setDefaultRestDuration: (seconds: number) => void;
  toggleHaptic: () => void;
  toggleSound: () => void;
  toggleAutoShare: () => void;
  toggleHideWeights: () => void;
  toggleNotifications: () => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  themeMode: 'OLED_BLACK',
  accentColor: '#C6FF3D',
  weightUnit: 'KG',
  defaultRestDuration: 90,
  hapticFeedback: true,
  soundAlerts: true,
  autoShareWorkoutToFeed: true,
  hideWeightsOnFeed: false,
  notificationsPush: true,

  setThemeMode: (mode) => set({ themeMode: mode }),
  setAccentColor: (color) => set({ accentColor: color }),
  setWeightUnit: (unit) => set({ weightUnit: unit }),
  setDefaultRestDuration: (seconds) => set({ defaultRestDuration: seconds }),
  toggleHaptic: () => set((s) => ({ hapticFeedback: !s.hapticFeedback })),
  toggleSound: () => set((s) => ({ soundAlerts: !s.soundAlerts })),
  toggleAutoShare: () => set((s) => ({ autoShareWorkoutToFeed: !s.autoShareWorkoutToFeed })),
  toggleHideWeights: () => set((s) => ({ hideWeightsOnFeed: !s.hideWeightsOnFeed })),
  toggleNotifications: () => set((s) => ({ notificationsPush: !s.notificationsPush })),
}));
