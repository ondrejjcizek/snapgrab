import { defineConfig } from 'vite';
import { execSync } from 'child_process';

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
    {
      name: 'generate-types',
      writeBundle() {
        try {
          // Run the TypeScript compiler to generate type definitions
          execSync('npx tsc --project tsconfig.json', { stdio: 'inherit' });
          console.log('TypeScript declaration files generated.');
        } catch (error) {
          console.error('Failed to generate types:', error.message);
          throw error; // Re-throw the error to stop the build process
        }
      }
    }
  ]
});
