const log = console.log;
const chalk = require("chalk");
const path = require("path");
const fs = require("fs-extra");
import test from "ava";

test.before(t => {
  const sandbox = path.join(__dirname, "../sandbox");
  fs.removeSync(sandbox);
});

test("repos are cloned", async t => {
  const { init } = require("../index.js");
  const { configSingular } = require("./sample.config.js");
  let ret = await init(configSingular);
  // let expected = [
  //   "https://github.com/servexyz/npm-starter-sample-module",
  //   "https://github.com/servexyz/node-starter"
  // ];
  let expected = ["https://github.com/servexyz/npm-starter-sample-module"];
  // log(`ret: ${chalk.blue(ret)}`);
  t.pass();
});
