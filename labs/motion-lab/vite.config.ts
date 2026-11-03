import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Each demo is imported dynamically from src/demos/registry.ts, so Vite emits one
// chunk per demo. Opening the lab never downloads a demo that was not opened.
export default defineConfig({
  plugins: [react()],
});
