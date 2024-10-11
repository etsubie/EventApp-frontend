// Import flowbite at the top
const flowbite = require('flowbite/plugin');

module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/flowbite/**/*.js", // Add this line to include flowbite files
  ],
  theme: {
    extend: {},
  },
  plugins: [flowbite], // Use flowbite as a plugin
};
