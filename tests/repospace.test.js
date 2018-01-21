/**
 * @Author: Alec Hale-Pletka <alechp>
 * @Date:   2018-01-19T16:05:25-08:00
 * @Email:  alec@bubblegum.academy
 * @Last modified by:   alechp
 * @Last modified time: 2018-01-21T15:48:44-08:00
 */

require("dotenv").config();
const path = require("path");
const chalk = require("chalk");
const log = console.log;
import Repospace from "../src/repospace.js";

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

  let respaceName = ".sandbox";
  let respacePath = path.join(__dirname, respaceName);
  let reposPath = path.join(__dirname, respaceName, ".repos");
  let attempt = instantiateRepospace(repos, respacePath, reposPath);
  expect(Boolean(attempt)).toBe(true);
});
