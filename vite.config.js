import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
    // Add this line:
    base: "/sushi-tetsu/",
    plugins: [
        react(),
        tailwindcss(),
    ],
})