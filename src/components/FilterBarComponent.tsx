import type React from "react";
import { ThemeContext } from "../contexts/ThemeContext";
import { useContext } from "react";
import { TasksContext } from "../contexts/TasksContext";
import { getThemeStyles } from "../styles/themeStyles";
import { Search } from "lucide-react";

const FilterBarComponent: React.FC = () => {
  const { theme, isDark } = useContext(ThemeContext);
  const { state, dispatch } = useContext(TasksContext);
  const styles = getThemeStyles(theme, isDark);

  return (
    <div className={`${styles.card} p-4 mb-6`}>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher..."
            value={state.filters.search}
            onChange={(e) => dispatch({ type: 'SET_FILTERS', payload: { search: e.target.value } })}
            className={`${styles.input } ${isDark && 'text-white'} pl-10 w-full`}
          />
        </div>
        <select
          value={state.filters.status}
          onChange={(e) => dispatch({ type: 'SET_FILTERS', payload: { status: e.target.value } })}
          className={`${styles.input} ${isDark && 'text-white'}`}
        >
          <option value="">Tous les statuts</option>
          <option value="todo">À faire</option>
          <option value="in-progress">En cours</option>
          <option value="completed">Terminé</option>
        </select>
        <select
          value={state.filters.priority}
          onChange={(e) => dispatch({ type: 'SET_FILTERS', payload: { priority: e.target.value } })}
          className={`${styles.input} ${isDark && 'text-white'}`}
        >
          <option value="">Toutes les priorités</option>
          <option value="high">Haute</option>
          <option value="medium">Moyenne</option>
          <option value="low">Basse</option>
        </select>
        <select
          value={state.filters.assignedTo}
          onChange={(e) => dispatch({ type: 'SET_FILTERS', payload: { assignedTo: e.target.value } })}
          className={`${styles.input} ${isDark && 'text-white'}`}
        >
          <option value="">Tous les utilisateurs</option>
          {state.users.map(user => (
            <option key={user.id} value={user.id}>{user.name}</option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default FilterBarComponent;