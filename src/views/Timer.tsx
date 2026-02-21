import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { NeuButton, PageHeader } from '../components/UI';

export const TimerView: React.FC = () => {
    const [duration, setDuration] = useState(90); // default 90s
    const [timeLeft, setTimeLeft] = useState(90);
    const [isActive, setIsActive] = useState(false);
    const timerRef = useRef<number | null>(null);

    const startTimer = useCallback(() => {
        if (timeLeft > 0) setIsActive(true);
    }, [timeLeft]);

    const pauseTimer = useCallback(() => {
        setIsActive(false);
    }, []);

    const resetTimer = useCallback(() => {
        setIsActive(false);
        setTimeLeft(duration);
    }, [duration]);

    const setPreset = useCallback((sec: number) => {
        setIsActive(false);
        setDuration(sec);
        setTimeLeft(sec);
    }, []);

    useEffect(() => {
        if (isActive && timeLeft > 0) {
            timerRef.current = window.setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            setIsActive(false);
        }

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [isActive, timeLeft]);

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    const percentage = (timeLeft / duration) * 100;

    let glowColor = 'rgba(147, 197, 253, 0.4)';
    if (percentage <= 50 && percentage > 15) {
        glowColor = 'rgba(252, 211, 77, 0.4)';
    } else if (percentage <= 15) {
        glowColor = 'rgba(252, 165, 165, 0.5)';
    }

    const presets = [
        { label: '1m', sec: 60 },
        { label: '1.5m', sec: 90 },
        { label: '2m', sec: 120 },
        { label: '3m', sec: 180 },
    ];

    return (
        <div className="pb-32 animate-in fade-in duration-500 flex flex-col items-center">
            <div className="w-full self-start mb-8">
                <PageHeader title="Vibe Timer" subtitle="Recover optimally." />
            </div>

            <div className="relative flex items-center justify-center mb-12 mt-8">
                <div
                    className="absolute inset-0 rounded-full blur-3xl transition-colors duration-1000 ease-in-out"
                    style={{
                        backgroundColor: glowColor,
                        transform: isActive ? 'scale(1.2)' : 'scale(1)',
                        opacity: isActive ? 0.8 : 0.3
                    }}
                />

                <div className="relative z-10 w-64 h-64 rounded-full bg-aura-bg shadow-neu-out flex items-center justify-center">
                    <div className="w-52 h-52 rounded-full shadow-neu-in flex flex-col items-center justify-center relative overflow-hidden">

                        <div
                            className="absolute bottom-0 left-0 right-0 bg-aura-shadowLight opacity-50 transition-all duration-1000 ease-linear"
                            style={{ height: `${percentage}%` }}
                        />

                        <span className="relative z-10 text-6xl font-extrabold text-aura-textPrimary tracking-tighter">
                            {formatTime(timeLeft)}
                        </span>
                        <span className="relative z-10 text-[10px] font-bold text-aura-textSecondary mt-2 tracking-widest uppercase">
                            {isActive ? 'Recovering' : 'Paused'}
                        </span>
                    </div>
                </div>
            </div>

            <div className="flex gap-6 mb-12">
                <NeuButton onClick={resetTimer} className="!rounded-full p-4 text-aura-textSecondary shadow-neu-out active:shadow-neu-in">
                    <RotateCcw size={24} strokeWidth={2.5} />
                </NeuButton>
                <NeuButton
                    onClick={isActive ? pauseTimer : startTimer}
                    className={`!rounded-full p-6 ${isActive ? 'text-aura-rose' : 'text-aura-sage'} shadow-neu-out active:shadow-neu-in`}
                >
                    {isActive ? <Pause size={32} /> : <Play size={32} className="ml-1" />}
                </NeuButton>
            </div>

            <div className="w-full">
                <p className="text-[10px] font-bold text-aura-textSecondary mb-4 text-center uppercase tracking-widest">Presets</p>
                <div className="grid grid-cols-4 gap-4">
                    {presets.map(p => (
                        <NeuButton
                            key={p.label}
                            active={duration === p.sec}
                            onClick={() => setPreset(p.sec)}
                            className="py-3 text-sm font-bold tracking-tight"
                        >
                            {p.label}
                        </NeuButton>
                    ))}
                </div>
            </div>
        </div>
    );
};