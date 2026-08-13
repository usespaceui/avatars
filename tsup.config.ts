import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    react: "src/react/index.ts",
  },
  format: ["cjs", "esm"],
  dts: true,
  clean: true,
  minify: true,
  minifySyntax: true,
  minifyWhitespace: true,
  minifyIdentifiers: true,
  external: ["react"],
});
