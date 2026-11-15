import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        ink: '#102A43',
        navy: '#12304A',
        teal: '#087F7B',
        mist: '#F3F7F8',
        paper: '#FBFCFC',
        sand: '#F5F2EA',
        amber: '#B7791F',
        coral: '#C05640',
        sky: '#E7F1F6',
      },
      boxShadow: {
        soft: '0 10px 32px rgba(16, 42, 67, 0.08)',
        lift: '0 18px 50px rgba(16, 42, 67, 0.12)',
      },
      borderRadius: {
        '2xl': '1.25rem',
      },
    },
  },
  plugins: [],
};

export default config;
