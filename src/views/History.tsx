/**
 * @file History.tsx
 * @description View component for browsing, expanding, editing, and deleting past logged workouts.
 * @author Mishat
 */

import React, { useState } from 'react';
import { Calendar, Dumbbell, ChevronDown, ChevronUp, Edit3, Trash2 } from 'lucide-react';
import { NeuCard, PageHeader } from '../components/UI';
import { Workout } from '../types';

interface HistoryProps {
    workouts: Workout[];
    onEdit: (workout: Workout) => void;
    onDelete: (id: string) => void;
}

/**
 * History View component rendering an expandable list of completed workouts.
 */
export const HistoryView: React.FC<HistoryProps> = ({ workouts, onEdit, onDelete }) => {
    const [expandedWorkoutId, setExpandedWorkoutId] = useState<string | null>(null);

    const toggleWorkout = (id: string) => {
        setExpandedWorkoutId(prev => prev === id ? null : id);
    };

    return (
        <div className="pb-32 animate-in fade-in duration-500">
            <PageHeader title="History" subtitle="Your past victories." />

            <div className="space-y-6">
                {workouts.length === 0 ? (
                    <NeuCard className="text-center py-12 flex flex-col items-center">
                        <Dumbbell size={48} className="text-aura-textSecondary opacity-30 mb-4" />
                        <p className="font-medium text-aura-textSecondary">No workouts logged yet.</p>
                        <p className="text-sm text-aura-textSecondary opacity-70 mt-1">Go to the Log tab to start your first session.</p>
                    </NeuCard>
                ) : (
                    workouts.map(workout => {
                        const dateObj = new Date(workout.date);
                        const formattedDate = dateObj.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
                        const isExpanded = expandedWorkoutId === workout.id;

                        return (
                            <NeuCard key={workout.id} className="relative overflow-hidden cursor-pointer" onClick={() => toggleWorkout(workout.id)}>
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="font-bold text-lg text-aura-textPrimary tracking-tight flex items-center gap-2">
                                            {workout.name}
                                            {isExpanded ? <ChevronUp size={16} className="text-aura-textSecondary" /> : <ChevronDown size={16} className="text-aura-textSecondary" />}
                                        </h3>
                                        <div className="flex items-center gap-1.5 text-xs font-semibold text-aura-textSecondary mt-1">
                                            <Calendar size={14} /> {formattedDate}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="block text-sm font-extrabold text-aura-sage">{workout.volume.toLocaleString()}</span>
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-aura-textSecondary">Vol (lbs)</span>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-aura-shadowDark space-y-4">
                                    {workout.exercises.map(ex => (
                                        <div key={ex.id} className="text-sm">
                                            <div className="flex justify-between items-center">
                                                <span className="font-semibold text-aura-textPrimary truncate mr-4">{ex.name}</span>
                                                <span className="font-medium text-aura-textSecondary flex-shrink-0">
                                                    {ex.sets.length} {ex.sets.length === 1 ? 'set' : 'sets'}
                                                </span>
                                            </div>
                                            {isExpanded && (
                                                <div className="space-y-1 mt-2">
                                                    {ex.sets.map((set, idx) => (
                                                        <div key={set.id} className="flex justify-between items-center text-xs px-3 py-2 bg-aura-bg shadow-neu-in-sm rounded-lg">
                                                            <span className="font-bold text-aura-textSecondary">Set {idx + 1}</span>
                                                            <span className="font-extrabold text-aura-textPrimary">{set.weight} <span className="font-semibold text-aura-textSecondary mx-1">lbs ×</span> {set.reps}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                {isExpanded && (
                                    <div className="pt-4 mt-6 border-t border-aura-shadowDark flex justify-end gap-3">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); onEdit(workout); }}
                                            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-aura-textSecondary hover:text-aura-textPrimary bg-aura-bg rounded-lg shadow-neu-out transition-all active:shadow-neu-in"
                                        >
                                            <Edit3 size={14} /> Edit
                                        </button>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); onDelete(workout.id); }}
                                            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-aura-rose hover:text-red-500 bg-aura-bg rounded-lg shadow-neu-out transition-all active:shadow-neu-in"
                                        >
                                            <Trash2 size={14} /> Delete
                                        </button>
                                    </div>
                                )}
                            </NeuCard>
                        );
                    })
                )}
            </div>
        </div>
    );
};