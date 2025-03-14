# Site de Physique chimie par M. Sekrane - Plateforme éducative

Une plateforme éducative complète basée sur Next.js pour gérer des cours, des activités et du contenu interactif.

## Aperçu

PC Sekrane est un système de gestion de cours complet conçu pour offrir une expérience d'apprentissage interactive. La plateforme permet aux enseignants d'organiser des cours par classe, de télécharger différents types de matériels pédagogiques, et permet aux étudiants d'interagir avec le contenu, y compris les notebooks Python via l'intégration de Jupyter.

## Fonctionnalités

### Gestion des Cours

- **Organisation des Cours**: Créer, mettre à jour et supprimer des cours organisés par classes
- **Gestion des Activités**: Support pour divers types de fichiers (PDF, images, vidéos, fichiers audio, notebooks Python)
- **Options d'Affichage Flexibles**: Plusieurs options de mise en page pour afficher le contenu du cours (accordéon, mise en page groupée verticale)

### Types de Contenu Supportés

- **Documents**: Visionneuse PDF avec zoom et contrôles de navigation
- **Notebooks Python**: Intégration de Jupyter avec authentification
- **Vidéos**: Lecteur vidéo personnalisé avec contrôles
- **Images**: Affichage d'images avec fonctionnalité de zoom
- **Audio**: Lecteur audio avec affichage des métadonnées
- **Autres Fichiers**: Affichage des métadonnées et options de téléchargement

### Fonctionnalités Interactives

- **Vue Côte à Côte**: Travailler avec deux types de contenu différents simultanément
- **Écran Partagé**: Panneaux redimensionnables pour comparer du contenu
- **Jeux Éducatifs**: Fonctionnalités de quiz et de jeux intégrées (rébus, énigmes, structure, conquête)

### Administration

- **Portail d'Administration**: Tableau de bord sécurisé pour gérer tout le contenu
- **Surveillance du Système**: Suivi de l'utilisation des ressources (CPU, RAM, réseau)
- **Gestion des Sessions Utilisateurs**: Suivre et gérer les sessions utilisateurs

## Architecture Technique

### Frontend

- Construit avec Next.js et React
- Design responsive utilisant Tailwind CSS
- Composants UI provenant de diverses bibliothèques, notamment Material UI et des composants personnalisés

### Backend

- Routes API Next.js servant de points de terminaison backend
- Stockage de données basé sur le système de fichiers
- Intégration de base de données MySQL pour les données de session et les fonctionnalités de jeux

### Points de Terminaison API

#### Gestion des Cours

- */api/courses*: Obtenir tous les cours
- */api/courses/[courseId]*: Obtenir un cours spécifique
- */api/addcourse*: Ajouter un nouveau cours
- */api/updatecourse/[courseId]*: Mettre à jour les détails du cours
- */api/updateCourseOrder*: Réorganiser les cours
- */api/deletecourse/[courseId]*: Supprimer un cours

#### Gestion des Classes

- */api/addclasse*: Ajouter une nouvelle classe
- */api/renameclasse/[classeId]*: Renommer une classe
- */api/deleteclasse/[classeId]*: Supprimer une classe

#### Gestion des Fichiers

- */api/upload*: Téléverser des fichiers
- */api/deletefile*: Supprimer des fichiers
- */api/file-metadata*: Obtenir les métadonnées d'un fichier
- */api/files/[...filePath]*: Servir des fichiers

#### Gestion des Activités

- */api/updateactivity*: Mettre à jour les détails d'une activité
- */api/updateActivitiesOrder*: Réorganiser les activités

#### Intégration Jupyter

- */api/generate-notebook*: Générer des notebooks Jupyter
- */api/jupyter-list*: Lister les serveurs Jupyter disponibles
- */api/verifyNotebook*: Vérifier l'authentification du notebook
- */api/init-session*: Initialiser les sessions de notebook

#### Authentification & Administration

- */api/admin*: Authentification administrateur
- */api/admin/logout*: Déconnexion administrateur
- */api/clear-cache*: Effacer le cache du serveur

#### Statistiques & Surveillance

- */api/stats*: Fonctionnalités d'analyse statistique
- */api/monitor*: Surveillance des ressources système

#### Jeux Éducatifs

- */api/fetch-questions*: Récupérer les questions du jeu
- */api/verify-answer*: Vérifier l'exactitude de la réponse
- */api/get-session*: Obtenir les données de session du jeu
- */api/rebus*: Servir des images de rébus
- */api/indices*: Servir des images d'indices de jeu

## Composants

L'application utilise une variété de composants pour différentes fonctionnalités:

- **ActivityList**: Affiche les activités du cours dans différentes dispositions
- **ActivityDisplay**: Composant principal pour visualiser le contenu du cours
- **VideoActions**: Interface de lecteur vidéo personnalisée
- **ImageZoom**: Visionneuse d'image avec capacités de zoom

## Configuration & Installation

L'application nécessite:

1. Node.js et npm
2. Base de données MySQL pour les fonctionnalités de jeu
3. Configuration du serveur Jupyter pour l'intégration des notebooks
4. Configuration des variables d'environnement:
   - Identifiants de base de données
   - Clés secrètes JWT
   - Identifiants d'authentification administrateur

## Déploiement

L'application est configurée pour un déploiement basé sur Linux avec des structures de dossiers spécifiques pour les fichiers publics et l'organisation du contenu.

## Fonctionnalités de Sécurité

- Authentification basée sur JWT pour l'accès administrateur
- Validation des chemins de fichiers pour empêcher la traversée de répertoire
- Assainissement du contenu pour le contenu généré par l'utilisateur
- Contrôle d'accès basé sur les sessions pour les notebooks
