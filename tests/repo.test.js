const { init } = require("../src/repo.js");
const log = console.log;
const chalk = require("chalk");
const path = require("path");
const fs = require("fs-extra");

beforeAll(() => {
  const respaceName = "sandbox";
  const respacePath = path.join(__dirname, respaceName);
  const reposPath = path.join(__dirname, respaceName, ".repositories");
  let directories = [reposPath, respacePath];
  for (let dir of directories) {
    // log(`deleting: ${chalk.yellow(dir)}`);
    fs.removeSync(dir);
  }
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
  // expect(ret).toEqual(expected);
});
