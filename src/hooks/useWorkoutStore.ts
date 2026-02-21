import { useState, useEffect, useCallback } from 'react';
import { Workout, ExerciseSet } from '../types';

const STORAGE_KEY = 'auralift_workouts';

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

    // Save to local storage whenever workouts change
    useEffect(() => {
        try {
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(workouts));
        } catch (error) {
            console.warn('Error setting localStorage', error);
        }
    }, [workouts]);

    const addWorkout = useCallback((workout: Workout) => {
        setWorkouts(prev => [workout, ...prev]);
    }, []);

    const deleteWorkout = useCallback((id: string) => {
        setWorkouts(prev => prev.filter(w => w.id !== id));
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
        addWorkout,
        deleteWorkout,
        getRecentVolumeData,
        getMuscleHeatmapData,
        getLastExerciseStats,
        getHistory
    };
};