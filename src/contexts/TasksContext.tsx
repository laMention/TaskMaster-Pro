import React from "react";
import type { AppState } from "../types/Types";

export const TasksContext = React.createContext<{
    state: AppState;
    dispatch: React.Dispatch<any>;
}>
({  
    state: {} as AppState,
    dispatch: () => {}
})