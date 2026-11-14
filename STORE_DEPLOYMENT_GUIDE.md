# 📱 Guide Complet de Publication sur les Stores : Apple App Store & Google Play Store

Ce guide détaille les étapes exactes pour compiler et publier l'application mobile **FitConnect** sur l'**Apple App Store** et le **Google Play Store** en utilisant **Expo Application Services (EAS Build)**.

---

## 🛠️ 1. Prérequis & Outils

1. **Installer l'outil officiel EAS CLI** :
   ```bash
   npm install -g eas-cli
   ```
2. **Se connecter à votre compte Expo** (créez-en un gratuitement sur [expo.dev](https://expo.dev)) :
   ```bash
   eas login
   ```
3. **Associer le projet à votre compte Expo** :
   ```bash
   cd "C:\Users\abash\Desktop\FITCONNECT PROJECT\fitConnect"
   eas project:init
   ```

---

## 🤖 2. Publication sur le Google Play Store (Android)

### Option A : Générer un fichier `.APK` de test direct (Installable immédiatement sur n'importe quel téléphone Android)
```bash
eas build --profile preview --platform android
```
> Dès la fin de la compilation dans le Cloud Expo, vous recevrez un lien de téléchargement et un QR code pour installer l'application immédiatement.

### Option B : Générer le Bundle de Production `.AAB` pour le Google Play Store
```bash
eas build --profile production --platform android
```
- Le build produit un fichier `.aab` (Android App Bundle) optimisé et signé automatiquement par EAS.
- **Soumission directe** sur la Google Play Console :
  ```bash
  eas submit --platform android
  ```

---

## 🍏 3. Publication sur l'Apple App Store & TestFlight (iOS)

### Prérequis Apple :
- Un compte [Apple Developer Program](https://developer.apple.com/) (99$/an).

### Étape 1 : Générer le Build iOS pour TestFlight & App Store
```bash
eas build --profile production --platform ios
```
- EAS configure automatiquement vos certificats de signature (*Distribution Certificate & Provisioning Profiles*).
- Vous pouvez choisir de laisser EAS gérer tous les certificats de manière 100% automatisée.

### Étape 2 : Envoyer sur App Store Connect / TestFlight
```bash
eas submit --platform ios
```
L'application apparaîtra automatiquement dans votre tableau de bord **TestFlight** pour vos bêta-testeurs et sera prête pour validation par l'équipe Apple.

---

## 🌐 4. Pointer vers l'API de Production

Avant de lancer les builds de production, assurez-vous de configurer l'URL de votre serveur VPS dans `fitConnect/.env` ou dans `fitConnect/eas.json` :

```env
EXPO_PUBLIC_API_URL=https://api.votre-domaine.com/api/v1
EXPO_PUBLIC_SOCKET_URL=https://api.votre-domaine.com
```

---

## 📋 Checklist de Validation Avant Soumission aux Stores

| Élément | État | Commentaire |
| :--- | :---: | :--- |
| **Identifiant de bundle** | `com.fitconnect.app` | Configuré dans `app.json` |
| **Numéro de version** | `1.0.0` (Code: 1) | Configuré dans `app.json` |
| **Autorisations Caméra / Micro** | Validées | Textes explicatifs configurés pour Apple App Review |
| **Splash Screen & Icône** | Validées | Thème sombre immersif `#0B0B0F` |
| **Mode Hors-Ligne & Erreurs** | Résilient | Pas de crash si le réseau est temporairement coupé |
