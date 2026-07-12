/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Odoo-inspired Enterprise Blue palette
        brand: {
          950: '#001f33',  // Deepest — footer bg
          900: '#003B5C',  // Primary brand — headers, navbars
          800: '#00547d',  // Hover states
          700: '#006d9e',  // Active elements
          600: '#0086bf',  // Links, interactive
          500: '#0098d4',  // Accent highlights
          400: '#33addf',  // Light accent
          300: '#66c2e8',  // Subtle tints
          200: '#b3e0f4',  // Pale backgrounds
          100: '#e6f4fb',  // Softest tint
          50:  '#f0f8fd',  // Near-white brand bg
        },
        // Functional status colors (muted, enterprise-appropriate)
        status: {
          available: '#D4EDDA',
          'available-text': '#155724',
          maintenance: '#FFF3CD',
          'maintenance-text': '#856404',
          allocated: '#CCE5FF',
          'allocated-text': '#004085',
          retired: '#F8D7DA',
          'retired-text': '#721C24',
        },
        // Neutral slate backgrounds
        surface: {
          50:  '#F8F9FA',  // Page background
          100: '#F1F3F5',  // Card backgrounds
          200: '#E9ECEF',  // Borders, dividers
          300: '#DEE2E6',  // Muted borders
          400: '#CED4DA',  // Input borders
          500: '#ADB5BD',  // Placeholder text
          600: '#6C757D',  // Secondary text
          700: '#495057',  // Body text
          800: '#343A40',  // Headings
          900: '#212529',  // Primary text
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s infinite linear',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        }
      }
    },
  },
  plugins: [],
}
