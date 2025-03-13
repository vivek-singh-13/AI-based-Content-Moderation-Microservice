import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(() => {
  return {
    plugins: [react()],
    server: {
      port: 80, // Ensure frontend runs on port 80
      host: "0.0.0.0", // Allow external connections
      strictPort: true
    },
    preview: {
      port: 80,
      host: "0.0.0.0"
    }
  };
});
