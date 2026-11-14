// services/mockData.ts
import { User, Post, Exercise, Conversation, Story, Badge, PersonalRecord } from '../types/models';

export const CURRENT_USER: User = {
  id: 'user_me',
  username: 'thomas_fit',
  fullName: 'Thomas Bernard',
  avatarUrl:
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
  bio: 'Passionné de Powerlifting & Hypertrophie | Objectif 200kg au Squat 🔥',
  role: 'ATHLETE',
  isVerified: false,
  currentStreakWeeks: 6,
  longestStreakWeeks: 14,
  postsCount: 28,
  followersCount: 412,
  followingCount: 189,
  homeGym: 'Fitness Park République - Paris',
};

export const MOCK_COACH_USER: User = {
  id: 'user_coach_alex',
  username: 'alex_coach_pro',
  fullName: 'Alexandre Valette',
  avatarUrl:
    'https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=400&auto=format&fit=crop&q=80',
  bio: 'Coach Sportif Diplômé d’État (BPJEPS & STAPS) | +50 transformations réussies | Spécialiste Force & Recomposition',
  role: 'COACH',
  isVerified: true,
  currentStreakWeeks: 24,
  longestStreakWeeks: 52,
  postsCount: 142,
  followersCount: 3840,
  followingCount: 230,
  homeGym: 'CrossFit Lutetia & Basic-Fit Bastille',
  coachProfile: {
    id: 'coach_prof_1',
    userId: 'user_coach_alex',
    specialties: ['Hypertrophie', 'Powerlifting', 'Perte de Gras', 'Biomécanique'],
    yearsOfExperience: 7,
    certificationStatus: 'APPROVED',
    diplomas: [
      'BPJEPS AF Mention Haltérophilie/Musculation',
      'Licence STAPS Entraînement Sportif',
      'Certification Precision Nutrition L1',
    ],
    ratingAverage: 4.95,
    reviewsCount: 38,
    studentsCount: 19,
    plans: [
      {
        id: 'plan_starter',
        coachId: 'coach_prof_1',
        title: 'Pack Programme Évolution',
        description:
          'Programme personnalisé d’entraînement sur 4 semaines avec ajustements hebdomadaires.',
        price: 59,
        interval: 'MONTHLY',
        features: [
          'Programme d’entraînement 100% sur-mesure',
          'Accès à la bibliothèque d’exercices',
          'Ajustement chaque dimanche',
          'Messagerie prioritaire sous 24h',
        ],
      },
      {
        id: 'plan_pro',
        coachId: 'coach_prof_1',
        title: 'Pack Suivi 1-on-1 Ultra (Entraînement + Diète)',
        description:
          'Le coaching complet pour transformer ton physique avec diète macro, entraînement et retours vidéos réguliers.',
        price: 119,
        interval: 'MONTHLY',
        isPopular: true,
        features: [
          'Programme d’entraînement personnalisé',
          'Plan alimentaire & cibles en macronutriments',
          'Analyse vidéo illimitée des mouvements (Form Checks)',
          'Chat WhatsApp VIP 7j/7 avec le coach',
          'Bilan visio hebdomadaire de 20 min',
        ],
      },
      {
        id: 'plan_one_time',
        coachId: 'coach_prof_1',
        title: 'E-Book & Guide Ultime Powerbuilding (12 Semaines)',
        description:
          'Le programme de force et masse éprouvé sur 12 semaines avec tableur de charges automatique.',
        price: 39,
        interval: 'ONE_TIME',
        features: [
          '12 semaines de programmation en 4 phases',
          'Calculateur de 1RM intégré',
          'Guide vidéo d’échauffement articulaire',
        ],
      },
    ],
  },
};

export const MOCK_COACH_ALEX = MOCK_COACH_USER;

export const MOCK_COACH_SARAH: User = {
  id: 'user_coach_sarah',
  username: 'sarah_hyrox',
  fullName: 'Sarah Martinez',
  avatarUrl:
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
  bio: 'Athlète Hyrox Pro & Coach Nutrition NASM | Préparation athlétique & Reconditionnement physique',
  role: 'COACH',
  isVerified: true,
  currentStreakWeeks: 18,
  longestStreakWeeks: 36,
  postsCount: 96,
  followersCount: 5200,
  followingCount: 310,
  homeGym: 'Hyrox Training Center Paris',
  coachProfile: {
    id: 'coach_prof_2',
    userId: 'user_coach_sarah',
    specialties: ['Hyrox', 'Conditioning', 'Nutrition', 'Mobilité'],
    yearsOfExperience: 5,
    certificationStatus: 'APPROVED',
    diplomas: [
      'NASM Certified Personal Trainer',
      'CQP Instructeur Fitness',
      'Certifiée Hyrox Master Coach',
    ],
    ratingAverage: 4.92,
    reviewsCount: 29,
    studentsCount: 14,
    plans: [
      {
        id: 'plan_sarah_1',
        coachId: 'coach_prof_2',
        title: 'Suivi Hyrox & Endurance Pro',
        description: 'Préparation complète pour franchir la ligne d’arrivée avec un chrono record.',
        price: 99,
        interval: 'MONTHLY',
        features: [
          'Séances hybrides Force / Course',
          'Programmation Ergo & Sled',
          'Retours vidéo sur la technique de course',
        ],
      },
    ],
  },
};

export const MOCK_STORIES: Story[] = [
  {
    id: 'story_1',
    userId: 'user_coach_alex',
    username: 'alex_coach_pro',
    avatarUrl:
      'https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=400&auto=format&fit=crop&q=80',
    mediaUrl:
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format&fit=crop&q=80',
    hasSeen: false,
    isLiveWorkout: true,
    createdAt: 'Il y a 2h',
  },
  {
    id: 'story_2',
    userId: 'user_coach_sarah',
    username: 'sarah_hyrox',
    avatarUrl:
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
    mediaUrl:
      'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80',
    hasSeen: false,
    createdAt: 'Il y a 4h',
  },
  {
    id: 'story_3',
    userId: 'user_lucas',
    username: 'lucas_power',
    avatarUrl:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    mediaUrl:
      'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&auto=format&fit=crop&q=80',
    hasSeen: true,
    createdAt: 'Il y a 7h',
  },
  {
    id: 'story_4',
    userId: 'user_elena',
    username: 'elena_fit',
    avatarUrl:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80',
    mediaUrl:
      'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&auto=format&fit=crop&q=80',
    hasSeen: true,
    createdAt: 'Il y a 10h',
  },
];

export const MOCK_POSTS: Post[] = [
  {
    id: 'post_1',
    author: MOCK_COACH_ALEX,
    content:
      '🚨 NOUVEAU RECORD PERSONNEL validé avec l’élève @lucas_power aujourd’hui ! Barre à 180kg au Squat propre, avec une profondeur validée au millimètre. La régularité sur les cycles de force paye toujours. Fiers du travail accompli 💪',
    mediaUrls: [
      'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=800&auto=format&fit=crop&q=80',
    ],
    postType: 'WORKOUT_SUMMARY',
    workoutSummary: {
      durationSeconds: 4500, // 1h15
      totalVolumeKg: 14250,
      prCount: 1,
      exercises: [
        { name: 'Squat à la Barre', maxWeight: 180, totalSets: 5 },
        { name: 'Presse à Cuisses Inclinée', maxWeight: 320, totalSets: 4 },
        { name: 'Fentes Marchées Haltères', maxWeight: 32, totalSets: 3 },
        { name: 'Leg Extension Dégressif', maxWeight: 85, totalSets: 4 },
      ],
    },
    reactionsCount: 128,
    myReaction: 'FIRE',
    commentsCount: 14,
    location: 'Fitness Park Bastille',
    createdAt: 'Il y a 3h',
    comments: [
      {
        id: 'c_1',
        postId: 'post_1',
        author: {
          id: 'user_lucas',
          username: 'lucas_power',
          fullName: 'Lucas Benali',
          avatarUrl:
            'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
          isVerified: false,
          role: 'ATHLETE',
        },
        content:
          'Merci coach pour la programmation et les ajustements sur le placement des genoux ! Les 200kg arrivent bientôt 🔥',
        createdAt: 'Il y a 2h',
        likesCount: 12,
        isLikedByMe: true,
        replies: [
          {
            id: 'c_1_1',
            postId: 'post_1',
            author: {
              id: MOCK_COACH_ALEX.id,
              username: MOCK_COACH_ALEX.username,
              fullName: MOCK_COACH_ALEX.fullName,
              avatarUrl: MOCK_COACH_ALEX.avatarUrl,
              isVerified: true,
              role: 'COACH',
            },
            content: 'Totalement mérité ! On continue sur ce bloc d’intensité encore 2 semaines 🎯',
            createdAt: 'Il y a 1h',
            likesCount: 5,
            isLikedByMe: false,
          },
        ],
      },
    ],
  },
  {
    id: 'post_2',
    author: {
      id: 'user_elena',
      username: 'elena_fit',
      fullName: 'Elena Rostova',
      avatarUrl:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80',
      bio: 'Athlète Bikini & passionnée de cuisine saine',
      role: 'ATHLETE',
      isVerified: false,
      currentStreakWeeks: 12,
      longestStreakWeeks: 18,
      postsCount: 42,
      followersCount: 1200,
      followingCount: 340,
      homeGym: 'Basic-Fit Nation',
    },
    content:
      'Transformation physique sur 6 mois de recomposition corporelle ! Moins 4kg sur la balance mais un gain musculaire net grâce à une diète hyper-protéinée et 4 séances Push/Pull/Legs par semaine.',
    mediaUrls: [
      'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&auto=format&fit=crop&q=80',
    ],
    postType: 'BEFORE_AFTER',
    beforeAfter: {
      beforeUrl:
        'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&auto=format&fit=crop&q=80',
      afterUrl:
        'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=800&auto=format&fit=crop&q=80',
      monthsInterval: 6,
      weightDiffKg: '-4.2 kg',
    },
    reactionsCount: 245,
    myReaction: 'MUSCLE',
    commentsCount: 29,
    location: 'Paris, France',
    createdAt: 'Il y a 6h',
    comments: [],
  },
  {
    id: 'post_3',
    author: MOCK_COACH_SARAH,
    content:
      'Astuce technique Hyrox : comment optimiser sa transition SkiErg ➡️ Sled Push sans faire exploser sa fréquence cardiaque. Pensez à respirer en 2 temps et à garder le bassin bas pour pousser avec les fessiers plutôt que les pointes de pieds ⚡',
    mediaUrls: [
      'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80',
    ],
    postType: 'STANDARD',
    reactionsCount: 189,
    myReaction: 'ENERGY',
    commentsCount: 18,
    location: 'Hyrox Training Club',
    createdAt: 'Il y a 12h',
    comments: [],
  },
];

export const MOCK_EXERCISES: Exercise[] = [
  {
    id: 'ex_1',
    name: 'Développé Couché (Barre)',
    targetMuscle: 'Pectoraux',
    secondaryMuscles: ['Triceps', 'Épaules'],
    equipment: 'Barre Olympique',
    category: 'BARBELL',
  },
  {
    id: 'ex_2',
    name: 'Squat Arrière (High Bar)',
    targetMuscle: 'Quadriceps',
    secondaryMuscles: ['Fessiers', 'Abdos'],
    equipment: 'Barre Olympique',
    category: 'BARBELL',
  },
  {
    id: 'ex_3',
    name: 'Soulevé de Terre Conventionnel',
    targetMuscle: 'Ischios & Dos',
    secondaryMuscles: ['Fessiers', 'Trapèzes'],
    equipment: 'Barre Olympique',
    category: 'BARBELL',
  },
  {
    id: 'ex_4',
    name: 'Développé Militaire Debout (Overhead Press)',
    targetMuscle: 'Épaules',
    secondaryMuscles: ['Triceps', 'Core'],
    equipment: 'Barre Olympique',
    category: 'BARBELL',
  },
  {
    id: 'ex_5',
    name: 'Tractions Pronation Lestées (Pull-ups)',
    targetMuscle: 'Grand Dorsal',
    secondaryMuscles: ['Biceps', 'Avant-bras'],
    equipment: 'Barre fixe',
    category: 'BODYWEIGHT',
  },
  {
    id: 'ex_6',
    name: 'Développé Incliné aux Haltères',
    targetMuscle: 'Haut Pectoraux',
    secondaryMuscles: ['Épaules'],
    equipment: 'Haltères',
    category: 'DUMBBELL',
  },
  {
    id: 'ex_7',
    name: 'Tirage Buste Penché (Barbell Row)',
    targetMuscle: 'Épaisseur du Dos',
    secondaryMuscles: ['Biceps'],
    equipment: 'Barre Olympique',
    category: 'BARBELL',
  },
  {
    id: 'ex_8',
    name: 'Hip Thrust à la Barre',
    targetMuscle: 'Fessiers',
    secondaryMuscles: ['Ischios'],
    equipment: 'Barre & Banc',
    category: 'BARBELL',
  },
  {
    id: 'ex_9',
    name: 'Dips aux Barres Parallèles Lestés',
    targetMuscle: 'Triceps & Bas Pectoraux',
    secondaryMuscles: ['Épaules'],
    equipment: 'Barres parallèles',
    category: 'BODYWEIGHT',
  },
  {
    id: 'ex_10',
    name: 'Élévations Latérales aux Haltères',
    targetMuscle: 'Faisceau Latéral Épaules',
    secondaryMuscles: [],
    equipment: 'Haltères',
    category: 'DUMBBELL',
  },
  {
    id: 'ex_11',
    name: 'Presse à Cuisses 45°',
    targetMuscle: 'Quadriceps & Fessiers',
    secondaryMuscles: [],
    equipment: 'Machine 45°',
    category: 'MACHINE',
  },
  {
    id: 'ex_12',
    name: 'Curl Incliné aux Haltères',
    targetMuscle: 'Biceps (Longue portion)',
    secondaryMuscles: [],
    equipment: 'Haltères',
    category: 'DUMBBELL',
  },
];

export const MOCK_PERSONAL_RECORDS: PersonalRecord[] = [
  {
    exerciseId: 'ex_1',
    exerciseName: 'Développé Couché (Barre)',
    weightKg: 130,
    reps: 3,
    estimatedOneRepMax: 140,
    dateAchieved: '2026-08-14',
  },
  {
    exerciseId: 'ex_2',
    exerciseName: 'Squat Arrière (High Bar)',
    weightKg: 175,
    reps: 2,
    estimatedOneRepMax: 185,
    dateAchieved: '2026-08-28',
  },
  {
    exerciseId: 'ex_3',
    exerciseName: 'Soulevé de Terre Conventionnel',
    weightKg: 215,
    reps: 1,
    estimatedOneRepMax: 215,
    dateAchieved: '2026-07-30',
  },
  {
    exerciseId: 'ex_4',
    exerciseName: 'Développé Militaire',
    weightKg: 85,
    reps: 4,
    estimatedOneRepMax: 93,
    dateAchieved: '2026-09-02',
  },
];

export const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv_1',
    type: 'DIRECT',
    participant: MOCK_COACH_ALEX,
    unreadCount: 1,
    updatedAt: '14:32',
    lastMessage: {
      id: 'msg_1',
      conversationId: 'conv_1',
      senderId: MOCK_COACH_ALEX.id,
      content:
        'Salut Thomas ! J’ai analysé ton Form Check au Squat. Ton verrouillage lombaire est impeccable, mais veille à écarter légèrement plus les pointes de pieds.',
      createdAt: '14:32',
      status: 'DELIVERED',
      isFormCheck: true,
      formCheckData: {
        exerciseName: 'Squat 175kg x 2',
        status: 'REVIEWED',
        coachNote: 'Excellente profondeur. Ajuste l’ouverture de hanches de 5°.',
        rating: 5,
      },
    },
  },
  {
    id: 'conv_2',
    type: 'DIRECT',
    participant: MOCK_COACH_SARAH,
    unreadCount: 0,
    updatedAt: 'Hier',
    lastMessage: {
      id: 'msg_2',
      conversationId: 'conv_2',
      senderId: 'user_me',
      content: 'Parfait merci pour les conseils sur la planification des glucides avant séance !',
      createdAt: 'Hier 19:40',
      status: 'READ',
    },
  },
];

export const MOCK_BADGES: Badge[] = [
  {
    id: 'b_1',
    code: 'CLUB_100_BENCH',
    title: 'Club 100kg Bench',
    description: 'Valider une répétition à 100kg ou plus au Développé Couché',
    category: 'STRENGTH',
    isUnlocked: true,
    unlockedAt: '2026-01-15',
  },
  {
    id: 'b_2',
    code: 'CLUB_180_SQUAT',
    title: 'Club 180kg Squat',
    description: 'Valider une répétition à 180kg au Squat',
    category: 'STRENGTH',
    isUnlocked: true,
    unlockedAt: '2026-08-28',
  },
  {
    id: 'b_3',
    code: 'CLUB_200_DEADLIFT',
    title: 'Club 200kg Deadlift',
    description: 'Franchir la barre mythique des 200kg au Soulevé de Terre',
    category: 'STRENGTH',
    isUnlocked: true,
    unlockedAt: '2026-07-30',
  },
  {
    id: 'b_4',
    code: 'STREAK_10_WEEKS',
    title: 'Guerrier de la Constance',
    description: '10 semaines consécutives sans manquer un seul entraînement',
    category: 'CONSISTENCY',
    isUnlocked: true,
    unlockedAt: '2026-05-10',
  },
  {
    id: 'b_5',
    code: 'EARLY_BIRD',
    title: 'Matinal d’Acier',
    description: 'Compléter 15 entraînements avant 7h30 du matin',
    category: 'CONSISTENCY',
    isUnlocked: false,
  },
  {
    id: 'b_6',
    code: 'FORM_CHECK_MASTER',
    title: 'Perfectionniste Biomécanique',
    description: 'Soumettre et faire valider 5 Form Checks par un coach certifié',
    category: 'COMMUNITY',
    isUnlocked: true,
    unlockedAt: '2026-08-01',
  },
];
