# 🏋️‍♂️ FITCONNECT — Architecture & Cahier des Charges Technique & Fonctionnel Ultra-Complet

> **Type de Projet** : Écosystème Mobile & Backend complet dédié au Fitness (Réseau Social + Marketplace Coaching Certifié + Messagerie Instantanée + Tracker d'Entraînement & Gamification).  
> **Frontend** : React Native / Expo (SDK 56+), Expo Router, NativeWind (TailwindCSS), Zustand, TanStack Query, Reanimated.  
> **Backend** : NestJS (Architecture Modulaire d'Entreprise), TypeScript, PostgreSQL (Prisma ORM), Redis (BullMQ & Cache), WebSockets (Socket.io), S3/Cloudinary, Resend/SendGrid, Stripe Connect.

---

## 📑 Sommaire Général
1. [Vision Produit, Rôles & Parcours Utilisateurs](#1-vision-produit-rôles--parcours-utilisateurs)
2. [Spécifications Fonctionnelles Détaillées par Module](#2-spécifications-fonctionnelles-détaillées-par-module)
   - 2.1. Réseau Social, Feed Algorithmique & Interactions (Insta/Threads)
   - 2.2. Messagerie Instantanée & Espaces Communautaires (WhatsApp/Discord)
   - 2.3. Hub Coaching, Certification & Vente de Plans (Marketplace & CRM)
   - 2.4. Tracker d'Entraînement, Carnet & Gamification (Hevy/Strava)
   - 2.5. Suivi Nutritionnel & Progression Morphologique
3. [Architecture Frontend : Application Mobile Expo (React Native)](#3-architecture-frontend--application-mobile-expo-react-native)
   - 3.1. Structure des dossiers et découpage modulaire
   - 3.2. Gestion d'état (Zustand + TanStack Query)
   - 3.3. Design System, Thème Dark Mode & Composants Clés
4. [Architecture Backend : API NestJS d'Entreprise](#4-architecture-backend--api-nestjs-dentreprise)
   - 4.1. Structure des modules & architecture logicielle
   - 4.2. Core & Common Modules (Intercepteurs, Filtres, Guards, Pipes, Decorators)
   - 4.3. Infrastructure : Base de données, Cache Redis, Storage S3/Cloudinary, Mailer
5. [Schéma de Base de Données (Modèles Prisma / PostgreSQL)](#5-schéma-de-base-de-données-modèles-prisma--postgresql)
6. [Contrats d'API REST & Passerelle WebSockets](#6-contrats-dapi-rest--passerelle-websockets)
7. [Fichiers de Configuration & Variables d'Environnement (.env)](#7-fichiers-de-configuration--variables-denvironnement-env)
8. [Sécurité, Conformité & Performance](#8-sécurité-conformité--performance)
9. [Infrastructure, DevOps & Déploiement](#9-infrastructure-devops--déploiement)
10. [Roadmap d'Implémentation Étape par Étape](#10-roadmap-dimplémentation-étape-par-étape)

---

## 1. 🎯 Vision Produit, Rôles & Parcours Utilisateurs

```mermaid
graph TD
    User([Utilisateur / Athlète]) <-->|Posts, Likes, Logs, Chat| App[Application Mobile Expo]
    Coach([Coach Certifié]) <-->|Plans, Form Checks, CRM, Facturation| App
    Admin([Administrateur]) <-->|Validation Diplômes, Modération| AdminPortal[Dashboard Admin NestJS]

    App <-->|REST & WebSockets| API[API Gateway / NestJS Backend]
    API <--> PostgreSQL[(PostgreSQL via Prisma)]
    API <--> Redis[(Redis: Cache, BullMQ, WS Adapter)]
    API <--> Storage[(AWS S3 / Cloudinary Media)]
    API <--> Mailer[Service Email: Resend]
    API <--> Stripe[Stripe Connect Payments]
```

### 1.1. Rôles & Matrice des Permissions (RBAC)
* **`ATHLETE` (Utilisateur standard)** :
  * Création de profil, publication de posts (photos, vidéos, séances), likes, commentaires, partages.
  * Utilisation du carnet d'entraînement (Workout Logger), calcul de 1RM, minuteur de repos.
  * Recherche et abonnement aux formules des coachs, messagerie 1-to-1 et groupes de salle.
* **`COACH` (Coach vérifié ou en cours)** :
  * Tous les droits `ATHLETE`.
  * Dépôt de diplômes / attestations professionnelles.
  * Après validation administrative : obtention du **Badge Officiel Vérifié** 🏅.
  * Création et tarification de plans de coaching (Abonnements récurrents ou Programmes one-shot).
  * Accès au Dashboard CRM : liste de ses élèves, validation des "Form Checks" vidéo, assignation de plans d'entraînement et de macros.
* **`GYM_MANAGER` (Gestionnaire de salle partenaire)** :
  * Création de la page officielle du club (ex: Fitness Park Paris 13, Basic-Fit Lyon...).
  * Publication d'annonces de salle, plannings de cours collectifs, modération de l'espace club.
* **`ADMIN` (Équipe Plateforme)** :
  * Revue des pièces justificatives des coachs (Approuver / Rejeter avec motif).
  * Modération des signalements (contenus inappropriés, spams, fraudes).
  * Gestion des commissions et métriques financières globales.

---

## 2. 📱 Spécifications Fonctionnelles Détaillées par Module

### 2.1. Réseau Social, Feed Algorithmique & Interactions (Style Instagram / Threads)

```mermaid
sequenceDiagram
    autonumber
    actor A as Athlète
    participant App as App Mobile Expo
    participant API as NestJS FeedModule
    participant DB as PostgreSQL
    participant Redis as Redis Cache

    A->>App: Défilement du Feed (Pull/Scroll)
    App->>API: GET /feed?cursor=xxx&limit=10 (Auth JWT)
    API->>Redis: Vérifier cache chronologique ou IDs chauds
    alt Cache Miss
        API->>DB: Query Posts (Followings + Posts viraux + Géolocalisation)
        API->>Redis: Hydrater cache utilisateur
    end
    API-->>App: Liste paginée de Posts + Métadonnées (LikedByMe, CommentsCount)
    App->>A: Rendu 120 FPS avec FlashList & Reanimated
```

* **Types de publications riches** :
  1. **Standard Post** : Image haute définition ou carrousel jusqu'à 10 médias, texte formaté avec hashtags `#` et mentions `@`.
  2. **Workout Share Card** : Fiche visuelle générée automatiquement à la fin d'une séance (Volume total, durée, records personnels battus, liste des exercices et charges maximales).
  3. **Avant / Après (Transformation Slider)** : Widget interactif côte à côte permettant au visiteur de faire glisser un curseur pour comparer l'évolution physique.
  4. **FitClips (Reels)** : Format vidéo court vertical (9:16) avec son original ou tags de mouvement technique.
* **Système de Réactions Énergétiques** :
  * 🔥 `FIRE` (Intensité & Dépassement)
  * 💪 `MUSCLE` (Force & Félicitations)
  * ⚡ `ENERGY` (Cardio & Dynamisme)
  * 🎯 `FOCUS` (Technique parfaite & Rigueur)
* **Commentaires Imbriqués (Threaded Replies)** :
  * Arborescence jusqu'à 3 niveaux de profondeur.
  * Like sur commentaire individuel.
  * Filtrage automatique anti-insultes et modération par IA/regex côté NestJS.

---

### 2.2. Messagerie Instantanée & Espaces Communautaires (Style WhatsApp / Discord)

* **Architecture Temps Réel** :
  * Passerelle WebSockets Socket.io avec authentification par JWT handshake.
  * Redis Streams / Redis PubSub pour la scalabilité horizontale multi-instances de NestJS.
  * Accusés de distribution et de lecture instantanés (`SENT`, `DELIVERED`, `READ`).
* **Fonctionnalités Clés du Chat** :
  * **Messages Vocaux** : Enregistrement micro avec affichage visuel des fréquences (waveform audio) et vitesse x1.5 / x2.
  * **Envoi de Médias HD** : Pré-signature S3 directe pour un téléversement instantané sans surcharger le serveur NestJS.
  * **Outil Métier "Form Check" (Revue Technique)** :
    * L'élève coche la case *"Demande de Form Check"* en envoyant une vidéo d'exécution (ex: Squat lourd).
    * Le coach dispose d'une interface vidéo avec contrôle image par image et enregistreur de note vocale timestampée pour commenter les angles articulaires.
  * **Groupes Thématiques & Clubs** : Canaux publics ou privés par salle de sport (avec géofencing GPS) et canaux d'entraide par objectif (ex: *Prise de force*, *Marathon 2026*).

---

### 2.3. Hub Coaching, Certification & Vente de Plans (Marketplace & CRM)

```mermaid
stateDiagram-v2
    [*] --> CandidatureSoumise: Dépôt Diplômes & Pièces d'identité
    CandidatureSoumise --> EnRevueAdmin: Notification Admin par Email/Slack
    EnRevueAdmin --> Rejetee: Pièces non conformes (Email explicatif)
    Rejetee --> CandidatureSoumise: Nouveau dépôt
    EnRevueAdmin --> Validee: Validation des justificatifs
    Validee --> BadgeAttribue: Badge Coach Certifié activé
    BadgeAttribue --> CreationOffres: Création Packs (Starter, Pro, VIP)
    CreationOffres --> VenteEnLigne: Compte Stripe Connect configuré
```

* **Processus de Certification Rigoureux** :
  * Upload de documents sécurisés (PDF, JPEG) : Diplômes d'État (BPJEPS, DEUST, STAPS) ou Certifications internationales accréditées (NASM, ACE, NSCA), Carte Pro, Pièce d'identité.
  * Stockage crypté sur un bucket S3 privé (non accessible publiquement sans URL signée temporaire).
  * Dashboard de revue pour les administrateurs avec validation en 1 clic.
* **Typologie des Offres de Coaching** :
  * **Abonnement Mensuel Récurrent** (ex: *Pack Suivi 1-on-1* à 120€/mois) avec prélèvement automatique Stripe Subscription.
  * **Programmes Prêt-à-l'emploi (Paiement Unique)** : E-books et plans de séances interactifs débloqués instantanément dans l'application.
* **Mini-CRM du Coach (Tableau de Bord Intégré)** :
  * Vue synthétique de tous les élèves actifs.
  * Alertes d'inactivité : Notification si un élève n'a pas loggé de séance depuis plus de 5 jours.
  * Assignation directe de séances depuis la bibliothèque de templates du coach vers l'agenda de l'élève.

---

### 2.4. Tracker d'Entraînement, Carnet & Gamification (Style Hevy / Strava)

* **Enregistreur de Séance en Temps Réel** :
  * Bibliothèque de plus de 500 exercices avec classification musculaire (Pectoraux, Dorsaux, Quadriceps, Ischios, etc.).
  * Gestion complète des types de séries : Série standard, Échauffement (Warm-up), Dégressive (Drop-set), Série jusqu'à l'échec (RPE 10).
  * Minuteur de repos intelligent automatique avec sonnerie et retour haptique.
  * Calcul en direct du tonnage total déplacé ($\sum \text{poids} \times \text{reps}$) et estimation automatique du 1RM selon la formule d'Epley :
    $$\text{1RM} = \text{Poids} \times \left(1 + \frac{\text{Répétitions}}{30}\right)$$
* **Gamification & Rétention** :
  * **Streaks d'assiduité** : Compteur de semaines validées consécutives.
  * **Badges d'Accomplissement** (débloqués via le worker BullMQ) :
    * *Club 100kg Bench Press*, *Club 200kg Deadlift*.
    * *Matinal* (séances avant 7h00 du matin).
    * *Régularité de Fer* (20 séances loggées en 1 mois).
  * **Classements (Leaderboards)** : Classement par salle de sport ou entre amis au volume hebdomadaire.

---

## 3. 📱 Architecture Frontend : Application Mobile Expo (React Native)

### 3.1. Arborescence Complète du Projet Mobile

```
TaskManager/ (FitConnect Mobile)
├── app/                               # Expo Router (Pages & Navigation)
│   ├── (auth)/                        # Groupe Authentification
│   │   ├── login.tsx                  # Connexion Email / Apple / Google
│   │   ├── register.tsx               # Inscription avec choix de profil (Athlète / Coach)
│   │   └── forgot-password.tsx        # Récupération de mot de passe
│   ├── (tabs)/                        # Navigation Principale (Bottom Tabs)
│   │   ├── _layout.tsx                # Configuration des 5 onglets avec icônes dynamiques
│   │   ├── index.tsx                  # Onglet 1 : Feed Social (Posts, Stories, Workout Cards)
│   │   ├── explore.tsx                # Onglet 2 : Recherche, Filtres & Marketplace Coachs
│   │   ├── workout.tsx                # Onglet 3 : Tracker & Log de Séance en direct
│   │   ├── messages.tsx               # Onglet 4 : Liste des conversations & salons
│   │   └── profile.tsx                # Onglet 5 : Profil utilisateur, PRs, Statistiques
│   ├── coach/                         # Espace dédié Coach
│   │   ├── apply-certification.tsx    # Formulaire de dépôt des diplômes
│   │   ├── manage-plans.tsx           # Création et édition des formules d'abonnements
│   │   └── client-crm.tsx             # Tableau de bord élèves
│   ├── chat/
│   │   └── [conversationId].tsx       # Écran de discussion 1-to-1 / Form Check
│   ├── post/
│   │   ├── create.tsx                 # Création de publication / Upload média
│   │   └── [postId].tsx               # Vue détaillée du post et commentaires arborescents
│   ├── _layout.tsx                    # Root Layout (Fournisseurs React Query, Theme, Auth)
│   └── +not-found.tsx                 # Écran 404
├── components/                        # Composants UI Réutilisables
│   ├── feed/                          # Composants du flux social
│   │   ├── PostCard.tsx               # Carte de post générique
│   │   ├── WorkoutSummaryCard.tsx     # Carte de séance esthétique
│   │   ├── BeforeAfterSlider.tsx      # Curseur avant/après tactile
│   │   ├── ReactionPicker.tsx         # Sélecteur de réactions 🔥💪⚡🎯
│   │   └── CommentThread.tsx          # Arborescence des commentaires
│   ├── workout/                       # Composants d'entraînement
│   │   ├── SetRow.tsx                 # Ligne de saisie série/poids/reps
│   │   ├── RestTimerOverlay.tsx       # Minuteur flottant animé
│   │   └── ExercisePickerModal.tsx    # Modal de recherche d'exercices
│   ├── coach/                         # Composants Coaching
│   │   ├── CoachCard.tsx              # Carte de profil coach avec badge certifié
│   │   ├── PlanSelectorModal.tsx      # Sélection de pack et paiement
│   │   └── VerificationBadge.tsx      # Badge vérifié stylisé
│   ├── chat/                          # Composants de messagerie
│   │   ├── AudioVoicePlayer.tsx       # Lecteur vocal avec Waveform
│   │   └── FormCheckBadge.tsx         # Tag de demande de correction technique
│   └── ui/                            # Composants Atomiques Design System
│       ├── Button.tsx                 # Bouton néon / primaire / glass
│       ├── Input.tsx                  # Champ de saisie stylisé
│       ├── Avatar.tsx                 # Avatar avec indicateur en ligne / badge
│       └── Card.tsx                   # Carte Dark Glassmorphism
├── hooks/                             # Custom Hooks React
│   ├── useAuth.ts                     # Gestion de la session utilisateur
│   ├── useFeed.ts                     # Requêtes infinies React Query pour le feed
│   ├── useSocket.ts                   # Connexion WebSockets temps réel
│   └── useActiveWorkout.ts            # État de la séance en cours (chrono, séries)
├── store/                             # Stores Zustand
│   ├── authStore.ts                   # Token JWT, profil actif
│   ├── workoutStore.ts                # Séance en cours, séries validées, temps de repos
│   └── chatStore.ts                   # Conversations actives, notifications non lues
├── services/                          # Services d'appel API & Intégrations
│   ├── api.ts                         # Instance Axios configurée avec intercepteurs JWT
│   ├── authService.ts                 # Endpoints auth
│   ├── postService.ts                 # Endpoints posts & likes
│   ├── coachService.ts                # Endpoints marketplace & certification
│   ├── workoutService.ts              # Endpoints logs de séances & PRs
│   └── socketService.ts               # Client Socket.io
├── constants/                         # Constantes & Thème
│   ├── Colors.ts                      # Palette de couleurs (Dark mode, Néon Lime, Gold)
│   └── Config.ts                      # URLs d'API et variables d'environnement Expo
└── types/                             # Types TypeScript stricts
    ├── models.ts                      # Interfaces User, Post, Coach, Workout, Plan
    └── navigation.ts                  # Types pour Expo Router
```

### 3.2. Configuration du Store Zustand pour le Tracker d'Entraînement en Direct

```typescript
// store/workoutStore.ts
import { create } from 'zustand';

export interface ExerciseSet {
  id: string;
  setNumber: number;
  type: 'WARMUP' | 'NORMAL' | 'DROPSET' | 'FAILURE';
  weightKg: number;
  reps: number;
  rpe?: number;
  isCompleted: boolean;
}

export interface WorkoutExercise {
  exerciseId: string;
  name: string;
  targetMuscle: string;
  sets: ExerciseSet[];
}

interface ActiveWorkoutState {
  isActive: boolean;
  title: string;
  startTime: number | null;
  exercises: WorkoutExercise[];
  restTimerSeconds: number;
  isTimerRunning: boolean;
  startWorkout: (title: string) => void;
  addExercise: (exercise: { id: string; name: string; targetMuscle: string }) => void;
  addSet: (exerciseIndex: number) => void;
  updateSet: (exerciseIndex: number, setIndex: number, data: Partial<ExerciseSet>) => void;
  completeSet: (exerciseIndex: number, setIndex: number, defaultRest?: number) => void;
  finishWorkout: () => { durationSeconds: number; totalVolumeKg: number; exercisesCount: number };
  cancelWorkout: () => void;
}

export const useWorkoutStore = create<ActiveWorkoutState>((set, get) => ({
  isActive: false,
  title: 'Séance Push (Pectoraux & Triceps)',
  startTime: null,
  exercises: [],
  restTimerSeconds: 90,
  isTimerRunning: false,

  startWorkout: (title) => set({
    isActive: true,
    title,
    startTime: Date.now(),
    exercises: [],
  }),

  addExercise: (exercise) => set((state) => ({
    exercises: [
      ...state.exercises,
      {
        exerciseId: exercise.id,
        name: exercise.name,
        targetMuscle: exercise.targetMuscle,
        sets: [
          {
            id: Math.random().toString(),
            setNumber: 1,
            type: 'NORMAL',
            weightKg: 60,
            reps: 10,
            isCompleted: false,
          },
        ],
      },
    ],
  })),

  addSet: (exerciseIndex) => set((state) => {
    const updated = [...state.exercises];
    const target = updated[exerciseIndex];
    const lastSet = target.sets[target.sets.length - 1];
    target.sets.push({
      id: Math.random().toString(),
      setNumber: target.sets.length + 1,
      type: 'NORMAL',
      weightKg: lastSet ? lastSet.weightKg : 50,
      reps: lastSet ? lastSet.reps : 10,
      isCompleted: false,
    });
    return { exercises: updated };
  }),

  updateSet: (exerciseIndex, setIndex, data) => set((state) => {
    const updated = [...state.exercises];
    updated[exerciseIndex].sets[setIndex] = {
      ...updated[exerciseIndex].sets[setIndex],
      ...data,
    };
    return { exercises: updated };
  }),

  completeSet: (exerciseIndex, setIndex, defaultRest = 90) => {
    set((state) => {
      const updated = [...state.exercises];
      updated[exerciseIndex].sets[setIndex].isCompleted = true;
      return {
        exercises: updated,
        restTimerSeconds: defaultRest,
        isTimerRunning: true,
      };
    });
  },

  finishWorkout: () => {
    const state = get();
    const durationSeconds = state.startTime ? Math.floor((Date.now() - state.startTime) / 1000) : 0;
    let totalVolumeKg = 0;
    state.exercises.forEach((ex) => {
      ex.sets.forEach((s) => {
        if (s.isCompleted) {
          totalVolumeKg += s.weightKg * s.reps;
        }
      });
    });

    set({ isActive: false, startTime: null, exercises: [], isTimerRunning: false });
    return {
      durationSeconds,
      totalVolumeKg,
      exercisesCount: state.exercises.length,
    };
  },

  cancelWorkout: () => set({ isActive: false, startTime: null, exercises: [], isTimerRunning: false }),
}));
```

---

## 4. 🏢 Architecture Backend : API NestJS d'Entreprise

### 4.1. Structure Complète du Projet NestJS (`/backend`)

```
fitconnect-backend/
├── src/
│   ├── app.module.ts                  # Module Racine (Imports des modules métier & infra)
│   ├── main.ts                        # Point d'entrée (Swagger, ValidationPipe, CORS, Helmet)
│   │
│   ├── core/                          # Cœur de l'architecture & Infrastructure transverse
│   │   ├── config/                    # Validation des variables d'environnement (Joi/Zod)
│   │   │   ├── env.validation.ts      # Schéma de validation strict .env
│   │   │   └── configuration.ts       # Typage fort des configurations
│   │   ├── database/                  # Connexion PostgreSQL & Prisma
│   │   │   ├── prisma.module.ts
│   │   │   └── prisma.service.ts      # Gestion du pool et hooks de cycle de vie
│   │   ├── redis/                     # Connexion Redis & BullMQ
│   │   │   ├── redis.module.ts
│   │   │   └── redis.service.ts       # Cache, sessions, pub/sub
│   │   ├── storage/                   # Gestion des Médias S3 / Cloudinary
│   │   │   ├── storage.interface.ts   # Interface de stockage abstraite
│   │   │   ├── s3-storage.service.ts   # Implémentation AWS S3 / Cloudflare R2
│   │   │   ├── cloudinary.service.ts  # Implémentation Cloudinary (Vidéos/Images)
│   │   │   └── storage.module.ts
│   │   └── mail/                      # Envoi d'Emails Transactionnels
│   │       ├── mail.module.ts
│   │       ├── mail.service.ts        # Envoi via Resend / SendGrid
│   │       └── templates/             # Templates HTML / React-Email
│   │           ├── welcome.hbs
│   │           ├── coach-approved.hbs
│   │           └── invoice-receipt.hbs
│   │
│   ├── common/                        # Utilitaires, Guards & Intercepteurs globaux
│   │   ├── decorators/
│   │   │   ├── current-user.decorator.ts  # Récupère l'utilisateur injecté par le JWT
│   │   │   ├── roles.decorator.ts         # Décorateur @Roles(Role.COACH)
│   │   │   └── public.decorator.ts        # Bypass de l'authentification
│   │   ├── guards/
│   │   │   ├── jwt-auth.guard.ts          # Protection globale des routes
│   │   │   ├── roles.guard.ts             # Vérification des rôles (RBAC)
│   │   │   └── ws-jwt.guard.ts            # Guard d'authentification pour WebSockets
│   │   ├── filters/
│   │   │   ├── http-exception.filter.ts   # Format standardisé d'erreur JSON
│   │   │   └── prisma-exception.filter.ts # Catch des erreurs d'unicité et contraintes SQL
│   │   ├── interceptors/
│   │   │   ├── transform-response.interceptor.ts # Format standard { success: true, data: ... }
│   │   │   ├── logging.interceptor.ts     # Journalisation des requêtes et temps de réponse
│   │   │   └── cache.interceptor.ts       # Mise en cache Redis automatique
│   │   └── pipes/
│   │       └── parse-uuid.pipe.ts
│   │
│   └── modules/                       # Modules Métier Découpés
│       ├── auth/                      # Authentification & Sessions
│       │   ├── auth.controller.ts     # /auth/register, /auth/login, /auth/refresh
│       │   ├── auth.service.ts        # Hachage Argon2, génération JWT Access/Refresh
│       │   ├── strategies/            # Passport JWT, Apple, Google
│       │   └── auth.module.ts
│       ├── users/                     # Gestion des Utilisateurs & Relations
│       │   ├── users.controller.ts    # /users/me, /users/:id/follow
│       │   ├── users.service.ts
│       │   └── users.module.ts
│       ├── posts/                     # Publications du Réseau Social
│       │   ├── posts.controller.ts    # CRUD Posts, Médias, Workout Cards
│       │   ├── posts.service.ts       # Agrégation du Feed algorithmique
│       │   └── posts.module.ts
│       ├── interactions/              # Likes 🔥💪, Commentaires, Favoris
│       │   ├── interactions.controller.ts
│       │   ├── interactions.service.ts # Commentaires imbriqués & notifications
│       │   └── interactions.module.ts
│       ├── chat/                      # Messagerie & WebSockets Gateway
│       │   ├── chat.gateway.ts        # Passerelle Socket.io temps réel
│       │   ├── chat.controller.ts     # Historique des messages, création de salles
│       │   ├── chat.service.ts
│       │   └── chat.module.ts
│       ├── coach/                     # Hub Coaching & Certification
│       │   ├── coach.controller.ts    # /coach/verify, /coach/plans, /coach/crm/students
│       │   ├── coach.service.ts       # Revue des diplômes & gestion des fiches coachs
│       │   └── coach.module.ts
│       ├── payments/                  # Facturation Stripe & Abonnements
│       │   ├── payments.controller.ts # /payments/checkout, /payments/webhook
│       │   ├── payments.service.ts    # Stripe Connect, Customer Portals
│       │   └── payments.module.ts
│       ├── workouts/                  # Carnet d'Entraînement & PRs
│       │   ├── workouts.controller.ts # Enregistrement de séance, calcul 1RM
│       │   ├── workouts.service.ts
│       │   └── workouts.module.ts
│       └── gamification/              # Badges, Streaks & Leaderboards
│           ├── gamification.service.ts# Calcul des streaks par cron job BullMQ
│           └── gamification.module.ts
├── prisma/
│   ├── schema.prisma                  # Définition de la BDD PostgreSQL
│   └── migrations/                    # Historique des migrations SQL
├── test/                              # Tests E2E et unitaires (Jest / Supertest)
├── docker-compose.yml                 # PostgreSQL + Redis + pgAdmin local
├── Dockerfile                         # Image optimisée Node.js Alpine
└── package.json
```

---

### 4.2. Exemple de Composants Common & Core NestJS

#### 1. Configuration & Validation des Variables d'Environnement (`src/core/config/env.validation.ts`)

```typescript
import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
  PORT: Joi.number().default(4000),
  DATABASE_URL: Joi.string().required().description('PostgreSQL connection string'),
  
  // JWT
  JWT_ACCESS_SECRET: Joi.string().min(32).required(),
  JWT_ACCESS_EXPIRATION: Joi.string().default('15m'),
  JWT_REFRESH_SECRET: Joi.string().min(32).required(),
  JWT_REFRESH_EXPIRATION: Joi.string().default('7d'),

  // Redis
  REDIS_HOST: Joi.string().default('localhost'),
  REDIS_PORT: Joi.number().default(6379),
  REDIS_PASSWORD: Joi.string().allow('').optional(),

  // Storage (AWS S3 ou Cloudinary)
  STORAGE_PROVIDER: Joi.string().valid('s3', 'cloudinary').default('s3'),
  AWS_S3_BUCKET: Joi.string().when('STORAGE_PROVIDER', { is: 's3', then: Joi.required() }),
  AWS_ACCESS_KEY_ID: Joi.string().when('STORAGE_PROVIDER', { is: 's3', then: Joi.required() }),
  AWS_SECRET_ACCESS_KEY: Joi.string().when('STORAGE_PROVIDER', { is: 's3', then: Joi.required() }),
  AWS_REGION: Joi.string().default('eu-west-3'),

  // Stripe
  STRIPE_SECRET_KEY: Joi.string().required(),
  STRIPE_WEBHOOK_SECRET: Joi.string().required(),

  // Mail
  RESEND_API_KEY: Joi.string().required(),
  MAIL_FROM: Joi.string().email().default('no-reply@fitconnect.app'),
});
```

#### 2. Intercepteur Standard de Réponse (`src/common/interceptors/transform-response.interceptor.ts`)

```typescript
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface ResponseFormat<T> {
  success: boolean;
  statusCode: number;
  timestamp: string;
  data: T;
}

@Injectable()
export class TransformResponseInterceptor<T> implements NestInterceptor<T, ResponseFormat<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<ResponseFormat<T>> {
    const statusCode = context.switchToHttp().getResponse().statusCode;
    return next.handle().pipe(
      map((data) => ({
        success: true,
        statusCode,
        timestamp: new Date().toISOString(),
        data,
      })),
    );
  }
}
```

#### 3. Passerelle WebSockets pour le Chat & Notifications (`src/modules/chat/chat.gateway.ts`)

```typescript
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UseGuards, Logger } from '@nestjs/common';
import { WsJwtGuard } from '../../common/guards/ws-jwt.guard';
import { ChatService } from './chat.service';

@WebSocketGateway({
  cors: { origin: '*' },
  namespace: '/chat',
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(ChatGateway.name);

  constructor(private readonly chatService: ChatService) {}

  async handleConnection(client: Socket) {
    try {
      const user = await this.chatService.authenticateSocket(client);
      client.data.user = user;
      client.join(`user_${user.id}`);
      this.logger.log(`Client connecté : ${user.username} (${client.id})`);
    } catch (err) {
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client déconnecté : ${client.id}`);
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('sendMessage')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { conversationId: string; content: string; mediaUrl?: string; isFormCheck?: boolean },
  ) {
    const senderId = client.data.user.id;
    const message = await this.chatService.saveMessage(senderId, payload);

    // Émission du message à tous les membres de la conversation
    this.server.to(`conversation_${payload.conversationId}`).emit('newMessage', message);
    return message;
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('joinConversation')
  handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { conversationId: string },
  ) {
    client.join(`conversation_${payload.conversationId}`);
    return { status: 'joined', conversationId: payload.conversationId };
  }
}
```

---

## 5. 🗄️ Schéma de Base de Données (Modèles Prisma / PostgreSQL)

Le schéma ci-dessous modélise l'ensemble des fonctionnalités de manière optimisée avec indexation pour des requêtes ultra-rapides.

```prisma
// prisma/schema.prisma

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

enum Role {
  ATHLETE
  COACH
  GYM_MANAGER
  ADMIN
}

enum CertificationStatus {
  PENDING
  UNDER_REVIEW
  APPROVED
  REJECTED
}

enum PlanInterval {
  MONTHLY
  QUARTERLY
  YEARLY
  ONE_TIME
}

enum ReactionType {
  FIRE
  MUSCLE
  ENERGY
  FOCUS
}

// ================= UTILISATEURS & PROFILS =================

model User {
  id               String           @id @default(uuid())
  email            String           @unique
  passwordHash     String?
  username         String           @unique
  fullName         String
  avatarUrl        String?
  bio              String?
  role             Role             @default(ATHLETE)
  isVerified       Boolean          @default(false)
  currentStreak    Int              @default(0)
  longestStreak    Int              @default(0)
  createdAt        DateTime         @default(now())
  updatedAt        DateTime         @updatedAt

  // Profil Spécifique Coach (si role == COACH)
  coachProfile     CoachProfile?

  // Relations Sociales
  followers        Follow[]         @relation("UserFollowers")
  following        Follow[]         @relation("UserFollowing")
  posts            Post[]
  reactions        PostReaction[]
  comments         Comment[]
  
  // Entraînements & Abonnements
  workouts         WorkoutSession[]
  subscriptions    Subscription[]   @relation("StudentSubscriptions")
  sentMessages     ChatMessage[]    @relation("SentMessages")
  userBadges       UserBadge[]

  @@index([username])
  @@index([email])
}

model Follow {
  followerId  String
  followingId String
  createdAt   DateTime @default(now())

  follower    User     @relation("UserFollowing", fields: [followerId], references: [id], onDelete: Cascade)
  following   User     @relation("UserFollowers", fields: [followingId], references: [id], onDelete: Cascade)

  @@id([followerId, followingId])
}

// ================= HUB COACHING & CERTIFICATIONS =================

model CoachProfile {
  id                    String                @id @default(uuid())
  userId                String                @unique
  user                  User                  @relation(fields: [userId], references: [id], onDelete: Cascade)
  specialties           String[]              // ex: ["Hypertrophie", "Perte de poids", "Powerlifting"]
  yearsOfExperience     Int                   @default(1)
  certificationStatus   CertificationStatus   @default(PENDING)
  verificationNotes     String?
  stripeAccountId       String?               // Stripe Connect ID
  ratingAvg             Float                 @default(5.0)
  reviewsCount          Int                   @default(0)
  
  documents             CertificationDocument[]
  plans                 CoachingPlan[]
  reviews               CoachReview[]

  createdAt             DateTime              @default(now())
  updatedAt             DateTime              @updatedAt
}

model CertificationDocument {
  id              String           @id @default(uuid())
  coachProfileId  String
  coachProfile    CoachProfile     @relation(fields: [coachProfileId], references: [id], onDelete: Cascade)
  documentType    String           // "BPJEPS", "STAPS", "NASM", "ID_CARD"
  fileUrl         String           // S3 Secure URL
  isVerified      Boolean          @default(false)
  uploadedAt      DateTime         @default(now())
}

model CoachingPlan {
  id              String           @id @default(uuid())
  coachProfileId  String
  coachProfile    CoachProfile     @relation(fields: [coachProfileId], references: [id], onDelete: Cascade)
  title           String           // ex: "Pack Suivi Sur-Mesure VIP"
  description     String
  priceCents      Int              // Prix en centimes (ex: 9900 = 99,00 €)
  interval        PlanInterval     @default(MONTHLY)
  features        String[]         // ["Programme personnalisé", "Chat VIP 7j/7", "Form Checks"]
  isActive        Boolean          @default(true)
  
  subscriptions   Subscription[]
  createdAt       DateTime         @default(now())
  updatedAt       DateTime         @updatedAt
}

model Subscription {
  id              String           @id @default(uuid())
  studentId       String
  student         User             @relation("StudentSubscriptions", fields: [studentId], references: [id])
  planId          String
  plan            CoachingPlan     @relation(fields: [planId], references: [id])
  stripeSubId     String?          @unique
  status          String           // "active", "canceled", "past_due"
  currentPeriodEnd DateTime
  createdAt       DateTime         @default(now())
}

model CoachReview {
  id              String           @id @default(uuid())
  coachProfileId  String
  coachProfile    CoachProfile     @relation(fields: [coachProfileId], references: [id], onDelete: Cascade)
  reviewerId      String
  rating          Int              // 1 à 5 étoiles
  comment         String
  createdAt       DateTime         @default(now())
}

// ================= RÉSEAU SOCIAL & INTERACTIONS =================

model Post {
  id               String           @id @default(uuid())
  authorId         String
  author           User             @relation(fields: [authorId], references: [id], onDelete: Cascade)
  content          String?
  mediaUrls        String[]
  workoutSessionId String?          @unique
  workoutSession   WorkoutSession?  @relation(fields: [workoutSessionId], references: [id])
  
  reactionsCount   Int              @default(0)
  commentsCount    Int              @default(0)
  
  reactions        PostReaction[]
  comments         Comment[]
  
  createdAt        DateTime         @default(now())
  updatedAt        DateTime         @updatedAt

  @@index([authorId, createdAt(sort: Desc)])
}

model PostReaction {
  id        String        @id @default(uuid())
  postId    String
  userId    String
  type      ReactionType  @default(FIRE)
  post      Post          @relation(fields: [postId], references: [id], onDelete: Cascade)
  user      User          @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([postId, userId])
}

model Comment {
  id        String    @id @default(uuid())
  postId    String
  authorId  String
  parentId  String?   // Pour les réponses imbriquées (Threaded)
  content   String
  post      Post      @relation(fields: [postId], references: [id], onDelete: Cascade)
  author    User      @relation(fields: [authorId], references: [id], onDelete: Cascade)
  parent    Comment?  @relation("CommentReplies", fields: [parentId], references: [id], onDelete: Cascade)
  replies   Comment[] @relation("CommentReplies")

  createdAt DateTime  @default(now())
}

// ================= TRACKER D'ENTRAÎNEMENT =================

model WorkoutSession {
  id               String            @id @default(uuid())
  userId           String
  user             User              @relation(fields: [userId], references: [id], onDelete: Cascade)
  title            String            // "Séance Jambes & Mollets"
  durationSeconds  Int
  totalVolumeKg    Float
  prCount          Int               @default(0)
  performedAt      DateTime          @default(now())
  
  post             Post?
  exercises        WorkoutExercise[]
}

model WorkoutExercise {
  id               String            @id @default(uuid())
  sessionId        String
  session          WorkoutSession    @relation(fields: [sessionId], references: [id], onDelete: Cascade)
  exerciseName     String            // "Développé Couché aux Haltères"
  targetMuscle     String            // "Pectoraux"
  orderIndex       Int               @default(0)
  
  sets             WorkoutSet[]
}

model WorkoutSet {
  id                String           @id @default(uuid())
  workoutExerciseId String
  exercise          WorkoutExercise  @relation(fields: [workoutExerciseId], references: [id], onDelete: Cascade)
  setNumber         Int
  weightKg          Float
  reps              Int
  rpe               Float?
  isPersonalRecord  Boolean          @default(false)
}

// ================= MESSAGERIE TEMPS RÉEL =================

model Conversation {
  id           String        @id @default(uuid())
  isGroup      Boolean       @default(false)
  title        String?
  createdAt    DateTime      @default(now())
  updatedAt    DateTime      @updatedAt
  
  messages     ChatMessage[]
}

model ChatMessage {
  id             String        @id @default(uuid())
  conversationId String
  senderId       String
  content        String
  mediaUrl       String?
  isFormCheck    Boolean       @default(false)
  conversation   Conversation  @relation(fields: [conversationId], references: [id], onDelete: Cascade)
  sender         User          @relation("SentMessages", fields: [senderId], references: [id])
  createdAt      DateTime      @default(now())
}

// ================= GAMIFICATION =================

model Badge {
  id          String      @id @default(uuid())
  code        String      @unique // "BENCH_100KG", "STREAK_10_WEEKS"
  title       String
  description String
  iconUrl     String
  userBadges  UserBadge[]
}

model UserBadge {
  id          String   @id @default(uuid())
  userId      String
  badgeId     String
  unlockedAt  DateTime @default(now())
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  badge       Badge    @relation(fields: [badgeId], references: [id])

  @@unique([userId, badgeId])
}
```

---

## 6. 🌐 Contrats d'API REST & Passerelle WebSockets

### Principaux Endpoints RESTful

| Méthode | Route | Description | Auth Requise |
| :--- | :--- | :--- | :--- |
| **POST** | `/auth/register` | Inscription nouvel utilisateur (Athlète ou Coach) | Public |
| **POST** | `/auth/login` | Connexion et émission des tokens JWT | Public |
| **POST** | `/auth/refresh` | Renouvellement de l'AccessToken via RefreshToken | Public |
| **GET** | `/feed` | Flux d'actualité paginé (Curseur, abonnements, suggestions) | `JWT` |
| **POST** | `/posts` | Création d'une publication (photos, vidéo, séance liée) | `JWT` |
| **POST** | `/posts/:id/react` | Réaction dynamique (🔥, 💪, ⚡, 🎯) | `JWT` |
| **GET** | `/posts/:id/comments` | Liste des commentaires arborescents | `JWT` |
| **POST** | `/posts/:id/comments` | Ajouter un commentaire ou répondre à un fil | `JWT` |
| **GET** | `/coaches` | Marketplace : recherche et filtres de coachs certifiés | `JWT` |
| **GET** | `/coaches/:id/plans` | Liste des formules d'abonnements d'un coach | `JWT` |
| **POST** | `/coach/apply` | Dépôt des diplômes pour demande de certification | `JWT` (`Role.COACH`) |
| **POST** | `/payments/checkout` | Création de la session de paiement Stripe pour un plan | `JWT` |
| **POST** | `/workouts` | Enregistrement d'une séance complétée + calcul PRs | `JWT` |
| **GET** | `/workouts/stats` | Tonnage total, historique des 1RM et streaks | `JWT` |

---

## 7. ⚙️ Fichiers de Configuration & Variables d'Environnement (.env)

### Backend NestJS (`/backend/.env.example`)

```env
# ================= APPLICATION =================
NODE_ENV=development
PORT=4000
API_PREFIX=api/v1
APP_URL=http://localhost:4000
FRONTEND_URL=exp://localhost:8081

# ================= BASE DE DONNÉES (POSTGRESQL) =================
DATABASE_URL="postgresql://postgres:postgrespassword@localhost:5432/fitconnect_db?schema=public&sslmode=prefer"

# ================= SÉCURITÉ JWT =================
JWT_ACCESS_SECRET="votre_super_cle_secrete_jwt_access_minimum_32_caracteres_12345"
JWT_ACCESS_EXPIRATION="15m"
JWT_REFRESH_SECRET="votre_super_cle_secrete_jwt_refresh_minimum_32_caracteres_67890"
JWT_REFRESH_EXPIRATION="7d"

# ================= REDIS & BULLMQ (CACHE, SESSIONS, FILES) =================
REDIS_HOST="127.0.0.1"
REDIS_PORT=6379
REDIS_PASSWORD=""

# ================= STOCKAGE FICHIERS (AWS S3 OU CLOUDINARY) =================
STORAGE_PROVIDER="s3" # "s3" ou "cloudinary"

# Configuration AWS S3 / Cloudflare R2
AWS_ACCESS_KEY_ID="AKIAIOSFODNN7EXAMPLE"
AWS_SECRET_ACCESS_KEY="wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"
AWS_REGION="eu-west-3"
AWS_S3_BUCKET="fitconnect-media-prod"

# Configuration Alternative Cloudinary
CLOUDINARY_CLOUD_NAME="fitconnect"
CLOUDINARY_API_KEY="123456789012345"
CLOUDINARY_API_SECRET="abcdefghijklmnopqrstuvwxyz12345"

# ================= EMAILS TRANSACTIONNELS (RESEND) =================
RESEND_API_KEY="re_123456789_abcdefghijklmnop"
MAIL_FROM="FitConnect <no-reply@fitconnect.app>"

# ================= STRIPE (PAIEMENTS & ABONNEMENTS COACHS) =================
STRIPE_SECRET_KEY="sk_test_51Mz..."
STRIPE_WEBHOOK_SECRET="whsec_..."
STRIPE_CLIENT_ID="ca_..." # Pour Stripe Connect

# ================= EXPO PUSH NOTIFICATIONS =================
EXPO_ACCESS_TOKEN="votre_token_expo_push_notifications"
```

### Frontend Mobile Expo (`/TaskManager/.env.example`)

```env
EXPO_PUBLIC_API_URL="http://192.168.1.50:4000/api/v1"
EXPO_PUBLIC_WS_URL="ws://192.168.1.50:4000/chat"
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_51Mz..."
```

---

## 8. 🔒 Sécurité, Conformité & Performance

1. **Protection des Données de Santé & Diplômes** :
   * Les pièces justificatives des coachs (diplômes, cartes d'identité) sont stockées dans un bucket S3 privé avec chiffrement AES-256 au repos.
   * Accès réservé aux administrateurs via des URLs signées à durée de vie limitée (5 minutes).
2. **Gestion de Charge & Scalabilité** :
   * Mise en cache Redis pour le flux d'actualités et le classement des coachs (invalidation intelligente par tags).
   * Traitement asynchrone des tâches lourdes (transcodage vidéo, notifications push, calcul de streaks nocturne) via **BullMQ**.
3. **Sécurité API** :
   * Throttling / Rate-Limiting par IP et par compte utilisateur via `@nestjs/throttler`.
   * Protection contre les failles XSS, injections SQL (garantie par Prisma ORM) et headers de sécurité via **Helmet**.

---

## 9. 🚀 Infrastructure, DevOps & Déploiement

### Fichier Docker Compose Local (`docker-compose.yml`)

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    container_name: fitconnect_postgres
    restart: always
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgrespassword
      POSTGRES_DB: fitconnect_db
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    container_name: fitconnect_redis
    restart: always
    ports:
      - "6379:6379"
    volumes:
      - redisdata:/data

volumes:
  pgdata:
  redisdata:
```

---

## 10. 📅 Roadmap d'Implémentation Étape par Étape

```
[Étape 1 : Fondations & Auth]
  ├── Initialisation du projet NestJS + Prisma + PostgreSQL
  ├── Auth JWT (Register, Login, Refresh, Rôles: ATHLETE / COACH / ADMIN)
  └── Setup Expo Router + NativeWind Dark Theme + Zustand Auth Store

[Étape 2 : Cœur Social & Feed]
  ├── Modèle Post, Like 🔥💪, Commentaires arborescents
  ├── Upload médias (Photos / Vidéos) vers S3 / Cloudinary
  └── Feed Mobile avec FlashList à 120 FPS + Composants PostCard & WorkoutSummary

[Étape 3 : Hub Coaching & Marketplace]
  ├── Upload des diplômes coach + Workflow d'approbation Admin
  ├── Création des plans d'abonnement + Intégration Stripe Connect
  └── Écran mobile de recherche de coachs avec badge vérifié

[Étape 4 : Messagerie Temps Réel & Form Check]
  ├── Gateway WebSockets Socket.io avec Redis adapter
  ├── Chat 1-to-1, messages vocaux (waveform) et médias
  └── Widget Form Check pour la correction vidéo d'exercices

[Étape 5 : Tracker d'Entraînement & Gamification]
  ├── Carnet d'entraînement en direct avec chronomètre et calcul 1RM
  ├── Partage automatique de la séance sur le feed
  └── Moteur de badges et de streaks via cron job BullMQ
```
