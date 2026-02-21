/**
 * @file UI.tsx
 * @description Core Neumorphic UI design system components used globally.
 * @author Mishat
 */

import React from 'react';
import { motion, HTMLMotionProps, AnimatePresence } from 'framer-motion';
import { triggerHaptic } from '../utils/haptics';

interface CardProps extends HTMLMotionProps<"div"> {
    children: React.ReactNode;
    className?: string;
    inset?: boolean;
    onClick?: () => void;
    style?: React.CSSProperties;
}

/**
 * A standard Neumorphic card container. Can be toggled between inset and outset shadows.
 */
export const NeuCard: React.FC<CardProps> = ({ children, className = '', inset = false, onClick, style, ...rest }) => {
    const shadowClass = inset ? 'shadow-neu-in' : 'shadow-neu-out';
    return (
        <motion.div
            onClick={onClick}
            whileTap={onClick ? { scale: 0.98 } : undefined}
            className={`bg-aura-bg rounded-3xl p-6 ${shadowClass} ${onClick ? 'cursor-pointer' : ''} ${className}`}
            style={style}
            {...rest}
        >
            {children}
        </motion.div>
    );
};

/**
 * A Neumorphic actionable button component, supporting active/pressed states.
 */
interface ButtonProps extends HTMLMotionProps<"button"> {
    children: React.ReactNode;
    className?: string;
    active?: boolean;
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
    style?: React.CSSProperties;
}

export const NeuButton: React.FC<ButtonProps> = ({ children, className = '', active = false, onClick, style, ...rest }) => {
    const shadowClass = active ? 'shadow-neu-in-sm' : 'shadow-neu-sm';

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        triggerHaptic(50);
        if (onClick) onClick(e);
    };

    return (
        <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleClick}
            className={`bg-aura-bg rounded-2xl p-4 font-medium transition-all duration-200 ${shadowClass} ${active ? 'text-aura-sage' : 'text-aura-textPrimary'} ${className}`}
            style={style}
            {...rest}
        >
            {children}
        </motion.button>
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

/**
 * A sleek, floating Toast notification for non-blocking alerts.
 */
interface ToastProps {
    message: string;
    isVisible: boolean;
    onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, isVisible, onClose }) => {
    React.useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(() => {
                onClose();
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [isVisible, onClose]);

    return (
        <AnimatePresence>
            {isVisible && (
                <div className="fixed bottom-24 left-0 w-full flex justify-center pointer-events-none z-50">
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        className="pointer-events-auto px-6 py-3 bg-aura-bg border border-aura-shadowLight shadow-neu-nav rounded-full flex items-center gap-3 w-max max-w-[90vw]"
                    >
                        <div className="w-2 h-2 rounded-full bg-aura-sage animate-pulse" />
                        <span className="font-bold text-sm text-aura-textPrimary tracking-tight">{message}</span>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};