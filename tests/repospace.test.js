/**
 * @Author: Alec Hale-Pletka <alechp>
 * @Date:   2018-01-19T16:05:25-08:00
 * @Email:  alec@bubblegum.academy
 * @Last modified by:   alechp
 * @Last modified time: 2018-01-22T16:18:51-08:00
 */

const path = require("path");
const chalk = require("chalk");
const log = console.log;
import Repospace from "../src/repospace.js";

const respaceName = "sandbox";
const respacePath = path.join(__dirname, respaceName);
const reposPath = path.join(__dirname, respaceName, "repos");

beforeAll(() => {
  const rimraf = require("rimraf");
  rimraf(reposPath, err => {
    if (err) {
      log(`Failed to delete ${chalk.yellow(reposPath)} \n ${chalk.red(err)}`);
    } else {
      log(`${chalk.green("Successfully removed")} ${chalk.yellow(reposPath)}`);
    }
  });
});

async function instantiateRepospace(repos, respacePath, reposPath) {
  let r = new Repospace(respacePath, reposPath);
  r.createRootDirectoriesSync();
  try {
    // let directories = await r.createRootDirectories();
    let repositories = await r.cloneFactory(repos);
    return true;
  } catch (err) {
    log(
      `Failed to createRootDirectories or cloneRepositories. \n ${chalk.red(
        err
      )}`
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
  let acct = "alechp";
  let repo = "bash";
  let remoteGenerated = r.getRemoteSSH(acct, repo);
  log(`Remote gen: ${remoteGenerated}`);
  let remoteExpected = "git@alechp:alechp/bash";
  expect(remoteGenerated).toBe(remoteExpected);
});

test("Repospace is created", () => {
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
  let attempt = instantiateRepospace(repos, respacePath, reposPath)
    .then(ret => {
      return ret;
    })
    .catch(err => {
      log(`instantiateRepospace failed. \n ${chalk.red(err)}`);
      return err;
    });
  log(`Attempt: ${chalk.yellow(attempt)}`);
  expect(Boolean(attempt)).toBe(true);
});
