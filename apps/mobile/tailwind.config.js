/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        background: "#ffffff",
        "background-dark": "#252525",
        foreground: "#252525",
        "foreground-dark": "#fafafa",
        card: "#ffffff",
        "card-dark": "#343434",
        muted: "#f7f7f7",
        "muted-dark": "#454545",
        "muted-foreground": "#8a8a8a",
        "muted-foreground-dark": "#b5b5b5",
        border: "#e9e9e9",
        "border-dark": "#ffffff1a",
        primary: "#343434",
        "primary-dark": "#e9e9e9",
        "primary-foreground": "#fafafa",
        "primary-foreground-dark": "#343434",
        destructive: "#c0402d",
        "destructive-dark": "#dd6152",
        "destructive-foreground": "#fafafa",
      },
    },
  },
  plugins: [],
};
