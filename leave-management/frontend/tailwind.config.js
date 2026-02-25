/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        body: ['DM Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        ink: {
          50: '#f5f3f0',
          100: '#e8e3db',
          200: '#d4cbbf',
          300: '#b8a99a',
          400: '#9a8474',
          500: '#7d6656',
          600: '#614f42',
          700: '#4a3c33',
          800: '#352c25',
          900: '#1e1a16',
          950: '#0f0d0b',
        },
        clay: {
          50: '#fdf5f0',
          100: '#fae8db',
          200: '#f5cdb5',
          300: '#eeaa84',
          400: '#e57d51',
          500: '#d95f2e',
          600: '#c04720',
          700: '#9e371a',
          800: '#7f2e18',
          900: '#672917',
        },
        sage: {
          50: '#f2f7f4',
          100: '#e0ece5',
          200: '#c2d9cc',
          300: '#97bea8',
          400: '#669e80',
          500: '#447f62',
          600: '#33644e',
          700: '#294f3e',
          800: '#213f32',
          900: '#1b332a',
        },
        cream: '#faf8f5',
        parchment: '#f0ebe3',
      },
      boxShadow: {
        'paper': '0 2px 8px rgba(30, 26, 22, 0.08), 0 1px 3px rgba(30, 26, 22, 0.06)',
        'card': '0 4px 20px rgba(30, 26, 22, 0.10), 0 2px 6px rgba(30, 26, 22, 0.06)',
        'float': '0 8px 40px rgba(30, 26, 22, 0.15), 0 4px 12px rgba(30, 26, 22, 0.08)',
      },
      backgroundImage: {
        'paper-texture': "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='400' height='400' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [],
}
