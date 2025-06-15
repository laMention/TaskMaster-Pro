// tasksService.test.ts
import { TasksService } from '../services/tasksService';
import type { Task } from '../types/Types';

describe('TasksService', () => {
  let tasksService: TasksService;

  beforeEach(() => {
    // Réinitialiser l'instance avant chaque test
    (TasksService as any).instance = undefined;
    tasksService = TasksService.getInstance();
  });

  describe('Instance de la classe TasksService', () => {
    it('doit renvoyer la même instance lorsqu\'elle est appelée plusieurs fois', () => {
      const instance1 = TasksService.getInstance();
      const instance2 = TasksService.getInstance();
      
      expect(instance1).toBe(instance2);
    });
  });

  describe('getTasks', () => {
    it('doit retourner un tableau de tâches', async () => {
      const tasks = await tasksService.getTasks();
      
      expect(Array.isArray(tasks)).toBe(true);
      expect(tasks.length).toBeGreaterThan(0);
    });

    it('doit retourner les tâches avec la structure correcte', async () => {
      const tasks = await tasksService.getTasks();
      const firstTask = tasks[0];
      
      expect(firstTask).toHaveProperty('id');
      expect(firstTask).toHaveProperty('title');
      expect(firstTask).toHaveProperty('description');
      expect(firstTask).toHaveProperty('priority');
      expect(firstTask).toHaveProperty('status');
      expect(firstTask).toHaveProperty('assignedTo');
      expect(firstTask).toHaveProperty('createdAt');
      expect(firstTask).toHaveProperty('updatedAt');
    });

    it('doit retourner une copie du tableau de tâches', async () => {
      const tasks1 = await tasksService.getTasks();
      const tasks2 = await tasksService.getTasks();
      
      expect(tasks1).not.toBe(tasks2);
      expect(tasks1).toEqual(tasks2);
    });
  });

  describe('getUsers', () => {
    it('doit retourner un tableau d\'utilisateurs', async () => {
      const users = await tasksService.getUsers();
      
      expect(Array.isArray(users)).toBe(true);
      expect(users.length).toBe(3);
    });

    it('doit retourner les utilisateurs avec la structure correcte', async () => {
      const users = await tasksService.getUsers();
      const firstUser = users[0];
      
      expect(firstUser).toHaveProperty('id');
      expect(firstUser).toHaveProperty('name');
      expect(firstUser).toHaveProperty('role');
    });

    it('doit retourner les utilisateurs attendus', async () => {
      const users = await tasksService.getUsers();
      
      expect(users).toEqual([
        { id: '1', name: 'Alice Dupont', role: 'Développeur' },
        { id: '2', name: 'Jean Martin', role: 'Chef de projet' },
        { id: '3', name: 'Sophie Bernard', role: 'Designer UX/UI' }
      ]);
    });
  });

  describe('createTask', () => {
    it('doit créer une nouvelle tâche', async () => {
      const taskData = {
        title: 'Nouvelle tâche',
        description: 'Description de la nouvelle tâche',
        priority: 'medium' as const,
        status: 'todo' as const,
        assignedTo: '1'
      };

      const createdTask = await tasksService.createTask(taskData);
      
      expect(createdTask).toHaveProperty('id');
      expect(createdTask).toHaveProperty('createdAt');
      expect(createdTask).toHaveProperty('updatedAt');
      expect(createdTask.title).toBe(taskData.title);
      expect(createdTask.description).toBe(taskData.description);
      expect(createdTask.priority).toBe(taskData.priority);
      expect(createdTask.status).toBe(taskData.status);
      expect(createdTask.assignedTo).toBe(taskData.assignedTo);
    });

    it('doit ajouter la tâche créée à la liste des tâches', async () => {
      const initialTasks = await tasksService.getTasks();
      const initialCount = initialTasks.length;

      const taskData = {
        title: 'Test Task',
        description: 'Test Description',
        priority: 'low' as const,
        status: 'todo' as const,
        assignedTo: '2'
      };

      await tasksService.createTask(taskData);
      const updatedTasks = await tasksService.getTasks();
      
      expect(updatedTasks.length).toBe(initialCount + 1);
      expect(updatedTasks.some(task => task.title === 'Test Task')).toBe(true);
    });

    it('doit générer des identifiants uniques pour les tâches différentes', async () => {
      const taskData1 = {
        title: 'Tache 1',
        description: 'Description 1',
        priority: 'high' as const,
        status: 'todo' as const,
        assignedTo: '1'
      };

      const taskData2 = {
        title: 'Tache 2',
        description: 'Description 2',
        priority: 'medium' as const,
        status: 'in-progress' as const,
        assignedTo: '2'
      };

      const task1 = await tasksService.createTask(taskData1);
      // Petit délai pour s'assurer que les timestamps sont différents
      await new Promise(resolve => setTimeout(resolve, 1));
      const task2 = await tasksService.createTask(taskData2);
      
      expect(task1.id).not.toBe(task2.id);
    });
  });

  describe('updateTask', () => {
    it('doit mettre à jour une tâche existante', async () => {
      const tasks = await tasksService.getTasks();
      const existingTask = tasks[0];
      
      const updates = {
        title: 'Titre mis à jour',
        status: 'completed' as const
      };

      const updatedTask = await tasksService.updateTask(existingTask.id, updates);
      
      expect(updatedTask.id).toBe(existingTask.id);
      expect(updatedTask.title).toBe(updates.title);
      expect(updatedTask.status).toBe(updates.status);
      expect(updatedTask.description).toBe(existingTask.description); // unchanged
      expect(updatedTask.updatedAt).toBe(existingTask.updatedAt);
    });

    it('doit lancer une erreur lorsque la tâche n\'est pas trouvée', async () => {
      const nonExistentId = 'non-existent-id';
      const updates = { title: 'Nouveau titre' };
      
      await expect(tasksService.updateTask(nonExistentId, updates))
        .rejects.toThrow('Tache non trouvee');
    });

    it('doit mettre à jour la tâche dans la liste des tâches', async () => {
      const tasks = await tasksService.getTasks();
      const taskToUpdate = tasks[0];
      const newTitle = 'Titre mis à jour';
      
      await tasksService.updateTask(taskToUpdate.id, { title: newTitle });
      
      const updatedTasks = await tasksService.getTasks();
      const updatedTask = updatedTasks.find(task => task.id === taskToUpdate.id);
      
      expect(updatedTask?.title).toBe(newTitle);
    });
  });

  describe('deleteTask', () => {
    it('doit supprimer une tâche existante', async () => {
      const initialTasks = await tasksService.getTasks();
      const taskToDelete = initialTasks[0];
      
      await tasksService.deleteTask(taskToDelete.id);
      
      const remainingTasks = await tasksService.getTasks();
      expect(remainingTasks.length).toBe(initialTasks.length - 1);
      expect(remainingTasks.some(task => task.id === taskToDelete.id)).toBe(false);
    });

    it('doit lancer une erreur lorsque la tâche n\'est pas trouvée', async () => {
      const nonExistentId = 'non-existent-id';
      
      await expect(tasksService.deleteTask(nonExistentId))
        .rejects.toThrow('Tache non trouvee');
    });
  });

  describe('Integrité des données', () => {
    it('doit maintenir l\'intégrité des données après plusieurs opérations', async () => {
      // Créer une tâche
      const newTask = await tasksService.createTask({
        title: 'Nouvelle tâche a tester',
        description: 'Test Description',
        priority: 'medium',
        status: 'todo',
        assignedTo: '1'
      });

      // Mettre à jour la tâche
      const updatedTask = await tasksService.updateTask(newTask.id, {
        status: 'in-progress'
      });

      // Vérifier que la mise à jour est persistée
      const allTasks = await tasksService.getTasks();
      const foundTask = allTasks.find(task => task.id === newTask.id);
      
      expect(foundTask?.status).toBe('in-progress');
      expect(foundTask?.title).toBe('Nouvelle tâche a tester');

      // Supprimer la tâche
      await tasksService.deleteTask(newTask.id);
      
      const finalTasks = await tasksService.getTasks();
      expect(finalTasks.some(task => task.id === newTask.id)).toBe(false);
    });
  });
});