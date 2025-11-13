# Migration de uniqueIds.json vers la base de données

## 📋 Résumé des modifications

Ce document décrit les modifications effectuées pour remplacer l'utilisation du fichier `uniqueIds.json` par une table de base de données Prisma.

## 🎯 Objectifs

1. Remplacer le fichier JSON `uniqueIds.json` par une table `notebook_sessions` dans la base de données
2. Ajouter les identifiants de cours (`courseId`) et d'activité (`activityId`) aux sessions de notebooks
3. Empêcher le chargement de notebooks si le cours ou l'activité est désactivé(e)

## 🗄️ Nouvelle table : `notebook_sessions`

### Structure de la table

```prisma
model NotebookSession {
  id               String   @id @default(uuid())
  uniqueId         String   @unique
  dirPath          String
  originalFileName String
  userName         String
  courseId         Int
  activityId       String
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt

  // Relations
  course   Course   @relation(fields: [courseId], references: [id], onDelete: Cascade)
  activity Activity @relation(fields: [activityId], references: [id], onDelete: Cascade)

  @@index([uniqueId])
  @@index([courseId])
  @@index([activityId])
  @@map("notebook_sessions")
}
```

### Index et contraintes

- **Clé primaire** : `id` (UUID)
- **Unique** : `uniqueId` (code à 6 caractères)
- **Index** : `uniqueId`, `courseId`, `activityId`
- **Clés étrangères** :
  - `courseId` → `courses.id` (CASCADE)
  - `activityId` → `activities.id` (CASCADE)

## 📝 Fichiers modifiés

### 1. Schema Prisma (`prisma/schema.prisma`)

- ✅ Ajout de la table `NotebookSession`
- ✅ Ajout de la relation `notebookSessions` dans `Course`
- ✅ Ajout de la relation `notebookSessions` dans `Activity`

### 2. API Routes

#### `/app/api/verifyNotebook/route.ts`

**Avant :**
- Lisait le fichier `uniqueIds.json`
- Recherchait l'`uniqueId` dans le tableau JSON

**Après :**
- Utilise Prisma pour interroger la table `notebook_sessions`
- Vérifie si le cours est désactivé (`isDisabled` ou `isHidden`)
- Vérifie si l'activité est désactivée (`isDisabled` ou `isHidden`)
- Retourne un message d'erreur approprié si désactivé

#### `/app/api/generate-notebook/route.ts`

**Avant :**
- Générait un `uniqueId` en vérifiant le fichier JSON
- Stockait les données dans `uniqueIds.json`

**Après :**
- Génère un `uniqueId` en vérifiant la base de données
- Stocke les données dans la table `notebook_sessions` avec `courseId` et `activityId`
- Utilise Prisma pour créer l'enregistrement

### 3. Composants React

#### `/components/courses/activity-display.tsx`

**Modifications :**
- ✅ Affiche le message d'erreur retourné par l'API (ex: "Ce cours est actuellement désactivé")
- ✅ Vérifie si l'activité est désactivée avant de permettre le clic
- ✅ Affiche un toast d'erreur si l'activité est désactivée

#### `/components/courses/activity-list.tsx`

**Modifications :**
- ✅ Vérifie si l'activité est désactivée avant de générer un notebook
- ✅ Affiche un toast d'erreur si l'activité est désactivée
- ✅ Empêche la génération de notebooks pour les activités désactivées

## 🔄 Migration des données

### Script de migration

Le script `scripts/migrate-uniqueids-to-db.ts` permet de migrer les données existantes de `uniqueIds.json` vers la base de données.

**Usage :**
```bash
npx ts-node scripts/migrate-uniqueids-to-db.ts
```

**Fonctionnalités :**
- Lit le fichier `uniqueIds.json`
- Pour chaque entrée :
  - Extrait le nom du fichier original du `dirPath`
  - Recherche l'activité correspondante dans la base de données
  - Récupère le `courseId` et `activityId`
  - Crée l'enregistrement dans `notebook_sessions`
- Affiche un résumé détaillé de la migration

**Exemple de sortie :**
```
🔄 Démarrage de la migration des données...
📊 25 entrées trouvées dans uniqueIds.json
✅ Session migrée: ABC123 (Jean)
✅ Session migrée: DEF456 (Marie)
⏭️  Session déjà migrée: GHI789
⚠️  Impossible de trouver le courseId ou activityId pour: JKL012

📈 Résumé de la migration:
  ✅ Migrées: 22
  ⏭️  Ignorées (déjà existantes): 2
  ❌ Erreurs: 1
  📊 Total: 25
```

### Migration SQL manuelle

Si nécessaire, vous pouvez également utiliser le script SQL :
```bash
mysql -u int -p'4Na9Gm8mdTVgnUp' planTravail < prisma/manual_migration_notebook_sessions.sql
```

## ✅ Validation et tests

### Vérifier la création de la table

```bash
mysql -u int -p'4Na9Gm8mdTVgnUp' planTravail -e "DESCRIBE notebook_sessions;"
```

### Vérifier les données migrées

```bash
mysql -u int -p'4Na9Gm8mdTVgnUp' planTravail -e "SELECT COUNT(*) as total FROM notebook_sessions;"
```

### Regénérer le client Prisma

```bash
npx prisma generate
```

## 🚀 Déploiement

1. **Créer la table dans la base de données**
   ```bash
   mysql -u int -p'4Na9Gm8mdTVgnUp' planTravail < prisma/manual_migration_notebook_sessions.sql
   ```

2. **Regénérer le client Prisma**
   ```bash
   npx prisma generate
   ```

3. **Migrer les données existantes** (optionnel)
   ```bash
   npx ts-node scripts/migrate-uniqueids-to-db.ts
   ```

4. **Tester les fonctionnalités**
   - Charger un notebook avec un code existant
   - Générer un nouveau notebook
   - Vérifier qu'un notebook ne peut pas être chargé si le cours/activité est désactivé

5. **Supprimer le fichier JSON** (après validation)
   ```bash
   # Sauvegarder d'abord
   cp public/jupyterServerWork/uniqueIds.json public/jupyterServerWork/uniqueIds.json.backup
   
   # Puis supprimer
   rm public/jupyterServerWork/uniqueIds.json
   ```

## 🔒 Nouvelles fonctionnalités de sécurité

### Validation de désactivation

Les notebooks ne peuvent plus être chargés si :

1. **Le cours est désactivé** :
   - `course.isDisabled = true`
   - `course.isHidden = true`
   - Message : "Ce cours est actuellement désactivé"

2. **L'activité est désactivée** :
   - `activity.isDisabled = true`
   - `activity.isHidden = true`
   - Message : "Cette activité est actuellement désactivée"

### Points de validation

- ✅ `/api/verifyNotebook` : Vérifie avant de charger un notebook existant
- ✅ `activity-display.tsx` : Vérifie au clic sur une activité
- ✅ `activity-list.tsx` : Vérifie avant de générer un nouveau notebook

## 📊 Avantages de la migration

1. **Performance** : Les requêtes SQL sont plus rapides que la lecture de fichiers JSON
2. **Relations** : Les relations avec `Course` et `Activity` sont automatiquement gérées
3. **Sécurité** : Validation automatique de l'état des cours et activités
4. **Cascade** : Suppression automatique des sessions si un cours/activité est supprimé
5. **Scalabilité** : Meilleure gestion des données volumineuses
6. **Requêtes avancées** : Possibilité de faire des statistiques et des filtres complexes

## 🔮 Futures améliorations possibles

- Ajouter un champ `lastAccessedAt` pour tracker l'utilisation
- Ajouter un champ `status` pour gérer les états (active, expired, archived)
- Implémenter une durée d'expiration des sessions
- Ajouter des statistiques d'utilisation par cours/activité
- Implémenter un système de nettoyage automatique des sessions inactives

## 📞 Support

En cas de problème :
1. Vérifier les logs de l'application
2. Vérifier que la table `notebook_sessions` existe
3. Vérifier les contraintes de clés étrangères
4. S'assurer que le client Prisma a été regénéré

---

**Date de migration** : 13 novembre 2025
**Version Prisma** : 6.15.0
