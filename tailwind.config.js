/*eslint-env node*/

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {},
  },
  darkMode: "class",
  daisyui: {
    themes: [
      {
        // light: {
        //   primary: "#18adf2",
        //   secondary: "#47566b",
        //   accent: "#88cc19",
        //   neutral: "#262626",
        //   "base-100": "#ededed",
        //   info: "#06b6d4",
        //   success: "#22c55e",
        //   warning: "#f97316",
        //   error: "#ef4444",
        // },
        dark: {
          primary: "#0ea5e9",
          secondary: "#94a3b8",
          accent: "#a3e635",
          neutral: "#262626",
          "base-100": "#171717",
          info: "#06b6d4",
          success: "#22c55e",
          warning: "#f97316",
          error: "#ef4444",

          // "--rounded-box": "1rem", // border radius rounded-box utility class, used in card and other large boxes
          // "--rounded-btn": "0.5rem", // border radius rounded-btn utility class, used in buttons and similar element
          // "--rounded-badge": "1.9rem", // border radius rounded-badge utility class, used in badges and similar
          // "--animation-btn": "0.25s", // duration of animation when you click on button
          // "--animation-input": "0.2s", // duration of animation for inputs like checkbox, toggle, radio, etc
          // "--btn-focus-scale": "0.95", // scale transform of button when you focus on it
          // "--border-btn": "1px", // border width of buttons
          // "--tab-border": "1px", // border width of tabs
          // "--tab-radius": "0.5rem", // border radius of tabs
        },
      },
    ],
  },
  plugins: [
    // require("@tailwindcss/forms"),
    require("@tailwindcss/typography"),
    require("daisyui"),
  ],
};
