/**
 * @file constants.tsx
 * @description Global application constants including design tokens and static collections.
 * @author Mishat
 */

import { MuscleGroup } from './types';

/**
 * Design system color mappings mapped directly to major muscle groups for consistent UI styling.
 */
export const MUSCLE_COLORS: Record<MuscleGroup, string> = {
    [MuscleGroup.Chest]: '#D2A3A9', // Rose
    [MuscleGroup.Back]: '#86A789',  // Sage
    [MuscleGroup.Legs]: '#A594F9',  // Lavender
    [MuscleGroup.Arms]: '#FCD34D',  // Soft Amber
    [MuscleGroup.Shoulders]: '#93C5FD', // Soft Blue
    [MuscleGroup.Core]: '#FDBA74',  // Soft Orange
};

/**
 * Pre-compiled list of common exercises categorized by primary muscle group to assist with search and logging.
 */
export const COMMON_EXERCISES: Record<MuscleGroup, string[]> = {
    [MuscleGroup.Chest]: ['Bench Press', 'Incline Dumbbell Press', 'Push-ups', 'Cable Crossovers'],
    [MuscleGroup.Back]: ['Pull-ups', 'Barbell Row', 'Lat Pulldown', 'Deadlift'],
    [MuscleGroup.Legs]: ['Squat', 'Leg Press', 'Romanian Deadlift', 'Calf Raises'],
    [MuscleGroup.Arms]: ['Bicep Curls', 'Tricep Extensions', 'Hammer Curls', 'Skull Crushers'],
    [MuscleGroup.Shoulders]: ['Overhead Press', 'Lateral Raises', 'Front Raises', 'Face Pulls'],
    [MuscleGroup.Core]: ['Plank', 'Crunches', 'Leg Raises', 'Russian Twists'],
};
