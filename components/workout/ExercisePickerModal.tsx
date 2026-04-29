// components/workout/ExercisePickerModal.tsx
import React, { useState } from 'react';
import { View, Text, Modal, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Exercise } from '../../types/models';
import { useWorkoutStore } from '../../store/workoutStore';
import { useTheme } from '../../hooks/useTheme';

interface Props {
  visible: boolean;
  onClose: () => void;
  onSelectExercise: (exercise: Exercise) => void;
}

export const ExercisePickerModal: React.FC<Props> = ({ visible, onClose, onSelectExercise }) => {
  const theme = useTheme();
  const { availableExercises } = useWorkoutStore();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('TOUS');

  const categories = ['TOUS', 'Pectoraux', 'Dos', 'Quadriceps', 'Épaules', 'Fessiers', 'Bras'];

  const filteredExercises = availableExercises.filter((ex) => {
    const matchesSearch =
      ex.name.toLowerCase().includes(search.toLowerCase()) ||
      ex.targetMuscle.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      selectedCategory === 'TOUS' ||
      ex.targetMuscle.toLowerCase().includes(selectedCategory.toLowerCase());
    return matchesSearch && matchesCategory;
  });

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
            <Text className="text-lg font-bold" style={{ color: theme.textPrimary }}>
              Ajouter un Exercice
            </Text>
            <TouchableOpacity onPress={onClose} className="p-1" activeOpacity={0.7}>
              <Ionicons name="close" size={22} color={theme.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Barre de recherche */}
          <View
            className="mt-3 flex-row items-center rounded-xl border px-3.5 py-2.5"
            style={{ backgroundColor: theme.surfaceAlt, borderColor: theme.border }}>
            <Ionicons name="search" size={18} color={theme.textMuted} />
            <TextInput
              value={search}
              onChangeText={(setSearchQuery) => setSearch(setSearchQuery)}
              placeholder="Rechercher par nom ou muscle..."
              placeholderTextColor={theme.textMuted}
              className="ml-2 flex-1 text-sm"
              style={{ color: theme.textPrimary }}
            />
            {search ? (
              <TouchableOpacity onPress={() => setSearch('')}>
                <Ionicons name="close-circle" size={16} color={theme.textMuted} />
              </TouchableOpacity>
            ) : null}
          </View>

          {/* Filtres de catégorie musculaire */}
          <View className="py-3">
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 8 }}>
              {categories.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  onPress={() => setSelectedCategory(cat)}
                  className="rounded-full border px-3.5 py-1.5"
                  style={{
                    backgroundColor: selectedCategory === cat ? theme.accent : theme.surfaceAlt,
                    borderColor: selectedCategory === cat ? theme.accent : theme.border,
                  }}
                  activeOpacity={0.8}>
                  <Text
                    className="text-xs font-semibold"
                    style={{
                      color: selectedCategory === cat ? '#0B0B0F' : theme.textSecondary,
                    }}>
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Liste des exercices */}
          <ScrollView className="mt-1 flex-1" showsVerticalScrollIndicator={false}>
            {filteredExercises.map((exercise) => (
              <TouchableOpacity
                key={exercise.id}
                onPress={() => {
                  onSelectExercise(exercise);
                  onClose();
                }}
                className="mb-2 flex-row items-center justify-between rounded-xl border p-3.5"
                style={{ backgroundColor: theme.surfaceAlt, borderColor: theme.border }}
                activeOpacity={0.7}>
                <View className="flex-1 flex-row items-center pr-3">
                  <View
                    className="mr-3 h-10 w-10 items-center justify-center rounded-full border"
                    style={{ backgroundColor: theme.surface, borderColor: theme.border }}>
                    <MaterialCommunityIcons name="dumbbell" size={20} color={theme.accent} />
                  </View>
                  <View>
                    <Text className="text-sm font-bold" style={{ color: theme.textPrimary }}>
                      {exercise.name}
                    </Text>
                    <View className="mt-0.5 flex-row items-center">
                      <Text className="text-xs" style={{ color: theme.accent }}>
                        {exercise.targetMuscle}
                      </Text>
                      <Text className="mx-1.5 text-xs" style={{ color: theme.textMuted }}>
                        •
                      </Text>
                      <Text className="text-xs" style={{ color: theme.textSecondary }}>
                        {exercise.equipment}
                      </Text>
                    </View>
                  </View>
                </View>

                <View
                  className="h-8 w-8 items-center justify-center rounded-full border"
                  style={{ backgroundColor: theme.surface, borderColor: theme.border }}>
                  <Ionicons name="add" size={18} color={theme.textPrimary} />
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};
