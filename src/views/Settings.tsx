/**
 * @file Settings.tsx
 * @description Application settings view with global theme toggling and app metadata.
 * @author Mishat
 */

import React, { useState } from 'react';
import { Sun, Moon, Info } from 'lucide-react';
import { NeuCard, PageHeader } from '../components/UI';

/**
 * Settings View component rendering theme toggle and app credits.
 */
export const SettingsView: React.FC = () => {
    const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains('dark'));

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
                            <span className="text-sm font-bold text-aura-textPrimary tracking-tight">0.7.0</span>
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
