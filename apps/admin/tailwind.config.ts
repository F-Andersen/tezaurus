import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: '#00091b',
        'brand-light': '#002045',
        accent: '#3b82f6',
        'accent-hover': '#2563eb',
        success: '#10b981',
        warning: '#f59e0b',
        danger: '#ef4444',
        'danger-hover': '#dc2626',
        sidebar: '#0f172a',
        'sidebar-hover': '#1e293b',
        'sidebar-active': '#1e40af',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
