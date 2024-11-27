/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter var', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      colors: {
        content: {
          primary: '#000000',    // Pure black for main text
          secondary: '#333333',  // Dark gray for secondary text
          muted: '#666666',     // Medium gray for muted text
          light: '#ffffff',     // White for dark backgrounds
        },
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        mytheme: {
          "primary": "#2563eb",
          "primary-focus": "#1d4ed8",
          "primary-content": "#ffffff",
          
          "secondary": "#4f46e5",
          "secondary-focus": "#4338ca",
          "secondary-content": "#ffffff",
          
          "accent": "#0ea5e9",
          "accent-focus": "#0284c7",
          "accent-content": "#ffffff",
          
          "neutral": "#1f2937",
          "neutral-focus": "#111827",
          "neutral-content": "#ffffff",
          
          "base-100": "#ffffff",
          "base-200": "#f9fafb",
          "base-300": "#f3f4f6",
          "base-content": "#000000",
          
          "info": "#3b82f6",
          "success": "#22c55e",
          "warning": "#f59e0b",
          "error": "#ef4444",

          "--rounded-box": "0.75rem",
          "--rounded-btn": "0.5rem",
          "--rounded-badge": "0.375rem",
          
          "--animation-btn": "0.2s",
          "--animation-input": "0.2s",
          
          "--btn-text-case": "normal-case",
          "--navbar-padding": "1rem",
          "--border-btn": "1px",
        },
      },
    ],
    darkTheme: "mytheme",
  },
};
