import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.js',
      name: 'Snapgrab',
      fileName: (format) => `Snapgrab.${format}.js`,
      formats: ['es', 'cjs', 'umd'],
    },
    rollupOptions: {
      external: [],
      output: {
        exports: 'named',
        globals: {
          //
        },
      },
    },
  },
});
