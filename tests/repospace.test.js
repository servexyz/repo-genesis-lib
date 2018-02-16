const path = require("path");
const chalk = require("chalk");
const fs = require("fs-extra");
const log = console.log;

//Library functions
const { Repospace } = require("../src/repospace.js");
const { init } = require("../index.js");

//Paths
const respaceName = "sandbox";
const respacePath = path.join(__dirname, respaceName);
const reposPath = path.join(__dirname, respaceName, "repos");

beforeAll(() => {
  let directories = [reposPath, respacePath];
  for (let dir of directories) {
    // log(`deleting: ${chalk.yellow(dir)}`);
    fs.removeSync(dir);
  }
});

//TODO: Decouple testing dependence from alechp (right now that's tied to my ssh config)
test("SSH remote created using alechp remote", () => {
  let r = new Repospace(respacePath, reposPath, "alechp");
  let acct = "alechp";
  let repo = "bash";
  let remoteGenerated = r.getRemoteSSH(acct, repo);
  let remoteExpected = "git@alechp:alechp/bash";
  expect(remoteGenerated).toBe(remoteExpected);
});

test(
  "repositories are cloned into repospace",
  async () => {
    // "git@alechp:alechp/bash"
    // "git@alechp:servexyz/file-genesis"
    let repos = { alechp: "bash", servexyz: "file-genesis" };
    //TODO: Update this by passing options
    let options = Object.assign({}, reposPath, repos, "alechp");
    let ret = await init(respacePath, options);
    let expected = [
      "git@alechp:alechp/bash",
      "git@alechp:servexyz/file-genesis"
    ];
    log(`ret: ${chalk.blue(ret)}`);
    //TODO: setup legitimate event to test this
    expect(ret).toEqual(expected);
  },
  30000
);
