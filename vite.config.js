import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.js', // Replace with the path to your entry file
      name: 'Snapgrab',
      fileName: (format) => `index.${format}.js`,
      formats: ['es', 'cjs', 'umd'], // Generate ES module, CommonJS, and UMD formats
    },
    rollupOptions: {
      external: [], // List any dependencies you want to exclude from your bundle
      output: {
        globals: {
          // Define global variables for any external dependencies if necessary
        },
      },
    },
  },
});
