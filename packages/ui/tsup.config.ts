import { defineConfig } from "tsup"

export default defineConfig((options) => ({
  entry: {
    index: "src/index.ts",
    button: "src/components/button/index.ts",
    input: "src/components/input/index.ts",
  },

  format: ["esm"],
  dts: true,
  clean: !options.watch,
  sourcemap: true,
  splitting: true,
  treeshake: true,

  external: [
    "react",
    "react-dom",
  ],
}))