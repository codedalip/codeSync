/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        vscode: {
          bg: '#1e1e1e',
          sidebar: '#252526',
          activity: '#333333',
          header: '#3c3c3c',
          tabActive: '#1e1e1e',
          tabInactive: '#2d2d2d',
          border: '#2d2d2d',
          editorBg: '#1e1e1e',
          accent: '#007acc',
          accentHover: '#0062a3',
          terminalBg: '#181818',
          textMuted: '#969696'
        }
      }
    },
  },
  plugins: [],
}
