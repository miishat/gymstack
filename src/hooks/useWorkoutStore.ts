/**
 * @file useWorkoutStore.ts
 * @description LocalStorage-backed state management hook for all workout data, history, and statistics.
 * @author Mishat
 */

import { useState, useEffect, useCallback } from 'react';
import { Workout, ExerciseSet, CustomExercise } from '../types';

const STORAGE_KEY = 'auralift_workouts';
const EXERCISES_KEY = 'auralift_custom_exercises';
const MUSCLES_KEY = 'auralift_custom_muscle_groups';

/**
 * Custom hook providing workout data and actions.
 * Synchronizes workout history seamlessly with the browser's localStorage.
 */
export const useWorkoutStore = () => {
    const [workouts, setWorkouts] = useState<Workout[]>(() => {
        try {
            const item = window.localStorage.getItem(STORAGE_KEY);
            return item ? JSON.parse(item) : [];
        } catch (error) {
            console.warn('Error reading localStorage', error);
            return [];
        }
    });

    const [customExercises, setCustomExercises] = useState<CustomExercise[]>(() => {
        try {
            const item = window.localStorage.getItem(EXERCISES_KEY);
            return item ? JSON.parse(item) : [];
        } catch (error) {
            console.warn('Error reading localStorage for custom exercises', error);
            return [];
        }
    });

    const [customMuscleGroups, setCustomMuscleGroups] = useState<string[]>(() => {
        try {
            const item = window.localStorage.getItem(MUSCLES_KEY);
            return item ? JSON.parse(item) : [];
        } catch (error) {
            console.warn('Error reading localStorage for custom muscle groups', error);
            return [];
        }
    });

    // Save to local storage whenever workouts change
    useEffect(() => {
        try {
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(workouts));
        } catch (error) {
            console.warn('Error setting localStorage', error);
        }
    }, [workouts]);

    useEffect(() => {
        try {
            window.localStorage.setItem(EXERCISES_KEY, JSON.stringify(customExercises));
        } catch (error) {
            console.warn('Error setting localStorage for custom exercises', error);
        }
    }, [customExercises]);

    useEffect(() => {
        try {
            window.localStorage.setItem(MUSCLES_KEY, JSON.stringify(customMuscleGroups));
        } catch (error) {
            console.warn('Error setting localStorage for custom muscle groups', error);
        }
    }, [customMuscleGroups]);

    /** Saves a completely new workout to the beginning of the history. */
    const addWorkout = useCallback((workout: Workout) => {
        setWorkouts(prev => [workout, ...prev]);
    }, []);

    /** Replaces an existing workout (by matching ID) with its updated version. */
    const updateWorkout = useCallback((updatedWorkout: Workout) => {
        setWorkouts(prev => prev.map(w => w.id === updatedWorkout.id ? updatedWorkout : w));
    }, []);

    /** Completely removes a workout from history based on its ID. */
    const deleteWorkout = useCallback((id: string) => {
        setWorkouts(prev => prev.filter(w => w.id !== id));
    }, []);

    const addCustomExercise = useCallback((exercise: CustomExercise) => {
        setCustomExercises(prev => [...prev, exercise]);
    }, []);

    const deleteCustomExercise = useCallback((id: string) => {
        setCustomExercises(prev => prev.filter(ex => ex.id !== id));
    }, []);

    const addCustomMuscleGroup = useCallback((group: string) => {
        setCustomMuscleGroups(prev => prev.includes(group) ? prev : [...prev, group]);
    }, []);

    const deleteCustomMuscleGroup = useCallback((group: string) => {
        setCustomMuscleGroups(prev => prev.filter(g => g !== group));
    }, []);

    const importData = useCallback((workoutsData: Workout[], exercisesData: CustomExercise[], musclesData: string[]) => {
        setWorkouts(workoutsData);
        setCustomExercises(exercisesData || []);
        setCustomMuscleGroups(musclesData || []);
    }, []);

    const getRecentVolumeData = useCallback(() => {
        const recent = [...workouts].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).slice(-7);
        return recent.map(w => ({
            name: new Date(w.date).toLocaleDateString(undefined, { weekday: 'short' }),
            volume: w.volume
        }));
    }, [workouts]);

    const getMuscleHeatmapData = useCallback(() => {
        const heatmap: Record<string, number> = {};
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        workouts.forEach(workout => {
            if (new Date(workout.date) >= oneWeekAgo) {
                workout.exercises.forEach(ex => {
                    const m = ex.muscleGroup;
                    heatmap[m] = (heatmap[m] || 0) + ex.sets.reduce((acc, set) => acc + (set.weight * set.reps), 0);
                });
            }
        });

        const maxVol = Math.max(...Object.values(heatmap), 1);
        return Object.keys(heatmap).map(muscle => ({
            muscle,
            intensity: (heatmap[muscle] / maxVol) * 100
        }));
    }, [workouts]);

    // Smart Ghosting: Get the last logged sets for a specific exercise name
    const getLastExerciseStats = useCallback((exerciseName: string): ExerciseSet[] | null => {
        const sortedWorkouts = [...workouts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        for (const workout of sortedWorkouts) {
            const exercise = workout.exercises.find(e => e.name.toLowerCase() === exerciseName.toLowerCase());
            if (exercise && exercise.sets.length > 0) {
                return exercise.sets;
            }
        }
        return null;
    }, [workouts]);

    const getHistory = useCallback(() => {
        return [...workouts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [workouts]);

    return {
        workouts,
        customExercises,
        customMuscleGroups,
        addWorkout,
        updateWorkout,
        deleteWorkout,
        addCustomExercise,
        deleteCustomExercise,
        addCustomMuscleGroup,
        deleteCustomMuscleGroup,
        importData,
        getRecentVolumeData,
        getMuscleHeatmapData,
        getLastExerciseStats,
        getHistory
    };
};