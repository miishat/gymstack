/**
 * @file useWorkoutStore.ts
 * @description LocalStorage-backed state management hook for all workout data, history, and statistics.
 * @author Mishat
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Workout, ExerciseSet, CustomExercise, WorkoutTemplate } from '../types';

const STORAGE_KEY = 'auralift_workouts';
const EXERCISES_KEY = 'auralift_custom_exercises';
const MUSCLES_KEY = 'auralift_custom_muscle_groups';
const TEMPLATES_KEY = 'auralift_templates';

export const calculate1RM = (weight: number, reps: number): number => {
    if (reps === 0 || weight === 0) return 0;
    if (reps === 1) return weight;
    return weight * (1 + reps / 30);
};

const flagPRs = (workoutToSave: Workout, history: Workout[]) => {
    const wClone = JSON.parse(JSON.stringify(workoutToSave)) as Workout;
    const otherWorkouts = history.filter(w => w.id !== wClone.id);
    const historicalMaxes: Record<string, number> = {};

    otherWorkouts.forEach(w => {
        w.exercises.forEach(ex => {
            const m = ex.name.toLowerCase();
            ex.sets.forEach(s => {
                const oneRM = calculate1RM(s.weight, s.reps);
                if (!historicalMaxes[m] || oneRM > historicalMaxes[m]) {
                    historicalMaxes[m] = oneRM;
                }
            });
        });
    });

    wClone.exercises.forEach(ex => {
        const m = ex.name.toLowerCase();
        ex.sets.forEach(s => {
            const oneRM = calculate1RM(s.weight, s.reps);
            // Must have some weight and reps to be a PR, and must beat existing 1RM
            if (oneRM > (historicalMaxes[m] || 0) && s.weight > 0 && s.reps > 0) {
                s.isPR = true;
                historicalMaxes[m] = oneRM; // Update local max so next sets must beat this one
            } else {
                s.isPR = false;
            }
        });
    });
    return wClone;
};

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

    const [templates, setTemplates] = useState<WorkoutTemplate[]>(() => {
        try {
            const item = window.localStorage.getItem(TEMPLATES_KEY);
            return item ? JSON.parse(item) : [];
        } catch (error) {
            console.warn('Error reading localStorage for templates', error);
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

    useEffect(() => {
        try {
            window.localStorage.setItem(TEMPLATES_KEY, JSON.stringify(templates));
        } catch (error) {
            console.warn('Error setting localStorage for templates', error);
        }
    }, [templates]);

    // Memoize sorted workouts (descending by date) to avoid sorting on every render/access
    const sortedWorkouts = useMemo(() => {
        return [...workouts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [workouts]);

    /** Saves a completely new workout to the beginning of the history. */
    const addWorkout = useCallback((workout: Workout) => {
        setWorkouts(prev => {
            const flaggedWorkout = flagPRs(workout, prev);
            return [flaggedWorkout, ...prev];
        });
    }, []);

    /** Replaces an existing workout (by matching ID) with its updated version. */
    const updateWorkout = useCallback((updatedWorkout: Workout) => {
        setWorkouts(prev => {
            const flaggedWorkout = flagPRs(updatedWorkout, prev);
            return prev.map(w => w.id === flaggedWorkout.id ? flaggedWorkout : w);
        });
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

    const saveTemplate = useCallback((template: WorkoutTemplate) => {
        setTemplates(prev => [template, ...prev]);
    }, []);

    const deleteTemplate = useCallback((id: string) => {
        setTemplates(prev => prev.filter(t => t.id !== id));
    }, []);

    const importData = useCallback((workoutsData: Workout[], exercisesData: CustomExercise[], musclesData: string[]) => {
        setWorkouts(workoutsData);
        setCustomExercises(exercisesData || []);
        setCustomMuscleGroups(musclesData || []);
    }, []);

    const getRecentVolumeData = useCallback(() => {
        // sortedWorkouts is DESC (newest first).
        // Take first 7 (most recent), then reverse to make them chronological (oldest to newest) for the chart.
        const recent = sortedWorkouts.slice(0, 7).reverse();
        return recent.map(w => ({
            name: new Date(w.date).toLocaleDateString(undefined, { weekday: 'short' }),
            volume: w.volume
        }));
    }, [sortedWorkouts]);

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
        // Use memoized sorted list
        for (const workout of sortedWorkouts) {
            const exercise = workout.exercises.find(e => e.name.toLowerCase() === exerciseName.toLowerCase());
            if (exercise && exercise.sets.length > 0) {
                return exercise.sets;
            }
        }
        return null;
    }, [sortedWorkouts]);

    const getHistory = useCallback(() => {
        // Return a copy of the memoized sorted list to prevent mutation of the source
        return [...sortedWorkouts];
    }, [sortedWorkouts]);

    return {
        workouts,
        templates,
        customExercises,
        customMuscleGroups,
        addWorkout,
        updateWorkout,
        deleteWorkout,
        addCustomExercise,
        deleteCustomExercise,
        addCustomMuscleGroup,
        deleteCustomMuscleGroup,
        saveTemplate,
        deleteTemplate,
        importData,
        getRecentVolumeData,
        getMuscleHeatmapData,
        getLastExerciseStats,
        getHistory
    };
};