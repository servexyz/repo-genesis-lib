const log = console.log;
import test from "ava";
import chalk from "chalk";
import path from "path";
import * as tkr from "tacker";
import { remove } from "../src/remove";
import { parse } from "../src/parse";

const rgConfigFile = path.resolve(process.cwd(), ".repogen.json");
const rgSandbox = path.join(process.cwd(), "sandbox");
const rgRepos = path.join(rgSandbox, ".repositories");

test.skip(`${chalk.cyan("remove")}${chalk.blue("(all)")}`, async t => {
  let config = await parse(rgConfigFile);
  t.true(await remove(config, "all"));
});
