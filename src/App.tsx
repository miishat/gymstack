/**
 * @file App.tsx
 * @description Main application shell, state provider, and view router for the Gym Stack application.
 * @author Mishat
 */

import React, { useState } from 'react';
import { ViewState, Workout } from './types';
import { useWorkoutStore } from './hooks/useWorkoutStore';
import { Dashboard } from './views/Dashboard';
import { Logger } from './views/Logger';
import { ToolsView } from './views/Tools';
import { TimerView } from './views/Timer';
import { HistoryView } from './views/History';
import { SettingsView } from './views/Settings';
import { BottomNav } from './components/BottomNav';

/**
 * The root Application component.
 * Manages the global `currentView` state, connects to the local storage hook (`useWorkoutStore`),
 * and renders the corresponding view component based on user navigation.
 */
const App: React.FC = () => {
    const [currentView, setCurrentView] = useState<ViewState>('dashboard');
    const [editingWorkout, setEditingWorkout] = useState<Workout | null>(null);
    const { workouts, templates, customExercises, customMuscleGroups, addWorkout, updateWorkout, deleteWorkout, getRecentVolumeData, getMuscleHeatmapData, getHistory, getLastExerciseStats, importData, addCustomExercise, deleteCustomExercise, addCustomMuscleGroup, deleteCustomMuscleGroup, saveTemplate } = useWorkoutStore();

    const handleSaveTemplate = (workout: Workout) => {
        saveTemplate({
            id: Date.now().toString(),
            name: `${workout.name} Template`,
            exercises: workout.exercises.map(ex => ({
                ...ex,
                sets: ex.sets.map(s => ({ ...s, completed: false, isPR: false }))
            }))
        });
        alert('Workout saved as a Template!');
    };

    const handleSaveWorkout = (workout: Workout) => {
        if (editingWorkout) {
            updateWorkout(workout);
            setEditingWorkout(null);
        } else {
            addWorkout(workout);
        }
        setCurrentView('dashboard');
    };

    const handleEditWorkout = (workout: Workout) => {
        setEditingWorkout(workout);
        setCurrentView('logger');
    };

    const handleCancelLog = () => {
        setEditingWorkout(null);
        setCurrentView('dashboard');
    };

    return (
        <div className="min-h-screen bg-aura-bg flex justify-center">
            {/* Mobile container constraint for desktop viewing */}
            <div className="w-full max-w-md bg-aura-bg min-h-screen shadow-2xl relative overflow-hidden">


                {/* Main Content Area */}
                <main className="h-full overflow-y-auto px-6 pt-12 pb-32">
                    <div className={currentView === 'dashboard' ? 'block' : 'hidden'}>
                        <Dashboard
                            workouts={workouts}
                            volumeData={getRecentVolumeData()}
                            heatmapData={getMuscleHeatmapData()}
                        />
                    </div>

                    <div className={currentView === 'logger' ? 'block' : 'hidden'}>
                        {currentView === 'logger' && (
                            <Logger
                                onSave={handleSaveWorkout}
                                onCancel={handleCancelLog}
                                getLastExerciseStats={getLastExerciseStats}
                                initialWorkout={editingWorkout || undefined}
                                customMuscleGroups={customMuscleGroups}
                                customExercises={customExercises}
                                templates={templates}
                            />
                        )}
                    </div>

                    <div className={currentView === 'tools' ? 'block' : 'hidden'}>
                        <ToolsView />
                    </div>

                    <div className={currentView === 'timer' ? 'block' : 'hidden'}>
                        <TimerView />
                    </div>

                    <div className={currentView === 'history' ? 'block' : 'hidden'}>
                        <HistoryView
                            workouts={getHistory()}
                            onEdit={handleEditWorkout}
                            onDelete={deleteWorkout}
                            onSaveTemplate={handleSaveTemplate}
                        />
                    </div>

                    <div className={currentView === 'settings' ? 'block' : 'hidden'}>
                        <SettingsView
                            workouts={workouts}
                            customExercises={customExercises}
                            customMuscleGroups={customMuscleGroups}
                            importData={importData}
                            addCustomExercise={addCustomExercise}
                            deleteCustomExercise={deleteCustomExercise}
                            addCustomMuscleGroup={addCustomMuscleGroup}
                            deleteCustomMuscleGroup={deleteCustomMuscleGroup}
                        />
                    </div>
                </main>

                <BottomNav currentView={currentView} setView={setCurrentView} />
            </div>
        </div>
    );
};

export default App;