/**
 * @file ShareCard.tsx
 * @description A visually premium React component rendered off-screen specifically for image export via html2canvas.
 * @author Mishat
 */

import React from 'react';
import { Dumbbell } from 'lucide-react';
import { Workout } from '../types';

interface ShareCardProps {
    workout: Workout;
    cardRef: React.RefObject<HTMLDivElement>;
}

export const ShareCard: React.FC<ShareCardProps> = ({ workout, cardRef }) => {

    // Format duration mock (since we don't track duration per workout natively yet, we can mock it based on volume or just show volume & exercises count)
    const exerciseCount = workout.exercises.length;

    return (
        <div style={{ position: 'absolute', top: '-9999px', left: '-9999px' }}>
            <div
                ref={cardRef}
                className="export-card"
                style={{
                    width: '380px',
                    height: '680px',
                    background: 'linear-gradient(135deg, #1c1c1e 0%, #111 100%)',
                    borderRadius: '32px',
                    padding: '32px',
                    position: 'relative',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    border: '1px solid rgba(255,255,255,0.05)',
                    fontFamily: "'Outfit', sans-serif",
                    color: '#fff'
                }}
            >
                {/* Glow Effects */}
                <div style={{ position: 'absolute', width: '300px', height: '300px', background: 'rgba(167, 243, 208, 0.15)', filter: 'blur(80px)', borderRadius: '50%', top: '-100px', right: '-100px', pointerEvents: 'none' }}></div>
                <div style={{ position: 'absolute', width: '250px', height: '250px', background: 'rgba(233, 213, 255, 0.1)', filter: 'blur(70px)', borderRadius: '50%', bottom: '-50px', left: '-50px', pointerEvents: 'none' }}></div>

                {/* Header */}
                <div className="flex items-center justify-between mb-8 relative z-10" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                    <div>
                        <h1 style={{ fontSize: '1.875rem', fontWeight: 900, letterSpacing: '-0.05em', color: '#f8f8f8', margin: 0 }}>{workout.name}</h1>
                        <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#a7f3d0', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '4px' }}>Gym-Stack Workout</p>
                    </div>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(167, 243, 208, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(167, 243, 208, 0.3)' }}>
                        <Dumbbell color="#a7f3d0" size={20} strokeWidth={2.5} />
                    </div>
                </div>

                {/* Stats Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '12px', marginBottom: '32px', position: 'relative', zIndex: 10 }}>
                    <div style={{ background: 'rgba(255, 255, 255, 0.03)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: '20px', padding: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <span style={{ fontSize: '10px', fontWeight: 800, color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>Volume</span>
                        <span style={{ fontSize: '1.5rem', fontWeight: 900, color: '#f8f8f8', letterSpacing: '-0.025em' }}>
                            {workout.volume.toLocaleString()} <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#a1a1aa' }}>lbs</span>
                        </span>
                    </div>
                    <div style={{ background: 'rgba(255, 255, 255, 0.03)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: '20px', padding: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <span style={{ fontSize: '10px', fontWeight: 800, color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>Exercises</span>
                        <span style={{ fontSize: '1.5rem', fontWeight: 900, color: '#f8f8f8', letterSpacing: '-0.025em' }}>{exerciseCount}</span>
                    </div>
                </div>

                {/* Exercises List */}
                <div style={{ flex: 1, position: 'relative', zIndex: 10 }}>
                    <h3 style={{ fontSize: '10px', fontWeight: 800, color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px' }}>Exercises Performed</h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {workout.exercises.slice(0, 6).map((ex, i) => {
                            const hasPR = ex.sets.some(s => s.isPR);
                            return (
                                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <span style={{ fontWeight: 700, color: '#f8f8f8', fontSize: '0.875rem' }}>{ex.name}</span>
                                        {hasPR && (
                                            <span style={{ fontSize: '8px', padding: '2px 6px', borderRadius: '9999px', background: 'rgba(233, 213, 255, 0.2)', color: '#e9d5ff', fontWeight: 900, letterSpacing: '0.1em', textTransform: 'uppercase', border: '1px solid rgba(233, 213, 255, 0.3)' }}>PR</span>
                                        )}
                                    </div>
                                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#a1a1aa', padding: '4px 8px', background: 'rgba(255, 255, 255, 0.03)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: '20px' }}>
                                        {ex.sets.length} {ex.sets.length === 1 ? 'set' : 'sets'}
                                    </span>
                                </div>
                            );
                        })}
                        {workout.exercises.length > 6 && (
                            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#a1a1aa', textAlign: 'center', marginTop: '8px' }}>
                                + {workout.exercises.length - 6} more exercises
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer Logo */}
                <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', paddingTop: '24px', borderTop: '1px solid rgba(255, 255, 255, 0.05)', position: 'relative', zIndex: 10 }}>
                    <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: '#f8f8f8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#1c1c1e' }}></div>
                    </div>
                    <span style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#a1a1aa' }}>Gym-Stack</span>
                </div>
            </div>
        </div>
    );
};
