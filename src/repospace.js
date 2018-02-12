/**
 * @Author: Alec Hale-Pletka <alechp>
 * @Date:   2018-01-20T15:27:38-08:00
 * @Email:  alec@bubblegum.academy
 * @Last modified by:   alechp
 * @Last modified time: 2018-01-23T16:40:23-08:00
 */

const Promise = require("bluebird");
const chalk = require("chalk");
const log = console.log;
const path = require("path");
const fs = require("fs-extra");
const clone = require("git-clone");
const empty = require("is-empty");

export default class Repospace {
  constructor(repospace, repositories, provider) {
    this.repospace = repospace; //path/to/repospace
    this.repositories = repositories; //path/to/repospace/.repositories
    this.provider = provider;
    this.cloned = [];
  }
  /////////////////////////////////////////////////////////////////////
  // Helpers
  /////////////////////////////////////////////////////////////////////

  //TODO: Create test for getRemoteSSH
  getRemoteSSH(account, repository) {
    let provider = this.provider || "github.com";
    return `git@${provider}:${account}/${repository}`;
  }
  gitClone(remoteRepository) {
    return new Promise((resolve, reject) => {
      let cloneRepoPathRe = /[^/]+$/;
      let cloneRepoPath = String(cloneRepoPathRe.exec(remoteRepository));
      // log(`cloneRepoPath: ${cloneRepoPath}`);
      // log(`typeof cloneRepoPath: ${typeof cloneRepoPath}`);
      let clonePath = path.join(this.repositories, cloneRepoPath);
      // log(`clonePath: ${chalk.yellow(clonePath)}`);
      clone(remoteRepository, clonePath, err => {
        if (err) {
          // log(`Failed. ${err}`);
          reject(`failed to clone ${remoteRepository}. \n ${chalk.red(err)}`);
        } else {
          // log(`Successfully cloned`);
          resolve(remoteRepository);
        }
      });
    });
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
    for (let [acct, repo] of Object.entries(repositoriesToClone)) {
      let remote = this.getRemoteSSH(acct, repo);
      let cloneDirectory = `${this.repositories}/${repo}`;
      let symlinkTarget = `${this.repospace}/${repo}`;
      try {
        let clone = await this.gitClone(remote);
        log(`Clone Directory: ${chalk.blue(cloneDirectory)}`);
        log(`this.repospace: ${chalk.blue(this.repospace)}`);
        fs.ensureSymlinkSync(cloneDirectory, symlinkTarget);
        this.cloned.push(clone);
      } catch (err) {
        log(`cloneFactory failed. \n ${chalk.red(err)}`);
        return err;
      }
    }
    // log(`this.cloned: ${String(this.cloned)}`);
    return this.cloned;
  }
} //end of class
