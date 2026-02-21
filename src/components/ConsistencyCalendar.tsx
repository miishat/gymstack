import React, { useMemo, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Workout } from '../types';

interface ConsistencyCalendarProps {
    workouts: Workout[];
}

export const ConsistencyCalendar: React.FC<ConsistencyCalendarProps> = ({ workouts }) => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const { days, months } = useMemo(() => {
        const today = new Date();
        today.setHours(23, 59, 59, 999); // Safe high bound for today

        // Go back approx half a year (180 days) for a rich, full heatmap that scrolls
        const startDate = new Date();
        startDate.setHours(0, 0, 0, 0); // Start securely at midnight 180 days ago
        startDate.setDate(startDate.getDate() - 180);

        // Ensure we start on a Sunday for the grid alignment
        const startDayOfWeek = startDate.getDay();
        if (startDayOfWeek !== 0) {
            startDate.setDate(startDate.getDate() - startDayOfWeek);
        }

        const daysArray = [];
        const monthsMap = new Map<string, number>(); // month name -> column index

        let colIndex = 0;
        let currentDate = new Date(startDate);

        while (currentDate <= today || currentDate.getDay() !== 0) {
            if (currentDate > today && currentDate.getDay() === 0) break; // End after last week is full

            const year = currentDate.getFullYear();
            const month = currentDate.getMonth();
            const date = currentDate.getDate();
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(date).padStart(2, '0')}`;

            const workoutsOnDay = workouts.filter(w => {
                const wDate = new Date(w.date);
                return wDate.getFullYear() === year && wDate.getMonth() === month && wDate.getDate() === date;
            });
            const volumeOnDay = workoutsOnDay.reduce((acc, w) => acc + w.volume, 0);

            let intensity = 0;
            if (volumeOnDay > 0) intensity = 1;
            if (volumeOnDay > 10000) intensity = 2;
            if (volumeOnDay > 20000) intensity = 3;

            // Strict midnight check against today's boundary to prevent invisible
            const isFutureDay = currentDate > today;

            daysArray.push({
                date: dateStr,
                intensity,
                volume: volumeOnDay,
                isFuture: isFutureDay
            });

            if (currentDate.getDate() === 1) {
                const monthName = currentDate.toLocaleString('default', { month: 'short' });
                if (!Array.from(monthsMap.keys()).includes(monthName)) {
                    monthsMap.set(monthName, colIndex);
                }
            } else if (daysArray.length === 1 && currentDate.getDate() <= 15) {
                // If the first day is before the 15th, show the month. Otherwise, wait for the next month to avoid overlap.
                const monthName = currentDate.toLocaleString('default', { month: 'short' });
                monthsMap.set(monthName, colIndex);
            }

            if (currentDate.getDay() === 6) {
                colIndex++;
            }

            currentDate.setDate(currentDate.getDate() + 1);
        }

        // Reverse the months map so it flows correctly when iterating (since we generate from past -> present)
        return { days: daysArray, months: Array.from(monthsMap.entries()) };
    }, [workouts]);

    // Group days by column (weeks)
    const weeks = [];
    for (let i = 0; i < days.length; i += 7) {
        weeks.push(days.slice(i, i + 7));
    }

    const getIntensityColor = (intensity: number) => {
        switch (intensity) {
            case 1: return 'bg-aura-sage/30';
            case 2: return 'bg-aura-sage/60';
            case 3: return 'bg-aura-sage shadow-[0_0_8px_rgba(167,243,208,0.5)] border border-aura-sage/20';
            default: return 'bg-aura-bg border border-black/5 dark:border-white/5';
        }
    };

    // Scroll to the latest month on mount
    useEffect(() => {
        if (scrollContainerRef.current) {
            // A short timeout ensures browser has calculated the scroll width after render
            setTimeout(() => {
                if (scrollContainerRef.current) {
                    scrollContainerRef.current.scrollLeft = scrollContainerRef.current.scrollWidth;
                }
            }, 50);
        }
    }, [days]);

    return (
        <div ref={scrollContainerRef} className="w-full overflow-x-auto no-scrollbar pb-2">
            <div className="min-w-max flex gap-1.5">
                <div className="flex flex-col text-[10px] font-bold text-aura-textSecondary pr-2 pt-[20px] justify-between hidden sm:flex h-[134px]">
                    <span className="mt-0.5">Mon</span>
                    <span className="-mb-1">Wed</span>
                    <span className="mb-1">Fri</span>
                </div>

                {weeks.map((week, weekIdx) => {
                    const monthData = months.find(([, c]) => c === weekIdx);
                    const monthLabel = monthData ? monthData[0] : null;
                    return (
                        <div key={weekIdx} className="flex flex-col gap-1.5 w-3.5 flex-shrink-0">
                            <div className="h-4 relative w-full mb-0.5">
                                {monthLabel && (
                                    <span className="absolute bottom-0 left-0 text-[10px] font-bold text-aura-textSecondary uppercase tracking-widest z-10 whitespace-nowrap">
                                        {monthLabel}
                                    </span>
                                )}
                            </div>
                            {week.map((day, dayIdx) => (
                                <motion.div
                                    key={day.date}
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: (weekIdx * 0.01) + (dayIdx * 0.01), duration: 0.3 }}
                                    className={`w-3.5 h-3.5 rounded-sm ${day.isFuture ? 'invisible' : getIntensityColor(day.intensity)} relative group`}
                                >
                                    {day.intensity > 0 && (
                                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-[#111] text-aura-textPrimary text-[10px] font-bold rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none shadow-neu-out border border-white/5">
                                            {day.volume.toLocaleString()} lbs on {new Date(day.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
