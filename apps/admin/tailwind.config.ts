import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: '#203033',
        'brand-light': '#0F3C49',
        accent: '#318491',
        'accent-hover': '#203033',
        success: '#5A7D65',
        warning: '#B8963E',
        danger: '#BA1A1A',
        'danger-hover': '#9C1515',
        sidebar: '#0a2528',
        'sidebar-hover': '#203033',
        'sidebar-active': '#0F3C49',
        sage: '#318491',
        'sage-light': '#9eecfd',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
