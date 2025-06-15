1. Architecture Technique
  1.1 Stack Technologique
    Frontend: React avec TypeScript
    Build Tool: Vite
    Styling: Tailwind CSS
    Testing: Jest
    Package Manager: pnpm
    Containerisation: Docker
  1.2 Structure du Projet
      src/
    ├── assets/         # Ressources statiques
    ├── components/     # Composants réutilisables
    ├── contexts/       # Contextes React
    ├── reducers/       # Reducers pour la gestion d'état
    ├── services/       # Services métier
    ├── styles/         # Styles globaux
    ├── tests/          # Tests unitaires
    ├── types/          # Types TypeScript
    └── views/          # Composants de vue
2. Choix de l'architecture
  2.1 Pattern Singleton pour TasksService
    Le service de gestion des tâches implémente le pattern Singleton pour garantir :
    Une seule instance du service dans l'application
    Un accès global et cohérent aux données
    Une meilleure gestion de la mémoire

    class TasksService {
      private static instance: TasksService;
      
      public static getInstance(): TasksService {
        if (!TasksService.instance) {
          TasksService.instance = new TasksService();
        }
        return TasksService.instance;
      }
    }
  2.2 Gestion d'État
    Utilisation de Context API pour la gestion d'état globale
    Séparation claire entre les données et la logique métier
    Pattern Reducer pour les modifications d'état
  2.3 Tests Unitaires
    La stratégie de test suit les principes suivants :
    Tests pour le composant principal
    Mocking des dépendances
    Tests asynchrones pour les opérations CRUD
    Vérification de l'intégrité des données
3. Fonctionnalités Principales
  3.1 Gestion des Tâches
    Création de tâches avec validation
    Mise à jour des tâches existantes
    Suppression de tâches
    Filtrage et tri des tâches
  3.2 Gestion des Utilisateurs
    Liste des utilisateurs prédéfinis
    Attribution des tâches aux utilisateurs
    Rôles utilisateurs (Développeur, Chef de projet, Designer)
  3.3 Structure des Données
    interface Task {
      id: string;
      title: string;
      description: string;
      priority: 'low' | 'medium' | 'high';
      status: 'todo' | 'in-progress' | 'completed';
      assignedTo: string;
      createdAt: Date;
      updatedAt: Date;
    }

    interface User {
      id: string;
      name: string;
      role: string;
    }
5. Tests et Qualité
  5.1 Tests Unitaires
    Les tests couvrent :
    Création de tâches
    Mise à jour de tâches
    Suppression de tâches
    Gestion des erreurs
    Intégrité des données
  5.2 Qualité du Code
    Utilisation de TypeScript pour la sécurité du typage
    ESLint pour la qualité du code
    Formatage automatique avec Prettier
6. Déploiement
  6.1 Containerisation
    Dockerfile pour la conteneurisation
    Configuration multi-stage pour optimiser la taille de l'image
    Variables d'environnement pour la configuration
  6.2 Build et Déploiement
    # Build de l'application
    pnpm build

    # Build du container
    docker build -t taskmaster-pro .

    # Lancement du container
    docker run -p 3000:5173 taskmaster-pro
7. Pipeline CI/CD
    Le pipeline est configure dans .github/workflows/ci-cd.yml l'automatisation du deploiement a partir de github action
  7.2. Étapes du Pipeline
    7.2.1 Installation et Configuration
     Voir le fichier ci-cd.yml
     Ce que fait ce pipeline :
     Configuration de nginx.conf. il a pour role de:
      - Définir le port d'écoute (80)
      - Spécifier le répertoire racine des fichiers statiques
      - Configurer la page d'index par défaut
     Étape Test :
      - Installe les dépendances Node.js
      - Lance le linter et les tests
      - Build l'application pour vérifier qu'elle compile
    Étape Build & Push :
      - Construit l'image Docker
      - La pousse vers GitHub Container Registry (ghcr.io)
      - Utilise le cache pour optimiser les builds
    Étape Deploy :
      - Se déclenche uniquement sur la branche main
8- Comment recuperer le projet
  cloner le projet via https https://github.com/laMention/TaskMaster-Pro.git ou ssh git@github.com:laMention/TaskMaster-Pro.git (ne pas oublier d'avoir une cle ssh pour faire cette action)