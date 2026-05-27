import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        primary: '#4ECDC4',
        secondary: '#7C3AED',
        accent: '#F97316',
        success: '#34D399',
        error: '#F87171',
        warning: '#FBBF24',
        nature: '#34D399',
        sun: '#FBBF24',
        enchant: '#EC4899',
        // Superfícies dark
        bg: '#0D0D1A',
        surface: '#14142A',
        'surface-2': '#1C1C36',
        border: '#2A2A48',
        // Texto
        'text-main': '#EEEEF8',
        'text-light': '#8585A8',
        // Compatibilidade
        'bg-light': '#0D0D1A',
        'bg-dark': '#0D0D1A',
      },
      fontFamily: {
        display: ['Fredoka', 'Nunito', 'sans-serif'],
        body: ['Nunito', 'Quicksand', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      borderRadius: {
        xl: '12px',
        '2xl': '16px',
        '3xl': '24px',
      },
      animation: {
        'bounce-slow': 'bounce 2s infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'pop-in': 'popIn 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        shake: 'shake 0.5s ease-in-out',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 5px rgba(78, 205, 196, 0.3)' },
          '50%': { boxShadow: '0 0 20px rgba(78, 205, 196, 0.6)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        popIn: {
          '0%': { transform: 'scale(0)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-5px)' },
          '75%': { transform: 'translateX(5px)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
