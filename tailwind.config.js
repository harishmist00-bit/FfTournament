/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        void: '#030909',
        deep: '#061412',
        panel: '#081D19',
        panel2: '#0B2520',
        neon: '#39FF14',
        neon2: '#00E676',
        lime: '#B7FF00',
        mist: '#E7FFF2',
        dim: '#A8B8B1',
      },
      fontFamily: {
        display: ['Oxanium', 'Rajdhani', 'sans-serif'],
        body: ['Rajdhani', 'sans-serif'],
        hud: ['Orbitron', 'Oxanium', 'sans-serif'],
      },
      boxShadow: {
        neon: '0 0 18px rgba(57,255,20,0.35)',
        'neon-sm': '0 0 8px rgba(57,255,20,0.35)',
      },
    },
  },
  plugins: [],
};
