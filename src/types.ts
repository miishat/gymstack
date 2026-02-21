/**
 * @file types.ts
 * @description Core TypeScript type definitions and interfaces for the Gym Stack application.
 * @author Mishat
 */

/**
 * Represents the primary muscle groups targeted during workouts.
 */
export enum MuscleGroup {
    Chest = 'Chest',
    Back = 'Back',
    Legs = 'Legs',
    Biceps = 'Biceps',
    Triceps = 'Triceps',
    Forearms = 'Forearms',
    Shoulders = 'Shoulders',
    Core = 'Core'
}

/**
 * Represents a single set in an exercise, tracking reps and weight.
 */
export interface ExerciseSet {
    id: string;
    reps: number;
    weight: number;
    completed: boolean;
    isPR?: boolean; // Flag to indicate if this set was a Personal Record (1RM) at the time it was logged
}

/**
 * Represents a logged exercise including the targeted muscle group and an array of sets.
 */
export interface Exercise {
    id: string;
    name: string;
    muscleGroup: string; // Changed from enum to string to support custom muscle groups
    sets: ExerciseSet[];
    isBodyweight?: boolean;
    isUnilateral?: boolean;
}

/**
 * Represents a user-defined custom exercise.
 */
export interface CustomExercise {
    id: string;
    name: string;
    muscleGroup: string;
}

/**
 * Represents a complete logged session (workout) with metadata and calculated volume.
 */
export interface Workout {
    id: string;
    name: string;
    date: string; // ISO string
    exercises: Exercise[];
    volume: number;
    durationMinutes?: number;
}

export interface WorkoutTemplate {
    id: string;
    name: string;
    exercises: Exercise[]; // Exercises with target/ghost sets
}

/**
 * Union type to define the active view within the application routing state.
 */
export type ViewState = 'dashboard' | 'logger' | 'tools' | 'timer' | 'history' | 'analytics' | 'settings';