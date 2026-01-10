import scrollbar from 'tailwind-scrollbar'
import type { Config } from 'tailwindcss'

export default <Config>{
  content: [
    './front/**/*.{vue,js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {},
      fontFamily: {},
      backgroundImage: {}
    },
  },
  plugins: [
    scrollbar,
  ],
}
