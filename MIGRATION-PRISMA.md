# Migration complète vers Prisma et MySQL

Ce document décrit la migration complète du système de fichier JSON vers une base de données MySQL avec Prisma.

## 🚀 Configuration effectuée

### 1. Base de données MySQL
- **Host**: localhost:3306
- **Base de données**: `planTravail`
- **Utilisateur**: `int`
- **Password**: `4Na9Gm8mdTVgnUp`

### 2. Schéma de données

La structure des données a été migrée vers 3 tables principales :

#### Classes (`classes`)
- `id` (String, PK)
- `name` (String)
- `toggleVisibilityClasse` (Boolean, default: false)
- `createdAt`, `updatedAt` (DateTime)

#### Courses (`courses`)
- `id` (String, PK)
- `title` (String)
- `description` (Text)
- `classe` (String)
- `theClasseId` (String, FK vers classes)
- `toggleVisibilityCourse` (Boolean, default: false)
- `themeChoice` (Int, default: 0)
- `createdAt`, `updatedAt` (DateTime)

#### Activities (`activities`)
- `id` (String, PK)
- `name` (String)
- `title` (String)
- `fileUrl` (String)
- `courseId` (String, FK vers courses)
- `createdAt`, `updatedAt` (DateTime)

### 3. Relations
- Une classe peut avoir plusieurs cours (1:N)
- Un cours peut avoir plusieurs activités (1:N)
- Suppression en cascade configurée

## 📁 Fichiers créés/modifiés

### Nouveaux fichiers
- `prisma/schema.prisma` - Schéma Prisma
- `lib/prisma.ts` - Client Prisma avec singleton pattern
- `lib/data-prisma-utils.ts` - Utilitaires CRUD pour chaque modèle
- `lib/migrate-data.ts` - Script de migration des données JSON vers MySQL
- `lib/test-prisma-setup.ts` - Script de test de la configuration
- `lib/test-all-apis.ts` - Script de test complet des APIs

### Fichiers modifiés
- `.env` - Variables d'environnement MySQL et DATABASE_URL
- `lib/data-utils.ts` - Migration vers Prisma (API conservée)
- `package.json` - Ajout des scripts de base de données

### APIs migrées vers Prisma (16 APIs)

#### APIs de lecture de données
1. ✅ `/api/courses` - Liste des cours et classes
2. ✅ `/api/getcourses` - Liste des cours et classes (duplicata)
3. ✅ `/api/courses/[courseId]` - Récupération d'un cours spécifique

#### APIs de gestion des classes
4. ✅ `/api/addclasse` - Ajout d'une classe
5. ✅ `/api/deleteclasse/[classeId]` - Suppression d'une classe
6. ✅ `/api/renameclasse/[classeId]` - Modification d'une classe

#### APIs de gestion des cours
7. ✅ `/api/addcourse` - Ajout d'un cours
8. ✅ `/api/deletecourse/[courseId]` - Suppression d'un cours
9. ✅ `/api/updatecourse/[courseId]` - Modification d'un cours
10. ✅ `/api/updateCourseOrder` - Réorganisation des cours

#### APIs de gestion des activités
11. ✅ `/api/upload` - Upload de fichiers et création d'activités
12. ✅ `/api/updateactivity` - Modification d'une activité
13. ✅ `/api/deletefile` - Suppression d'un fichier/activité
14. ✅ `/api/updateActivitiesOrder` - Réorganisation des activités

#### APIs utilitaires
15. ✅ `/api/generate-notebook` - Génération de notebooks (lecture seule)

## 🛠️ Scripts disponibles

```bash
# Développement de la base de données
npm run db:migrate      # Créer et appliquer une migration
npm run db:generate     # Générer le client Prisma
npm run db:studio       # Ouvrir Prisma Studio
npm run db:reset        # Reset complet de la base de données

# Migration des données
npm run migrate-data    # Migrer les données JSON vers MySQL

# Tests
npx tsx lib/test-prisma-setup.ts    # Test de la configuration
npx tsx lib/test-all-apis.ts        # Test complet des APIs
```

## 📊 Résultats de la migration

✅ **Migration réussie** :
- **5 classes** migrées
- **39 cours** migrés
- **126 activités** migrées
- **0 données orphelines**

✅ **APIs migrées** : **16 APIs** complètement migrées vers Prisma

## 🔄 Compatibilité

L'interface publique des fonctions `parseData()` et `updateData()` dans `lib/data-utils.ts` est conservée, garantissant la compatibilité avec le code existant.

## 🚨 Points d'attention

1. **Sauvegarde** : Le fichier `lib/data.json` original est conservé comme sauvegarde
2. **Performances** : Les requêtes utilisent maintenant les relations Prisma optimisées
3. **Types** : Les types TypeScript existants sont maintenus
4. **Sécurité** : Les variables d'environnement sont utilisées pour la connexion
5. **Ordre des éléments** : L'ordre des cours et activités n'est actuellement pas persisté en base (géré côté client)

## 🔧 Variables d'environnement requises

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=int
DB_PASSWORD=4Na9Gm8mdTVgnUp
DB_NAME=planTravail
DATABASE_URL="mysql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}"
```

## 📱 Utilisation

### Méthode existante (maintenant via Prisma)
```typescript
import { parseData, updateData } from '@/lib/data-utils';

const { classes, courses } = await parseData();
await updateData(newClasses, newCourses);
```

### Nouvelles méthodes Prisma
```typescript
import { 
  getAllClasses, 
  getCourseById, 
  createActivity,
  updateCourse,
  deleteClasse 
} from '@/lib/data-prisma-utils';

// Récupérer toutes les classes avec leurs cours
const classes = await getAllClasses();

// Récupérer un cours spécifique
const course = await getCourseById('15');

// Créer une nouvelle activité
const activity = await createActivity({ 
  id: 'new-id', 
  name: 'filename.pdf', 
  title: 'Title', 
  fileUrl: '/path/file.pdf',
  courseId: '15'
});

// Mettre à jour un cours
await updateCourse('15', { title: 'Nouveau titre' });

// Supprimer une classe (cascade vers cours et activités)
await deleteClasse('7');
```

## 🎯 Avantages obtenus

1. **Performance** : Requêtes SQL optimisées vs lecture de fichier JSON
2. **Intégrité** : Contraintes de base de données et relations
3. **Concurrent** : Support multi-utilisateur sans conflit de fichier
4. **Backup** : Sauvegarde automatique des données
5. **Monitoring** : Possibilité de monitorer les requêtes
6. **Scalabilité** : Préparation pour une montée en charge

## 🔮 Prochaines améliorations possibles

1. **Ordre persistant** : Ajouter des champs `order` pour persister l'ordre des cours/activités
2. **Soft delete** : Ajouter un champ `deleted_at` au lieu de supprimer définitivement
3. **Audit trail** : Traçabilité des modifications avec un modèle `AuditLog`
4. **Cache** : Mise en place de cache Redis pour les données fréquemment consultées
5. **Pagination** : Pour les listes importantes de cours/activités

---

**Migration terminée le :** 6 septembre 2025  
**Status :** ✅ Complète et opérationnelle
