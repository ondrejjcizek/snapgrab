import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.js',
      name: 'Snapgrab',
      fileName: (format) => `index.${format}.js`,
    },
    rollupOptions: {
      external: [],
      output: {
        globals: {
          // Global variables for external dependencies//
        },
      },
    },
  },
});
