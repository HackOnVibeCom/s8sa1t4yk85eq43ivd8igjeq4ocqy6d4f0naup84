/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          DEFAULT: '#155E4B',
          hover: '#104A3B',
          light: '#1B765E',
        },
        sage: {
          DEFAULT: '#80A995',
          pale: '#DDEBE1',
          light: '#EDF4EA',
          border: '#C3D8CE',
        },
        ivory: {
          DEFAULT: '#F7F6F0',
          dark: '#EFEFE5',
        },
        charcoal: {
          DEFAULT: '#263C3A',
          muted: '#74817B',
          light: '#425856',
        },
        amber: {
          DEFAULT: '#D6A34B',
          light: '#FBF1DC',
          dark: '#B08234',
        },
        terracotta: {
          DEFAULT: '#C8795B',
          light: '#FCEBE7',
          dark: '#A65A3F',
        },
        canigoBorder: '#E5E5DC',
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        subtle: '0 2px 8px -2px rgba(21, 94, 75, 0.05), 0 1px 4px -1px rgba(0, 0, 0, 0.04)',
        card: '0 4px 20px -2px rgba(38, 60, 58, 0.06), 0 2px 6px -1px rgba(0, 0, 0, 0.03)',
        cardHover: '0 8px 30px -4px rgba(38, 60, 58, 0.12), 0 4px 10px -2px rgba(0, 0, 0, 0.04)',
        floating: '0 10px 30px -5px rgba(21, 94, 75, 0.25), 0 4px 12px -2px rgba(0, 0, 0, 0.1)',
        popover: '0 12px 36px -6px rgba(38, 60, 58, 0.16), 0 4px 16px -2px rgba(0, 0, 0, 0.06)',
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '24px',
      }
    },
  },
  plugins: [],
}
