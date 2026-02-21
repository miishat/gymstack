import React, { useState, useMemo } from 'react';
import { Calculator } from 'lucide-react';
import { NeuCard, NeuInput, PageHeader } from '../components/UI';

export const ToolsView: React.FC = () => {
    const [targetWeight, setTargetWeight] = useState<string>('135');
    const [barWeight, setBarWeight] = useState<number>(45);

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
        <div className="animate-in fade-in duration-500">
            <PageHeader title="Plate Calculator" subtitle="Gym math, simplified." />

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
                        <label className="flex items-center gap-2 text-sm font-bold text-aura-textPrimary cursor-pointer">
                            <input type="radio" name="bar" checked={barWeight === 45} onChange={() => setBarWeight(45)} className="accent-aura-sage w-4 h-4" />
                            45 lb Bar
                        </label>
                        <label className="flex items-center gap-2 text-sm font-bold text-aura-textPrimary cursor-pointer">
                            <input type="radio" name="bar" checked={barWeight === 35} onChange={() => setBarWeight(35)} className="accent-aura-sage w-4 h-4" />
                            35 lb Bar
                        </label>
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
        </div>
    );
};