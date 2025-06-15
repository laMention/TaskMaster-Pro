import React from "react";
import type { ThemeType } from "../types/Types";

export const ThemeContext = React.createContext<{ 
    theme: ThemeType;
    isDark: boolean;
    toggleTheme: () => void;
    toggleDarkMode: () => void;
}>({
    theme:'material',
    isDark:false,
    toggleTheme:() => {},
    toggleDarkMode:()=>{}
})