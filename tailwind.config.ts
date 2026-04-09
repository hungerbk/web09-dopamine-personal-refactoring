import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
    './src/app/**/*.{ts,tsx}',
    './src/features/**/*.{ts,tsx}',
    './src/issues/**/*.{ts,tsx}',
    './src/projects/**/*.{ts,tsx}',
    './src/topics/**/*.{ts,tsx}',
    './src/mypage/**/*.{ts,tsx}',
    './src/invite/**/*.{ts,tsx}',
    './src/providers/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      borderRadius: {
        half: '50%',
        large: '16px',
        medium: '12px',
        small: '8px',
      },
      fontSize: {
        xl: '28px',
        xxl: '22.5px',
        large: '18px',
        medium: '14px',
        small: '12px',
        xs: '10px',
      },
      minHeight: {
        xl: '28px',
      },
      fontWeight: {
        regular: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
      },
      zIndex: {
        hide: '-1',
        base: '0',
        important: '9999',
        selected: '100',
        sticky: '200',
        backdrop: '300',
        modal: '400',
        popover: '500',
        overlay: '600',
      },
    },
  },
  plugins: [],
};

export default config;
