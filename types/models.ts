// types/models.ts

export type UserRole = 'ATHLETE' | 'COACH' | 'GYM_MANAGER' | 'ADMIN';

export type ReactionType = 'FIRE' | 'MUSCLE' | 'ENERGY' | 'FOCUS';

export type CertificationStatus = 'PENDING' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED';

export type PlanInterval = 'MONTHLY' | 'QUARTERLY' | 'YEARLY' | 'ONE_TIME';

export type PostType = 'STANDARD' | 'WORKOUT_SUMMARY' | 'BEFORE_AFTER' | 'CLIP';

export interface FormCheckData {
  exerciseName: string;
  status: 'PENDING' | 'REVIEWED';
  coachNote?: string;
  rating?: number;
}

export interface User {
  id: string;
  username: string;
  fullName: string;
  avatarUrl: string;
  bio: string;
  role: UserRole;
  isVerified: boolean;
  currentStreakWeeks: number;
  longestStreakWeeks: number;
  postsCount: number;
  followersCount: number;
  followingCount: number;
  homeGym?: string;
  coachProfile?: CoachProfile;
}

export interface CoachProfile {
  id: string;
  userId: string;
  specialties: string[];
  yearsOfExperience: number;
  certificationStatus: CertificationStatus;
  diplomas: string[];
  ratingAverage: number;
  reviewsCount: number;
  plans: CoachingPlan[];
  studentsCount: number;
}

export interface CoachingPlan {
  id: string;
  coachId: string;
  title: string;
  description: string;
  price: number; // en Euros
  interval: PlanInterval;
  features: string[];
  isPopular?: boolean;
}

export interface ExerciseSet {
  id: string;
  setNumber: number;
  type: 'WARMUP' | 'NORMAL' | 'DROPSET' | 'FAILURE';
  weightKg: number;
  reps: number;
  rpe?: number;
  isCompleted: boolean;
  isPersonalRecord?: boolean;
}

export interface WorkoutExercise {
  id: string;
  exerciseId: string;
  name: string;
  targetMuscle: string;
  equipment: string;
  sets: ExerciseSet[];
}

export interface WorkoutSession {
  id: string;
  userId: string;
  title: string;
  status: 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  startedAt: string;
  completedAt?: string;
  durationSeconds: number;
  totalVolumeKg: number;
  prCount: number;
  exercises: WorkoutExercise[];
  notes?: string;
}

export interface Exercise {
  id: string;
  name: string;
  targetMuscle: string;
  secondaryMuscles?: string[];
  equipment: string;
  category: 'BARBELL' | 'DUMBBELL' | 'MACHINE' | 'BODYWEIGHT' | 'CABLE';
  instructions?: string;
}

export interface Comment {
  id: string;
  postId: string;
  author: {
    id: string;
    username: string;
    fullName: string;
    avatarUrl: string;
    isVerified: boolean;
    role: UserRole;
  };
  content: string;
  createdAt: string;
  likesCount: number;
  isLikedByMe: boolean;
  replies?: Comment[];
}

export interface Post {
  id: string;
  author: User;
  content: string;
  mediaUrls: string[];
  postType: 'STANDARD' | 'WORKOUT_SUMMARY' | 'BEFORE_AFTER' | 'CLIP';
  workoutSummary?: {
    durationSeconds: number;
    totalVolumeKg: number;
    prCount: number;
    exercises: { name: string; maxWeight: number; totalSets: number }[];
  };
  beforeAfter?: {
    beforeUrl: string;
    afterUrl: string;
    monthsInterval: number;
    weightDiffKg: string;
  };
  reactionsCount: number;
  myReaction?: ReactionType;
  commentsCount: number;
  comments: Comment[];
  createdAt: string;
  isSaved?: boolean;
  location?: string;
}

export interface Story {
  id: string;
  userId: string;
  username: string;
  avatarUrl: string;
  mediaUrl: string;
  hasSeen: boolean;
  isLiveWorkout?: boolean;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  mediaUrl?: string;
  audioDurationSeconds?: number;
  isAudio?: boolean;
  isFormCheck?: boolean;
  formCheckData?: {
    exerciseName: string;
    status: 'PENDING' | 'REVIEWED';
    coachNote?: string;
    rating?: number;
  };
  createdAt: string;
  status: 'SENT' | 'DELIVERED' | 'READ';
}

export interface Conversation {
  id: string;
  type: 'DIRECT' | 'GROUP';
  participant: User;
  lastMessage?: ChatMessage;
  unreadCount: number;
  updatedAt: string;
}

export interface PersonalRecord {
  exerciseId: string;
  exerciseName: string;
  weightKg: number;
  reps: number;
  estimatedOneRepMax: number;
  dateAchieved: string;
}

export interface Badge {
  id: string;
  code: string;
  title: string;
  description: string;
  category: 'STRENGTH' | 'CONSISTENCY' | 'COMMUNITY';
  isUnlocked: boolean;
  unlockedAt?: string;
}
