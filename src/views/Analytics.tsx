/**
 * @file Analytics.tsx
 * @description View component for granular chart visualizations of specific exercises over time.
 * @author Mishat
 */

import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Activity, Target, ChevronDown } from 'lucide-react';
import { NeuCard, PageHeader } from '../components/UI';
import { Workout } from '../types';
import { calculate1RM } from '../hooks/useWorkoutStore';

interface AnalyticsProps {
    workouts: Workout[];
}

export const AnalyticsView: React.FC<AnalyticsProps> = ({ workouts }) => {
    const [selectedExercise, setSelectedExercise] = useState<string>('');
    const [metric, setMetric] = useState<'1rm' | 'volume'>('1rm');

    // Extract a list of all unique exercises the user has ever performed
    const availableExercises = useMemo(() => {
        const uniqueNames = new Set<string>();
        workouts.forEach(w => w.exercises.forEach(ex => uniqueNames.add(ex.name)));
        return Array.from(uniqueNames).sort();
    }, [workouts]);

    // Set default exercise if not set
    useMemo(() => {
        if (!selectedExercise && availableExercises.length > 0) {
            setSelectedExercise(availableExercises[0]);
        }
    }, [selectedExercise, availableExercises]);

    // Process data for the chart based on the selected exercise
    const chartData = useMemo(() => {
        if (!selectedExercise) return [];

        const data: { date: string, value: number, formattedDate: string }[] = [];

        // Sort workouts chronologically
        const sortedWorkouts = [...workouts].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        sortedWorkouts.forEach(workout => {
            const exerciseInstance = workout.exercises.find(ex => ex.name === selectedExercise);
            if (exerciseInstance) {
                const dateObj = new Date(workout.date);
                const formattedDate = dateObj.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });

                let value = 0;
                if (metric === '1rm') {
                    // Find the best 1RM from the sets in this workout for this exercise
                    let best1RM = 0;
                    exerciseInstance.sets.forEach(set => {
                        const estMax = calculate1RM(set.weight, set.reps);
                        if (estMax > best1RM) best1RM = estMax;
                    });
                    value = Math.round(best1RM);
                } else {
                    // Calculate total volume for this exercise in this workout
                    let totalVol = 0;
                    exerciseInstance.sets.forEach(set => {
                        let vol = set.weight * set.reps;
                        if (exerciseInstance.isUnilateral) vol *= 2;
                        totalVol += vol;
                    });
                    value = totalVol;
                }

                data.push({
                    date: workout.date,
                    formattedDate,
                    value
                });
            }
        });

        return data;
    }, [workouts, selectedExercise, metric]);

    return (
        <div className="pb-32 animate-in fade-in duration-500">
            <PageHeader title="Analytics" subtitle="Granular progress tracking." />

            <div className="space-y-6">
                <NeuCard>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-aura-bg shadow-neu-in rounded-full text-aura-lavender">
                            <Target size={20} />
                        </div>
                        <h3 className="font-semibold text-aura-textPrimary text-lg">Select Exercise</h3>
                    </div>

                    {availableExercises.length === 0 ? (
                        <p className="text-sm font-medium text-aura-textSecondary text-center py-4">No exercises logged yet.</p>
                    ) : (
                        <div className="relative">
                            <select
                                value={selectedExercise}
                                onChange={(e) => setSelectedExercise(e.target.value)}
                                className="w-full appearance-none bg-aura-bg border-none rounded-xl px-4 py-3 text-sm font-bold text-aura-textPrimary shadow-neu-in focus:outline-none focus:ring-2 focus:ring-aura-lavender pr-10"
                            >
                                {availableExercises.map(exName => (
                                    <option key={exName} value={exName}>{exName}</option>
                                ))}
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-aura-textSecondary">
                                <ChevronDown size={18} strokeWidth={3} />
                            </div>
                        </div>
                    )}

                    <div className="flex gap-4 mt-6">
                        <button
                            onClick={() => setMetric('1rm')}
                            className={`flex flex-col flex-1 items-center justify-center p-3 rounded-2xl transition-all ${metric === '1rm' ? 'bg-aura-bg shadow-neu-in text-aura-lavender' : 'shadow-neu-out text-aura-textSecondary hover:text-aura-textPrimary'}`}
                        >
                            <TrendingUp size={20} className="mb-1" />
                            <span className="text-[10px] font-extrabold uppercase tracking-widest">Est. 1RM</span>
                        </button>
                        <button
                            onClick={() => setMetric('volume')}
                            className={`flex flex-col flex-1 items-center justify-center p-3 rounded-2xl transition-all ${metric === 'volume' ? 'bg-aura-bg shadow-neu-in text-aura-sage' : 'shadow-neu-out text-aura-textSecondary hover:text-aura-textPrimary'}`}
                        >
                            <Activity size={20} className="mb-1" />
                            <span className="text-[10px] font-extrabold uppercase tracking-widest">Volume (lbs)</span>
                        </button>
                    </div>
                </NeuCard>

                {chartData.length > 0 && (
                    <NeuCard className="!p-0 overflow-hidden">
                        <div className="p-6 pb-0">
                            <h3 className="font-bold text-aura-textPrimary flex items-center gap-2 tracking-tight">
                                {selectedExercise} Progress
                            </h3>
                            <p className="text-xs font-bold text-aura-textSecondary uppercase tracking-widest mt-1">
                                {metric === '1rm' ? 'Estimated 1 Rep Max' : 'Total Exercise Volume'}
                            </p>
                        </div>
                        <div className="h-64 w-full mt-6 pr-6 pb-2">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                    <XAxis
                                        dataKey="formattedDate"
                                        stroke="var(--color-text-secondary)"
                                        fontSize={10}
                                        tickLine={false}
                                        axisLine={false}
                                        dy={10}
                                    />
                                    <YAxis
                                        stroke="var(--color-text-secondary)"
                                        fontSize={10}
                                        tickLine={false}
                                        axisLine={false}
                                        tickFormatter={(val) => val >= 1000 ? `${(val / 1000).toFixed(1)}k` : val}
                                    />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: 'var(--color-aura-bg)', borderRadius: '16px', border: 'none', boxShadow: '4px 4px 8px var(--color-shadow-dark), -4px -4px 8px var(--color-shadow-light)' }}
                                        itemStyle={{ color: 'var(--color-text-primary)', fontWeight: 'bold' }}
                                        labelStyle={{ color: 'var(--color-text-secondary)', fontSize: '12px', fontWeight: 'bold', marginBottom: '4px' }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="value"
                                        name={metric === '1rm' ? '1RM (lbs)' : 'Volume (lbs)'}
                                        stroke={metric === '1rm' ? 'var(--color-lavender)' : 'var(--color-sage)'}
                                        strokeWidth={4}
                                        dot={{ fill: 'var(--color-aura-bg)', strokeWidth: 2, r: 4 }}
                                        activeDot={{ r: 6, strokeWidth: 0 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </NeuCard>
                )}
            </div>
        </div>
    );
};
