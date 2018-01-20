/**
 * @Author: Alec Hale-Pletka <alechp>
 * @Date:   2018-01-17T17:39:25-08:00
 * @Email:  alec@bubblegum.academy
 * @Last modified by:   alechp
 * @Last modified time: 2018-01-19T16:45:59-08:00
 */
(function() {
  "use strict";
  const Promise = require("bluebird");
  const chalk = require("chalk");
  const log = console.log;
  const path = require("path");
  const fs = require("fs-extra");

  var hiddenDirectory = ".repos";
  function Repospace(path) {}
  function create(repos, repospacePath) {
    log(`Going to clone these repos: \n ${chalk.blue(repos.toString())}`);
    // createDirectories(repospacePath)
    //   .then(hiddenPath => {
    //     log(`Cloning repos into ${hiddenPath}`);
    //     cloneFactory(repos, hiddenPath);
    //   })
    //   .then(clonedRepos => {
    //     log(`Symlinking factory with ${chalk.blue(clonedRepos.toString())}`);
    //     symlinkFactory(clonedRepos);
    //   })
    //   .catch(err => {
    //     log(`Failed to create repospace. \n ${chalk.red(err)}`);
    //   });
  }

  // create() {
  // fs.ensureDir(pathToSpace).then() {fs.ensureDir(hiddenRepo)}
  // cloneFactory() {}
  // symlinkFactory() { }
  // symlinkLayoutFactory() {}

  // function Repospace() {}

  Repospace.prototype.createDirectories = async function(repospacePath) {
    chalk.yellow(`Inside createDirectories`);
    let hiddenPath = `${repospacePath}/.repos`;
    try {
      await fs.ensureDir(repospacePath);
      await fs.ensureDir(hiddenPath);
      log(
        `Created: \n ${chalk.blue(repospacePath)} \n ${chalk.blue(hiddenPath)}`
      );
    } catch (err) {
      log(`Failed to create directories. \n ${chalk.red(err)}`);
    }
  };
  function gitRepoRemote(repo) {
    return new String(
      `https://${process.env.GIT_USER}:${process.env.GIT_PASS}@${repo}`
    );
  }
  // function getRepoBasename(repoRemote) {
  //   return repoRemote.substring(indexOf("@"), repoRemote.length);
  // }
  Repospace.prototype.cloneFactory = function(repos, hiddenPath) {
    let clonedRepos = [];
    let failedRepos = [];
    chalk.yellow(`Inside cloneFactory`);
    return new Promise((resolve, reject) => {
      repos.map(repo => {
        let remote = gitRepoRemote(repo);
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
      log(`clonedRepos: ${chalk.red(clonedRepos.toString())}`);
      log(`failedRepos: ${chalk.blue(failedRepos.toString())}`);
      failedRepos.length > 0 ? reject(failedRepos) : resolve(clonedRepos);
    });
  };

  Repospace.prototype.symlinkFactory = function(clonedRepos) {
    chalk.yellow(`Inside symlinkFactory`);
    let createdSymlinks = [];
    let failedSymlinks = [];
    return new Promise((resolve, reject) => {
      for (let repo in clonedRepos) {
        let source = path.join(__dirname, repo, hiddenDirectory);
        let target = path.join(__dirname, repo);
        fs.ensureSymlink(source, target, err => {
          if (err) {
            log(`Failed to create symlink ${target} which points to ${source}`);
            failedSymlinks.push(target);
          } else {
            log(`Created symlink ${target} which points to ${source}`);
            createdSymlinks.push(target);
          }
        });
      }
      failedSymlinks.length > 0
        ? reject(failedSymlinks)
        : resolve(createdSymlinks);
    });
  };
  // 1.0
  // TODO: function symlinkLayoutFactory(symlinks) {}

  module.exports = {
    create
  };
})();
