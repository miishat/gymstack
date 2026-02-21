/**
 * @file Tools.tsx
 * @description Utility calculators for quick gym math, such as the barbell plate calculator.
 * @author Mishat
 */

import React, { useState, useMemo } from 'react';
import { Calculator, Zap } from 'lucide-react';
import { NeuCard, NeuInput, NeuButton, PageHeader } from '../components/UI';
import { calculate1RM } from '../hooks/useWorkoutStore';

/**
 * Tools View component currently featuring a plate calculator for target weights.
 */
export const ToolsView: React.FC = () => {
    // Plate Calculator State
    const [targetWeight, setTargetWeight] = useState<string>('135');
    const [barWeight, setBarWeight] = useState<number>(45);

    // 1RM Calculator State
    const [calcRepWeight, setCalcRepWeight] = useState<string>('135');
    const [calcReps, setCalcReps] = useState<string>('10');

    const estimated1RM = useMemo(() => {
        const w = parseFloat(calcRepWeight) || 0;
        const r = parseInt(calcReps) || 0;
        return calculate1RM(w, r);
    }, [calcRepWeight, calcReps]);

    const individualPlates = useMemo(() => {
        const weight = parseFloat(targetWeight);
        if (isNaN(weight) || weight <= barWeight) return [];

        let remainingPerSide = (weight - barWeight) / 2;
        const availablePlates = [45, 35, 25, 10, 5, 2.5];
        const plates: number[] = [];

        // Breakdown perfectly into individual plates mapped out
        for (const plate of availablePlates) {
            while (remainingPerSide >= plate) {
                plates.push(plate);
                remainingPerSide -= plate;
            }
        }
        return plates;
    }, [targetWeight, barWeight]);

    // Adjusted dimensions to stack beautifully without neumorphic gradients
    const plateSizes: Record<number, string> = {
        45: 'h-32 w-10',
        35: 'h-28 w-10',
        25: 'h-24 w-8',
        10: 'h-16 w-6',
        5: 'h-12 w-5',
        2.5: 'h-10 w-4'
    };

    return (
        <div className="animate-in fade-in duration-500 pb-32">
            <PageHeader title="Tools" subtitle="Gym math, simplified." />

            <div className="space-y-6">

                {/* Plate Calculator Component */}
                <NeuCard>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-aura-bg shadow-neu-in rounded-full text-aura-lavender">
                            <Calculator size={20} />
                        </div>
                        <h3 className="font-semibold text-aura-textPrimary text-lg">Calculate Load</h3>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-aura-textSecondary mb-2">Target Weight (lbs)</label>
                            <NeuInput
                                type="number"
                                value={targetWeight}
                                onChange={(e) => setTargetWeight(e.target.value)}
                                className="text-2xl font-bold py-4"
                                placeholder="0"
                            />
                        </div>

                        <div className="flex gap-4">
                            <NeuButton
                                active={barWeight === 45}
                                onClick={() => setBarWeight(45)}
                                className={`flex-1 text-sm font-bold py-3 ${barWeight === 45 ? '!text-aura-lavender' : ''}`}
                            >
                                45 lb Bar
                            </NeuButton>
                            <NeuButton
                                active={barWeight === 35}
                                onClick={() => setBarWeight(35)}
                                className={`flex-1 text-sm font-bold py-3 ${barWeight === 35 ? '!text-aura-lavender' : ''}`}
                            >
                                35 lb Bar
                            </NeuButton>
                        </div>

                        <div className="pt-8 border-t border-aura-shadowDark">
                            <h4 className="text-xs font-bold text-aura-textSecondary mb-6 uppercase tracking-widest text-center">Load per side</h4>

                            {/* Scrollable Container ensures we don't overflow on massive lifts */}
                            <div className="flex items-center justify-center min-h-[160px] overflow-x-auto py-4">

                                <div className="flex items-center gap-1">
                                    {individualPlates.length === 0 ? (
                                        <span className="text-aura-textSecondary font-bold bg-aura-bg px-4 py-2 rounded-xl shadow-neu-out">Bar Only</span>
                                    ) : (
                                        /* Reverse the array: Big plates render first on the right, smaller plates extend leftwards */
                                        [...individualPlates].reverse().map((weight, idx) => (
                                            <div
                                                key={`${weight}-${idx}`}
                                                className={`flex items-center justify-center rounded-md border-2 border-aura-bg bg-aura-textPrimary text-aura-bg transition-all animate-in zoom-in ${plateSizes[weight]}`}
                                            >
                                                <span className={`transform -rotate-90 font-black tracking-tighter ${weight >= 25 ? 'text-xl' : 'text-sm'}`}>
                                                    {weight}
                                                </span>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>

                        </div>
                    </div>
                </NeuCard>

                {/* 1RM Calculator Component */}
                <NeuCard>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-aura-bg shadow-neu-in rounded-full text-aura-sage">
                            <Zap size={20} />
                        </div>
                        <h3 className="font-semibold text-aura-textPrimary text-lg">1RM Calculator</h3>
                    </div>

                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-aura-textSecondary mb-2 uppercase tracking-widest">Weight (lbs)</label>
                                <NeuInput
                                    type="number"
                                    value={calcRepWeight}
                                    onChange={(e) => setCalcRepWeight(e.target.value)}
                                    className="text-xl font-bold py-3 text-center"
                                    placeholder="0"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-aura-textSecondary mb-2 uppercase tracking-widest">Reps</label>
                                <NeuInput
                                    type="number"
                                    value={calcReps}
                                    onChange={(e) => setCalcReps(e.target.value)}
                                    className="text-xl font-bold py-3 text-center"
                                    placeholder="0"
                                />
                            </div>
                        </div>

                        <div className="pt-6 border-t border-aura-shadowDark flex flex-col items-center justify-center">
                            <h4 className="text-xs font-bold text-aura-textSecondary mb-2 uppercase tracking-widest">Estimated 1RM</h4>
                            <div className="text-4xl font-black text-aura-sage tracking-tighter">
                                {Math.round(estimated1RM)} <span className="text-lg font-bold text-aura-textSecondary tracking-normal">lbs</span>
                            </div>
                        </div>
                    </div>
                </NeuCard>
            </div>
        </div>
    );
};