const { init } = require("../src/repo.js");
const log = console.log;
const chalk = require("chalk");
const path = require("path");
const fs = require("fs-extra");

beforeAll(() => {
  const sandbox = path.join(__dirname, "../sandbox");
  fs.removeSync(sandbox);
});

/*
  @@config.repositories = [{}, {}]
  @@config.repospacePath = <sz> || default (process.cwd)
  @@config.provider = <sz> || default (github.com)
*/

test("repos are cloned", async () => {
  const config = {
    provider: "alechp",
    repospacePath: path.join(__dirname, "../sandbox"),
    repositories: [
      {
        alechp: "bash"
      },
      {
        servexyz: "cli-starter"
      }
    ]
  };
  let ret = await init(config);
  let expected = ["git@alechp:alechp/bash", "git@alechp:servexyz/cli-starter"];
  log(`ret: ${chalk.blue(ret)}`);
  expect(ret).toEqual(expected);
});

test("api is working", () => {});
// async function testInit() {}
//TODO: Extract test function into testInit since it's being used twice
// test("api is working");
