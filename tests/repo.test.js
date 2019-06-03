const log = console.log;
const chalk = require("chalk");
const path = require("path");
const fs = require("fs-extra");

beforeAll(() => {
  const sandbox = path.join(__dirname, "../sandbox");
  fs.removeSync(sandbox);
});

test.skip("repos are cloned", async () => {
  const { init } = require("../index.js");
  const { config } = require("./sample.config.js");
  let ret = await init(config);
  let expected = [
    "https://github.com/servexyz/npm-starter",
    "https://github.com/servexyz/cli-starter"
  ];
  // log(`ret: ${chalk.blue(ret)}`);
  expect(ret).toEqual(expected);
});
