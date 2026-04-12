import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#00091b',
        'primary-container': '#002045',
        'on-primary': '#ffffff',
        'on-primary-container': '#7089b3',
        secondary: '#466270',
        'secondary-container': '#c6e4f4',
        'on-secondary': '#ffffff',
        'on-secondary-container': '#4a6774',
        tertiary: '#160400',
        'tertiary-container': '#3c1400',
        surface: '#fbf9f8',
        'surface-dim': '#dbdad9',
        'surface-bright': '#fbf9f8',
        'surface-container-lowest': '#ffffff',
        'surface-container-low': '#f5f3f2',
        'surface-container': '#efedec',
        'surface-container-high': '#e9e8e7',
        'surface-container-highest': '#e4e2e1',
        'on-surface': '#1b1c1b',
        'on-surface-variant': '#44474e',
        outline: '#74777f',
        'outline-variant': '#c4c6cf',
        background: '#fbf9f8',
        'on-background': '#1b1c1b',
        error: '#ba1a1a',
        'inverse-surface': '#303030',
        'inverse-on-surface': '#f2f0ef',
        'inverse-primary': '#aec7f5',
        'primary-fixed': '#d6e3ff',
        'primary-fixed-dim': '#aec7f5',
        'secondary-fixed': '#c9e7f7',
        'tertiary-fixed': '#ffdbcb',
        'on-tertiary-container': '#b97858',
        gold: '#B8963E',
        'gold-light': '#D4AF6A',
      },
      fontFamily: {
        headline: ['Noto Serif', 'Georgia', 'serif'],
        body: ['Manrope', 'Inter', 'system-ui', 'sans-serif'],
        label: ['Manrope', 'Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '0.25rem',
        lg: '0.5rem',
        xl: '1.5rem',
        full: '9999px',
      },
      maxWidth: {
        site: '1440px',
      },
    },
  },
  plugins: [],
};

export default config;
