
import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
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
        "btc-orange": "#f7931a",
        "btc-dark": "#121212",
        "btc-darker": "#0a0a0a",
        "btc-highlight": "#2a2a2a",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "gradient-border": {
          "0%, 100%": {
            transform: "translateX(0) translateY(0)",
          },
          "50%": {
            transform: "translateX(15%) translateY(15%)",
          },
        },
        "gradient-1": {
          "0%": {
            opacity: "0.5",
            transform: "translateX(0%) translateY(0%)",
          },
          "25%": {
            opacity: "0.25",
            transform: "translateX(25%) translateY(10%)",
          },
          "50%": {
            opacity: "0.65",
            transform: "translateX(-5%) translateY(15%)",
          },
          "75%": {
            opacity: "0.35",
            transform: "translateX(-15%) translateY(5%)",
          },
          "100%": {
            opacity: "0.5",
            transform: "translateX(0%) translateY(0%)",
          },
        },
        "gradient-2": {
          "0%": {
            opacity: "0.5",
            transform: "translateX(0%) translateY(0%)",
          },
          "25%": {
            opacity: "0.35",
            transform: "translateX(-15%) translateY(5%)",
          },
          "50%": {
            opacity: "0.65",
            transform: "translateX(5%) translateY(-15%)",
          },
          "75%": {
            opacity: "0.25",
            transform: "translateX(15%) translateY(-10%)",
          },
          "100%": {
            opacity: "0.5",
            transform: "translateX(0%) translateY(0%)",
          },
        },
        "gradient-3": {
          "0%": {
            opacity: "0.5",
            transform: "translateX(0%) translateY(0%)",
          },
          "25%": {
            opacity: "0.25",
            transform: "translateX(-25%) translateY(-10%)",
          },
          "50%": {
            opacity: "0.65",
            transform: "translateX(5%) translateY(-15%)",
          },
          "75%": {
            opacity: "0.35",
            transform: "translateX(15%) translateY(-5%)",
          },
          "100%": {
            opacity: "0.5",
            transform: "translateX(0%) translateY(0%)",
          },
        },
        "gradient-4": {
          "0%": {
            opacity: "0.5",
            transform: "translateX(0%) translateY(0%)",
          },
          "25%": {
            opacity: "0.35",
            transform: "translateX(15%) translateY(-5%)",
          },
          "50%": {
            opacity: "0.65",
            transform: "translateX(-5%) translateY(15%)",
          },
          "75%": {
            opacity: "0.25",
            transform: "translateX(-15%) translateY(10%)",
          },
          "100%": {
            opacity: "0.5",
            transform: "translateX(0%) translateY(0%)",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "spin-slow": "spin 3s linear infinite",
        "pulse-subtle": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
