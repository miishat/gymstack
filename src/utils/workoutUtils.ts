/**
 * @file workoutUtils.ts
 * @description Utility functions for workout data processing, sorting, and analytics.
 */

import type { Workout } from '../types';

/**
 * Sorts workouts by date in descending order (newest first).
 * @param workouts - Array of workouts to sort.
 * @returns A new array of sorted workouts.
 */
export const sortWorkouts = (workouts: Workout[]): Workout[] => {
    return [...workouts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

/**
 * Calculates muscle heatmap data based on workouts from the last 7 days.
 * Optimized to iterate only through relevant workouts, assuming input is sorted descending.
 * @param workouts - Array of workouts (should be sorted descending by date).
 * @param now - Current date (for testing purposes).
 * @returns Heatmap data array.
 */
export const calculateHeatmap = (workouts: Workout[], now: Date = new Date()) => {
    const heatmap: Record<string, number> = {};
    const oneWeekAgo = new Date(now);
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const oneWeekAgoTime = oneWeekAgo.getTime();

    for (const workout of workouts) {
        // Optimization: Stop processing if workout is older than 1 week
        if (new Date(workout.date).getTime() < oneWeekAgoTime) {
            break;
        }

        workout.exercises.forEach(ex => {
            const m = ex.muscleGroup;
            let vol = 0;
            for (const set of ex.sets) {
                vol += set.weight * set.reps;
            }
            heatmap[m] = (heatmap[m] || 0) + vol;
        });
    }

    const maxVol = Math.max(...Object.values(heatmap), 1);
    return Object.keys(heatmap).map(muscle => ({
        muscle,
        intensity: (heatmap[muscle] / maxVol) * 100
    }));
};
