import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.js',
      name: 'Snapgrab',
      fileName: (format) => `snapgrab.mjs`,
      formats: ['cjs'],
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
