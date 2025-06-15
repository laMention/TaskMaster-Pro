import type { ThemeType } from "../types/Types";

export const getThemeStyles = (theme: ThemeType, isDark: boolean) => {
  const baseColors = isDark ? {
    background: 'bg-gray-900',
    surface: 'bg-gray-800',
    text: 'text-white',
    textSecondary: 'text-gray-300',
    border: 'border-gray-700'
  } : {
    background: 'bg-gray-50',
    surface: 'bg-white',
    text: 'text-gray-900',
    textSecondary: 'text-gray-600',
    border: 'border-gray-200'
  };

  if (theme === 'material') {
    return {
      ...baseColors,
      primary: 'bg-blue-600',
      primaryHover: 'hover:bg-blue-700',
      secondary: 'bg-gray-600',
      accent: 'bg-purple-600',
      card: `${baseColors.surface} shadow-md rounded-lg`,
      button: `${baseColors.surface} ${baseColors.border} border rounded-md px-4 py-2 transition-colors hover:bg-opacity-80`,
      input: `${baseColors.surface} ${baseColors.border} border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`
    };
  } else {
    return {
      ...baseColors,
      primary: 'bg-slate-900',
      primaryHover: 'hover:bg-slate-800',
      secondary: 'bg-slate-600',
      accent: 'bg-emerald-600',
      card: `${baseColors.surface} border ${baseColors.border} rounded-xl shadow-sm`,
      button: `${baseColors.surface} ${baseColors.border} border rounded-lg px-4 py-2 transition-all hover:shadow-md`,
      input: `${baseColors.surface} ${baseColors.border} border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-500`
    };
  }
};
