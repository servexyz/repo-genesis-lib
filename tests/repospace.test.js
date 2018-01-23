/**
 * @Author: Alec Hale-Pletka <alechp>
 * @Date:   2018-01-19T16:05:25-08:00
 * @Email:  alec@bubblegum.academy
 * @Last modified by:   alechp
 * @Last modified time: 2018-01-22T17:41:37-08:00
 */

const path = require("path");
const chalk = require("chalk");
const fs = require("fs-extra");
const log = console.log;
import Repospace from "../src/repospace.js";
import init from "../index.js";
const respaceName = "sandbox";
const respacePath = path.join(__dirname, respaceName);
const reposPath = path.join(__dirname, respaceName, "repos");

beforeAll(() => {
  // log(`respacePath: ${chalk.yellow(respacePath)}`);
  // log(`reposPath: ${chalk.yellow(reposPath)}`);
  // fs.removeSync(reposPath);
  // fs.removeSync(respacePath);
  Repospace.deleteDirectoriesSync([reposPath, respacePath]);
});

test("babel-plugin-inline-dotenv is loading", () => {
  let user = process.env.GIT_USER;
  log(`User: ${chalk.yellow(user)}`);
  expect(String(user)).toBe("alechp");
});

test("SSH remote created", () => {
  let r = new Repospace(respacePath, reposPath);
  let acct = "alechp";
  let repo = "bash";
  let remoteGenerated = r.getRemoteSSH(acct, repo);
  log(`Remote gen: ${remoteGenerated}`);
  let remoteExpected = "git@alechp:alechp/bash";
  expect(remoteGenerated).toBe(remoteExpected);
});

test("repositories are cloned into repospace", async () => {
  // "https://github.com/alechp/bash"
  let repos = [
    {
      acct: "alechp",
      repo: "bash"
    },
    {
      acct: "servexyz",
      repo: "file-genesis"
    }
  ];
  let ret = init(respacePath, reposPath, repos);
  log(`ret: ${chalk.blue(ret)}`);
  expect(Boolean(ret)).toBe(true);
});
