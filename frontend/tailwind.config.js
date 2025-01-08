/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/components/*.jsx",
    "./src/views/*.jsx",
    "./src/pages/*.jsx",
    "./src/App.jsx",
    "./src/Layout.jsx",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Light Mode
        error: "#F33539",
        title: "#049FFF",
        input: "#D9D9D9",
        recievedMessage: "#D5CDFF",
        backgroundChat: "#F5F5F5",
        backgroundBox: "#183954",
        blueCustom: "#4B89FF",

        // Dark Mode
        errorDark: "#9B1D20",
        buttonDark: "#B0DEFB",
        backgroundFormDark: "#2a3748",
        inputDark: "#B0B0B0",
        backgroundChatDark: "#183954",
        titleDark: "#ffffff",
        recievedMessageDark: "#B0B0FF",
        textColorDark: "#E0E0E0",
        bodychat:"#1B2536"
      },
      backgroundImage: {
        button: "linear-gradient(to right, #3b82f6, #60a5fa, #2563eb)", // Gradient for button
      },
      boxShadow: {
        "custom-strong": "0 4px 15px rgba(0, 0, 0, 0.2)",
      },
    },
  },
  plugins: [],
};

