// components/settings/SettingsModal.tsx
import React from 'react';
import { View, Text, Modal, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import {
  useSettingsStore,
  THEME_PRESETS,
  ACCENT_PRESETS,
  ThemeMode,
  AccentColor,
  WeightUnit,
} from '../../store/settingsStore';
import { useTheme } from '../../hooks/useTheme';

interface Props {
  visible: boolean;
  onClose: () => void;
}

export function SettingsModal({ visible, onClose }: Props) {
  const theme = useTheme();
  const themeMode = useSettingsStore((s) => s.themeMode);
  const accentColor = useSettingsStore((s) => s.accentColor);
  const weightUnit = useSettingsStore((s) => s.weightUnit);
  const defaultRestDuration = useSettingsStore((s) => s.defaultRestDuration);
  const hapticFeedback = useSettingsStore((s) => s.hapticFeedback);
  const soundAlerts = useSettingsStore((s) => s.soundAlerts);
  const autoShareWorkoutToFeed = useSettingsStore((s) => s.autoShareWorkoutToFeed);
  const hideWeightsOnFeed = useSettingsStore((s) => s.hideWeightsOnFeed);

  const setThemeMode = useSettingsStore((s) => s.setThemeMode);
  const setAccentColor = useSettingsStore((s) => s.setAccentColor);
  const setWeightUnit = useSettingsStore((s) => s.setWeightUnit);
  const setDefaultRestDuration = useSettingsStore((s) => s.setDefaultRestDuration);
  const toggleHaptic = useSettingsStore((s) => s.toggleHaptic);
  const toggleSound = useSettingsStore((s) => s.toggleSound);
  const toggleAutoShare = useSettingsStore((s) => s.toggleAutoShare);
  const toggleHideWeights = useSettingsStore((s) => s.toggleHideWeights);

  const restOptions = [60, 90, 120, 180];

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <View className="flex-1 justify-end bg-black/80">
        <View
          className="h-[85%] flex-col rounded-t-3xl border-t p-4"
          style={{ backgroundColor: theme.surface, borderColor: theme.border }}>
          {/* Header */}
          <View
            className="flex-row items-center justify-between border-b pb-3"
            style={{ borderColor: theme.border }}>
            <View className="flex-row items-center">
              <View
                className="mr-2 h-8 w-8 items-center justify-center rounded-xl border"
                style={{ backgroundColor: theme.surfaceAlt, borderColor: theme.border }}>
                <Feather name="sliders" size={16} color={theme.textPrimary} />
              </View>
              <Text className="text-base font-bold" style={{ color: theme.textPrimary }}>
                Paramètres & Personnalisation
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} className="p-1" activeOpacity={0.7}>
              <Ionicons name="close" size={22} color={theme.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView className="mt-2 flex-1" showsVerticalScrollIndicator={false}>
            {/* 1. SECTION THÈMES VISUELS */}
            <View className="mb-5">
              <View className="mb-2.5 flex-row items-center">
                <MaterialCommunityIcons name="palette-outline" size={16} color={accentColor} />
                <Text
                  className="ml-1.5 text-xs font-bold uppercase tracking-wider"
                  style={{ color: theme.textMuted }}>
                  {"THÈME D'AFFICHAGE"}
                </Text>
              </View>

              <View className="gap-2">
                {(Object.keys(THEME_PRESETS) as ThemeMode[]).map((mode) => {
                  const preset = THEME_PRESETS[mode];
                  const isSelected = themeMode === mode;
                  const getThemeIcon = () => {
                    if (preset.isLight)
                      return (
                        <MaterialCommunityIcons name="weather-sunny" size={18} color="#F59E0B" />
                      );
                    if (mode === 'OLED_BLACK')
                      return (
                        <MaterialCommunityIcons
                          name="moon-waning-crescent"
                          size={18}
                          color={accentColor}
                        />
                      );
                    if (mode === 'MIDNIGHT_CYBER')
                      return (
                        <MaterialCommunityIcons name="weather-night" size={18} color="#06B6D4" />
                      );
                    return (
                      <MaterialCommunityIcons name="shield-half-full" size={18} color="#94A3B8" />
                    );
                  };

                  return (
                    <TouchableOpacity
                      key={mode}
                      onPress={() => setThemeMode(mode)}
                      className="flex-row items-center justify-between rounded-xl border p-3"
                      style={{
                        backgroundColor: isSelected ? theme.surfaceAlt : theme.surfaceAlt,
                        borderColor: isSelected ? accentColor : theme.border,
                        borderWidth: isSelected ? 2 : 1,
                      }}
                      activeOpacity={0.8}>
                      <View className="flex-row items-center">
                        <View className="mr-3">{getThemeIcon()}</View>
                        <View
                          className="mr-3 h-5 w-5 rounded-full border"
                          style={{ backgroundColor: preset.background, borderColor: theme.border }}
                        />
                        <View>
                          <Text className="text-xs font-bold" style={{ color: theme.textPrimary }}>
                            {preset.name}
                          </Text>
                          <Text className="text-[10px]" style={{ color: theme.textMuted }}>
                            {preset.isLight
                              ? 'Affichage clair haute visibilité'
                              : 'Contraste sombre optimisé'}
                          </Text>
                        </View>
                      </View>
                      {isSelected && (
                        <Ionicons name="checkmark-circle" size={18} color={accentColor} />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* 2. SECTION COULEUR D'ACCENT */}
            <View className="mb-5">
              <View className="mb-2.5 flex-row items-center">
                <Ionicons name="flash-outline" size={16} color={accentColor} />
                <Text
                  className="ml-1.5 text-xs font-bold uppercase tracking-wider"
                  style={{ color: theme.textMuted }}>
                  {"COULEUR D'ACCENT DYNAMIQUE"}
                </Text>
              </View>

              <View
                className="flex-row items-center justify-between rounded-2xl border p-3.5"
                style={{ backgroundColor: theme.surfaceAlt, borderColor: theme.border }}>
                {ACCENT_PRESETS.map((item) => {
                  const isSelected = accentColor === item.color;
                  return (
                    <TouchableOpacity
                      key={item.name}
                      onPress={() => setAccentColor(item.color as AccentColor)}
                      className="items-center"
                      activeOpacity={0.8}>
                      <View
                        className={`h-9 w-9 items-center justify-center rounded-full ${isSelected ? 'border-2 border-white shadow-md' : ''}`}
                        style={{ backgroundColor: item.color }}>
                        {isSelected && <Ionicons name="checkmark" size={16} color="#0B0B0F" />}
                      </View>
                      <Text
                        className="mt-1 text-[10px] font-semibold"
                        style={{ color: theme.textSecondary }}>
                        {item.name.split(' ')[1] || item.name}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* 3. UNITÉS & ENTRAÎNEMENT */}
            <View className="mb-5">
              <View className="mb-2.5 flex-row items-center">
                <MaterialCommunityIcons name="weight-kilogram" size={16} color={accentColor} />
                <Text
                  className="ml-1.5 text-xs font-bold uppercase tracking-wider"
                  style={{ color: theme.textMuted }}>
                  UNITÉ DE CHARGE
                </Text>
              </View>

              <View className="flex-row gap-3">
                {(['KG', 'LBS'] as WeightUnit[]).map((unit) => {
                  const isSelected = weightUnit === unit;
                  return (
                    <TouchableOpacity
                      key={unit}
                      onPress={() => setWeightUnit(unit)}
                      className="flex-1 items-center justify-center rounded-xl border py-2.5"
                      style={{
                        backgroundColor: isSelected ? accentColor : theme.surfaceAlt,
                        borderColor: isSelected ? accentColor : theme.border,
                      }}
                      activeOpacity={0.8}>
                      <Text
                        className="text-xs font-bold uppercase"
                        style={{ color: isSelected ? '#0B0B0F' : theme.textSecondary }}>
                        {unit === 'KG' ? 'Kilogrammes (kg)' : 'Livres (lbs)'}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* 4. MINUTEUR DE REPOS PAR DÉFAUT */}
            <View className="mb-5">
              <View className="mb-2.5 flex-row items-center">
                <Ionicons name="timer-outline" size={16} color={accentColor} />
                <Text
                  className="ml-1.5 text-xs font-bold uppercase tracking-wider"
                  style={{ color: theme.textMuted }}>
                  REPOS PAR DÉFAUT APRÈS SÉRIE
                </Text>
              </View>

              <View className="flex-row gap-2">
                {restOptions.map((sec) => {
                  const isSelected = defaultRestDuration === sec;
                  return (
                    <TouchableOpacity
                      key={sec}
                      onPress={() => setDefaultRestDuration(sec)}
                      className="flex-1 items-center justify-center rounded-xl border py-2.5"
                      style={{
                        backgroundColor: isSelected ? theme.surfaceAlt : theme.surfaceAlt,
                        borderColor: isSelected ? accentColor : theme.border,
                        borderWidth: isSelected ? 2 : 1,
                      }}
                      activeOpacity={0.8}>
                      <Text
                        className="text-xs font-bold"
                        style={{ color: isSelected ? accentColor : theme.textSecondary }}>
                        {sec}s
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* 5. PRÉFÉRENCES SYSTÈME & CONFIDENTIALITÉ */}
            <View className="mb-6">
              <View className="mb-2.5 flex-row items-center">
                <Feather name="shield" size={15} color={accentColor} />
                <Text
                  className="ml-1.5 text-xs font-bold uppercase tracking-wider"
                  style={{ color: theme.textMuted }}>
                  EXPÉRIENCE & CONFIDENTIALITÉ
                </Text>
              </View>

              <View
                className="rounded-2xl border"
                style={{ backgroundColor: theme.surfaceAlt, borderColor: theme.border }}>
                {/* Haptique */}
                <View
                  className="flex-row items-center justify-between border-b p-3.5"
                  style={{ borderColor: theme.border }}>
                  <View className="flex-1 pr-3">
                    <Text className="text-xs font-bold" style={{ color: theme.textPrimary }}>
                      Retours Haptiques (Vibrations)
                    </Text>
                    <Text className="mt-0.5 text-[11px]" style={{ color: theme.textMuted }}>
                      Vibration lors de la validation des séries et des actions
                    </Text>
                  </View>
                  <Switch
                    value={hapticFeedback}
                    onValueChange={toggleHaptic}
                    trackColor={{ false: theme.border, true: accentColor }}
                    thumbColor="#FFFFFF"
                  />
                </View>

                {/* Sons */}
                <View
                  className="flex-row items-center justify-between border-b p-3.5"
                  style={{ borderColor: theme.border }}>
                  <View className="flex-1 pr-3">
                    <Text className="text-xs font-bold" style={{ color: theme.textPrimary }}>
                      Signaux Sonores de Repos
                    </Text>
                    <Text className="mt-0.5 text-[11px]" style={{ color: theme.textMuted }}>
                      Bip sonore lorsque le minuteur de repos arrive à 0
                    </Text>
                  </View>
                  <Switch
                    value={soundAlerts}
                    onValueChange={toggleSound}
                    trackColor={{ false: theme.border, true: accentColor }}
                    thumbColor="#FFFFFF"
                  />
                </View>

                {/* Auto Share Workout */}
                <View
                  className="flex-row items-center justify-between border-b p-3.5"
                  style={{ borderColor: theme.border }}>
                  <View className="flex-1 pr-3">
                    <Text className="text-xs font-bold" style={{ color: theme.textPrimary }}>
                      Partage automatique des séances
                    </Text>
                    <Text className="mt-0.5 text-[11px]" style={{ color: theme.textMuted }}>
                      {"Publier la carte de séance dans le feed dès la fin de l'entraînement"}
                    </Text>
                  </View>
                  <Switch
                    value={autoShareWorkoutToFeed}
                    onValueChange={toggleAutoShare}
                    trackColor={{ false: theme.border, true: accentColor }}
                    thumbColor="#FFFFFF"
                  />
                </View>

                {/* Masquer les poids */}
                <View className="flex-row items-center justify-between p-3.5">
                  <View className="flex-1 pr-3">
                    <Text className="text-xs font-bold" style={{ color: theme.textPrimary }}>
                      Masquer mes charges publiques
                    </Text>
                    <Text className="mt-0.5 text-[11px]" style={{ color: theme.textMuted }}>
                      {"N'afficher que les exercices et séries, sans le poids exact"}
                    </Text>
                  </View>
                  <Switch
                    value={hideWeightsOnFeed}
                    onValueChange={toggleHideWeights}
                    trackColor={{ false: theme.border, true: accentColor }}
                    thumbColor="#FFFFFF"
                  />
                </View>
              </View>
            </View>
          </ScrollView>

          {/* Bouton Fermer */}
          <View className="border-t pt-3" style={{ borderColor: theme.border }}>
            <TouchableOpacity
              onPress={onClose}
              className="w-full items-center justify-center rounded-xl py-3"
              style={{ backgroundColor: accentColor }}
              activeOpacity={0.8}>
              <Text className="text-xs font-black uppercase tracking-wider text-background">
                Enregistrer & Fermer
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
