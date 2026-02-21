/**
 * @file haptics.ts
 * @description Utility for triggering device vibration corresponding to user actions.
 * @author Mishat
 */

/**
 * Triggers a device haptic vibration if supported by the browser.
 * @param pattern - Duration in ms or an array of active/pause durations.
 * 
 * Common usage:
 * - Light Tap: `triggerHaptic(50)`
 * - Success/Monumental: `triggerHaptic([50, 50, 50])`
 * - Error/Alert: `triggerHaptic([50, 100, 50, 100, 50])`
 */
export const triggerHaptic = (pattern: number | number[] = 50): void => {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
        try {
            navigator.vibrate(pattern);
        } catch (e) {
            // Ignore if vibration fails or is blocked by the browser
            console.warn('Haptic feedback failed:', e);
        }
    }
};
