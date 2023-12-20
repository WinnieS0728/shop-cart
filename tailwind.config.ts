import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        "spider-red": {
          '50': '#fff8f2', 
          '100': '#fff1e6', 
          '200': '#fcd6bd', 
          '300': '#fab696', 
          '400': '#f7674a', 
          '500': '#f60400', 
          '600': '#db0400', 
          '700': '#b80300', 
          '800': '#940200', 
          '900': '#6e0200', 
          '950': '#470100'
      }
      }
    }
  },
  plugins: [],
}
export default config
