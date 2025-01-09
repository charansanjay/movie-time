import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()], // Adds the Vite React plugin for JSX handling and fast-refresh during development. Necessary for transpiling JSX in your tests.
});
