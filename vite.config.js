import { defineConfig } from "vite";
import path, { resolve } from "path";
import autoprefixer from "autoprefixer";
import postcssGapProperties from "postcss-gap-properties";
import postcssFlexbugsFixes from "postcss-flexbugs-fixes";
import handlebars from "vite-plugin-handlebars";

export default defineConfig({
  root: resolve(__dirname, "src/pages"),
  build: {
    outDir: resolve(__dirname, "dist"),
    rollupOptions: {
      input: {
        home: resolve(__dirname, "src/pages/index.html"),
        "user-settings": resolve(__dirname, "src/pages/user-settings.html"),
        "sign-in": resolve(__dirname, "src/pages/sign-in.html"),
        "sign-up": resolve(__dirname, "src/pages/sign-up.html"),
        "page-404": resolve(__dirname, "src/pages/page-404.html"),
        "page-500": resolve(__dirname, "src/pages/page-500.html"),
      },
    },
  },
  plugins: [
    handlebars({
      partialDirectory: resolve(__dirname, "src/partials"),
    }),
  ],
  server: {
    host: true,
    port: 3000,
  },
  preview: {
    host: true,
    port: 3000,
  },
  resolve: {
    alias: {
      "@styles": path.resolve(__dirname, "src/pages/styles"),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: "modern-compiler",
      },
    },
    postcss: {
      plugins: [autoprefixer(), postcssGapProperties(), postcssFlexbugsFixes()],
    },
  },
});
