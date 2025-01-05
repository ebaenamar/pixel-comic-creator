import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'cyan': {
          400: '#22D3EE',
          500: '#06B6D4',
          600: '#0891B2',
        },
        'magenta': {
          500: '#D946EF',
          600: '#C026D3',
        },
        'yellow': {
          300: '#FDE047',
        },
      },
      fontFamily: {
        pixel: ['Press Start 2P', 'cursive'],
      },
      animation: {
        'glitch-1': 'glitch-1 3s infinite linear alternate-reverse',
        'glitch-2': 'glitch-2 3s infinite linear alternate-reverse',
        'text-shift': 'text-shift 3s infinite linear',
        'flicker': 'flicker 2s infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        'glitch-1': {
          '0%': { 
            clipPath: 'inset(40% 0 61% 0)',
            transform: 'translate(-2px, 2px)'
          },
          '20%': { 
            clipPath: 'inset(92% 0 1% 0)',
            transform: 'translate(1px, -3px)'
          },
          '40%': { 
            clipPath: 'inset(43% 0 1% 0)',
            transform: 'translate(-1px, 3px)'
          },
          '60%': { 
            clipPath: 'inset(25% 0 58% 0)',
            transform: 'translate(3px, -2px)'
          },
          '80%': { 
            clipPath: 'inset(54% 0 7% 0)',
            transform: 'translate(-3px, 4px)'
          },
          '100%': { 
            clipPath: 'inset(58% 0 43% 0)',
            transform: 'translate(2px, -2px)'
          },
        },
        'text-shift': {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          },
        },
      },
    },
  },
  plugins: [],
};

export default config;
