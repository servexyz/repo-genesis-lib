/**
 * @Author: Alec Hale-Pletka <alechp>
 * @Date:   2018-01-20T15:27:38-08:00
 * @Email:  alec@bubblegum.academy
 * @Last modified by:   alechp
 * @Last modified time: 2018-01-22T09:21:22-08:00
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

  //TODO: Create test for getRemoteHTTPS
  getRemoteHTTPS(repository) {
    return new String(
      `https://${process.env.GIT_USER}:${process.env.GIT_PASS}@${repo}`
    );
  }
  //TODO: Create test for getRemoteSSH
  getRemoteSSH(organization, repository) {
    return new String(
      `git@${process.env.GIT_PROVIDER}:${organization}/${repository}`
    );
  }
  gitClone(remoteRepository) {
    return new Promise((resolve, reject) => {
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
    log(`repositoriesToClone: ${repositoriesToClone}`);
    for (let repo of repositoriesToClone) {
      log(`Repo.acct: ${chalk.blue(repo.acct)}`);
      log(`Repo.repo: ${chalk.blue(repo.repo)}`);
      let remote = this.getRemoteSSH(repo.acct, repo.repo);
      try {
        log(`Inside cloneFactory try block`);
        let clone = await gitClone(remote);
        this.cloned.push(clone);
        log(`Added ${chalk.yellow(cloned)} to [this.cloned]`);
      } catch (err) {
        log(
          `Failed to clone repositories. ${chalk.yellow(
            "this.cloned[]"
          )} won't contain this repo. \n ${chalk.red(repositoriesToClone)}`
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
