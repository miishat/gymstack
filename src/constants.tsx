/**
 * @file constants.tsx
 * @description Global application constants including design tokens and static collections.
 * @author Mishat
 */

import { MuscleGroup } from './types';

/**
 * Design system color mappings mapped directly to major muscle groups for consistent UI styling.
 */
export const MUSCLE_COLORS: Record<string, string> = {
    [MuscleGroup.Chest]: '#D2A3A9', // Rose
    [MuscleGroup.Back]: '#86A789',  // Sage
    [MuscleGroup.Legs]: '#A594F9',  // Lavender
    [MuscleGroup.Biceps]: '#FCD34D',  // Soft Amber
    [MuscleGroup.Triceps]: '#FDA4AF', // Soft Rose/Pink
    [MuscleGroup.Forearms]: '#5EEAD4', // Soft Teal
    [MuscleGroup.Shoulders]: '#93C5FD', // Soft Blue
    [MuscleGroup.Core]: '#FDBA74',  // Soft Orange
};

/**
 * Returns a consistent color for any given muscle group name.
 * Default muscle groups return their predefined color.
 * Custom groups generate a distinct pastel/muted color based on a string hash.
 */
export const getMuscleColor = (muscleName: string): string => {
    if (MUSCLE_COLORS[muscleName]) {
        return MUSCLE_COLORS[muscleName];
    }

    let hash = 0;
    for (let i = 0; i < muscleName.length; i++) {
        hash = muscleName.charCodeAt(i) + ((hash << 5) - hash);
    }

    // Generate HSL: restrict Saturation to 65-80% and Lightness to 70-85% 
    // for a soft, pastel aura look similar to the base palette.
    const h = Math.abs(hash) % 360;
    const s = 65 + (Math.abs(hash) % 16);
    const l = 70 + (Math.abs(hash) % 16);

    return `hsl(${h}, ${s}%, ${l}%)`;
};

/**
 * Pre-compiled list of common exercises categorized by primary muscle group to assist with search and logging.
 */
export const COMMON_EXERCISES: Record<string, string[]> = {
    [MuscleGroup.Chest]: ['Bench Press', 'Incline Dumbbell Press', 'Push-ups', 'Cable Crossovers'],
    [MuscleGroup.Back]: ['Pull-ups', 'Barbell Row', 'Lat Pulldown', 'Deadlift'],
    [MuscleGroup.Legs]: ['Squat', 'Leg Press', 'Romanian Deadlift', 'Calf Raises'],
    [MuscleGroup.Biceps]: ['Bicep Curls', 'Hammer Curls', 'Preacher Curls', 'Cable Curls'],
    [MuscleGroup.Triceps]: ['Tricep Extensions', 'Skull Crushers', 'Tricep Pushdowns', 'Close-Grip Bench Press'],
    [MuscleGroup.Forearms]: ['Wrist Curls', 'Reverse Wrist Curls', 'Reverse Curls', 'Farmers Walk'],
    [MuscleGroup.Shoulders]: ['Overhead Press', 'Lateral Raises', 'Front Raises', 'Face Pulls'],
    [MuscleGroup.Core]: ['Plank', 'Crunches', 'Leg Raises', 'Russian Twists'],
};
