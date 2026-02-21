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
    Arms = 'Arms',
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
}

/**
 * Represents a logged exercise including the targeted muscle group and an array of sets.
 */
export interface Exercise {
    id: string;
    name: string;
    muscleGroup: MuscleGroup;
    sets: ExerciseSet[];
}

/**
 * Represents a complete logged session (workout) with metadata and calculated volume.
 */
export interface Workout {
    id: string;
    /** ISO format Date string when the workout occurred */
    date: string;
    name: string;
    exercises: Exercise[];
    /** The calculated total structural volume of the session (sum of weight * reps) */
    volume: number;
}

/**
 * Union type to define the active view within the application routing state.
 */
export type ViewState = 'dashboard' | 'logger' | 'tools' | 'timer' | 'history' | 'settings';