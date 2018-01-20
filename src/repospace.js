/**
 * @Author: Alec Hale-Pletka <alechp>
 * @Date:   2018-01-17T17:39:25-08:00
 * @Email:  alec@bubblegum.academy
 * @Last modified by:   alechp
 * @Last modified time: 2018-01-19T17:32:04-08:00
 */
(function() {
  const Promise = require("bluebird");
  const chalk = require("chalk");
  const log = console.log;
  const path = require("path");
  const fs = require("fs-extra");
  const git = require("simple-git")();

  function Repospace(repospacePath, hiddenReposPath) {
    log(`repospacePath: ${chalk.yellow(repospacePath)}`);
    log(`hiddenReposPath: ${chalk.yellow(hiddenReposPath)}`);
    log(`This: ${this}`);
    this.respace = repospacePath;
    this.respaceRepos = hiddenReposPath;
  }

  Repospace.prototype.createDirectories = async function() {
    chalk.yellow(`Inside createDirectories`);
    try {
      await fs.ensureDir(this.respace);
      await fs.ensureDir(this.respaceRepos);
      log(
        `Created: \n ${chalk.blue(this.respace)} \n ${chalk.blue(
          this.respaceRepos
        )}`
      );
    } catch (err) {
      log(`Failed to create directories. \n ${chalk.red(err)}`);
    }
  };

  Repospace.prototype.getAuthenticatedRemoteStringFromRepo = function(repo) {
    return new String(
      `https://${process.env.GIT_USER}:${process.env.GIT_PASS}@${repo}`
    );
  };

  Repospace.prototype.cloneFactory = function(repos) {
    chalk.yellow(`Inside cloneFactory`);
    let clonedRepos = [];
    let failedRepos = [];
    repos.map(repo => {
      let remote = Repospace.getAuthenticatedRemoteStringFromRepo(repo);
      git()
        .clone(remote)
        .then(() => {
          log(`This ${chalk.blue(repo)} has been pushed to clonedRepos`);
          clonedRepos.push(repo);
        })
        .catch(err => {
          log(`${chalk.red(err)}`);
          failedRepos.push(repo);
        });
    });
    log(`clonedRepos: \n ${chalk.red(clonedRepos.toString())}`);
    log(`failedRepos: \n ${chalk.blue(failedRepos.toString())}`);
    this.clonedRepos = clonedRepos;
    return clonedRepos;
  };

  Repospace.prototype.symlinkFactory = async function(
    repos = this.clonedRepos
  ) {
    chalk.yellow(`Inside symlinkFactory`);
    let createdSymlinks = [];
    let failedSymlinks = [];
    for (let repo in clonedRepos) {
      let source = path.join(__dirname, repo, hiddenDirectory);
      let target = path.join(__dirname, repo);
      try {
        await fs.ensureSymlink(source, target);
      } catch (err) {
        failedSymlinks.push(target);
        log(`Failed to create symlink \n ${chalk.red(err)}`);
      }
      createdSymlinks.push(target);
    }
    return createdSymlinks;
  };
  // 1.0
  // TODO: function symlinkLayoutFactory(symlinks) {}

  module.exports = Repospace;
})();
