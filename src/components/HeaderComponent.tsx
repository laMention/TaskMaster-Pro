import type React from "react";
import { useContext } from "react";
import { getThemeStyles } from "../styles/themeStyles";
import { ThemeContext } from "../contexts/ThemeContext";
import { Moon, Plus, Sun } from "lucide-react";

const HeaderComponent: React.FC<{ onNewTask: () => void }> = ({ onNewTask }) => {
  const { theme, isDark, toggleTheme, toggleDarkMode } = useContext(ThemeContext);
  const styles = getThemeStyles(theme, isDark);

  return (
    <header className={`${styles.surface} ${styles.border} border-b p-4`}>
      <div className="flex justify-between items-center">
        <div>
          <h1 className={`text-2xl font-bold ${styles.text}`}>TaskMaster Pro</h1>
          <p className={styles.textSecondary}>Gestion collaborative de tâches enterprise</p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={toggleDarkMode}
            className={`${styles.button} p-2`}
            title="Toggle Dark Mode"
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <select
            value={theme}
            onChange={() => toggleTheme()}
            className={`${styles.input } ${isDark && 'text-white' }`}
            title={`Changer le theme ${theme === 'material' ? 'ShadCN' : 'Material UI'}`}
          >
            <option value="material">Material UI</option>
            <option value="shadcn">ShadCN</option>
          </select>
          <button
            onClick={onNewTask}
            className={`${styles.button} ${styles.primary} ${isDark && 'text-white' } flex items-center gap-2`}
          >
            <Plus className="w-4 h-4" />
            Nouvelle tâche
          </button>
        </div>
      </div>
    </header>
  );
};

export default HeaderComponent;