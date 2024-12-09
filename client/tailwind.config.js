const flowbite = require("flowbite-react/tailwind");
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "node_modules/flowbite-react/lib/esm/**/*.js" /* src folder, for example */,
    flowbite.content(),
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Parkinsans", "sans-serif"],
      },
    },
  },
  plugins: [require("flowbite/plugin")],
};
