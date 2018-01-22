/**
 * @Author: Alec Hale-Pletka <alechp>
 * @Date:   2018-01-19T16:05:25-08:00
 * @Email:  alec@bubblegum.academy
 * @Last modified by:   alechp
 * @Last modified time: 2018-01-22T09:56:48-08:00
 */

const path = require("path");
const chalk = require("chalk");
const log = console.log;
import Repospace from "../src/repospace.js";

const respaceName = ".sandbox";
const respacePath = path.join(__dirname, respaceName);
const reposPath = path.join(__dirname, respaceName, ".repos");

async function instantiateRepospace(repos, respacePath, reposPath) {
  let r = new Repospace(respacePath, reposPath);
  try {
    let directories = await r.createDirectories();
    let repositories = await r.cloneFactory(repos);
    let symlinks = await r.symlinkFactory();
    return true;
  } catch (err) {
    log(
      `Failed to createDirectories or cloneRepositories. \n ${chalk.red(err)}`
    );
    return false;
  }
}

test("babel-plugin-inline-dotenv is loading", () => {
  let user = process.env.GIT_USER;
  log(`User: ${chalk.yellow(user)}`);
  expect(String(user)).toBe("alechp");
});

test("SSH remote created", () => {
  let r = new Repospace(respacePath, reposPath);
  let acct = "servexyz";
  let repo = "kisoro";
  let remoteGenerated = r.getRemoteSSH(acct, repo);
  log(`Remote gen: ${remoteGenerated}`);
  let remoteExpected = "git@alechp:servexyz/kisoro";
  expect(remoteGenerated).toBe(remoteExpected);
});

test("Repospace is created", () => {
  // "https://github.com/servexyz/kisoro",
  // "https://github.com/alechp/bash"
  let repos = [
    {
      acct: "servexyz",
      repo: "kisoro"
    },
    {
      acct: "alechp",
      repo: "bash"
    }
  ];
  let retFlag;
  let attempt = instantiateRepospace(repos, respacePath, reposPath)
    .then(ret => {
      log(`inside instantiateRepospace: ${chalk.green(ret)}`);
      return ret;
    })
    .catch(err => {
      log(`instantiateRepospace failed. \n ${chalk.red(err)}`);
      return err;
    });
  log(`Attempt: ${chalk.yellow(attempt)}`);
  expect(Boolean(attempt)).toBe(true);
});
