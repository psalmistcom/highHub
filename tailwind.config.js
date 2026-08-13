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
                // Design tokens — grounded in timber: heartwood, bark, sap, and mill-yard chalk.
                bark: {
                    DEFAULT: "#211A14", // near-black roasted walnut, not pure black
                    light: "#332821",
                },
                heartwood: {
                    50: "#FBF6EF",
                    100: "#F2E6D3",
                    200: "#E2C9A0",
                    300: "#CFA96E",
                    400: "#B98A4C",
                    500: "#9C6E36", // primary oak accent
                    600: "#7A552A",
                },
                sap: {
                    DEFAULT: "#3C4A34", // deep forest green, evergreen-adjacent (not olive default)
                    light: "#57694B",
                    dark: "#26301F",
                },
                chalk: "#F4EFE4", // mill-yard limewash white, warm but not #F4F1EA cream default
                rust: "#954639", // clay accent, distinct from #D97757
            },
            fontFamily: {
                display: ["'Fraunces'", "serif"],
                body: ["'Inter'", "sans-serif"],
                mono: ["'IBM Plex Mono'", "monospace"],
            },
            backgroundImage: {
                "grain-rings":
                    "radial-gradient(circle, transparent 0%, transparent 40%)",
            },
            letterSpacing: {
                widest2: "0.28em",
            },
        },
    },

    plugins: [forms, require("tailwindcss-animate")],
};
