import type React from "react";
import { useContext, useState } from "react";
import { ThemeContext } from "../contexts/ThemeContext";
import { TasksContext } from "../contexts/TasksContext";
import { getThemeStyles } from "../styles/themeStyles";
import { TasksService } from "../services/tasksService";

const TaskFormComponent: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { theme, isDark } = useContext(ThemeContext);
  const { state, dispatch } = useContext(TasksContext);
  const styles = getThemeStyles(theme, isDark);
  
  const [form, setForm] = useState({
    title: '',
    description: '',
    priority: 'medium' as const,
    status: 'todo' as const,
    assignedTo: state.users[0]?.id || ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const api = TasksService.getInstance();
      const newTask = await api.createTask(form);
      dispatch({ type: 'ADD_TASK', payload: newTask });
      onClose();
    } catch (error) {
        console.error(error);
      dispatch({ type: 'SET_ERROR', payload: 'Erreur lors de la création' });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className={`${styles.card} p-6 w-full max-w-md`}>
        <h2 className={`text-xl font-bold mb-4 ${styles.text}`}>Nouvelle tâche</h2>
        <div className="space-y-4">
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className={`${styles.input} w-full`}
            placeholder="Titre de la tâche"
            required
          />
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className={`${styles.input} w-full h-24 resize-none`}
            placeholder="Description"
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <select
              value={form.priority}
              onChange={(e) => setForm({ ...form, priority: e.target.value as any })}
              className={styles.input}
            >
              <option value="high">Haute</option>
              <option value="medium">Moyenne</option>
              <option value="low">Basse</option>
            </select>
            <select
              value={form.assignedTo}
              onChange={(e) => setForm({ ...form, assignedTo: e.target.value })}
              className={styles.input}
            >
              {state.users.map(user => (
                <option key={user.id} value={user.id}>{user.name}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                handleSubmit(e);
              }}
              className={`${styles.button} ${styles.primary} ${isDark && 'text-white'}  flex-1`}
              
            >
              Ajouter
              {/* {state.loading ? 'Création...' : 'Créer'} */}
            </button>
            <button
              type="button"
              onClick={onClose}
              className={`${styles.button} flex-1`}
            >
              Annuler
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskFormComponent;