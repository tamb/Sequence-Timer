// vitest.config.ts
import { defineConfig } from "vitest/config";
import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";

export default defineConfig({
  plugins: [vanillaExtractPlugin()],
  test: {
    exclude: ['node_modules', 'dist', '**/*.e2e.ts'],
    globals: true,
    environment: 'jsdom',
  },
});
