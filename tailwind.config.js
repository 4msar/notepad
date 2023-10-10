/** @type {import('tailwindcss').Config} */
export default {
    darkMode: "class",
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            backgroundSize: {
                20: "20px 20px",
            },
            backgroundImage: (theme) => ({
                "notebook-paper": `radial-gradient(${theme(
                    "colors.gray.200"
                )} 2px, transparent 0)`,
                "notebook-paper-dark": `radial-gradient(${theme(
                    "colors.gray.800"
                )} 2px, transparent 0)`,
            }),

            fontFamily: {
                nunito: ["Nunito", "sans-serif"],
                bangla: ["Kalpurush", "sans-serif"],
            },
        },
    },
    plugins: [
        require("@tailwindcss/typography"),
        function ({ addVariant }) {
            addVariant("child", "& > *");
            addVariant("child:hover", "& > *:hover");
        },
    ],
};
