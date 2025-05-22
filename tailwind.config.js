/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                primary: {
                    light: '#4ade80',
                    DEFAULT: '#22c55e',
                    dark: '#16a34a',
                },
                secondary: {
                    light: '#60a5fa',
                    DEFAULT: '#3b82f6',
                    dark: '#2563eb',
                },
            },
            animation: {
                'glow': 'glow 2s ease-in-out infinite alternate',
            },
            keyframes: {
                glow: {
                    '0%': { boxShadow: '0 0 5px #4ade80, 0 0 10px #4ade80, 0 0 15px #4ade80' },
                    '100%': { boxShadow: '0 0 10px #60a5fa, 0 0 20px #60a5fa, 0 0 30px #60a5fa' },
                },
            },
        },
    },
    plugins: [],
} 