/**
 * @Author: Alec Hale-Pletka <alechp>
 * @Date:   2018-01-19T16:05:25-08:00
 * @Email:  alec@bubblegum.academy
 * @Last modified by:   alechp
 * @Last modified time: 2018-01-23T16:39:13-08:00
 */

const path = require("path");
const chalk = require("chalk");
const fs = require("fs-extra");
const log = console.log;

//Library functions
import Repospace from "../src/repospace.js";
import init from "../index.js";

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
    let ret = await init(respacePath, reposPath, repos, "alechp");
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
