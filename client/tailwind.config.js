/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        }
      },
      animation: {
        'fade-up': 'fadeUp 0.6s cubic-bezier(0.32, 0.72, 0, 1) forwards',
        'fade-in': 'fadeIn 0.4s cubic-bezier(0.32, 0.72, 0, 1) forwards',
        'slide-in': 'slideIn 0.5s cubic-bezier(0.32, 0.72, 0, 1) forwards',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(-16px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        }
      },
      boxShadow: {
        'soft': '0 2px 20px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.04)',
        'medium': '0 4px 30px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.06)',
        'strong': '0 8px 50px rgba(0,0,0,0.12), 0 4px 16px rgba(0,0,0,0.08)',
        'brand': '0 8px 30px rgba(22, 163, 74, 0.3)',
        'inner-highlight': 'inset 0 1px 1px rgba(255,255,255,0.15)',
      }
    },
  },
  plugins: [],
}
