import React from 'react';
import { Calendar, Dumbbell } from 'lucide-react';
import { NeuCard, PageHeader } from '../components/UI';
import { Workout } from '../types';

interface HistoryProps {
    workouts: Workout[];
}

export const HistoryView: React.FC<HistoryProps> = ({ workouts }) => {
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

                        return (
                            <NeuCard key={workout.id} className="relative overflow-hidden">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="font-bold text-lg text-aura-textPrimary tracking-tight">{workout.name}</h3>
                                        <div className="flex items-center gap-1.5 text-xs font-semibold text-aura-textSecondary mt-1">
                                            <Calendar size={14} /> {formattedDate}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="block text-sm font-extrabold text-aura-sage">{workout.volume.toLocaleString()}</span>
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-aura-textSecondary">Vol (lbs)</span>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-aura-shadowDark space-y-2">
                                    {workout.exercises.map(ex => (
                                        <div key={ex.id} className="flex justify-between items-center text-sm">
                                            <span className="font-semibold text-aura-textPrimary truncate mr-4">{ex.name}</span>
                                            <span className="font-medium text-aura-textSecondary flex-shrink-0">
                                                {ex.sets.length} {ex.sets.length === 1 ? 'set' : 'sets'}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </NeuCard>
                        );
                    })
                )}
            </div>
        </div>
    );
};