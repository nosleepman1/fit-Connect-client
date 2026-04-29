// app/(tabs)/workout.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { SetRow } from '../../components/workout/SetRow';
import { RestTimerOverlay } from '../../components/workout/RestTimerOverlay';
import { ExercisePickerModal } from '../../components/workout/ExercisePickerModal';
import { Exercise } from '../../types/models';
import { useWorkoutStore } from '../../store/workoutStore';
import { useSocialStore } from '../../store/socialStore';
import { useAuthStore } from '../../store/authStore';
import { useTheme } from '../../hooks/useTheme';

function WorkoutElapsedTime() {
  const theme = useTheme();
  const elapsedSeconds = useWorkoutStore((s) => s.elapsedSeconds);
  const mins = Math.floor(elapsedSeconds / 60);
  const remainSecs = elapsedSeconds % 60;
  const hrs = Math.floor(mins / 60);
  const remainMins = mins % 60;

  const formatted =
    hrs > 0
      ? `${hrs}:${remainMins < 10 ? '0' : ''}${remainMins}:${remainSecs < 10 ? '0' : ''}${remainSecs}`
      : `${remainMins}:${remainSecs < 10 ? '0' : ''}${remainSecs}`;

  return (
    <Text className="ml-1 font-mono text-xs font-bold" style={{ color: theme.accent }}>
      {formatted}
    </Text>
  );
}

export default function WorkoutScreen() {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const isActive = useWorkoutStore((s) => s.isActive);
  const title = useWorkoutStore((s) => s.title);
  const exercises = useWorkoutStore((s) => s.exercises);
  const personalRecords = useWorkoutStore((s) => s.personalRecords);
  const workoutHistory = useWorkoutStore((s) => s.workoutHistory);

  const startWorkout = useWorkoutStore((s) => s.startWorkout);
  const tickTimer = useWorkoutStore((s) => s.tickTimer);
  const addExerciseToWorkout = useWorkoutStore((s) => s.addExerciseToWorkout);
  const removeExercise = useWorkoutStore((s) => s.removeExercise);
  const addSet = useWorkoutStore((s) => s.addSet);
  const removeSet = useWorkoutStore((s) => s.removeSet);
  const updateSet = useWorkoutStore((s) => s.updateSet);
  const completeSet = useWorkoutStore((s) => s.completeSet);
  const finishWorkout = useWorkoutStore((s) => s.finishWorkout);
  const cancelWorkout = useWorkoutStore((s) => s.cancelWorkout);

  const createPost = useSocialStore((s) => s.createPost);
  const currentUser = useAuthStore((s) => s.currentUser);

  const [showExercisePicker, setShowExercisePicker] = useState(false);

  // Timer Tick global
  useEffect(() => {
    let interval: any;
    if (isActive) {
      interval = setInterval(() => {
        tickTimer();
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, tickTimer]);

  // Calcul du volume live
  const liveVolume = exercises.reduce((acc, ex) => {
    return (
      acc + ex.sets.reduce((sAcc, s) => (s.isCompleted ? sAcc + s.weightKg * s.reps : sAcc), 0)
    );
  }, 0);

  const handleFinish = () => {
    const finished = finishWorkout();

    // Publication automatique sur le feed social
    createPost({
      author: currentUser,
      content: `🔥 Séance "${finished.title}" terminée avec un volume total de ${finished.totalVolumeKg.toLocaleString('fr-FR')} kg !`,
      mediaUrls: [
        'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80',
      ],
      postType: 'WORKOUT_SUMMARY',
      workoutSummary: {
        durationSeconds: finished.durationSeconds,
        totalVolumeKg: finished.totalVolumeKg,
        prCount: finished.prCount,
        exercises: finished.exercises.map((ex) => ({
          name: ex.name,
          maxWeight: Math.max(...ex.sets.map((s) => s.weightKg), 0),
          totalSets: ex.sets.length,
        })),
      },
    });
  };

  return (
    <View className="flex-1" style={{ backgroundColor: theme.background, paddingTop: insets.top }}>
      {/* HEADER */}
      <View
        className="flex-row items-center justify-between border-b px-4 py-3"
        style={{ backgroundColor: theme.background, borderColor: theme.border }}>
        <View className="flex-row items-center">
          <View
            className="mr-2.5 h-9 w-9 items-center justify-center rounded-xl"
            style={{
              backgroundColor: isActive ? 'rgba(198, 255, 61, 0.2)' : theme.surfaceAlt,
              borderWidth: isActive ? 1 : 0,
              borderColor: theme.accent,
            }}>
            <MaterialCommunityIcons
              name="dumbbell"
              size={20}
              color={isActive ? theme.accent : theme.textSecondary}
            />
          </View>
          <View>
            <Text className="text-base font-bold" style={{ color: theme.textPrimary }}>
              {isActive ? title : 'Carnet d’Entraînement'}
            </Text>
            {isActive && (
              <View className="mt-0.5 flex-row items-center">
                <Ionicons name="time-outline" size={12} color={theme.accent} />
                <WorkoutElapsedTime />
                <Text className="mx-1.5 text-xs" style={{ color: theme.textMuted }}>
                  •
                </Text>
                <Text className="text-xs font-semibold" style={{ color: theme.textSecondary }}>
                  {liveVolume.toLocaleString('fr-FR')} kg
                </Text>
              </View>
            )}
          </View>
        </View>

        {isActive ? (
          <View className="flex-row items-center gap-2">
            <TouchableOpacity
              onPress={() => {
                Alert.alert(
                  'Annuler la séance ?',
                  'Les séries saisies ne seront pas enregistrées.',
                  [
                    { text: 'Continuer', style: 'cancel' },
                    { text: 'Annuler la séance', style: 'destructive', onPress: cancelWorkout },
                  ]
                );
              }}
              className="rounded-xl border px-3 py-1.5"
              style={{ backgroundColor: theme.surfaceAlt, borderColor: theme.border }}
              activeOpacity={0.7}>
              <Text className="text-xs font-semibold" style={{ color: theme.danger }}>
                Annuler
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleFinish}
              className="flex-row items-center rounded-xl px-3.5 py-1.5"
              style={{ backgroundColor: theme.accent }}
              activeOpacity={0.8}>
              <Ionicons name="checkmark" size={16} color="#0B0B0F" />
              <Text className="ml-1 text-xs font-bold uppercase tracking-wider text-background">
                Finir
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            onPress={() => startWorkout('Séance Push (Force & Volume)')}
            className="flex-row items-center rounded-xl px-3.5 py-1.5 shadow-md"
            style={{ backgroundColor: theme.accent }}
            activeOpacity={0.8}>
            <Ionicons name="play" size={14} color="#0B0B0F" />
            <Text className="ml-1 text-xs font-bold uppercase tracking-wider text-background">
              Démarrer
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* CONTENU PRINCIPAL */}
      {isActive ? (
        <ScrollView className="flex-1 p-4 pb-28" showsVerticalScrollIndicator={false}>
          {/* Liste des exercices en cours */}
          {exercises.map((exercise, exIdx) => (
            <View
              key={exercise.id}
              className="mb-4 rounded-2xl border p-4 shadow-sm"
              style={{ backgroundColor: theme.surface, borderColor: theme.border }}>
              {/* En-tête de l'exercice */}
              <View
                className="flex-row items-center justify-between border-b pb-3"
                style={{ borderColor: theme.border }}>
                <View className="flex-1 pr-2">
                  <Text className="text-sm font-bold" style={{ color: theme.textPrimary }}>
                    {exercise.name}
                  </Text>
                  <Text className="mt-0.5 text-xs font-semibold" style={{ color: theme.accent }}>
                    {exercise.targetMuscle}
                  </Text>
                </View>

                <TouchableOpacity
                  onPress={() => removeExercise(exIdx)}
                  className="rounded-lg p-1.5"
                  style={{ backgroundColor: theme.surfaceAlt }}
                  activeOpacity={0.7}>
                  <Ionicons name="trash-outline" size={15} color={theme.textMuted} />
                </TouchableOpacity>
              </View>

              {/* En-tête des colonnes */}
              <View className="flex-row items-center justify-between px-2 py-2">
                <Text
                  className="w-12 text-[10px] font-bold uppercase tracking-wider"
                  style={{ color: theme.textMuted }}>
                  SÉRIE
                </Text>
                <Text
                  className="flex-1 text-center text-[10px] font-bold uppercase tracking-wider"
                  style={{ color: theme.textMuted }}>
                  POIDS
                </Text>
                <Text
                  className="flex-1 text-center text-[10px] font-bold uppercase tracking-wider"
                  style={{ color: theme.textMuted }}>
                  REPS
                </Text>
                <Text
                  className="w-14 text-center text-[10px] font-bold uppercase tracking-wider"
                  style={{ color: theme.textMuted }}>
                  VALIDER
                </Text>
              </View>

              {/* Lignes de séries */}
              {exercise.sets.map((set, setIdx) => (
                <SetRow
                  key={set.id}
                  set={set}
                  exerciseIndex={exIdx}
                  setIndex={setIdx}
                  onUpdate={(data) => updateSet(exIdx, setIdx, data)}
                  onComplete={() => completeSet(exIdx, setIdx, 90)}
                  onDelete={() => removeSet(exIdx, setIdx)}
                />
              ))}

              {/* Bouton Ajouter une série */}
              <TouchableOpacity
                onPress={() => addSet(exIdx)}
                className="mt-2 flex-row items-center justify-center rounded-xl border border-dashed py-2"
                style={{ backgroundColor: theme.surfaceAlt, borderColor: theme.border }}
                activeOpacity={0.7}>
                <Ionicons name="add" size={15} color={theme.textSecondary} />
                <Text className="ml-1 text-xs font-semibold" style={{ color: theme.textSecondary }}>
                  Ajouter une série
                </Text>
              </TouchableOpacity>
            </View>
          ))}

          {/* Bouton Ajouter un Exercice */}
          <TouchableOpacity
            onPress={() => setShowExercisePicker(true)}
            className="mb-6 flex-row items-center justify-center rounded-2xl border py-3.5"
            style={{ backgroundColor: theme.surfaceAlt, borderColor: theme.accent }}
            activeOpacity={0.8}>
            <Ionicons name="add-circle-outline" size={20} color={theme.accent} />
            <Text
              className="ml-2 text-xs font-bold uppercase tracking-wider"
              style={{ color: theme.accent }}>
              Ajouter un Exercice
            </Text>
          </TouchableOpacity>
        </ScrollView>
      ) : (
        <ScrollView className="flex-1 p-4" showsVerticalScrollIndicator={false}>
          {/* Bannière Démarrage Rapide */}
          <View
            className="p-4.5 mb-5 rounded-2xl border"
            style={{ backgroundColor: theme.surface, borderColor: theme.border }}>
            <View className="mb-2 flex-row items-center justify-between">
              <View className="flex-row items-center">
                <Ionicons name="flash" size={16} color={theme.accent} />
                <Text
                  className="ml-1.5 text-xs font-bold uppercase tracking-wider"
                  style={{ color: theme.accent }}>
                  PRÊT À VOUS ENTRAÎNER ?
                </Text>
              </View>
              <Text className="text-xs font-medium" style={{ color: theme.textMuted }}>
                Session Directe
              </Text>
            </View>

            <Text className="mb-1 text-lg font-black" style={{ color: theme.textPrimary }}>
              Enregistrez vos séries et battez vos records
            </Text>
            <Text className="mb-4 text-xs leading-relaxed" style={{ color: theme.textSecondary }}>
              Minuteur de repos intelligent, calcul automatique du volume et partage instantané.
            </Text>

            <TouchableOpacity
              onPress={() => startWorkout('Séance Libre')}
              className="flex-row items-center justify-center rounded-xl py-3.5 shadow-md"
              style={{ backgroundColor: theme.accent }}
              activeOpacity={0.8}>
              <Ionicons name="play" size={18} color="#0B0B0F" />
              <Text className="ml-2 text-sm font-black uppercase tracking-wider text-background">
                Démarrer une Séance Libre
              </Text>
            </TouchableOpacity>
          </View>

          {/* Programmes & Routines Rapides */}
          <View className="mb-5">
            <Text
              className="mb-2.5 text-xs font-bold uppercase tracking-wider"
              style={{ color: theme.textMuted }}>
              ROUTINES RAPIDES & PROGRAMMES
            </Text>

            <View className="gap-2.5">
              <TouchableOpacity
                onPress={() => {
                  startWorkout('Push Day (Pecs • Épaules • Triceps)');
                  const bench = useWorkoutStore
                    .getState()
                    .availableExercises.find((e) => e.name.includes('Couché'));
                  const ohp = useWorkoutStore
                    .getState()
                    .availableExercises.find((e) => e.name.includes('Militaire'));
                  if (bench) addExerciseToWorkout(bench);
                  if (ohp) addExerciseToWorkout(ohp);
                }}
                className="flex-row items-center justify-between rounded-2xl border p-3.5"
                style={{ backgroundColor: theme.surface, borderColor: theme.border }}
                activeOpacity={0.8}>
                <View className="flex-1 pr-2">
                  <Text className="text-xs font-bold" style={{ color: theme.textPrimary }}>
                    Push Day (Pecs • Épaules • Triceps)
                  </Text>
                  <Text className="mt-0.5 text-[11px]" style={{ color: theme.textSecondary }}>
                    Développé Couché, Militaire • 4 séries par exercice
                  </Text>
                </View>
                <View
                  className="rounded-full px-3 py-1.5"
                  style={{ backgroundColor: theme.surfaceAlt }}>
                  <Text className="text-[10px] font-bold" style={{ color: theme.accent }}>
                    LANCER
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  startWorkout('Pull Day (Dos • Trapèzes • Biceps)');
                  const deadlift = useWorkoutStore
                    .getState()
                    .availableExercises.find((e) => e.name.includes('Terre'));
                  const pullup = useWorkoutStore
                    .getState()
                    .availableExercises.find((e) => e.name.includes('Tractions'));
                  if (deadlift) addExerciseToWorkout(deadlift);
                  if (pullup) addExerciseToWorkout(pullup);
                }}
                className="flex-row items-center justify-between rounded-2xl border p-3.5"
                style={{ backgroundColor: theme.surface, borderColor: theme.border }}
                activeOpacity={0.8}>
                <View className="flex-1 pr-2">
                  <Text className="text-xs font-bold" style={{ color: theme.textPrimary }}>
                    Pull Day (Dos • Trapèzes • Biceps)
                  </Text>
                  <Text className="mt-0.5 text-[11px]" style={{ color: theme.textSecondary }}>
                    Soulevé de Terre, Tractions lestées • 4 séries
                  </Text>
                </View>
                <View
                  className="rounded-full px-3 py-1.5"
                  style={{ backgroundColor: theme.surfaceAlt }}>
                  <Text className="text-[10px] font-bold" style={{ color: theme.accent }}>
                    LANCER
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  startWorkout('Legs Day (Quadriceps • Ischios • Fessiers)');
                  const squat = useWorkoutStore
                    .getState()
                    .availableExercises.find((e) => e.name.includes('Squat'));
                  if (squat) addExerciseToWorkout(squat);
                }}
                className="flex-row items-center justify-between rounded-2xl border p-3.5"
                style={{ backgroundColor: theme.surface, borderColor: theme.border }}
                activeOpacity={0.8}>
                <View className="flex-1 pr-2">
                  <Text className="text-xs font-bold" style={{ color: theme.textPrimary }}>
                    Legs Day (Quadriceps • Ischios • Fessiers)
                  </Text>
                  <Text className="mt-0.5 text-[11px]" style={{ color: theme.textSecondary }}>
                    Squat Arrière barre lourde • Hypertrophie
                  </Text>
                </View>
                <View
                  className="rounded-full px-3 py-1.5"
                  style={{ backgroundColor: theme.surfaceAlt }}>
                  <Text className="text-[10px] font-bold" style={{ color: theme.accent }}>
                    LANCER
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* Records Personnels (PRs) */}
          <View className="mb-5">
            <View className="mb-2.5 flex-row items-center justify-between">
              <View className="flex-row items-center">
                <Ionicons name="trophy" size={15} color={theme.gold} />
                <Text
                  className="ml-1.5 text-xs font-bold uppercase tracking-wider"
                  style={{ color: theme.textPrimary }}>
                  RECORDS PERSONNELS (PR)
                </Text>
              </View>
              <Text className="text-xs font-semibold" style={{ color: theme.gold }}>
                1RM Estimé
              </Text>
            </View>

            <View className="gap-2">
              {personalRecords.map((pr) => (
                <View
                  key={pr.exerciseId}
                  className="flex-row items-center justify-between rounded-xl border p-3.5"
                  style={{ backgroundColor: theme.surface, borderColor: theme.border }}>
                  <View className="flex-1 pr-2">
                    <Text className="text-xs font-bold" style={{ color: theme.textPrimary }}>
                      {pr.exerciseName}
                    </Text>
                    <Text className="mt-0.5 text-[11px]" style={{ color: theme.textMuted }}>
                      {pr.weightKg} kg × {pr.reps} reps ({pr.dateAchieved})
                    </Text>
                  </View>
                  <View className="items-end">
                    <Text className="text-sm font-black" style={{ color: theme.accent }}>
                      {pr.estimatedOneRepMax} kg
                    </Text>
                    <Text className="text-[10px] uppercase" style={{ color: theme.textMuted }}>
                      1RM Max
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Historique Récent */}
          <View className="mb-6">
            <Text
              className="mb-2.5 text-xs font-bold uppercase tracking-wider"
              style={{ color: theme.textMuted }}>
              HISTORIQUE DES SÉANCES
            </Text>
            {workoutHistory.map((sess) => (
              <View
                key={sess.id}
                className="mb-2.5 flex-row items-center justify-between rounded-xl border p-3.5"
                style={{ backgroundColor: theme.surface, borderColor: theme.border }}>
                <View className="flex-1 flex-row items-center">
                  <View
                    className="mr-3 h-9 w-9 items-center justify-center rounded-xl border"
                    style={{ backgroundColor: theme.surfaceAlt, borderColor: theme.border }}>
                    <Feather name="check-circle" size={18} color={theme.accent} />
                  </View>
                  <View>
                    <Text className="text-xs font-bold" style={{ color: theme.textPrimary }}>
                      {sess.title}
                    </Text>
                    <Text className="mt-0.5 text-[11px]" style={{ color: theme.textMuted }}>
                      {Math.floor(sess.durationSeconds / 60)} min •{' '}
                      {(sess.totalVolumeKg || 0).toLocaleString('fr-FR')} kg
                    </Text>
                  </View>
                </View>

                {sess.prCount > 0 && (
                  <View
                    className="rounded-full border px-2.5 py-0.5"
                    style={{
                      backgroundColor: 'rgba(255, 209, 102, 0.15)',
                      borderColor: 'rgba(255, 209, 102, 0.4)',
                    }}>
                    <Text className="text-[10px] font-bold" style={{ color: theme.gold }}>
                      +{sess.prCount} PR
                    </Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        </ScrollView>
      )}

      {/* Minuteur Flottant de Repos */}
      <RestTimerOverlay />

      {/* Modal Sélection d'Exercice */}
      <ExercisePickerModal
        visible={showExercisePicker}
        onClose={() => setShowExercisePicker(false)}
        onSelectExercise={(ex: Exercise) => addExerciseToWorkout(ex)}
      />
    </View>
  );
}
