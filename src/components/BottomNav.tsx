import React from 'react';
import { Home, PlusSquare, Timer, History, Calculator } from 'lucide-react';
import { ViewState } from '../types';

interface NavProps {
    currentView: ViewState;
    setView: (view: ViewState) => void;
}

export const BottomNav: React.FC<NavProps> = ({ currentView, setView }) => {
    const navItems = [
        { id: 'dashboard', icon: Home, label: 'Home' },
        { id: 'logger', icon: PlusSquare, label: 'Log' },
        { id: 'tools', icon: Calculator, label: 'Plates' },
        { id: 'timer', icon: Timer, label: 'Timer' },
        { id: 'history', icon: History, label: 'History' },
    ] as const;

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-aura-bg shadow-neu-nav rounded-t-3xl pb-safe pt-2 px-4 z-50 transition-colors duration-300">
            <div className="flex justify-between items-center max-w-md mx-auto h-20">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = currentView === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => setView(item.id)}
                            className={`flex flex-col items-center justify-center flex-1 h-full transition-all duration-300 ${isActive ? 'text-aura-sage transform -translate-y-1' : 'text-aura-textSecondary hover:text-aura-textPrimary'
                                }`}
                        >
                            <div className={`p-2.5 rounded-2xl transition-all duration-300 ${isActive ? 'bg-aura-bg shadow-neu-in' : ''}`}>
                                <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                            </div>
                            <span className={`text-[10px] font-bold tracking-wide mt-1.5 ${isActive ? 'opacity-100 text-aura-sage' : 'opacity-0'} transition-opacity`}>
                                {item.label}
                            </span>
                        </button>
                    );
                })}
            </div>
        </nav>
    );
};