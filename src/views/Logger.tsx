/**
 * @file Logger.tsx
 * @description Multi-step workout logging interface allowing users to record exercises, sets, and weights.
 * @author Mishat
 */

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Plus, Check, ChevronRight, ChevronLeft, X, Dumbbell, Edit3, Star, Trash2 } from 'lucide-react';
import { NeuCard, NeuButton, NeuInput, PageHeader } from '../components/UI';
import { Workout, Exercise, ExerciseSet, MuscleGroup, CustomExercise, WorkoutTemplate } from '../types';
import { COMMON_EXERCISES, getMuscleColor } from '../constants';
import { triggerHaptic } from '../utils/haptics';

interface LoggerProps {
    onSave: (workout: Workout) => void;
    onCancel: () => void;
    getLastExerciseStats: (name: string) => ExerciseSet[] | null;
    initialWorkout?: Workout;
    customMuscleGroups: string[];
    customExercises: CustomExercise[];
    templates: WorkoutTemplate[];
    onDeleteTemplate: (id: string) => void;
}

type Step = 'name' | 'muscle' | 'exercise' | 'sets' | 'review';

/**
 * Logger View component providing a guided flow to create or edit a workout session.
 */
export const Logger: React.FC<LoggerProps> = ({ onSave, getLastExerciseStats, initialWorkout, customMuscleGroups, customExercises, templates, onDeleteTemplate }) => {
    const [step, setStep] = useState<Step>('name');
    const [workoutName, setWorkoutName] = useState('');
    const [exercises, setExercises] = useState<Exercise[]>([]);

    // Current exercise state
    const [currentMuscle, setCurrentMuscle] = useState<string | null>(null);
    const [currentExName, setCurrentExName] = useState('');
    const [currentSets, setCurrentSets] = useState<ExerciseSet[]>([{ id: '1', reps: 0, weight: 0, completed: false }]);
    const [isBodyweight, setIsBodyweight] = useState(false);
    const [isUnilateral, setIsUnilateral] = useState(false);

    useEffect(() => {
        if (initialWorkout && step === 'name' && !workoutName && exercises.length === 0) {
            setWorkoutName(initialWorkout.name);
            setExercises(initialWorkout.exercises);
            setStep('review');
        }
    }, [initialWorkout]);

    const handleNextStep = useCallback((next: Step) => setStep(next), []);

    const handleAddSet = useCallback(() => {
        triggerHaptic(50);
        setCurrentSets(prev => {
            const last = prev[prev.length - 1];
            return [...prev, { id: Date.now().toString(), reps: last.reps, weight: last.weight, completed: false }];
        });
    }, []);

    const updateSet = useCallback((id: string, field: 'reps' | 'weight', value: string) => {
        // Allow empty string for better UX when clearing placeholder, parse on save
        setCurrentSets(prev => prev.map(s => s.id === id ? { ...s, [field]: value === '' ? 0 : parseInt(value) || 0 } : s));
    }, []);

    const removeSet = useCallback((id: string) => {
        setCurrentSets(prev => prev.filter(s => s.id !== id));
    }, []);

    const handleEditExercise = useCallback((exerciseToEdit: Exercise) => {
        setCurrentMuscle(exerciseToEdit.muscleGroup);
        setCurrentExName(exerciseToEdit.name);
        setCurrentSets(exerciseToEdit.sets);
        setIsBodyweight(exerciseToEdit.isBodyweight || false);
        setIsUnilateral(exerciseToEdit.isUnilateral || false);
        // Remove from the finished list so we don't duplicate when saving again
        setExercises(prev => prev.filter(ex => ex.id !== exerciseToEdit.id));
        setStep('sets');
    }, []);

    // Fetch ghost stats for the current exercise
    const ghostStats = useMemo(() => {
        if (!currentExName) return null;
        return getLastExerciseStats(currentExName);
    }, [currentExName, getLastExerciseStats]);

    const saveCurrentExercise = useCallback(() => {
        if (!currentMuscle || !currentExName || currentSets.length === 0) return;

        // Ensure we inherit ghost stats if user left inputs blank (0) but placeholders were visible
        const finalSets = currentSets.map((set, i) => {
            const ghost = ghostStats && ghostStats[i];
            const finalWeight = isBodyweight ? 0 : (set.weight === 0 && ghost ? ghost.weight : set.weight);
            return {
                ...set,
                weight: finalWeight,
                reps: set.reps === 0 && ghost ? ghost.reps : set.reps
            };
        }).filter(s => s.reps > 0); // Must have at least reps to count

        if (finalSets.length === 0) return;

        const newEx: Exercise = {
            id: Date.now().toString(),
            name: currentExName,
            muscleGroup: currentMuscle,
            sets: finalSets,
            isBodyweight,
            isUnilateral
        };

        setExercises(prev => [...prev, newEx]);

        // Reset
        setCurrentMuscle(null);
        setCurrentExName('');
        setCurrentSets([{ id: Date.now().toString(), reps: 0, weight: 0, completed: false }]);
        setIsBodyweight(false);
        setIsUnilateral(false);
        setStep('review');
    }, [currentMuscle, currentExName, currentSets, ghostStats]);

    const finishWorkout = useCallback(() => {
        const totalVolume = exercises.reduce((acc, ex) => {
            return acc + ex.sets.reduce((setAcc, set) => {
                let vol = set.weight * set.reps;
                if (ex.isUnilateral) vol *= 2;
                return setAcc + vol;
            }, 0);
        }, 0);

        const workout: Workout = {
            id: initialWorkout ? initialWorkout.id : Date.now().toString(),
            date: initialWorkout ? initialWorkout.date : new Date().toISOString(),
            name: workoutName || 'Quick Session',
            exercises,
            volume: totalVolume
        };

        triggerHaptic([50, 50, 50]); // Monumental feedback for finishing a workout
        onSave(workout);

        // Reset Logger state seamlessly after saving
        setTimeout(() => {
            setStep('name');
            setWorkoutName('');
            setExercises([]);
            setCurrentMuscle(null);
            setCurrentExName('');
            setCurrentSets([{ id: Date.now().toString(), reps: 0, weight: 0, completed: false }]);
            setIsBodyweight(false);
            setIsUnilateral(false);
        }, 200);

    }, [exercises, workoutName, onSave]);

    return (
        <div className="pb-32 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-start justify-between">
                <div>
                    <PageHeader title="Log Session" subtitle={step === 'review' ? 'Review & Complete' : 'Log your hardwork.'} />
                </div>
                {step === 'review' && exercises.length > 0 && (
                    <NeuButton onClick={finishWorkout} className="!p-3 !rounded-full text-aura-sage shadow-neu-sm hover:shadow-neu-in-sm animate-in zoom-in flex-shrink-0 mt-1">
                        <Check size={24} strokeWidth={3} />
                    </NeuButton>
                )}
            </div>

            {step === 'name' && (
                <NeuCard className="animate-in fade-in">
                    <h3 className="text-lg font-bold text-aura-textPrimary tracking-tight mb-4">What are we hitting today?</h3>
                    <NeuInput
                        placeholder="e.g., Heavy Legs, Pull Day..."
                        value={workoutName}
                        onChange={(e) => setWorkoutName(e.target.value)}
                        className="font-medium"
                    />
                    <NeuButton
                        className="w-full mt-6 bg-aura-bg !text-aura-sage tracking-wide flex justify-center items-center gap-2"
                        onClick={() => handleNextStep(exercises.length > 0 ? 'review' : 'muscle')}
                    >
                        Start Logging <ChevronRight size={18} />
                    </NeuButton>

                    {templates && templates.length > 0 && (
                        <div className="mt-8 pt-6 border-t border-aura-shadowDark">
                            <h4 className="text-sm font-bold text-aura-textSecondary uppercase tracking-widest mb-4 flex items-center gap-2">
                                <Star size={16} /> Load Template
                            </h4>
                            <div className="space-y-3">
                                {templates.map(t => (
                                    <div key={t.id} className="flex gap-2">
                                        <NeuButton onClick={() => {
                                            setWorkoutName(t.name);
                                            setExercises(t.exercises);
                                            setStep('review');
                                        }} className="flex-1 text-left !justify-start !shadow-neu-out-sm transition-all focus:!shadow-neu-in-sm text-aura-textPrimary font-semibold overflow-hidden">
                                            <span className="truncate block">{t.name}</span>
                                        </NeuButton>
                                        <NeuButton
                                            onClick={() => onDeleteTemplate(t.id)}
                                            className="!px-4 !shadow-neu-out-sm text-aura-rose hover:text-red-500 flex-shrink-0"
                                        >
                                            <Trash2 size={18} />
                                        </NeuButton>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </NeuCard>
            )}

            {step === 'muscle' && (
                <NeuCard className="animate-in fade-in slide-in-from-right-4">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-aura-textPrimary tracking-tight">Select Target Muscle</h3>
                        <button onClick={() => handleNextStep(exercises.length > 0 ? 'review' : 'name')} className="text-aura-textSecondary bg-aura-bg p-2 rounded-full shadow-neu-out active:shadow-neu-in">
                            <X size={18} />
                        </button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        {[...Object.values(MuscleGroup), ...customMuscleGroups].map(mg => (
                            <NeuButton
                                key={mg}
                                onClick={() => { setCurrentMuscle(mg); handleNextStep('exercise'); }}
                                className="flex items-center justify-center py-6 font-bold tracking-tight text-lg"
                                style={{ color: getMuscleColor(mg) }}
                            >
                                {mg}
                            </NeuButton>
                        ))}
                    </div>
                </NeuCard>
            )}

            {step === 'exercise' && currentMuscle && (
                <NeuCard className="animate-in fade-in slide-in-from-right-4">
                    <div className="flex items-center gap-3 mb-6">
                        <button onClick={() => setStep('muscle')} className="text-aura-textSecondary p-2 bg-aura-bg rounded-full shadow-neu-out active:shadow-neu-in">
                            <ChevronLeft size={20} />
                        </button>
                        <h3 className="text-lg font-bold text-aura-textPrimary tracking-tight">Choose Exercise</h3>
                    </div>

                    <NeuInput
                        placeholder="Custom exercise name..."
                        value={currentExName}
                        onChange={(e) => setCurrentExName(e.target.value)}
                        className="mb-4 font-medium"
                    />

                    <div className="space-y-4 mt-8">
                        <p className="text-xs font-bold text-aura-textSecondary uppercase tracking-widest">Common {currentMuscle}</p>
                        <div className="grid gap-3">
                            {[...(COMMON_EXERCISES[currentMuscle] || []), ...customExercises.filter(ce => ce.muscleGroup === currentMuscle).map(ce => ce.name)].map(ex => (
                                <div
                                    key={ex}
                                    onClick={() => { setCurrentExName(ex); handleNextStep('sets'); }}
                                    className="p-4 rounded-2xl shadow-neu-out bg-aura-bg cursor-pointer active:shadow-neu-in transition-all text-aura-textPrimary font-semibold tracking-tight"
                                >
                                    {ex}
                                </div>
                            ))}
                        </div>
                    </div>

                    {currentExName && (
                        <NeuButton onClick={() => handleNextStep('sets')} className="w-full mt-8 bg-aura-bg !text-aura-sage">Continue to Sets</NeuButton>
                    )}
                </NeuCard>
            )}

            {step === 'sets' && (
                <NeuCard className="animate-in fade-in slide-in-from-right-4">
                    <div className="flex items-center gap-3 mb-6">
                        <button onClick={() => setStep('exercise')} className="text-aura-textSecondary p-2 bg-aura-bg rounded-full shadow-neu-out active:shadow-neu-in">
                            <ChevronLeft size={20} />
                        </button>
                        <div>
                            <h3 className="text-lg font-bold text-aura-textPrimary tracking-tight leading-tight flex items-center gap-2">
                                {currentExName}
                            </h3>
                            <p className="text-xs font-bold text-aura-textSecondary uppercase tracking-widest">{currentMuscle}</p>
                        </div>
                    </div>

                    <div className="flex gap-3 mb-6">
                        <NeuButton
                            onClick={() => setIsBodyweight(!isBodyweight)}
                            className={`flex-1 text-[10px] font-bold py-2.5 transition-all ${isBodyweight ? '!text-aura-lavender !shadow-neu-in' : 'text-aura-textSecondary !shadow-neu-out'}`}
                        >
                            Bodyweight Only
                        </NeuButton>
                        <NeuButton
                            onClick={() => setIsUnilateral(!isUnilateral)}
                            className={`flex-1 text-[10px] font-bold py-2.5 transition-all ${isUnilateral ? '!text-aura-sage !shadow-neu-in' : 'text-aura-textSecondary !shadow-neu-out'}`}
                        >
                            Unilateral (Per Side)
                        </NeuButton>
                    </div>

                    <div className="space-y-4">
                        <div className="grid grid-cols-12 gap-2 text-[10px] font-extrabold text-aura-textSecondary tracking-widest text-center px-2">
                            <div className="col-span-2">SET</div>
                            <div className="col-span-4">LBS/KG</div>
                            <div className="col-span-4">REPS</div>
                            <div className="col-span-2"></div>
                        </div>

                        {currentSets.map((set, idx) => {
                            const ghost = ghostStats && ghostStats[idx];
                            return (
                                <div key={set.id} className="grid grid-cols-12 gap-3 items-center">
                                    <div className="col-span-2 flex justify-center text-sm font-extrabold text-aura-textSecondary">
                                        {idx + 1}
                                    </div>
                                    <div className="col-span-4 relative">
                                        <NeuInput
                                            type="number"
                                            value={isBodyweight ? '' : (set.weight === 0 ? '' : set.weight)}
                                            onChange={(e) => updateSet(set.id, 'weight', e.target.value)}
                                            disabled={isBodyweight}
                                            className={`text-center font-bold !py-2.5 transition-all ${isBodyweight ? 'opacity-30 cursor-not-allowed bg-aura-bg/50 shadow-none' : ''} ${set.weight === 0 && ghost && !isBodyweight ? 'placeholder:opacity-50 placeholder:text-aura-sage' : ''}`}
                                            placeholder={isBodyweight ? "BW" : (ghost ? `${ghost.weight}` : "0")}
                                        />
                                    </div>
                                    <div className="col-span-4">
                                        <NeuInput
                                            type="number"
                                            value={set.reps === 0 ? '' : set.reps}
                                            onChange={(e) => updateSet(set.id, 'reps', e.target.value)}
                                            className={`text-center font-bold !py-2.5 ${set.reps === 0 && ghost ? 'placeholder:opacity-50 placeholder:text-aura-sage' : ''}`}
                                            placeholder={ghost ? `${ghost.reps}` : "0"}
                                        />
                                    </div>
                                    <div className="col-span-2 flex justify-center">
                                        <button onClick={() => removeSet(set.id)} className="p-2 text-aura-rose bg-aura-bg rounded-full shadow-neu-out active:shadow-neu-in transition-all">
                                            <X size={16} strokeWidth={3} />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="flex gap-4 mt-8">
                        <NeuButton onClick={handleAddSet} className="flex-1 text-sm font-bold border border-transparent !shadow-neu-out text-aura-textSecondary">
                            + Add Set
                        </NeuButton>
                        <NeuButton onClick={saveCurrentExercise} className="flex-1 text-sm font-bold !shadow-neu-out !text-aura-sage">
                            Save Exercise
                        </NeuButton>
                    </div>
                </NeuCard>
            )}

            {step === 'review' && (
                <div className="space-y-6 animate-in fade-in">
                    {exercises.length === 0 ? (
                        <NeuCard className="text-center py-12">
                            <Dumbbell size={48} className="mx-auto mb-4 text-aura-textSecondary opacity-30" />
                            <p className="font-medium text-aura-textSecondary mb-6">No exercises logged yet.</p>
                            <NeuButton onClick={() => setStep('muscle')} className="w-full !text-aura-sage shadow-neu-out">
                                Add First Exercise
                            </NeuButton>
                        </NeuCard>
                    ) : (
                        <>
                            {exercises.map((ex) => (
                                <NeuCard key={ex.id} className="relative overflow-hidden">
                                    <div className="absolute top-0 left-0 w-2 h-full" style={{ backgroundColor: getMuscleColor(ex.muscleGroup) }} />
                                    <div className="pl-2">
                                        <h4 className="font-bold text-aura-textPrimary text-lg tracking-tight justify-between flex items-center">
                                            {ex.name}
                                            <button onClick={() => handleEditExercise(ex)} className="text-aura-textSecondary hover:text-aura-sage p-1">
                                                <Edit3 size={16} />
                                            </button>
                                        </h4>
                                        <p className="text-[10px] font-bold text-aura-textSecondary uppercase tracking-widest mb-4">{ex.muscleGroup}</p>

                                        <div className="space-y-2.5">
                                            {ex.sets.map((set, idx) => (
                                                <div key={set.id} className="flex justify-between items-center text-sm px-4 py-2.5 bg-aura-bg shadow-neu-in rounded-xl">
                                                    <span className="font-bold text-aura-textSecondary">Set {idx + 1}</span>
                                                    <span className="font-extrabold text-aura-textPrimary">
                                                        {ex.isBodyweight ? 'BW' : `${set.weight}`}
                                                        <span className="text-xs font-semibold text-aura-textSecondary mx-1">
                                                            {ex.isBodyweight ? '×' : 'lbs ×'}
                                                        </span>
                                                        {set.reps}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </NeuCard>
                            ))}

                            <NeuButton onClick={() => setStep('muscle')} className="w-full flex justify-center items-center gap-2 py-5 font-bold text-aura-textSecondary hover:text-aura-textPrimary">
                                <Plus size={20} strokeWidth={3} /> Add Another Exercise
                            </NeuButton>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};