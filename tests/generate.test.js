const log = console.log;
import { rgGen } from "../src/generate";
import test from "ava";
import chalk from "chalk";
import path from "path";
import { parseConfig, readConfig } from "../src/parse";
import { printMirror } from "tacker";

const configFile = path.resolve(__dirname, "../", "sandbox", ".repogen.json");
test.before(t => {
  process.env.rgenHost = "alechp";
});

//* Should work, just don't want to run everytime
test.skip(`${chalk.blue("rgGen(")}${chalk.cyan("all")}${chalk.blue(
  ")"
)} :: returns true `, async t => {
  let config = await readConfig(configFile);
  let parsedConfig = await parseConfig(config);
  t.true(await rgGen(parsedConfig, "all"));
});
