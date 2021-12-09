#! /usr/bin/env node

import { build } from "esbuild";
import { watch } from "chokidar";
import { promisify } from "util";
import path from "path";
import { readFileSync } from "fs";
import glob from "fast-glob";
import { resolve } from "path";
import rimraf from "rimraf";

const rimrafAsync = promisify(rimraf);

let packageJSON = readFileSync(resolve("./package.json"));
const { main, source, type, esbuild = {} } = JSON.parse(packageJSON);
const srcDir = path.resolve(source, "..");
const entry = [`${srcDir}/**/*.js`, `!*.stories.js`];

let outdir = path.resolve(main, "..");

/**
 * Builds the code in no time
 */
const run = async () => {
  //Start build service
  try {
    // await rimrafAsync(outdir);
    const entryPoints = await glob(entry);
    console.log({ entryPoints });
    // // Get time before build starts
    // const timerStart = Date.now();
    // // Build code
    // await build({
    //   entryPoints,
    //   outdir,
    //   bundle: false,
    //   loader: { ".js": "jsx" },
    //   ...esbuild,
    // });
    // // Get time after build ends
    // const timerEnd = Date.now();
    // console.log(`Built in ${timerEnd - timerStart}ms.`);
  } catch (e) {
    // OOPS! ERROR!
  }
};

const watcher = watch(entry);
// run();
console.log(`Watching ${entry}...`);
watcher.on("all", () => {
  run();
});
