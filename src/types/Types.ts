// ==================== TYPES & INTERFACES ====================

// Interface pour les taches
export interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  status: 'todo' | 'in-progress' | 'completed';
  assignedTo: string;
  createdAt: string;
  updatedAt: string;
}

// Interface pour les utilisateurs
export interface User {
  id: string;
  name: string;
  role: string;
}

// Interface pour l'etat de l'application
export interface AppState {
  tasks: Task[];
  users: User[];
  filters: {
    status: string;
    priority: string;
    assignedTo: string;
    search: string;
  };
  loading: boolean;
  error: string | null;
}

// Le type de theme pour l'application
export type ThemeType = 'material' | 'shadcn';
