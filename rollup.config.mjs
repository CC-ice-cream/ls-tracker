import path, { dirname } from "path";
import ts2 from "rollup-plugin-typescript2";
import dts from "rollup-plugin-dts";
import { fileURLToPath } from "url";
const resolve = p => {
  return path.resolve(dirname(fileURLToPath(import.meta.url)), p)
}
export default [
  {
    input: "./src/core/index.ts",
    output: [
      {
        file: resolve("./dist/index.esm.js"),
        format: "es",
      },
      {
        file: resolve("./dist/index.cjs.js"),
        format: "cjs",
      },
      {
        file: resolve("./dist/index.js"),
        format: "umd",
        name: "tracker",
      },
    ],
    plugins: [ts2()],
  },
  {
    input: "./src/core/index.ts",
    output: {
      file: resolve("./index.d.ts"),
      format: "es",
    },
    plugins: [dts()],
  },
];
