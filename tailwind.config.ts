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
    },
  },
  plugins: [],
};

export default config;
