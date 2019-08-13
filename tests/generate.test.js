const log = console.log;
import { rgGen } from "../src/generate";
import test from "ava";
import chalk from "chalk";
import path from "path";
import { parse, parseConfig, readConfig } from "../src/parse";
import { printMirror } from "tacker";

const configFile = path.resolve(__dirname, "../", "sandbox", ".repogen.json");
test.before(t => {
  process.env.rgAuthHost = "alechp";
  delete process.env.rgAuthHost;
});

//* Reasons for skipping some/all generate tests:
// --------------------------------
//* Slow to run everytime
//* "alechp" provider doesn't work on travis

test.skip(`${chalk.blue("rgGen(")}${chalk.cyan("all")}${chalk.blue(
  ")"
)} :: returns true `, async t => {
  let config = await readConfig(configFile);
  let parsedConfig = await parseConfig(config);
  t.true(await rgGen(parsedConfig, "all"));
});

test.skip(`${chalk.blue("rgGen(")}${chalk.cyan("all")}${chalk.blue(
  ")"
)} works with ${chalk.underline.grey("parse(null)")}`, async t => {
  let parsedConfig = await parse();
  t.true(await rgGen(parsedConfig, "all"));
});
