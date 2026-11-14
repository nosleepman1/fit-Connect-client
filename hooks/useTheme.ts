// hooks/useTheme.ts
import { useSettingsStore, THEME_PRESETS, ThemeConfig } from '../store/settingsStore';

export interface ActiveTheme extends ThemeConfig {
  accent: string;
  surfaceElevated: string;
  textMuted: string;
  gold: string;
  fire: string;
  danger: string;
}

export const useTheme = (): ActiveTheme => {
  const themeMode = useSettingsStore((s) => s.themeMode);
  const accentColor = useSettingsStore((s) => s.accentColor);
  const preset = THEME_PRESETS[themeMode] || THEME_PRESETS.OLED_BLACK;

  return {
    ...preset,
    accent: accentColor,
    surfaceElevated: preset.isLight ? '#E2E8F0' : '#242432',
    textMuted: preset.isLight ? '#94A3B8' : '#6B6B78',
    gold: '#FFD166',
    fire: '#FF5722',
    danger: '#FF5A5F',
  };
};
