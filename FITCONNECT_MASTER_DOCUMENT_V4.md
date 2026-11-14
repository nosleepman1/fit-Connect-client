# FITCONNECT — Document Maître d'Architecture, Modélisation & Parcours Utilisateurs

**Version 4.0.0 — Document de référence unique**
**Backend : NestJS + TypeScript + Prisma + PostgreSQL (Clean Architecture)**
**Mobile : React Native + Expo Router + NativeWind + Zustand + TanStack Query + Reanimated**
**Infrastructure : Docker, Redis/BullMQ, S3/Cloudinary, Stripe Connect, Socket.io**

---

## Sommaire

1. Vision produit, rôles & permissions
2. Architecture générale (Clean Architecture)
3. Architecture Backend (NestJS)
4. Authentification robuste (local + Google + Apple)
5. Modélisation complète des données
6. Architecture Frontend (Expo Router)
7. Guide de Design (tokens & patterns d'écran)
8. Parcours utilisateurs (User Flows)
9. Convention API & versioning
10. Scalabilité
11. Tests, CI/CD, Observabilité
12. Roadmap en phases
13. Décisions d'architecture à ne pas modifier
14. Conclusion

---

# 1. Vision produit, rôles & permissions

FitConnect combine réseau social fitness (façon Instagram/Threads), messagerie et clubs (façon WhatsApp/Discord/Facebook Groups), marketplace de coaching certifié, tracker d'entraînement gamifié (façon Hevy/Strava), vidéo courte verticale (façon TikTok).

```text
Athlète        ←→  Posts, Stories, Clips, Workout Logger, Messagerie, Abonnement coach
Coach          ←→  Tout Athlète + Certification, Plans, CRM élèves, Form Check
Gym Manager    ←→  Page de club/salle, annonces, modération de l'espace
Admin          ←→  Revue certifications, modération, métriques financières
```

## 1.1. Matrice RBAC (résumé)

| Action | Athlète | Coach vérifié | Gym Manager | Admin |
|---|---|---|---|---|
| Publier post / story / clip | ✅ | ✅ | ✅ (page club) | ✅ |
| Créer plan de coaching | ❌ | ✅ | ❌ | ❌ |
| Voir CRM élèves | ❌ | ✅ (ses élèves) | ❌ | ❌ |
| Créer page de club | ❌ | ❌ | ✅ | ✅ |
| Valider certification | ❌ | ❌ | ❌ | ✅ |
| Voir métriques financières globales | ❌ | ❌ (ses seules) | ❌ | ✅ |

Le rôle (`User.role`) donne l'accès fonctionnel de haut niveau ; l'autorisation fine (est-ce *mon* élève, *ma* conversation, *mon* club) est vérifiée dans chaque Use Case via une règle d'ownership — jamais uniquement via le rôle.

---

# 2. Architecture générale (Clean Architecture)

```text
                         ┌─────────────────────┐
                         │ React Native / Expo  │
                         │ Mobile Application   │
                         └──────────┬──────────┘
                                    │ HTTPS / WSS
                                    ▼
                         ┌─────────────────────┐
                         │   Presentation      │  Controllers, Guards, DTO, Gateways WS
                         └──────────┬──────────┘
                                    ▼
                         ┌─────────────────────┐
                         │   Application       │  Use Cases (1 classe = 1 action)
                         │                     │  + Ports (interfaces)
                         └──────────┬──────────┘
                                    ▼
                         ┌─────────────────────┐
                         │   Domain            │  Entités, règles, value objects
                         │                     │  Zéro dépendance externe
                         └──────────┬──────────┘
                                    ▲ implémente les ports
                         ┌─────────────────────┐
                         │  Infrastructure     │  Prisma, OAuth, S3/Cloudinary,
                         │                     │  Stripe, Mail, BullMQ, Socket.io Redis
                         └──────────┬──────────┘
             ┌──────────────────────┼──────────────────────┐
             ▼                      ▼                      ▼
       PostgreSQL                 Redis                Object Storage
       Source of truth       Cache/Queue/PubSub       Images/Vidéos
```

**Règle de dépendance stricte** : `Presentation → Application → Domain`. `Infrastructure → Application` (implémente les ports définis là, jamais l'inverse). Le Domain ne dépend de rien.

---

# 3. Architecture Backend (NestJS)

## 3.1. Arborescence par module

```text
src/
├── main.ts
├── app.module.ts
├── config/
│   ├── configuration.ts
│   └── env.validation.ts
├── common/
│   ├── decorators/  guards/  interceptors/  filters/  pipes/  exceptions/
├── infrastructure/
│   ├── database/ (prisma.module.ts, prisma.service.ts)
│   ├── cache/  queue/  storage/  mail/
│   └── oauth/ (google-oauth.provider.ts, apple-oauth.provider.ts)
└── modules/
    └── <domaine>/
        ├── domain/
        │   ├── entities/
        │   └── value-objects/
        ├── application/
        │   ├── use-cases/        -- 1 fichier = 1 action
        │   └── ports/             -- interfaces (repos, providers)
        ├── infrastructure/
        │   └── repositories/      -- implémentations Prisma
        ├── presentation/
        │   ├── dto/
        │   ├── <domaine>.controller.ts
        │   └── <domaine>.gateway.ts   (si temps réel)
        └── <domaine>.module.ts
```

## 3.2. Exemple concret — Use Case + Repository (pattern appliqué à tout le backend)

```typescript
// application/ports/workout-session.repository.port.ts
export interface WorkoutSessionRepositoryPort {
  findActiveByUser(userId: string): Promise<WorkoutSession | null>;
  save(session: WorkoutSession): Promise<void>;
}
export const WORKOUT_SESSION_REPOSITORY = Symbol('WORKOUT_SESSION_REPOSITORY');
```

```typescript
// application/use-cases/add-set-to-exercise.use-case.ts
@Injectable()
export class AddSetToExerciseUseCase {
  constructor(
    @Inject(WORKOUT_SESSION_REPOSITORY) private readonly sessions: WorkoutSessionRepositoryPort,
    @Inject(PERSONAL_RECORD_CHECKER) private readonly prChecker: PersonalRecordCheckerPort,
    private readonly eventBus: DomainEventBus,
  ) {}

  async execute(command: AddSetCommand): Promise<AddSetResult> {
    const session = await this.sessions.findActiveByUser(command.userId);
    if (!session) throw new NoActiveSessionError();

    const set = session.addSet(command.exerciseId, command.weightKg, command.reps);
    const isPR = await this.prChecker.check(command.userId, command.exerciseId, set);
    if (isPR) {
      set.markAsPersonalRecord();
      this.eventBus.publish(new PersonalRecordUnlockedEvent(command.userId, set.id));
    }
    await this.sessions.save(session);
    return { setId: set.id, isPersonalRecord: isPR };
  }
}
```

```typescript
// infrastructure/repositories/prisma-workout-session.repository.ts
@Injectable()
export class PrismaWorkoutSessionRepository implements WorkoutSessionRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}
  async findActiveByUser(userId: string) {
    const record = await this.prisma.workoutSession.findFirst({
      where: { userId, status: 'IN_PROGRESS' },
      include: { exercises: { include: { sets: true } } },
    });
    return record ? WorkoutSessionMapper.toDomain(record) : null;
  }
  async save(session: WorkoutSession) { /* upsert via mapper */ }
}
```

Le contrôleur ne fait que traduire HTTP ↔ Use Case :

```typescript
@Post(':sessionId/sets')
async addSet(@Param('sessionId') id: string, @Body() dto: AddSetDto, @CurrentUser() user: AuthUser) {
  return this.addSetToExerciseUseCase.execute({ userId: user.id, ...dto });
}
```

**Bénéfice** : `AddSetToExerciseUseCase` se teste avec un repository en mémoire, zéro Docker. Changer Prisma pour autre chose ne touche jamais ce fichier.

## 3.3. Événements de domaine — découpler les effets de bord

Un Use Case métier ne déclenche jamais directement un email, un push ou un calcul de badge. Il publie un événement (`PersonalRecordUnlockedEvent`, `ReactionAddedEvent`, `CertificationApprovedEvent`...) ; des handlers dédiés dans les modules Notifications/Gamification s'y abonnent et enfilent les jobs BullMQ correspondants. Ajouter un nouveau badge ou un nouveau canal de notification ne modifie jamais le Use Case déclencheur.

---

# 4. Authentification robuste (local + Google + Apple)

## 4.1. Modèle

```text
User 1 ─── N AuthIdentity   (provider: LOCAL | GOOGLE | APPLE)
UNIQUE(provider, providerAccountId)
```

Le mot de passe (`passwordHash`) vit uniquement dans `AuthIdentity` (provider `LOCAL`) — un utilisateur 100% Google n'a jamais de mot de passe obligatoire.

## 4.2. Flux OAuth

```text
Mobile (Expo AuthSession) → id_token signé Google/Apple
   → POST /api/v1/auth/oauth/{provider} { idToken }
   → VerifyOAuthTokenUseCase (vérifie signature JWKS, aud, iss, expiration — TOUJOURS côté serveur)
   → FindOrCreateUserFromOAuthUseCase
        - AuthIdentity existe → connexion
        - email déjà présent (autre provider) ET email_verified=true côté provider → proposition de liaison
        - sinon → création User + AuthIdentity
   → émission RefreshSession + AccessToken
```

## 4.3. Sessions & sécurité

```text
RefreshSession
- id, userId, tokenHash, deviceName, userAgent, ipAddress,
  expiresAt, revokedAt, createdAt, lastUsedAt
```

- Access token JWT court (10–15 min) ; refresh token opaque, **rotation obligatoire** à chaque usage ; réutilisation d'un token déjà consommé = révocation de toute la famille de sessions.
- Argon2id pour les mots de passe ; 2FA TOTP obligatoire pour `ADMIN` et `COACH` vérifié.
- Rate limiting par IP **et** par compte sur `/auth/*` ; `SecurityAuditLog` append-only sur tout événement sensible.

---

# 5. Modélisation complète des données

## 5.1. Identité

```text
User
- id, email, username, role, status, emailVerifiedAt, createdAt, updatedAt

AuthIdentity
- id, userId, provider, providerAccountId, passwordHash?, emailAtProvider, createdAt, lastUsedAt
```

## 5.2. Social — Cœur

```text
Follow
- followerId, followingId   UNIQUE(followerId, followingId)

Post
- id, authorId, content, visibility, status, createdAt, updatedAt

PostMedia
- id, postId, storageKey, mediaType, mimeType, width, height, durationSeconds, sortOrder

PostReaction
- postId, userId, type   UNIQUE(postId, userId)   -- 1 réaction active/utilisateur/post en V1

Comment
- id, postId, authorId, parentId?, content, status, createdAt
  MAX_DEPTH = 3 (contrôlé service) ; pagination par curseur : INDEX(postId, parentId, createdAt)
```

## 5.3. Contenu éphémère & vidéo courte

```text
Story
- id, authorId, mediaId, caption?, expiresAt, createdAt   -- purge BullMQ après expiresAt

StoryMedia
- id, storageKey, mediaType, durationSeconds

StoryView
- storyId, viewerId, viewedAt   UNIQUE(storyId, viewerId)

Clip
- id, authorId, mediaId, caption, exerciseTagId?, soundId?, visibility,
  status(PROCESSING|READY|FAILED|REMOVED), viewsCount, createdAt

ClipMedia
- id, storageKey, hlsPlaylistKey?, thumbnailKey, width, height, durationSeconds

ClipSound
- id, sourceClipId?, storageKey, title, usageCount
```

## 5.4. Clubs / Pages

```text
Club
- id, name, type(GYM_PAGE|INTEREST_GROUP), visibility, ownerId, geoLat?, geoLng?, description

ClubMember
- clubId, userId, role(OWNER|MODERATOR|MEMBER), joinedAt   UNIQUE(clubId, userId)

ClubPost
- id, clubId, authorId, content, status, createdAt
```

## 5.5. Entraînement

```text
Exercise
- id, name, slug, description, instructions, primaryMuscle, equipment, difficulty, isActive

WorkoutSession
- id, userId, title, status(IN_PROGRESS|COMPLETED|CANCELLED), startedAt, completedAt, durationSeconds, notes

WorkoutExercise
- id, workoutSessionId, exerciseId, orderIndex, notes

WorkoutSet
- id, workoutExerciseId, setNumber, type(WARMUP|NORMAL|DROPSET|FAILURE),
  weightKg, reps, rpe, rir, durationSeconds, isCompleted, isPersonalRecord
```

Calculs : `volume = weightKg × reps` ; `1RM (Epley) = poids × (1 + reps/30)` (estimation). PR toujours déterminé côté serveur, avec `INDEX(userId, exerciseId, weightKg DESC)` dédié.

## 5.6. Coaching & Certification

```text
CoachProfile
- id, userId UNIQUE, bio, specialties, yearsOfExperience, status, ratingAverage, reviewsCount

CoachingPlan
- id, coachId, title, description, type(SUBSCRIPTION|ONE_TIME), price, currency, interval,
  status(DRAFT|PUBLISHED|ARCHIVED)

CertificationApplication
- id, coachId, status(DRAFT|SUBMITTED|UNDER_REVIEW|APPROVED|REJECTED|WITHDRAWN|EXPIRED|REVOKED),
  submittedAt, reviewedAt, reviewedById, rejectionReason

CertificationDocument
- id, applicationId, documentType(DIPLOMA|PROFESSIONAL_CERTIFICATION|PROFESSIONAL_CARD|IDENTITY_DOCUMENT|OTHER),
  storageKey, mimeType, fileSize, status, rejectionReason, uploadedAt, reviewedAt

CertificationReview   -- append-only, jamais modifié
- id, applicationId, reviewerId, decision, note, createdAt
```

## 5.7. Messagerie & Form Check

```text
Conversation
- id, type(DIRECT|GROUP), title, createdAt

ConversationParticipant   -- seule source d'autorité sur l'appartenance
- conversationId, userId, role, joinedAt, leftAt, lastReadAt, mutedUntil   UNIQUE(conversationId, userId)

ChatMessage
- id, conversationId, senderId, content,
  type(TEXT|IMAGE|VIDEO|AUDIO|FILE|FORM_CHECK|SYSTEM), status, createdAt, editedAt, deletedAt

FormCheck
- id, studentId, coachId, messageId?, mediaId, status(PENDING|IN_REVIEW|REVIEWED|CANCELLED),
  submittedAt, reviewedAt
```

## 5.8. Notifications

```text
Notification
- id, recipientId, type, payload(JSON), readAt, createdAt

NotificationPreference
- userId, channel(PUSH|EMAIL|IN_APP), type, enabled   UNIQUE(userId, channel, type)

PushToken
- id, userId, token, platform(IOS|ANDROID), lastSeenAt
```

## 5.9. Gamification

```text
Badge
- id, code, title, description, iconKey

UserBadge
- userId, badgeId, unlockedAt   UNIQUE(userId, badgeId)

StreakState
- userId UNIQUE, currentStreakWeeks, longestStreakWeeks, lastValidatedWeekStart

LeaderboardEntry   -- projection recalculée par job, jamais source de vérité
- leaderboardKey, userId, periodStart, score, rank   UNIQUE(leaderboardKey, userId, periodStart)
```

## 5.10. Paiements & Marketplace

```text
CoachStripeAccount
- coachId UNIQUE, stripeAccountId, onboardingStatus(PENDING|ACTIVE|RESTRICTED), payoutsEnabled

Subscription
- id, studentId, planId, stripeSubscriptionId, status(ACTIVE|PAST_DUE|CANCELED|INCOMPLETE),
  currentPeriodEnd, createdAt

OneTimePurchase
- id, studentId, planId, stripePaymentIntentId, status(PENDING|SUCCEEDED|FAILED|REFUNDED),
  amount, currency, createdAt

PlatformCommission
- id, sourceType(SUBSCRIPTION|ONE_TIME_PURCHASE), sourceId, coachId,
  grossAmount, commissionAmount, netAmountToCoach, createdAt

PaymentWebhookEvent   -- idempotence stricte
- id, stripeEventId UNIQUE, type, processedAt, payload
```

---

# 6. Architecture Frontend (Expo Router)

## 6.1. Principes

- **Expo Router** (navigation par fichiers), **NativeWind** pour un design system cohérent.
- **Zustand** = état local éphémère uniquement (séance en cours, brouillon de post). **TanStack Query** = tout ce qui vient de l'API (cache, pagination curseur, invalidation ciblée après mutation). Jamais de données serveur dans Zustand.
- Un écran n'appelle jamais `fetch`/`axios` directement : il passe par un hook (`useFeed`, `useActiveWorkout`, `useSocket`) qui encapsule TanStack Query + le service API.

## 6.2. Arborescence

```text
app/
├── (auth)/            login.tsx, register.tsx, forgot-password.tsx
├── (tabs)/
│   ├── _layout.tsx    -- Feed, Explore, Workout, Messages, Profil
│   ├── index.tsx
│   ├── explore.tsx
│   ├── workout.tsx
│   ├── messages.tsx
│   └── profile.tsx
├── clips/index.tsx     -- flux vertical plein écran
├── stories/[userId].tsx
├── coach/
│   ├── apply-certification.tsx
│   ├── manage-plans.tsx
│   └── client-crm.tsx
├── club/[clubId].tsx
├── chat/[conversationId].tsx
├── post/
│   ├── create.tsx
│   └── [postId].tsx
└── _layout.tsx

components/
├── feed/     PostCard, WorkoutSummaryCard, BeforeAfterSlider, ReactionPicker, CommentThread
├── workout/  SetRow, RestTimerOverlay, ExercisePickerModal
├── coach/    CoachCard, PlanSelectorModal, VerificationBadge
├── chat/     AudioVoicePlayer, FormCheckBadge
└── ui/       Button, Input, Avatar, Card

hooks/      useAuth, useFeed, useSocket, useActiveWorkout
store/      authStore, workoutStore, chatStore   (Zustand — état éphémère seulement)
services/   api.ts, authService, postService, coachService, workoutService, socketService
constants/  theme.ts (design tokens), config.ts
types/      models.ts, navigation.ts
```

Règle de composition : un écran assemble des composants `components/<domaine>/`, qui eux-mêmes ne composent que des atomes `components/ui/` — jamais de style dupliqué à la main, jamais de couleur/rayon en dur hors de `theme.ts`.

---

# 7. Guide de Design (tokens & patterns d'écran)

## 7.1. Design tokens

```text
colors:
  background: #0B0B0F      surface: #16161D       surfaceAlt: #1E1E27
  border:     #2A2A35      textPrimary: #F5F5F7    textSecondary: #9A9AA5
  accentPrimary:   #C6FF3D   (lime — CTA, streaks, PR)
  accentSecondary: #FFD166   (or — réservé exclusivement au badge coach certifié + récompenses)
  danger: #FF5A5F

radius:  card 16px · pill 999px · input 12px
typography: display 28/700 · heading 20/600 · body 15/400 · caption 12/500 uppercase
```

## 7.2. Feed (Instagram/Threads)

Bandeau **Stories** horizontal en tête de feed (anneau lime = non vue, gris = vue) → `FlashList horizontal`. Feed vertical `FlashList` (jamais `FlatList` seule à l'échelle). Carte de post : média plein largeur, réactions énergétiques 🔥💪⚡🎯 au lieu d'un like binaire, aperçu de 2 commentaires + lien vers le thread paginé. `WorkoutSummaryCard` = type de post à part entière (volume, PR, durée), pas une image statique.

## 7.3. FitClips (TikTok)

Route plein écran hors tabs, `FlashList` vertical `pagingEnabled`, un clip = un écran, lecture auto du clip visible / pause dès qu'il sort du viewport. Overlay superposé (jamais dans le flux layout) : auteur, caption, tag d'exercice cliquable, son en rotation, colonne d'actions à droite. Préchargement du clip suivant dès mi-scroll.

## 7.4. Clubs / Pages (Facebook)

En-tête couverture + logo + type + bouton contextuel au rôle. Onglets : Fil / Membres / À propos. Un post de club réutilise `PostCard` avec bandeau "posté dans {club}" plutôt qu'un composant dupliqué.

---

# 8. Parcours utilisateurs (User Flows)

## 8.1. Inscription & première connexion

```text
1. Écran (auth)/register.tsx → choix méthode : Email / Google / Apple
2a. Email → saisie email+mdp → POST /auth/register → email de vérification (Resend)
2b. Google/Apple → AuthSession → idToken → POST /auth/oauth/{provider}
     → VerifyOAuthTokenUseCase → FindOrCreateUserFromOAuthUseCase
3. Choix du profil : Athlète ou Coach (le choix Coach ouvre ensuite le flux de certification, mais ne le bloque pas — un coach en attente reste un Athlète fonctionnel)
4. Onboarding : objectif fitness, niveau, unités (kg/lb) → écrit dans le profil
5. Redirection (tabs)/index.tsx (Feed)
```

## 8.2. Séance d'entraînement → partage automatique

```text
1. (tabs)/workout.tsx → "Démarrer une séance" → StartWorkoutSessionUseCase → WorkoutSession(IN_PROGRESS)
2. Ajout d'exercice → ExercisePickerModal → recherche dans Exercise (500+)
3. Pour chaque série : SetRow → AddSetToExerciseUseCase
     → si PR détecté (PersonalRecordCheckerPort) → RestTimerOverlay affiche un feedback visuel immédiat
     → PersonalRecordUnlockedEvent publié → (async) Gamification évalue les badges
4. "Terminer la séance" → CompleteWorkoutSessionUseCase → status COMPLETED, durationSeconds figé
5. Proposition immédiate : générer un WorkoutSummaryCard et le publier comme Post
     → si accepté : CreatePostUseCase(type=WORKOUT_SUMMARY) → apparaît dans le Feed des followers
```

## 8.3. Interaction sociale (like → notification → retour au post)

```text
1. Utilisateur B voit le post dans (tabs)/index.tsx → ReactionPicker → AddReactionUseCase
2. Use Case persiste PostReaction, incrémente la projection reactionsCount, publie ReactionAddedEvent
3. (async) Handler Notifications → crée Notification(type=POST_REACTION) → vérifie NotificationPreference
     → enfile DISPATCH_NOTIFICATION (push + in-app selon préférences de l'auteur A)
4. Auteur A reçoit une notification push → tap → deep link vers post/[postId].tsx
```

## 8.4. Devenir coach certifié

```text
1. profile.tsx → "Devenir coach" → coach/apply-certification.tsx
2. Upload diplôme + carte pro + pièce d'identité → SubmitCertificationUseCase
     → CertificationApplication(SUBMITTED) + CertificationDocument[] (storage privé, URL signée)
3. Notification interne à l'équipe Admin (dashboard NestJS séparé)
4. Admin → revue documents → ApproveCertificationUseCase ou RejectCertificationUseCase
     → CertificationReview append-only créé, jamais de modification rétroactive
5. Si APPROVED → CoachProfile.status = VERIFIED, VerificationBadge (or) affiché partout où le coach apparaît
     → CertificationApprovedEvent → Notification à l'utilisateur
6. Coach débloque coach/manage-plans.tsx → création de CoachingPlan
```

## 8.5. Un athlète s'abonne à un coach

```text
1. explore.tsx → recherche coach → CoachCard (badge vérifié visible) → fiche coach
2. PlanSelectorModal → choix SUBSCRIPTION ou ONE_TIME
3. SUBSCRIPTION → CreateStripeCheckoutSessionUseCase (vérifie CoachStripeAccount.payoutsEnabled)
     → redirection Stripe Checkout → webhook checkout.session.completed
     → PaymentWebhookEvent (idempotent) → CreateSubscriptionUseCase → Subscription(ACTIVE)
     → PlatformCommission calculée serveur (jamais transmise par le client)
4. L'élève apparaît dans coach/client-crm.tsx du coach
5. Ouverture automatique d'une Conversation(DIRECT) coach↔élève si elle n'existe pas déjà
```

## 8.6. Form Check (revue technique vidéo)

```text
1. chat/[conversationId].tsx → élève envoie une vidéo → coche "Demande de Form Check"
     → RequestFormCheckUseCase → FormCheck(PENDING) + ChatMessage(type=FORM_CHECK)
2. Coach ouvre la vidéo → contrôle image par image → enregistre une note vocale timestampée
     → ReviewFormCheckUseCase → FormCheck(REVIEWED), réponse postée dans la conversation
3. FormCheckReviewedEvent → Notification push à l'élève → deep link vers le message
```

## 8.7. Messagerie temps réel

```text
Mobile: useSocket → connexion WSS avec JWT en handshake
   → gateway: authenticate → authorize (ConversationParticipant actif ?) → validate payload
   → SendMessageUseCase (écrit ChatMessage en base — jamais l'inverse)
   → broadcast message:new aux participants connectés (Redis PubSub si multi-instance)
   → accusés SENT → DELIVERED → READ mis à jour via message:delivered / message:read
```

## 8.8. Story & FitClip

```text
Story:
1. post/create.tsx (mode Story) → upload média → CreateStoryUseCase → Story(expiresAt = now+24h)
2. Job planifié PURGE_EXPIRED_STORIES → supprime le média du storage après expiration

FitClip:
1. Upload vidéo verticale → CreateClipUseCase → Clip(status=PROCESSING) — réponse immédiate au client
2. Job TRANSCODE_CLIP (BullMQ) → génère HLS + thumbnail → Clip.status = READY
3. Le flux clips/index.tsx ne sert jamais un clip PROCESSING
```

---

# 9. Convention API & versioning

`/api/v1/...` — la version ne change que sur rupture de contrat réelle (champ supprimé/renommé, type changé, sémantique modifiée), **jamais** sur une nouvelle phase produit ou un changement de design. Versioning par ressource par défaut (`/api/v2/workouts` sans forcer `/api/v2` global) ; cycle `Introduce → Document → Migrate clients → Deprecate → Monitor → Remove`.

---

# 10. Scalabilité

API stateless, coordination WebSocket multi-instance via Redis adapter Socket.io. BullMQ pour tout traitement différable (transcodage, purge stories, badges, notifications, webhooks paiement). Cache Redis sur projections coûteuses (feed, compteurs) invalidé explicitement par les Use Cases concernés. Read replicas PostgreSQL introduits uniquement sur charge mesurée.

---

# 11. Tests, CI/CD, Observabilité

| Couche | Test | Méthode |
|---|---|---|
| Domain | Règles pures (1RM, transitions certification) | Unitaire, zéro mock |
| Application | Use Cases | Repository en mémoire |
| Infrastructure | Repositories Prisma | Intégration, vraie PostgreSQL |
| Presentation | DTO, guards, contrats | E2E parcours critiques |

Pipeline : `Install → Lint → Typecheck → Unit → Build → Integration/E2E → Docker → Staging → Smoke → Prod`. Observabilité minimale : logs structurés, request ID, erreurs, jobs échoués/retries, santé Redis/PostgreSQL — OpenTelemetry en phase Scale.

---

# 12. Roadmap en phases

```text
Fondations → Identité & Auth → Entraînement
    → Social Cœur → Social Feed & Stories (inclut FitClips) → Coaching → Certification
    → Messagerie & Clubs → Form Check → Notifications
    → Gamification → Paiements & Marketplace → Scale & Optimisation
```

Chaque phase est livrable et testable indépendamment des suivantes. Aucune phase ne porte de numéro de version produit — les versions d'API évoluent séparément (section 9).

---

# 13. Décisions d'architecture à ne pas modifier sans justification

| Décision | Règle |
|---|---|
| Clean Architecture | Domain/Application sans dépendance externe |
| Use Case = 1 action | Pas de service fourre-tout |
| Repository = interface + implémentation | Prisma jamais importé hors Infrastructure |
| Événements de domaine | Badges/notifications/commissions jamais calculés en synchrone dans le Use Case déclencheur |
| Auth multi-provider | `AuthIdentity` découplé de `User`, OAuth vérifié côté serveur uniquement |
| Webhooks Stripe | Idempotence via `PaymentWebhookEvent.stripeEventId` |
| Stories/Clips | Média jamais servi avant status `READY` |
| `ConversationParticipant` / `ClubMember` | Seules sources d'autorité sur l'appartenance |
| Design tokens | Toute couleur/rayon vient de `theme.ts` |
| Or (accent secondaire) | Réservé au badge coach certifié et aux récompenses |
| Versioning API | Piloté par la rupture de contrat, jamais par la phase produit |

---

# 14. Conclusion

Ce document consolide en une seule référence : l'architecture Clean (Domain/Application/Infrastructure/Presentation) avec Use Cases et Repositories testables isolément, une authentification multi-provider durcie, la modélisation complète de tous les modules (social, entraînement, coaching, certification, messagerie, contenu éphémère, notifications, gamification, paiements), l'architecture frontend Expo Router avec son design system, et les parcours utilisateurs bout-en-bout qui relient chaque écran à son Use Case backend.

**Priorité : cohérence → sécurité → testabilité → livraison → performance → scalabilité.**
**Document maître : référence unique avant toute nouvelle phase d'implémentation.**
