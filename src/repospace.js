/**
 * @Author: Alec Hale-Pletka <alechp>
 * @Date:   2018-01-20T15:27:38-08:00
 * @Email:  alec@bubblegum.academy
 * @Last modified by:   alechp
 * @Last modified time: 2018-01-22T13:44:39-08:00
 */

const Promise = require("bluebird");
const chalk = require("chalk");
const log = console.log;
const path = require("path");
const fs = require("fs-extra");
const clone = require("git-clone");
const empty = require("is-empty");

export default class Repospace {
  constructor(repospace, repositories) {
    this.repospace = repospace; //path/to/repospace
    this.repositories = repositories; //path/to/repospace/.repositories
    this.cloned = [];
  }
  /////////////////////////////////////////////////////////////////////
  // Helpers
  /////////////////////////////////////////////////////////////////////

  //TODO: Create test for getRemoteSSH
  getRemoteSSH(account, repository) {
    return `git@${process.env.GIT_PROVIDER}:${account}/${repository}`;
  }
  gitClone(remoteRepository) {
    return new Promise((resolve, reject) => {
      let clonePathRe = /[^/]+$/;
      let clonePath = clonePathRe.exec(remoteRepository);
      log(`clonePath: ${chalk.yellow(clonePath)}`);
      clone(remoteRepository, this.repositories, err => {
        if (err) {
          log(`Failed. ${err}`);
          reject(`failed to clone ${remoteRepository}. \n ${chalk.red(err)}`);
        } else {
          log(`Successfully cloned`);
          resolve(remoteRepository);
        }
      });
    });
  }
  /////////////////////////////////////////////////////////////////////
  // Core
  /////////////////////////////////////////////////////////////////////
  async createDirectories() {
    try {
      await fs.ensureDir(this.repospace);
      await fs.ensureDir(this.repositories);
      return true;
    } catch (err) {
      log(`Failed to create directories. \n ${chalk.red(err)}`);
      return false;
    }
  }
  async cloneFactory(repositoriesToClone) {
    for (let repo of repositoriesToClone) {
      let remote = this.getRemoteSSH(repo.acct, repo.repo);
      try {
        let cloneDirectory = `${this.repositories}/${repo.repo}`;
        log(`Clone directory: ${cloneDirectory}`);
        await fs.ensureDir(cloneDirectory);
        let clone = await this.gitClone(remote);
        this.cloned.push(clone);
        log(`Added ${chalk.yellow(cloned)} to [this.cloned]`);
      } catch (err) {
        log(
          `Failed to clone repositories. ${chalk.yellow(
            "this.cloned[]"
          )} won't contain this repo. \n ${chalk.red(err)}`
        );
      }
    }
  }
  async symlinkFactory() {
    if (empty(this.cloned)) {
      log(
        `${chalk.yellow("this.cloned[]")} is empty. Check ${chalk.yellow(
          "cloneFactory"
        )} function`
      );
      return false;
    }
    //need to create array of paths of every repo that was created here
    for (let repo in this.cloned) {
      log(`Repo: ${chalk.yellow(repo)}`);
      try {
        await fs.ensureSymlink(repo, this.repospace);
      } catch (err) {
        log(`Failed to create symlink for ${repo}. \n ${chalk.red(err)}`);
      }
    }
  }
} //end of class
