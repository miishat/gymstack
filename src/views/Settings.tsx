/**
 * @file Settings.tsx
 * @description Application settings view with global theme toggling and app metadata.
 * @author Mishat
 */

import React, { useState } from 'react';
import { Sun, Moon, Info, Download, Upload, Trash2, ChevronLeft, ChevronRight, Dumbbell } from 'lucide-react';
import { NeuCard, PageHeader, NeuButton, NeuInput } from '../components/UI';
import { CustomExercise, MuscleGroup, Workout } from '../types';

interface SettingsProps {
    workouts: Workout[];
    customExercises: CustomExercise[];
    customMuscleGroups: string[];
    importData: (w: Workout[], ce: CustomExercise[], cm: string[]) => void;
    addCustomExercise: (ex: CustomExercise) => void;
    deleteCustomExercise: (id: string) => void;
    addCustomMuscleGroup: (group: string) => void;
    deleteCustomMuscleGroup: (group: string) => void;
}

/**
 * Settings View component rendering theme toggle and app credits.
 */
export const SettingsView: React.FC<SettingsProps> = ({
    workouts,
    customExercises,
    customMuscleGroups,
    importData,
    addCustomExercise,
    deleteCustomExercise,
    addCustomMuscleGroup,
    deleteCustomMuscleGroup
}) => {
    const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains('dark'));
    const [manageExOpen, setManageExOpen] = useState(false);

    // Custom exercise form state
    const [newExName, setNewExName] = useState('');
    const [newExMuscle, setNewExMuscle] = useState('');
    const [customMuscleMode, setCustomMuscleMode] = useState(false);

    const toggleTheme = () => {
        const nextState = !isDark;
        setIsDark(nextState);
        if (nextState) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    };

    const handleExport = () => {
        const data = {
            workouts,
            customExercises,
            customMuscleGroups,
            version: '1.0'
        };
        const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `gymstack-backup-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const data = JSON.parse(event.target?.result as string);
                if (data.workouts) {
                    importData(data.workouts, data.customExercises || [], data.customMuscleGroups || []);
                    alert('Data imported successfully!');
                }
            } catch (err) {
                alert('Failed to parse backup file. Invalid format.');
            }
        };
        reader.readAsText(file);
    };

    const handleAddCustomExercise = () => {
        if (!newExName || !newExMuscle) return;

        if (customMuscleMode) {
            addCustomMuscleGroup(newExMuscle);
        }

        addCustomExercise({
            id: Date.now().toString(),
            name: newExName,
            muscleGroup: newExMuscle
        });

        setNewExName('');
        setNewExMuscle('');
        setCustomMuscleMode(false);
    };

    if (manageExOpen) {
        return (
            <div className="pb-32 animate-in slide-in-from-right-4 duration-300">
                <div className="flex items-center gap-3 mb-6">
                    <button onClick={() => setManageExOpen(false)} className="text-aura-textSecondary p-2 bg-aura-bg rounded-full shadow-neu-out active:shadow-neu-in">
                        <ChevronLeft size={20} />
                    </button>
                    <h2 className="text-2xl font-bold text-aura-textPrimary tracking-tight">Custom Exercises</h2>
                </div>

                <NeuCard className="mb-6">
                    <h3 className="text-sm font-bold text-aura-textPrimary mb-4">Add New Exercise</h3>
                    <div className="space-y-4">
                        <NeuInput
                            placeholder="Exercise Name (e.g. Wrist Curls)"
                            value={newExName}
                            onChange={e => setNewExName(e.target.value)}
                        />

                        {!customMuscleMode ? (
                            <div className="flex gap-2">
                                <select
                                    className="w-full bg-aura-bg shadow-neu-in rounded-xl px-4 py-3 outline-none text-aura-textPrimary font-semibold appearance-none"
                                    value={newExMuscle}
                                    onChange={e => {
                                        if (e.target.value === 'custom') {
                                            setCustomMuscleMode(true);
                                            setNewExMuscle('');
                                        } else {
                                            setNewExMuscle(e.target.value);
                                        }
                                    }}
                                >
                                    <option value="" disabled>Select Muscle Group...</option>
                                    {[...Object.values(MuscleGroup), ...customMuscleGroups].map(mg => (
                                        <option key={mg} value={mg}>{mg}</option>
                                    ))}
                                    <option value="custom" className="text-aura-sage font-bold">+ Create Custom Group...</option>
                                </select>
                            </div>
                        ) : (
                            <div className="flex gap-2">
                                <NeuInput
                                    placeholder="Custom Muscle (e.g. Forearms)"
                                    value={newExMuscle}
                                    onChange={e => setNewExMuscle(e.target.value)}
                                    className="flex-1"
                                />
                                <button onClick={() => setCustomMuscleMode(false)} className="px-4 bg-aura-bg rounded-xl shadow-neu-out text-aura-rose font-bold">Cancel</button>
                            </div>
                        )}

                        <NeuButton onClick={handleAddCustomExercise} className="w-full !text-aura-sage">
                            Save Exercise
                        </NeuButton>
                    </div>
                </NeuCard>

                <div className="space-y-4 mb-8">
                    <h3 className="text-sm font-bold text-aura-textSecondary uppercase tracking-widest px-2">Your Muscle Groups</h3>
                    {customMuscleGroups.length === 0 ? (
                        <div className="text-center py-4 text-aura-textSecondary opacity-50">
                            <p className="text-sm font-medium">No custom groups yet.</p>
                        </div>
                    ) : (
                        customMuscleGroups.map(group => (
                            <div key={group} className="flex items-center justify-between p-4 bg-aura-bg shadow-neu-out rounded-2xl">
                                <div>
                                    <h4 className="font-bold text-aura-textPrimary leading-tight">{group}</h4>
                                </div>
                                <button onClick={() => addCustomMuscleGroup(group) /* Replace with delete when uncommented below */} className="p-2 text-aura-rose bg-aura-bg rounded-full shadow-neu-out active:shadow-neu-in hidden" /* Temporarily passing through to suppress lint if delete wasn't imported */>
                                    <Trash2 size={16} />
                                </button>
                                <button onClick={() => {
                                    // Make sure we have the delete function available from props
                                    if (typeof deleteCustomMuscleGroup !== 'undefined') {
                                        deleteCustomMuscleGroup(group);
                                    }
                                }} className="p-2 text-aura-rose bg-aura-bg rounded-full shadow-neu-out active:shadow-neu-in">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))
                    )}
                </div>

                <div className="space-y-4">
                    <h3 className="text-sm font-bold text-aura-textSecondary uppercase tracking-widest px-2">Your Exercises</h3>
                    {customExercises.length === 0 ? (
                        <div className="text-center py-8 text-aura-textSecondary opacity-50">
                            <Dumbbell size={32} className="mx-auto mb-2" />
                            <p className="text-sm font-medium">No custom exercises yet.</p>
                        </div>
                    ) : (
                        customExercises.map(ex => (
                            <div key={ex.id} className="flex items-center justify-between p-4 bg-aura-bg shadow-neu-out rounded-2xl">
                                <div>
                                    <h4 className="font-bold text-aura-textPrimary leading-tight">{ex.name}</h4>
                                    <p className="text-[10px] font-bold text-aura-textSecondary uppercase tracking-widest">{ex.muscleGroup}</p>
                                </div>
                                <button onClick={() => deleteCustomExercise(ex.id)} className="p-2 text-aura-rose bg-aura-bg rounded-full shadow-neu-out active:shadow-neu-in">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="pb-32 animate-in fade-in duration-500">
            <PageHeader title="Settings" subtitle="Customize your experience." />

            <div className="space-y-6">
                {/* Theme Toggle Component */}
                <NeuCard>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-aura-bg shadow-neu-in rounded-full text-aura-sage">
                            {isDark ? <Moon size={20} /> : <Sun size={20} />}
                        </div>
                        <h3 className="font-semibold text-aura-textPrimary text-lg">Appearance</h3>
                    </div>

                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-aura-textSecondary">Theme Style</span>

                        <div
                            className="w-24 h-12 bg-aura-bg rounded-full shadow-neu-in flex items-center p-1 cursor-pointer relative overflow-hidden"
                            onClick={toggleTheme}
                        >
                            <div className="flex w-full justify-between px-3 z-0 text-aura-textSecondary opacity-50">
                                <Sun size={18} />
                                <Moon size={18} />
                            </div>
                            <div
                                className={`w-10 h-10 rounded-full bg-aura-bg shadow-neu-out flex items-center justify-center transition-all duration-500 ease-in-out absolute top-1 ${isDark ? 'translate-x-[48px]' : 'translate-x-0'}`}
                            >
                                {isDark ? (
                                    <Moon size={18} className="text-aura-lavender" strokeWidth={2.5} />
                                ) : (
                                    <Sun size={18} className="text-aura-sage" strokeWidth={2.5} />
                                )}
                            </div>
                        </div>
                    </div>
                </NeuCard>

                {/* Data Management Section */}
                <NeuCard>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-aura-bg shadow-neu-in rounded-full text-aura-rose">
                            <Download size={20} />
                        </div>
                        <h3 className="font-semibold text-aura-textPrimary text-lg">Data Management</h3>
                    </div>

                    <div className="space-y-4">
                        <NeuButton onClick={handleExport} className="w-full flex items-center justify-center gap-2 font-bold !shadow-neu-out text-aura-textPrimary">
                            <Download size={18} /> Export Backup (JSON)
                        </NeuButton>
                        <div className="relative">
                            <NeuButton className="w-full flex items-center justify-center gap-2 font-bold !shadow-neu-out text-aura-textPrimary">
                                <Upload size={18} /> Import Backup Data
                            </NeuButton>
                            <input
                                type="file"
                                accept=".json"
                                onChange={handleImport}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                        </div>
                    </div>
                </NeuCard>

                {/* Manage Custom Exercises */}
                <NeuCard>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-aura-bg shadow-neu-in rounded-full text-aura-lavender">
                                <Dumbbell size={20} />
                            </div>
                            <h3 className="font-semibold text-aura-textPrimary text-lg">Custom Exercises</h3>
                        </div>
                        <NeuButton onClick={() => setManageExOpen(true)} className="!p-2">
                            <ChevronRight size={20} />
                        </NeuButton>
                    </div>
                </NeuCard>

                {/* About Section */}
                <NeuCard>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-aura-bg shadow-neu-in rounded-full text-aura-textSecondary">
                            <Info size={20} />
                        </div>
                        <h3 className="font-semibold text-aura-textPrimary text-lg">About</h3>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-aura-textSecondary">App Version</span>
                            <span className="text-sm font-bold text-aura-textPrimary tracking-tight">0.8.0</span>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-aura-shadowDark">
                            <span className="text-sm font-medium text-aura-textSecondary">Credits</span>
                            <span className="text-sm font-bold text-aura-textPrimary bg-aura-bg px-3 py-1.5 rounded-full shadow-neu-in-sm tracking-tight text-aura-lavender">
                                Made by @Mishat
                            </span>
                        </div>
                    </div>
                </NeuCard>
            </div>
        </div>
    );
};
