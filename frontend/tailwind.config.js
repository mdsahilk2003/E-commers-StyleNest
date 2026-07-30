/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                navy: {
                    50: '#e6e8f0',
                    100: '#ccd1e1',
                    200: '#99a3c3',
                    300: '#6675a5',
                    400: '#334787',
                    500: '#0A1128', // Primary Navy
                    600: '#080d20',
                    700: '#060a18',
                    800: '#040610',
                    900: '#020308',
                },
                gold: {
                    50: '#fffef5',
                    100: '#fffceb',
                    200: '#fff9d6',
                    300: '#fff5c2',
                    400: '#fff2ad',
                    500: '#FFD700', // Primary Gold
                    600: '#ccac00',
                    700: '#998100',
                    800: '#665600',
                    900: '#332b00',
                },
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
            boxShadow: {
                'gold': '0 0 20px rgba(255, 215, 0, 0.3)',
                'gold-lg': '0 0 30px rgba(255, 215, 0, 0.5)',
            },
            animation: {
                'fade-in': 'fadeIn 0.5s ease-in-out',
                'slide-up': 'slideUp 0.5s ease-out',
                'scale-in': 'scaleIn 0.3s ease-out',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(20px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                scaleIn: {
                    '0%': { transform: 'scale(0.9)', opacity: '0' },
                    '100%': { transform: 'scale(1)', opacity: '1' },
                },
            },
        },
    },
    plugins: [],
}
