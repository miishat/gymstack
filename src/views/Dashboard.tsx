import React, { useMemo } from 'react';
import { AreaChart, Area, ResponsiveContainer, Tooltip } from 'recharts';
import { Activity, Flame, TrendingUp } from 'lucide-react';
import { NeuCard, PageHeader } from '../components/UI';
import { Workout } from '../types';
import { MUSCLE_COLORS } from '../constants';

interface DashboardProps {
    workouts: Workout[];
    volumeData: { name: string; volume: number }[];
    heatmapData: { muscle: string; intensity: number }[];
}

export const Dashboard: React.FC<DashboardProps> = ({ workouts, volumeData, heatmapData }) => {
    const totalWorkouts = workouts.length;
    const thisWeekWorkouts = useMemo(() => {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        return workouts.filter(w => new Date(w.date) >= oneWeekAgo).length;
    }, [workouts]);

    const Ring = ({ progress, color }: { progress: number, color: string }) => {
        const radius = 36;
        const circumference = 2 * Math.PI * radius;
        const offset = circumference - (progress / 100) * circumference;

        return (
            <svg viewBox="0 0 96 96" className="transform -rotate-90 w-24 h-24 overflow-visible">
                <circle cx="48" cy="48" r={radius} stroke="var(--color-text-secondary)" opacity="0.2" strokeWidth="8" fill="transparent" />
                <circle
                    cx="48" cy="48" r={radius}
                    stroke={color} strokeWidth="8" fill="transparent"
                    strokeDasharray={circumference} strokeDashoffset={offset}
                    className="transition-all duration-1000 ease-in-out drop-shadow-md"
                    strokeLinecap="round"
                />
            </svg>
        );
    };

    return (
        <div className="pb-32 animate-in fade-in duration-500">
            <PageHeader title="Overview" subtitle="Your journey, quantified." />

            {/* Top Stats */}
            <div className="grid grid-cols-2 gap-6 mb-8">
                <NeuCard className="flex flex-col items-center justify-center py-6 h-full">
                    <div className="flex items-center justify-center gap-2 mb-3 w-full text-aura-sage">
                        <Activity size={18} strokeWidth={2.5} />
                        <span className="text-xs font-bold uppercase tracking-wider text-aura-textSecondary">This Week</span>
                    </div>
                    <div className="relative w-24 h-24 flex items-center justify-center mt-2">
                        <Ring progress={Math.min((thisWeekWorkouts / 4) * 100, 100)} color="var(--color-sage)" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-2xl font-extrabold text-aura-textPrimary tracking-tight">{thisWeekWorkouts}/4</span>
                        </div>
                    </div>
                </NeuCard>

                <NeuCard className="flex flex-col items-center justify-center py-6 h-full">
                    <div className="flex items-center justify-center gap-2 mb-3 w-full text-aura-rose">
                        <Flame size={18} strokeWidth={2.5} />
                        <span className="text-xs font-bold uppercase tracking-wider text-aura-textSecondary">Total Lifts</span>
                    </div>
                    <div className="flex-1 flex items-center justify-center">
                        <span className="text-5xl font-extrabold text-aura-textPrimary tracking-tighter">{totalWorkouts}</span>
                    </div>
                </NeuCard>
            </div>

            {/* Volume Chart */}
            <NeuCard className="mb-8 p-0 overflow-hidden">
                <div className="p-6 pb-2">
                    <div className="flex items-center gap-2.5">
                        <TrendingUp size={20} className="text-aura-lavender" />
                        <h3 className="font-bold text-aura-textPrimary tracking-tight">Volume History</h3>
                    </div>
                </div>
                <div className="h-48 w-full mt-4">
                    {volumeData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={volumeData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="var(--color-lavender)" stopOpacity={0.4} />
                                        <stop offset="95%" stopColor="var(--color-lavender)" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'var(--color-aura-bg)', borderRadius: '16px', border: 'none', boxShadow: '4px 4px 8px var(--color-shadow-dark), -4px -4px 8px var(--color-shadow-light)' }}
                                    itemStyle={{ color: 'var(--color-text-primary)', fontWeight: 'bold' }}
                                />
                                <Area type="monotone" dataKey="volume" stroke="var(--color-lavender)" strokeWidth={3} fillOpacity={1} fill="url(#colorVolume)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex h-full items-center justify-center text-aura-textSecondary text-sm pb-8 font-medium">
                            No data yet. Start lifting!
                        </div>
                    )}
                </div>
            </NeuCard>

            {/* Muscle Heatmap */}
            <NeuCard>
                <h3 className="font-bold text-aura-textPrimary mb-6 flex items-center gap-2 tracking-tight">
                    Muscle Activity <span className="text-xs font-semibold text-aura-textSecondary uppercase tracking-widest ml-2">Last 7 Days</span>
                </h3>
                {heatmapData.length > 0 ? (
                    <div className="space-y-5">
                        {heatmapData.map((data) => (
                            <div key={data.muscle} className="flex items-center gap-4">
                                <span className="w-20 text-sm font-bold text-aura-textPrimary tracking-tight">{data.muscle}</span>
                                <div className="flex-1 h-3 rounded-full shadow-neu-in overflow-hidden bg-aura-bg">
                                    <div
                                        className="h-full rounded-full transition-all duration-1000 ease-out shadow-sm"
                                        style={{
                                            width: `${data.intensity}%`,
                                            backgroundColor: MUSCLE_COLORS[data.muscle as keyof typeof MUSCLE_COLORS] || 'var(--color-shadow-dark)'
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm font-medium text-aura-textSecondary text-center py-4">Complete workouts to see your heatmap.</p>
                )}
            </NeuCard>
        </div>
    );
};