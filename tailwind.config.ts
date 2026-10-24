/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
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
      colors: {
        primary: {
          500: "#1D9BF0",
          600: "#1A8CD8",
          100: "#E8F5FE",
        },
        x: {
          blue: "#1D9BF0",
          blueHover: "#1A8CD8",
          black: "#000000",
          cardDark: "#0A0A0A",
          cardHoverDark: "#16181C",
          borderDark: "#2F3336",
          borderLight: "#EFF3F4",
          textMutedDark: "#71767B",
          textMutedLight: "#536471",
          surfaceDark: "#16181C",
          surfaceLight: "#F7F9F9",
        },
        dark: {
          100: "#000000",
          200: "#0A0A0A",
          300: "#16181C",
          400: "#202327",
          500: "#000000",
        },
        light: {
          900: "#FFFFFF",
          850: "#FFFFFF",
          800: "#F7F9F9",
          700: "#EFF3F4",
          500: "#536471",
          400: "#71767B",
        },
        "accent-blue": "#1D9BF0",
      },
      fontFamily: {
        inter: ["var(--font-inter)"],
        spaceGrotesk: ["var(--font-spaceGrotesk)"],
      },
      boxShadow: {
        "light-100":
          "0px 12px 20px 0px rgba(184, 184, 184, 0.03), 0px 6px 12px 0px rgba(184, 184, 184, 0.02), 0px 2px 4px 0px rgba(184, 184, 184, 0.03)",
        "light-200": "10px 10px 20px 0px rgba(218, 213, 213, 0.10)",
        "light-300": "-10px 10px 20px 0px rgba(218, 213, 213, 0.10)",
        "dark-100": "0px 2px 10px 0px rgba(46, 52, 56, 0.10)",
        "dark-200": "2px 0px 20px 0px rgba(39, 36, 36, 0.04)",
      },
      backgroundImage: {
        "auth-dark": "url('/assets/images/auth-dark.png')",
        "auth-light": "url('/assets/images/auth-light.png')",
      },
      screens: {
        xs: "420px",
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
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
};