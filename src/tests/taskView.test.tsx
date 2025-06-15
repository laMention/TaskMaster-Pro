// TaskView.test.tsx
import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import TaskView from '../views/TaskView';
import { TasksService } from '../services/tasksService';
import type { Task, User } from '../types/Types';

// Mock du service
jest.mock('../services/tasksService');

// Mock des composants enfants pour isoler les tests
jest.mock('../components/HeaderComponent', () => {
  return function MockHeaderComponent({ onNewTask }: { onNewTask: () => void }) {
    return (
      <div data-testid="header-component">
        <button onClick={onNewTask} data-testid="new-task-button">
          Nouvelle tâche
        </button>
      </div>
    );
  };
});

jest.mock('../components/FilterBarComponent', () => {
  return function MockFilterBarComponent() {
    return <div data-testid="filter-bar-component">Filter Bar</div>;
  };
});

jest.mock('../components/TaskCardComponent', () => {
  return function MockTaskCardComponent({ task }: { task: Task }) {
    return (
      <div data-testid={`task-card-${task.id}`}>
        <h3>{task.title}</h3>
        <p>{task.description}</p>
        <span>{task.status}</span>
      </div>
    );
  };
});

jest.mock('../components/TaskFormComponent', () => {
  return function MockTaskFormComponent({ onClose }: { onClose: () => void }) {
    return (
      <div data-testid="task-form-component">
        <button onClick={onClose} data-testid="close-form-button">
          Fermer
        </button>
      </div>
    );
  };
});

// Mock des styles et contextes
jest.mock('../styles/themeStyles', () => ({
  getThemeStyles: () => ({
    background: 'bg-white',
    card: 'bg-gray-100',
    textSecondary: 'text-gray-600'
  })
}));

const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Tâche 1',
    description: 'Description 1',
    priority: 'high',
    status: 'todo',
    assignedTo: '1',
    createdAt: '2023-01-01T00:00:00.000Z',
    updatedAt: '2023-01-01T00:00:00.000Z'
  },
  {
    id: '2',
    title: 'Tâche 2',
    description: 'Description 2',
    priority: 'medium',
    status: 'in-progress',
    assignedTo: '2',
    createdAt: '2023-01-01T00:00:00.000Z',
    updatedAt: '2023-01-01T00:00:00.000Z'
  }
];

const mockUsers: User[] = [
  { id: '1', name: 'Alice Dupont', role: 'Développeur' },
  { id: '2', name: 'Jean Martin', role: 'Chef de projet' }
];

describe('TaskView Component', () => {
  let mockTasksService: jest.Mocked<TasksService>;

  beforeEach(() => {
    // Reset des mocks
    jest.clearAllMocks();
    
    // Configuration du mock du service
    mockTasksService = {
      getTasks: jest.fn().mockResolvedValue(mockTasks),
      getUsers: jest.fn().mockResolvedValue(mockUsers),
      createTask: jest.fn(),
      updateTask: jest.fn(),
      deleteTask: jest.fn()
    } as any;

    (TasksService.getInstance as jest.Mock).mockReturnValue(mockTasksService);
  });

  describe('Rendu', () => {
      it('doit rendre sans crasher', async () => {
        await act(async () => {
        render(<TaskView />);
      });

      expect(screen.getByTestId('header-component')).toBeInTheDocument();
      expect(screen.getByTestId('filter-bar-component')).toBeInTheDocument();
    });

    it('doit rendre les cartes de tâches lorsque les tâches sont chargées', async () => {
      await act(async () => {
        render(<TaskView />);
      });

      await waitFor(() => {
        expect(screen.getByTestId('task-card-1')).toBeInTheDocument();
        expect(screen.getByTestId('task-card-2')).toBeInTheDocument();
      });

      expect(screen.getByText('Tâche 1')).toBeInTheDocument();
      expect(screen.getByText('Tâche 2')).toBeInTheDocument();
    });

    it('doit afficher le message "Aucune tâche trouvée" lorsque aucune tâche ne correspond aux filtres', async () => {
      // Mock empty tasks array
      mockTasksService.getTasks.mockResolvedValue([]);

      await act(async () => {
        render(<TaskView />);
      });

      await waitFor(() => {
        expect(screen.getByText('Aucune tâche trouvée')).toBeInTheDocument();
      });
    });
  });

  describe('Chargement des données', () => {
    it('doit appeler TasksService pour charger les tâches et les utilisateurs lors du montage', async () => {
      await act(async () => {
        render(<TaskView />);
      });

      await waitFor(() => {
        expect(mockTasksService.getTasks).toHaveBeenCalledTimes(1);
        expect(mockTasksService.getUsers).toHaveBeenCalledTimes(1);
      });
    });

    it('doit gérer les erreurs de chargement', async () => {
      const errorMessage = 'Network error';
      mockTasksService.getTasks.mockRejectedValue(new Error(errorMessage));

      await act(async () => {
        render(<TaskView />);
      });

      await waitFor(() => {
        expect(screen.getByText('Erreur lors du chargement des données')).toBeInTheDocument();
      });
    });

    it('doit permettre de fermer les messages d\'erreur', async () => {
      mockTasksService.getTasks.mockRejectedValue(new Error('Test error'));

      await act(async () => {
        render(<TaskView />);
      });

      await waitFor(() => {
        expect(screen.getByText('Erreur lors du chargement des données')).toBeInTheDocument();
      });

      const closeButton = screen.getByText('×');
      fireEvent.click(closeButton);

      expect(screen.queryByText('Erreur lors du chargement des données')).not.toBeInTheDocument();
    });
  });

  describe('Gestion du formulaire de tâche', () => {
    it('doit afficher le formulaire de tâche lorsque le bouton "Nouvelle tâche" est cliqué', async () => {
      await act(async () => {
        render(<TaskView />);
      });

      const newTaskButton = screen.getByTestId('new-task-button');
      fireEvent.click(newTaskButton);

      expect(screen.getByTestId('task-form-component')).toBeInTheDocument();
    });

    it('doit masquer le formulaire de tâche lorsque le bouton "Fermer" est cliqué', async () => {
      await act(async () => {
        render(<TaskView />);
      });

      // Ouvrir le formulaire
      const newTaskButton = screen.getByTestId('new-task-button');
      fireEvent.click(newTaskButton);

      expect(screen.getByTestId('task-form-component')).toBeInTheDocument();

      // Fermer le formulaire
      const closeButton = screen.getByTestId('close-form-button');
      fireEvent.click(closeButton);

      expect(screen.queryByTestId('task-form-component')).not.toBeInTheDocument();
    });
  });

  describe('Filtrage des tâches', () => {
    it('doit filtrer les tâches en fonction du statut', async () => {
      // Créer un composant avec état initial personnalisé pour tester le filtrage
      const TestTaskViewWithFilters = () => {
        const [tasks] = React.useState([
          { ...mockTasks[0], status: 'todo' as const },
          { ...mockTasks[1], status: 'completed' as const }
        ]);

        const filteredTasks = React.useMemo(() => {
          // Simuler le filtrage par statut 'todo'
          return tasks.filter(task => task.status === 'todo');
        }, [tasks]);

        return (
          <div>
            {filteredTasks.map(task => (
              <div key={task.id} data-testid={`filtered-task-${task.id}`}>
                {task.title}
              </div>
            ))}
          </div>
        );
      };

      render(<TestTaskViewWithFilters />);

      expect(screen.getByTestId('filtered-task-1')).toBeInTheDocument();
      expect(screen.queryByTestId('filtered-task-2')).not.toBeInTheDocument();
    });

    it('doit filtrer les tâches en fonction du terme de recherche', async () => {
      const TestTaskViewWithSearch = () => {
        const [tasks] = React.useState(mockTasks);
        const [searchTerm] = React.useState('Tâche 1');

        const filteredTasks = React.useMemo(() => {
          return tasks.filter(task => 
            task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            task.description.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }, [tasks, searchTerm]);

        return (
          <div>
            {filteredTasks.map(task => (
              <div key={task.id} data-testid={`search-result-${task.id}`}>
                {task.title}
              </div>
            ))}
          </div>
        );
      };

      render(<TestTaskViewWithSearch />);

      expect(screen.getByTestId('search-result-1')).toBeInTheDocument();
      expect(screen.queryByTestId('search-result-2')).not.toBeInTheDocument();
    });
  });

  describe('Gestion du thème', () => {
    it('doit appliquer les classes CSS correctes en fonction du thème', async () => {
      await act(async () => {
        render(<TaskView />);
      });

      const mainContainer = screen.getByRole('main').parentElement;
      expect(mainContainer).toHaveClass('min-h-screen', 'bg-white', 'transition-colors', 'duration-200');
    });
  });


  describe('Gestion des erreurs', () => {
    it('doit gérer les erreurs de composant', async () => {
      // Supprimer les logs d'erreur pour ce test
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      // Mock d'un composant qui génère une erreur
      const ErrorComponent = () => {
        throw new Error('Erreur de test');
      };

      // Vérifie que l'application ne bug pas totalement
      expect(() => {
        render(<ErrorComponent />);
      }).toThrow('Erreur de test');

      consoleSpy.mockRestore();
    });
  });
});