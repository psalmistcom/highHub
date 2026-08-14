import defaultTheme from "tailwindcss/defaultTheme";
import forms from "@tailwindcss/forms";

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php",
    "./storage/framework/views/*.php",
    "./resources/views/**/*.blade.php",
    "./resources/js/**/*.jsx",
  ],

  theme: {
    extend: {
      colors: {
        navy: {
          50: "#EEF1F8",
          100: "#D6DCEE",
          300: "#8C9BC9",
          500: "#3D4F8F",
          700: "#253869",
          800: "#1C2C55",
          900: "#16234A",
          950: "#0F1833",
        },
        gold: {
          50: "#FDF6E8",
          100: "#FBEAC2",
          300: "#F2C876",
          500: "#E8A93A",
          700: "#B9822A",
          900: "#7A5619",
        },
        emerald: {
          50: "#EAF8EF",
          300: "#7FD19D",
          500: "#2F9E56",
          700: "#1F7A40",
        },
        coral: {
          50: "#FCEEEC",
          300: "#EFA298",
          500: "#DE5B4C",
          700: "#B23F32",
        },
        paper: "#FAF7F0",
        ink: "#1C1D22",
        slate: { 400: "#9AA1B0", 500: "#6B7280", 600: "#525866" },
      },
      fontFamily: {
        display: ['"Fraunces"', ...defaultTheme.fontFamily.serif],
        sans: ['"Plus Jakarta Sans"', ...defaultTheme.fontFamily.sans],
        mono: ['"IBM Plex Mono"', ...defaultTheme.fontFamily.mono],
      },
      borderRadius: {
        xl: "0.875rem",
        "2xl": "1.25rem",
      },
      boxShadow: {
        card: "0 1px 2px rgba(22,35,74,0.06), 0 8px 24px -12px rgba(22,35,74,0.12)",
      },
    },
  },

  plugins: [forms, require("tailwindcss-animate")],
};
