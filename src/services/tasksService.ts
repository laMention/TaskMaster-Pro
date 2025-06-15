import type { Task, User } from "../types/Types";

export class TasksService {
    private static instance: TasksService;
    private tasks: Task[] = [];
    private users: User[] = [
        { id: '1', name: 'Alice Dupont', role: 'Développeur' },
        { id: '2', name: 'Jean Martin', role: 'Chef de projet' },
        { id: '3', name: 'Sophie Bernard', role: 'Designer UX/UI' }
    ];

    // Recuperer l'instance de TasksService
    static getInstance(): TasksService {
        if (!TasksService.instance) {
            TasksService.instance = new TasksService();
        }
        return TasksService.instance;
    }

    // Initialiser les taches
    private constructor() {
        this.initializeTasks();
    }

    // Initialiser les taches avec des donnees
    private initializeTasks() : void {
        this.tasks = [
            {
                id: '1',
                title: 'Créer la maquette de l\'application',
                description: 'Utiliser Figma pour créer la maquette de l\'application.',
                priority: 'high',
                status: 'todo',
                assignedTo: '3',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            {
                id: '2',
                title: 'Développer l\'API REST',
                description: 'Utiliser Node.js et Express pour développer l\'API REST.',
                priority: 'medium',
                status: 'in-progress',
                assignedTo: '1',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            {
                id: '3',
                title: 'Implémenter l\'authentification',
                description: 'Mise en place du système d\'authentification avec JWT',
                priority: 'high',
                status: 'in-progress',
                assignedTo: '1',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            {
                id: '4',
                title: 'Réaliser les tests unitaires',
                description: 'Écrire des tests unitaires pour le code développé.',
                priority: 'low',
                status: 'completed',
                assignedTo: '2',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }
        ];
    }

    // Obtenir la liste des taches (appel asynchrone)
    async getTasks(): Promise<Task[]> {
        // await this.simulateDelay();
        return [...this.tasks];
    }

    // Obtenir la liste des utilisateurs (appel asynchrone)
    async getUsers(): Promise<User[]> {
        // await this.simulateDelay();
        return [...this.users];
    }

    // Creation d'une tache
    async createTask(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task> {
        
        const newTask: Task = {
        ...task,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
        };
        this.tasks.push(newTask);
        
        return newTask;
    }

    // Mise a jour d'une tache
    async updateTask(id: string, updates: Partial<Task>): Promise<Task> {
        
        const taskIndex = this.tasks.findIndex(task => task.id === id);
        if (taskIndex === -1) {
        throw new Error('Task not found');
        }
        this.tasks[taskIndex] = {
        ...this.tasks[taskIndex],
        ...updates,
        updatedAt: new Date().toISOString()
        };
        return this.tasks[taskIndex];
    }

    // Supprimer une tache
    async deleteTask(id: string): Promise<void> {
        
        const taskIndex = this.tasks.findIndex(task => task.id === id);
        if (taskIndex === -1) {
        throw new Error('Task not found');
        }
        this.tasks.splice(taskIndex, 1);
    }

    // Simuler un delai
    private simulateDelay(): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, Math.random() * 500 + 200));
    }
}