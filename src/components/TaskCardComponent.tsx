import type React from "react";
import type { Task } from './../types/Types';
import { useContext, useState } from "react";
import { getThemeStyles } from "../styles/themeStyles";
import { TasksContext } from "../contexts/TasksContext";
import { ThemeContext } from "../contexts/ThemeContext";
import {AlertCircle, CheckCircle, Clock, Edit, Trash2, User} from 'lucide-react';
import { TasksService } from "../services/tasksService";

const TaskCardComponent:React.FC<{task:Task}> = ({ task }) => {
    const { theme, isDark } = useContext(ThemeContext);
    const { state, dispatch } = useContext(TasksContext);
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState(task);
    const styles = getThemeStyles(theme, isDark);
    
    const user = state.users.find(user => user.id === task.assignedTo);
    
    const getPriorityColor = (priority: string) => {
        switch (priority) {
        case 'high': return 'text-red-600 bg-red-100';
        case 'medium': return 'text-yellow-600 bg-yellow-100';
        case 'low': return 'text-green-600 bg-green-100';
        default: return 'text-gray-600 bg-gray-100';
        }
    };
    
    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'completed': return <CheckCircle className="w-5 h-5 text-green-600" />;
            case 'in-progress': return <Clock className="w-5 h-5 text-blue-600" />;
            default: return <AlertCircle className="w-5 h-5 text-gray-600" />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed': return 'text-green-600';
            case 'in-progress': return 'text-blue-600';
            default: return 'text-gray-600';
        }
    }

    const getStatusText = (status: string) => {
        switch (status) {
            case 'completed': return 'Terminé';
            case 'in-progress': return 'En cours';
            default: return 'À faire';
        }
    }

    const handleUpdate = async () => {
        try {
        const api = TasksService.getInstance();
        const updatedTask = await api.updateTask(task.id, editForm);
        dispatch({ type: 'UPDATE_TASK', payload: updatedTask });
        setIsEditing(false);
        } catch (error) {
        console.error(error)
            dispatch({ type: 'SET_ERROR', payload: 'Erreur lors de la modification de la tache' });
        }
    };

    const handleDelete = async () => {
        try {
        const api = TasksService.getInstance();
        await api.deleteTask(task.id);
        dispatch({ type: 'DELETE_TASK', payload: task.id });
        } catch (error) {
        console.error(error)

        dispatch({ type: 'SET_ERROR', payload: 'Erreur lors de la suppression de la tache' });
        }
    };

    

    if (isEditing) {
        return (
            <div className={`${styles.card} ${isDark && 'text-white'} p-6`}>
                <div className="space-y-4">
                <input
                    type="text"
                    value={editForm.title}
                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                    className={`${styles.input} w-full`}
                    placeholder="Titre de la tâche"
                />
                <textarea
                    value={editForm.description}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    className={`${styles.input} w-full h-24 resize-none`}
                    placeholder="Description"
                />
                <div className="grid grid-cols-3 gap-4">
                    <select
                    value={editForm.priority}
                    onChange={(e) => setEditForm({ ...editForm, priority: e.target.value as any })}
                    className={styles.input}
                    >
                    <option value="high">Haute</option>
                    <option value="medium">Moyenne</option>
                    <option value="low">Basse</option>
                    </select>
                    <select
                    value={editForm.status}
                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value as any })}
                    className={styles.input}
                    >
                    <option value="todo">À faire</option>
                    <option value="in-progress">En cours</option>
                    <option value="completed">Terminé</option>
                    </select>
                    <select
                    value={editForm.assignedTo}
                    onChange={(e) => setEditForm({ ...editForm, assignedTo: e.target.value })}
                    className={styles.input}
                    >
                    {state.users.map(user => (
                        <option key={user.id} value={user.id}>{user.name}</option>
                    ))}
                    </select>
                </div>
                <div className="flex gap-2">
                    <button
                    onClick={handleUpdate}
                    className={`${styles.button} ${styles.primary} ${isDark && 'text-white'} `}
                    >
                    Enregistrer
                    </button>
                    <button
                    onClick={() => setIsEditing(false)}
                    className={styles.button}
                    >
                    Annuler
                    </button>
                </div>
                </div>
            </div>
        );
    }

    return (
        <div className={`${styles.card} p-6 hover:shadow-lg transition-shadow`}>
        <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-2">
            {getStatusIcon(task.status)}
            <h3 className={`font-semibold ${styles.text}`}>{task.title}</h3>
            </div>
            <div className="flex gap-2">
            <button
                onClick={() => setIsEditing(true)}
                className="p-1 rounded hover:bg-gray-200 transition-colors"
            >
                <Edit className={`w-4 h-4 ${isDark && 'text-white'}`} />
            </button>
            <button
                onClick={handleDelete}
                className="p-1 rounded hover:bg-red-100 text-red-600 transition-colors"
            >
                <Trash2 className="w-4 h-4" />
            </button>
            </div>
        </div>
        
        <p className={`${styles.textSecondary} mb-4`}>{task.description}</p>
        
        <div className="flex justify-between items-center">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
            {task.priority === 'high' ? 'Haute' : task.priority === 'medium' ? 'Moyenne' : 'Basse'}
            </span>
            <div className="flex items-center gap-2">
                <span className={`text-sm ${getStatusColor(task.status)}`}>
                    {getStatusText(task.status)}
                </span>
                <User className={`w-4 h-4 ${isDark && 'text-white'}`}/>
                <span className={`text-sm ${styles.textSecondary}`}>{user?.name}</span>
            </div>
        </div>
        </div>
        );
    
}

export default TaskCardComponent;