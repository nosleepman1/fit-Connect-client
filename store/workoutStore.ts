// store/workoutStore.ts
import { create } from 'zustand';
import {
  WorkoutSession,
  WorkoutExercise,
  ExerciseSet,
  Exercise,
  PersonalRecord,
} from '../types/models';
import { MOCK_EXERCISES, MOCK_PERSONAL_RECORDS } from '../services/mockData';
import { api } from '../services/api';

interface WorkoutState {
  // Séance Active
  isActive: boolean;
  activeSessionId: string | null;
  title: string;
  startTime: number | null;
  elapsedSeconds: number;
  exercises: WorkoutExercise[];
  restTimerSeconds: number;
  isRestTimerRunning: boolean;
  initialRestDuration: number;

  // Données & Records
  availableExercises: Exercise[];
  personalRecords: PersonalRecord[];
  workoutHistory: WorkoutSession[];

  // Actions
  startWorkout: (title?: string) => void;
  tickTimer: () => void;
  tickRestTimer: () => void;
  adjustRestTimer: (deltaSeconds: number) => void;
  stopRestTimer: () => void;
  addExerciseToWorkout: (exercise: Exercise) => void;
  removeExercise: (exerciseIndex: number) => void;
  addSet: (exerciseIndex: number) => void;
  removeSet: (exerciseIndex: number, setIndex: number) => void;
  updateSet: (exerciseIndex: number, setIndex: number, data: Partial<ExerciseSet>) => void;
  completeSet: (exerciseIndex: number, setIndex: number, defaultRest?: number) => boolean; // returns true if PR
  finishWorkout: () => WorkoutSession;
  cancelWorkout: () => void;
}

export const useWorkoutStore = create<WorkoutState>((set, get) => ({
  isActive: false,
  activeSessionId: null,
  title: 'Séance Push (Pectoraux & Triceps)',
  startTime: null,
  elapsedSeconds: 0,
  exercises: [],
  restTimerSeconds: 90,
  isRestTimerRunning: false,
  initialRestDuration: 90,

  availableExercises: MOCK_EXERCISES,
  personalRecords: MOCK_PERSONAL_RECORDS,
  workoutHistory: [
    {
      id: 'ws_prev_1',
      userId: 'user_me',
      title: 'Séance Jambes & Force',
      status: 'COMPLETED',
      startedAt: '2026-09-10T14:00:00Z',
      completedAt: '2026-09-10T15:15:00Z',
      durationSeconds: 4500,
      totalVolumeKg: 12400,
      prCount: 1,
      exercises: [],
    },
    {
      id: 'ws_prev_2',
      userId: 'user_me',
      title: 'Push & Épaules',
      status: 'COMPLETED',
      startedAt: '2026-09-08T18:00:00Z',
      completedAt: '2026-09-08T19:10:00Z',
      durationSeconds: 4200,
      totalVolumeKg: 9800,
      prCount: 0,
      exercises: [],
    },
  ],

  startWorkout: (title = 'Nouvelle Séance d’Entraînement') => {
    const localSessionId = `ws_${Date.now()}`;
    set({
      isActive: true,
      activeSessionId: localSessionId,
      title,
      startTime: Date.now(),
      elapsedSeconds: 0,
      exercises: [
        {
          id: `we_${Date.now()}_1`,
          exerciseId: 'ex_1',
          name: 'Développé Couché (Barre)',
          targetMuscle: 'Pectoraux',
          equipment: 'Barre Olympique',
          sets: [
            {
              id: `s_${Date.now()}_1`,
              setNumber: 1,
              type: 'WARMUP',
              weightKg: 60,
              reps: 12,
              isCompleted: false,
            },
            {
              id: `s_${Date.now()}_2`,
              setNumber: 2,
              type: 'NORMAL',
              weightKg: 90,
              reps: 8,
              isCompleted: false,
            },
            {
              id: `s_${Date.now()}_3`,
              setNumber: 3,
              type: 'NORMAL',
              weightKg: 100,
              reps: 5,
              isCompleted: false,
            },
          ],
        },
      ],
      restTimerSeconds: 90,
      isRestTimerRunning: false,
    });

    // Enregistrement en arrière-plan sur l'API
    api
      .startWorkout(title)
      .then((res) => {
        if (res.data?.id) {
          set({ activeSessionId: res.data.id });
        }
      })
      .catch(() => {});
  },

  tickTimer: () =>
    set((state) => (state.isActive ? { elapsedSeconds: state.elapsedSeconds + 1 } : {})),

  tickRestTimer: () =>
    set((state) => {
      if (!state.isRestTimerRunning) return {};
      if (state.restTimerSeconds <= 1) {
        return { restTimerSeconds: 0, isRestTimerRunning: false };
      }
      return { restTimerSeconds: state.restTimerSeconds - 1 };
    }),

  adjustRestTimer: (deltaSeconds: number) =>
    set((state) => ({
      restTimerSeconds: Math.max(0, state.restTimerSeconds + deltaSeconds),
      initialRestDuration: Math.max(0, state.initialRestDuration + deltaSeconds),
    })),

  stopRestTimer: () =>
    set({
      isRestTimerRunning: false,
      restTimerSeconds: 0,
    }),

  addExerciseToWorkout: (exercise: Exercise) =>
    set((state) => {
      const newExercise: WorkoutExercise = {
        id: `we_${Date.now()}_${state.exercises.length + 1}`,
        exerciseId: exercise.id,
        name: exercise.name,
        targetMuscle: exercise.targetMuscle,
        equipment: exercise.equipment,
        sets: [
          {
            id: `s_${Date.now()}_1`,
            setNumber: 1,
            type: 'NORMAL',
            weightKg: 20,
            reps: 10,
            isCompleted: false,
          },
        ],
      };
      return { exercises: [...state.exercises, newExercise] };
    }),

  removeExercise: (exerciseIndex: number) =>
    set((state) => ({
      exercises: state.exercises.filter((_, idx) => idx !== exerciseIndex),
    })),

  addSet: (exerciseIndex: number) =>
    set((state) => {
      const updated = [...state.exercises];
      const currentSets = updated[exerciseIndex].sets;
      const lastSet = currentSets[currentSets.length - 1];

      const newSet: ExerciseSet = {
        id: `s_${Date.now()}_${currentSets.length + 1}`,
        setNumber: currentSets.length + 1,
        type: 'NORMAL',
        weightKg: lastSet ? lastSet.weightKg : 0,
        reps: lastSet ? lastSet.reps : 10,
        isCompleted: false,
      };

      updated[exerciseIndex].sets = [...currentSets, newSet];
      return { exercises: updated };
    }),

  removeSet: (exerciseIndex: number, setIndex: number) =>
    set((state) => {
      const updated = [...state.exercises];
      updated[exerciseIndex].sets = updated[exerciseIndex].sets
        .filter((_, idx) => idx !== setIndex)
        .map((s, idx) => ({ ...s, setNumber: idx + 1 }));
      return { exercises: updated };
    }),

  updateSet: (exerciseIndex, setIndex, data) =>
    set((state) => {
      const updated = [...state.exercises];
      updated[exerciseIndex].sets[setIndex] = {
        ...updated[exerciseIndex].sets[setIndex],
        ...data,
      };
      return { exercises: updated };
    }),

  completeSet: (exerciseIndex, setIndex, defaultRest = 90) => {
    const state = get();
    const updated = [...state.exercises];
    const currentSet = updated[exerciseIndex].sets[setIndex];
    const exercise = updated[exerciseIndex];

    // Calcul 1RM Formule d'Epley: Poids * (1 + Reps / 30)
    const estimated1RM = Math.round(currentSet.weightKg * (1 + currentSet.reps / 30));

    // Vérification PR
    const existingPR = state.personalRecords.find((pr) => pr.exerciseId === exercise.exerciseId);
    let isPR = false;
    if (!existingPR || estimated1RM > existingPR.estimatedOneRepMax) {
      isPR = true;
      currentSet.isPersonalRecord = true;
    }

    currentSet.isCompleted = true;

    set({
      exercises: updated,
      restTimerSeconds: defaultRest,
      initialRestDuration: defaultRest,
      isRestTimerRunning: true,
    });

    // Enregistrement asynchrone du set sur l'API
    if (state.activeSessionId) {
      api
        .addSet(state.activeSessionId, {
          exerciseId: exercise.exerciseId,
          exerciseName: exercise.name,
          weightKg: currentSet.weightKg,
          reps: currentSet.reps,
          isCompleted: true,
          type: currentSet.type,
        })
        .catch(() => {});
    }

    return isPR;
  },

  finishWorkout: () => {
    const state = get();
    let totalVolumeKg = 0;
    let prCount = 0;

    state.exercises.forEach((ex) => {
      ex.sets.forEach((s) => {
        if (s.isCompleted) {
          totalVolumeKg += s.weightKg * s.reps;
          if (s.isPersonalRecord) prCount++;
        }
      });
    });

    const finishedSession: WorkoutSession = {
      id: state.activeSessionId || `ws_${Date.now()}`,
      userId: 'user_me',
      title: state.title,
      status: 'COMPLETED',
      startedAt: new Date(
        state.startTime || Date.now() - state.elapsedSeconds * 1000
      ).toISOString(),
      completedAt: new Date().toISOString(),
      durationSeconds: state.elapsedSeconds,
      totalVolumeKg,
      prCount,
      exercises: state.exercises,
    };

    // Synchronisation sur le backend
    if (state.activeSessionId) {
      api.finishWorkout(state.activeSessionId, state.elapsedSeconds).catch(() => {});
    }

    set({
      isActive: false,
      activeSessionId: null,
      startTime: null,
      elapsedSeconds: 0,
      exercises: [],
      isRestTimerRunning: false,
      workoutHistory: [finishedSession, ...state.workoutHistory],
    });

    return finishedSession;
  },

  cancelWorkout: () =>
    set({
      isActive: false,
      activeSessionId: null,
      startTime: null,
      elapsedSeconds: 0,
      exercises: [],
      isRestTimerRunning: false,
    }),
}));
