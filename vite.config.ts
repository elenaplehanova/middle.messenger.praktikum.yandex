import { defineConfig } from "vite";
import path, { resolve } from "path";
import autoprefixer from "autoprefixer";
import postcssGapProperties from "postcss-gap-properties";
import postcssFlexBugsFixes from "postcss-flexbugs-fixes";

export default defineConfig({
  build: {
    outDir: resolve(__dirname, "dist"),
  },

  server: {
    host: true,
    port: 3000,
  },
  preview: {
    host: true,
    port: 3000,
  },
  assetsInclude: ["**/*.hbs"],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@styles": path.resolve(__dirname, "src/styles"),
      "@components": path.resolve(__dirname, "src/components"),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: "modern-compiler",
      },
    },
    postcss: {
      plugins: [autoprefixer(), postcssGapProperties(), postcssFlexBugsFixes()],
    },
  },
});
