import { useEffect, useMemo, useReducer, useState } from "react";
import type { AppState, ThemeType } from "../types/Types";
import { taskReducer } from "../reducers/TasksReducer";
import { TasksService } from "../services/tasksService";
import { getThemeStyles } from "../styles/themeStyles";
import { ThemeContext } from "../contexts/ThemeContext";
import { TasksContext } from "../contexts/TasksContext";
import HeaderComponent from "../components/HeaderComponent";
import FilterBarComponent from "../components/FilterBarComponent";
import TaskCardComponent from "../components/TaskCardComponent";
import TaskFormComponent from "../components/TaskFormComponent";

const TaskView: React.FC = () => {
  const [theme, setTheme] = useState<ThemeType>('material');
  const [isDark, setIsDark] = useState(false);
  const [showTaskForm, setShowTaskForm] = useState(false);

  const initialState: AppState = {
    tasks: [],
    users: [],
    filters: {
      status: '',
      priority: '',
      assignedTo: '',
      search: ''
    },
    loading: false,
    error: null
  };

  const [state, dispatch] = useReducer(taskReducer, initialState);

  useEffect(() => {
    const loadData = async () => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        const api = TasksService.getInstance();
        const [tasks, users] = await Promise.all([
          api.getTasks(),
          api.getUsers()
        ]);
        dispatch({ type: 'SET_TASKS', payload: tasks });
        dispatch({ type: 'SET_USERS', payload: users });
      } catch (error) {
        console.error(error);
        dispatch({ type: 'SET_ERROR', payload: 'Erreur lors du chargement des données' });
      }
    };

    loadData();
  }, []);

  const filteredTasks = useMemo(() => {
    return state.tasks.filter(task => {
      const matchesStatus = !state.filters.status || task.status === state.filters.status;
      const matchesPriority = !state.filters.priority || task.priority === state.filters.priority;
      const matchesAssignedTo = !state.filters.assignedTo || task.assignedTo === state.filters.assignedTo;
      const matchesSearch = !state.filters.search || 
        task.title.toLowerCase().includes(state.filters.search.toLowerCase()) ||
        task.description.toLowerCase().includes(state.filters.search.toLowerCase());
      
      return matchesStatus && matchesPriority && matchesAssignedTo && matchesSearch;
    });
  }, [state.tasks, state.filters]);

  const themeContextValue = {
    theme,
    isDark,
    toggleTheme: () => setTheme(prev => prev === 'material' ? 'shadcn' : 'material'),
    toggleDarkMode: () => setIsDark(prev => !prev)
  };

  const taskContextValue = {
    state,
    dispatch
  };

  const styles = getThemeStyles(theme, isDark);

  return (
    <ThemeContext.Provider value={themeContextValue}>
      <TasksContext.Provider value={taskContextValue}>
        <div className={`min-h-screen ${styles.background} transition-colors duration-200`}>
          <HeaderComponent onNewTask={() => setShowTaskForm(true)} />
          
          <main className="container mx-auto px-4 py-6">
            {state.error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {state.error}
                <button
                  onClick={() => dispatch({ type: 'SET_ERROR', payload: null })}
                  className="float-right font-bold"
                >
                  ×
                </button>
              </div>
            )}

            {/* <TaskStats /> */}
            <FilterBarComponent />

            {/* {state.loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              
            )} */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTasks.map(task => (
                  <TaskCardComponent key={task.id} task={task} />
                ))}
                {filteredTasks.length === 0 && (
                  <div className={`${styles.card} p-8 text-center col-span-full`}>
                    <p className={styles.textSecondary}>Aucune tâche trouvée</p>
                  </div>
                )}
              </div>
          </main>

          {showTaskForm && (
            <TaskFormComponent onClose={() => setShowTaskForm(false)} />
          )}
        </div>
      </TasksContext.Provider>
    </ThemeContext.Provider>
  );
};

export default TaskView;