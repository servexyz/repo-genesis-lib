/**
 * @Author: Alec Hale-Pletka <alechp>
 * @Date:   2018-01-20T15:27:38-08:00
 * @Email:  alec@bubblegum.academy
 * @Last modified by:   alechp
 * @Last modified time: 2018-01-21T16:23:11-08:00
 */

const Promise = require("bluebird");
const chalk = require("chalk");
const log = console.log;
const path = require("path");
const fs = require("fs-extra");
const clone = require("git-clone");
//TODO: Checkout https://github.com/aichbauer/node-git-clone-repo

export default class Repospace {
  constructor(repospace, repositories) {
    this.repospace = repospace; //path/to/repospace
    this.repositories = repositories; //path/to/repospace/.repositories
    this.cloned = [];
  }
  /////////////////////////////////////////////////////////////////////
  // Helpers
  /////////////////////////////////////////////////////////////////////
  getRemoteHTTPS(repository) {
    return new String(
      `https://${process.env.GIT_USER}:${process.env.GIT_PASS}@${repo}`
    );
  }
  //TODO: Fix formatting of this function that it can handle account / repo objects
  getRemoteSSH(organization, repository) {
    return new String(
      `git@${process.env.GIT_PROVIDER}:${organization}/${repository}`
    );
  }
  gitClone(remoteRepository) {
    return new Promise((resolve, reject) => {});
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
        let cloned = await gitPullOrClone(repo);
        this.cloned.push(cloned);
        log(`Added ${chalk.yellow(cloned)} to [this.cloned]`);
      } catch (err) {
        log(
          `Failed to clone repositories. \n ${chalk.red(repositoriesToClone)}`
        );
      }
    }
  }
  async symlinkFactory() {
    log(`symlinkFactory: ${chalk.blue(String(this.cloned))}`);
    //need to create array of paths of every repo that was created here
    for (let repo in pathsToClonedRepos) {
      try {
        await fs.ensureSymlink(repo, this.repospace);
      } catch (err) {
        log(`Failed to create symlink for ${repo}. \n ${chalk.red(err)}`);
      }
    }
  }
} //end of class
