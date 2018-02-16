const log = console.log;
const chalk = require("chalk");
const path = require("path");
const fs = require("fs-extra");

beforeAll(() => {
  const sandbox = path.join(__dirname, "../sandbox");
  fs.removeSync(sandbox);
});

test("repos are cloned", async () => {
  // const { init } = require("../src/repo.js");
  const { init } = require("../index.js");
  const { config } = require("./sample.config.js");
  let ret = await init(config);
  let expected = ["git@alechp:alechp/bash", "git@alechp:servexyz/cli-starter"];
  // log(`ret: ${chalk.blue(ret)}`);
  expect(ret).toEqual(expected);
});
