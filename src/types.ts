export enum MuscleGroup {
    Chest = 'Chest',
    Back = 'Back',
    Legs = 'Legs',
    Arms = 'Arms',
    Shoulders = 'Shoulders',
    Core = 'Core'
}

export interface ExerciseSet {
    id: string;
    reps: number;
    weight: number;
    completed: boolean;
}

export interface Exercise {
    id: string;
    name: string;
    muscleGroup: MuscleGroup;
    sets: ExerciseSet[];
}

export interface Workout {
    id: string;
    date: string; // ISO string
    name: string;
    exercises: Exercise[];
    volume: number; // calculated total (weight * reps)
}

export type ViewState = 'dashboard' | 'logger' | 'tools' | 'timer' | 'history';