import typography from '@tailwindcss/typography'

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./**/*.html",
    "./src/**/*.{js,ts,jsx,tsx,svelte}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': {
          '50': '#f2f7fb',
          '100': '#e7f0f8',
          '200': '#d3e2f2',
          '300': '#b9cfe8',
          '400': '#9cb6dd',
          '500': '#839dd1',
          '600': '#6a7fc1',
          '700': '#6374ae',
          '800': '#4a5989',
          '900': '#414e6e',
          '950': '#262c40',
        },
        'accent': {
          '50': '#fffbea',
          '100': '#fff2c5',
          '200': '#ffe585',
          '300': '#ffd146',
          '400': '#ffbc1b',
          '500': '#ff9800',
          '600': '#e27100',
          '700': '#bb4c02',
          '800': '#983a08',
          '900': '#7c300b',
          '950': '#481700',
        },
      }
    },
    fontFamily: {
      sans: ["'Varela Round'", '"ChillRoundF"', "'-apple-system'", "'Microsoft YaHei'", "sans-serif"]
    }
  },
  plugins: [
    typography
  ],
}

