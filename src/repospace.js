/**
 * @Author: Alec Hale-Pletka <alechp>
 * @Date:   2018-01-20T15:27:38-08:00
 * @Email:  alec@bubblegum.academy
 * @Last modified by:   alechp
 * @Last modified time: 2018-01-22T17:42:48-08:00
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
      let cloneRepoPathRe = /[^/]+$/;
      let cloneRepoPath = String(cloneRepoPathRe.exec(remoteRepository));
      log(`cloneRepoPath: ${cloneRepoPath}`);
      log(`typeof cloneRepoPath: ${typeof cloneRepoPath}`);
      let clonePath = path.join(this.repositories, cloneRepoPath);
      log(`clonePath: ${chalk.yellow(clonePath)}`);
      clone(remoteRepository, clonePath, err => {
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
  static deleteDirectoriesSync(directories) {
    for (let dir in directories) {
      fs.removeSync(dir);
    }
  }
  /////////////////////////////////////////////////////////////////////
  // Core
  /////////////////////////////////////////////////////////////////////
  async createRootDirectories() {
    try {
      Promise.all([
        await fs.ensureDir(this.repospace),
        await fs.ensureDir(this.repositories)
      ]);
      return true;
    } catch (err) {
      log(`Failed to create directories. \n ${chalk.red(err)}`);
      return false;
    }
  }
  async cloneFactory(repositoriesToClone) {
    //TODO: Ensure that both array elements are being stepped into
    //Seems like bash repo is attempting to be cloned twice
    for (let repo of repositoriesToClone) {
      let remote = this.getRemoteSSH(repo.acct, repo.repo);
      log(`${repo.acct} ${repo.repo}`);
      let cloneDirectory = `${this.repositories}/${repo.repo}`;
      log(`${chalk.blue(remote)}`);
      try {
        let clone = await this.gitClone(remote);
        log(`Clone Directory: ${chalk.blue(cloneDirectory)}`);
        log(`this.repospace: ${chalk.blue(this.repospace)}`);
        let sym = await fs.ensureSymlink(cloneDirectory, this.repospace);
        this.cloned.push(clone);
        return true;
      } catch (err) {
        log(
          `Failed to clone repositories. ${chalk.yellow(
            "this.cloned[]"
          )} won't contain this repo. \n ${chalk.red(err)}`
        );
        return false;
      }
    }
    log(`this.cloned: ${String(this.cloned)}`);
  }
} //end of class
