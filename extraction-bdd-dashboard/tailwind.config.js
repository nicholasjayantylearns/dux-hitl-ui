/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        'mono': ['Courier New', 'Monaco', 'Menlo', 'Ubuntu Mono', 'monospace'],
        'barlow': ['Monaco', 'Menlo', 'Ubuntu Mono', 'monospace'],
        'monospace': ['IBM Plex Mono', 'Monaco', 'Menlo', 'Ubuntu Mono', 'monospace'],
        'sansBody': ['Monaco', 'Menlo', 'Ubuntu Mono', 'monospace'],
      },
      fontSize: {
        '2xs': ['9px', '12px'],
        'xs': ['10px', '14px'],
        'sm': ['11px', '16px'],
        'base': ['12px', '18px'],
        'lg': ['13px', '20px'],
        'xl': ['14px', '22px'],
        '2xl': ['18px', '26px'],
      },
      letterSpacing: {
        'terminal': '0.1em',
        'wide': '0.15em',
        'wider': '0.2em',
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Terminal theme colors
        'card-monospace-bg': "hsl(var(--card-monospace-bg))",
        'card-monospace-border': "hsl(var(--card-monospace-border))",
        'card-monospace-text-primary': "hsl(var(--card-monospace-text-primary))",
        'card-monospace-text-secondary': "hsl(var(--card-monospace-text-secondary))",
        // Terminal Theme Colors
        'terminal': {
          'bg': '#0a0a0a',
          'bg-secondary': 'rgb(22 78 99 / 0.2)',
          'bg-tertiary': 'rgb(22 78 99 / 0.3)',
        },
        'cyan': {
          'primary': '#67e8f9',
          'secondary': 'rgb(103 232 249 / 0.7)',
          'muted': 'rgb(103 232 249 / 0.5)',
          'faint': 'rgb(103 232 249 / 0.3)',
        },
        'purple': {
          'border': 'rgb(168 85 247 / 0.3)',
          'bg': 'rgb(88 28 135 / 0.2)',
          'text': 'rgb(216 180 254)',
          'text-muted': 'rgb(216 180 254 / 0.7)',
        },
        'signal': {
          'complete': '#22c55e',
          'partial': '#f59e0b',
          'missing': '#475569',
        },
        'status': {
          'red': '#ef4444',
          'yellow': '#eab308',
          'green': '#22c55e',
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        'ping-slow': 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}