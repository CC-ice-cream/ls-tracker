/*
 * @Author: CC-ice-cream 45475641+CC-ice-cream@users.noreply.github.com
 * @Date: 2022-12-15 12:30:39
 * @LastEditors: CC-ice-cream 45475641+CC-ice-cream@users.noreply.github.com
 * @LastEditTime: 2022-12-15 14:05:28
 * @FilePath: \TRACKER\rollup.config.mjs
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
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
