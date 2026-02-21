/**
 * @file UI.tsx
 * @description Core Neumorphic UI design system components used globally.
 * @author Mishat
 */

import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    inset?: boolean;
    onClick?: () => void;
    style?: React.CSSProperties;
}

/**
 * A standard Neumorphic card container. Can be toggled between inset and outset shadows.
 */
export const NeuCard: React.FC<CardProps> = ({ children, className = '', inset = false, onClick, style }) => {
    const shadowClass = inset ? 'shadow-neu-in' : 'shadow-neu-out';
    return (
        <div
            onClick={onClick}
            className={`bg-aura-bg rounded-3xl p-6 ${shadowClass} ${onClick ? 'cursor-pointer transition-transform active:scale-95' : ''} ${className}`}
            style={style}
        >
            {children}
        </div>
    );
};

/**
 * A Neumorphic actionable button component, supporting active/pressed states.
 */
export const NeuButton: React.FC<CardProps & { active?: boolean }> = ({ children, className = '', active = false, onClick, style }) => {
    const shadowClass = active ? 'shadow-neu-in-sm' : 'shadow-neu-sm';
    return (
        <button
            onClick={onClick}
            className={`bg-aura-bg rounded-2xl p-4 font-medium transition-all duration-200 ${shadowClass} active:shadow-neu-in-sm ${active ? 'text-aura-sage' : 'text-aura-textPrimary'} ${className}`}
            style={style}
        >
            {children}
        </button>
    );
};

/**
 * A Neumorphic text input container optimized for forms and numerical data entry.
 */
export const NeuInput: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => {
    return (
        <input
            {...props}
            className={`bg-aura-bg shadow-neu-in rounded-xl px-4 py-3 w-full outline-none text-aura-textPrimary placeholder:text-aura-textSecondary transition-shadow focus:shadow-[inset_4px_4px_8px_var(--color-shadow-dark),inset_-4px_-4px_8px_var(--color-shadow-light)] ${props.className || ''}`}
        />
    );
};

/**
 * Standardized page header for consistent typography at the top of main views.
 */
export const PageHeader: React.FC<{ title: string; subtitle?: string }> = ({ title, subtitle }) => {
    return (
        <div className="mb-8 pr-16">
            <h1 className="text-3xl font-bold text-aura-textPrimary tracking-tight">{title}</h1>
            {subtitle && <p className="text-aura-textSecondary mt-1 font-medium">{subtitle}</p>}
        </div>
    );
};