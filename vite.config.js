import { defineConfig } from 'vite';

// Vite configuration
export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.js',  // Adjust the entry point as needed
      name: 'Snapgrab',
      fileName: (format) => `index.${format}.js`,
    },
    rollupOptions: {
      // External dependencies to exclude from the bundle
      external: [],
      output: {
        globals: {
          // Global variables for external dependencies
        },
      },
    },
  },
});
