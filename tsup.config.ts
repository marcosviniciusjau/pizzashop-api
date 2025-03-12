import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['./src/http/server.ts'],
  outDir: 'dist',
  format: ['cjs'],
  target: 'node18',
  clean: true,
  dts: false,
  minify: false,
  sourcemap: true,
});
