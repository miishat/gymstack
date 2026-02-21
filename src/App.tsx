import React, { useState } from 'react';
import { Sun, Moon } from 'lucide-react';
import { ViewState } from './types';
import { useWorkoutStore } from './hooks/useWorkoutStore';
import { Dashboard } from './views/Dashboard';
import { Logger } from './views/Logger';
import { ToolsView } from './views/Tools';
import { TimerView } from './views/Timer';
import { HistoryView } from './views/History';
import { BottomNav } from './components/BottomNav';

const App: React.FC = () => {
    const [currentView, setCurrentView] = useState<ViewState>('dashboard');
    const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains('dark'));
    const { workouts, addWorkout, getRecentVolumeData, getMuscleHeatmapData, getHistory, getLastExerciseStats } = useWorkoutStore();

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

    const handleSaveWorkout = (workout: any) => {
        addWorkout(workout);
        setCurrentView('dashboard');
    };

    return (
        <div className="min-h-screen bg-aura-bg flex justify-center">
            {/* Mobile container constraint for desktop viewing */}
            <div className="w-full max-w-md bg-aura-bg min-h-screen shadow-2xl relative overflow-hidden">

                {/* Global Theme Toggle - Fixed firmly to Top Right */}
                <button
                    onClick={toggleTheme}
                    className="absolute top-10 right-6 p-3 bg-aura-bg shadow-neu-out active:shadow-neu-in rounded-full text-aura-textPrimary transition-all duration-300 hover:text-aura-sage z-50"
                    aria-label="Toggle dark mode"
                >
                    {isDark ? <Sun size={20} strokeWidth={2.5} /> : <Moon size={20} strokeWidth={2.5} />}
                </button>

                {/* Main Content Area */}
                <main className="h-full overflow-y-auto px-6 pt-12 pb-32">
                    <div className={currentView === 'dashboard' ? 'block' : 'hidden'}>
                        <Dashboard
                            workouts={workouts}
                            volumeData={getRecentVolumeData()}
                            heatmapData={getMuscleHeatmapData()}
                        />
                    </div>

                    <div className={currentView === 'logger' ? 'block' : 'hidden'}>
                        <Logger
                            onSave={handleSaveWorkout}
                            onCancel={() => setCurrentView('dashboard')}
                            getLastExerciseStats={getLastExerciseStats}
                        />
                    </div>

                    <div className={currentView === 'tools' ? 'block' : 'hidden'}>
                        <ToolsView />
                    </div>

                    <div className={currentView === 'timer' ? 'block' : 'hidden'}>
                        <TimerView />
                    </div>

                    <div className={currentView === 'history' ? 'block' : 'hidden'}>
                        <HistoryView workouts={getHistory()} />
                    </div>
                </main>

                <BottomNav currentView={currentView} setView={setCurrentView} />
            </div>
        </div>
    );
};

export default App;