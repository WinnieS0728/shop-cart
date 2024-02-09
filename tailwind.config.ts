import type { Config } from 'tailwindcss'

export default {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        "spider-red": {
          '50': '#fcf6f0',
          '100': '#fcf0e6',
          '200': '#f7d3bc',
          '300': '#f5b498',
          '400': '#eb6750',
          '500': '#e20c0b',
          '600': '#cc0a0a',
          '700': '#ab0707',
          '800': '#870404',
          '900': '#660202',
          '950': '#420101'
        }
      },
      aspectRatio: {
        'image': '3/4'
      }
    }
  },
  plugins: []
} satisfies Config
// export default config
