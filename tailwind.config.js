/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            fontFamily: {
                sans: ['"Plus Jakarta Sans"', 'sans-serif'],
            },
            colors: {
                aura: {
                    bg: 'var(--color-aura-bg)',
                    shadowDark: 'var(--color-shadow-dark)',
                    shadowLight: 'var(--color-shadow-light)',
                    sage: 'var(--color-sage)',
                    rose: 'var(--color-rose)',
                    lavender: 'var(--color-lavender)',
                    textPrimary: 'var(--color-text-primary)',
                    textSecondary: 'var(--color-text-secondary)'
                }
            },
            boxShadow: {
                'neu-out': '8px 8px 16px var(--color-shadow-dark), -8px -8px 16px var(--color-shadow-light)',
                'neu-in': 'inset 6px 6px 12px var(--color-shadow-dark), inset -6px -6px 12px var(--color-shadow-light)',
                'neu-sm': '4px 4px 8px var(--color-shadow-dark), -4px -4px 8px var(--color-shadow-light)',
                'neu-in-sm': 'inset 3px 3px 6px var(--color-shadow-dark), inset -3px -3px 6px var(--color-shadow-light)',
                'neu-nav': '0 -8px 16px var(--color-shadow-dark), 0 -8px 16px var(--color-shadow-light)',
            }
        }
    },
    plugins: [],
}
