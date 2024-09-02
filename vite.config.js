import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts'; // Import the plugin

export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.js', // Path to your entry file
      name: 'Snapgrab',
      fileName: (format) => `index.${format}.js`,
      formats: ['es', 'cjs', 'umd'], // Generate ES module, CommonJS, and UMD formats
    },
    rollupOptions: {
      external: [], // List any dependencies you want to exclude from your bundle
      output: {
        exports: 'named',
        globals: {
          // Define global variables for any external dependencies if necessary
        },
      },
    },
  },
  plugins: [
    dts({ // Add the plugin to generate type declarations
      outputDir: 'dist', // Output directory for .d.ts files
      insertTypesEntry: true, // Insert a `types` entry in package.json
    }),
  ],
});
