const path = require("path");
const fs = require("fs-extra");
const clone = require("git-clone");
const empty = require("is-empty");
const log = console.log;
const chalk = require("chalk");

//TODO: Add type checking on config

/*
  @@config.repositories = [{}, {}]
  @@config.repospacePath = <sz> || default (process.cwd)
  @@config.provider = <sz> || default (github.com)
*/

let Repo = config => {
  var provider = config.provider || "github.com"; //optional
  var repospacePath = config.repospacePath; //required
  var repositories = config.repositories; //required
  var repositoriesPath = path.join(repospacePath, ".repositories"); //derived
  var clonedRepositories = [];
  return {
    getRemoteSSH: function(account, repository) {
      return `git@${provider}:${account}/${repository}`;
    },
    gitClone: function(remoteRepository) {
      return new Promise((resolve, reject) => {
        let cloneRepoPathRe = /[^/]+$/;
        let cloneRepoPath = String(cloneRepoPathRe.exec(remoteRepository));
        let clonePath = path.join(repositoriesPath, cloneRepoPath);
        // log("repositoriesPath: ", repositoriesPath);
        // log(`cloneRepoPath: ${cloneRepoPath}`);
        // log(`typeof cloneRepoPath: ${typeof cloneRepoPath}`);
        // log(`clonePath: ${clonePath}`);
        // log(`remote repository: ${chalk.magenta(remoteRepository)}`);
        clone(remoteRepository, clonePath, err => {
          if (err) {
            reject(`Failed to clone ${remoteRepository}. \n ${chalk.red(err)}`);
          } else {
            resolve(remoteRepository);
          }
        });
      });
    },
    cloneFactory: function() {
      this.createRootDirectories();
      // log(`repositories: ${JSON.stringify(repositories)}`);
      for (let [index, obj] of Object.entries(repositories)) {
        let acct = Object.keys(obj);
        let repo = Object.values(obj);
        // log(
        //   `index: ${chalk.yellow(index)} \n acct: ${chalk.green(
        //     acct
        //   )} \n repo: ${chalk.blue(repo)}`
        // );
        let remote = this.getRemoteSSH(acct, repo);
        // log(`remote: ${chalk.yellow(remote)}`);
        let cloneDirectory = `${repositoriesPath}/${repo}`;
        let symlinkTarget = `${repospacePath}/${repo}`;
        let singleClonedRepo = this.gitClone(remote)
          .then(repo => {
            fs.ensureSymlinkSync(cloneDirectory, symlinkTarget);
            log(`repo inside cloneFactory: ${chalk.blue(repo)}`);
            return repo;
          })
          .catch(err => {
            log(`cloneFactory failed. \n ${chalk.red(err)}`);
          });
        clonedRepositories.push(singleClonedRepo);
      }
      // log(`clonedRepositories: ${clonedRepositories}`);
      return clonedRepositories;
    },
    createRootDirectories: function() {
      fs.ensureDirSync(repospacePath);
      fs.ensureDirSync(repositoriesPath);
    }
  };
};

function init(config) {
  let clonesPromises = Repo(config).cloneFactory();
  // => [object Promise], [object Promise]
  let clonesResolved = Promise.all(clonesPromises)
    .then(clone => clone)
    .catch(err => err);
  // log(`clonesPromises: ${chalk.blue(clonesPromises)}`);
  // log(`clonesResolved: ${chalk.blue(clonesResolved)}`);
  return clonesResolved;
}

module.exports = { init };
