/**
 * @Author: Alec Hale-Pletka <alechp>
 * @Date:   2018-01-17T17:39:25-08:00
 * @Email:  alec@bubblegum.academy
 * @Last modified by:   alechp
 * @Last modified time: 2018-01-19T16:15:34-08:00
 */

const Promise = require("bluebird");
const chalk = require("chalk");
const log = console.log;
const path = require("path");
const fs = require("fs-extra");
/*

Excerpt from README
| Name                      | Params                | Description              |
| :------------------------ | :-------------------- | :----------------------- |
| [Create](#createrootpath) | String(`pathToSpace`) | Designate repospace root |
| [Clone](#clone)           | Array(`repos`)        | Clone all github repos   |
| [hidden](#hidden)         | undefined             | Move repos to hidden dir |
| [Symlink](#symlink)       | String(`pathToRepos`) | Param implicit from hidden |
| [Structure](#structure)   | Object(`structure`)   | Move syms to dirs        |

*/

var hiddenDirectory = ".repos";

function create(repos, repospacePath) {
  log(`Going to clone these repos: \n ${chalk.blue(repos.toString())}`);
  createDirectories(repospacePath)
    .then(hiddenPath => {
      log(`Cloning repos into ${hiddenPath}`);
      cloneFactory(repos, hiddenPath);
    })
    .then(clonedRepos => {
      log(`Symlinking factory with ${chalk.blue(clonedRepos.toString())}`);
      symlinkFactory(clonedRepos);
    })
    .catch(err => {
      log(`Failed to create repospace. \n ${chalk.red(err)}`);
    });
}
// create() {
// fs.ensureDir(pathToSpace).then() {fs.ensureDir(hiddenRepo)}
// cloneFactory() {}
// symlinkFactory() { }
// symlinkLayoutFactory() {}

function createDirectories(repospacePath) {
  let hidden = `${repospace}/.repos`;
  return new Promise((resolve, reject) => {
    fs
      .ensureDir(repospace)
      .ensureDir(hidden)
      .then(() => {
        resolve(hidden);
      })
      .catch(err => {
        reject(err);
      });
  });
}
function gitRepoRemote(repo) {
  return new String(
    `https://${process.env.GIT_USER}:${process.env.GIT_PASS}@${repo}`
  );
}
function getRepoBasename(repoRemote) {
  return repoRemote.substring(indexOf("@"), repoRemote.length);
}
function cloneFactory(repos, hiddenPath) {
  let clonedRepos = [];
  let failedRepos = [];
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
}

function symlinkFactory(clonedRepos) {
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
}
// 1.0
// TODO: function symlinkLayoutFactory(symlinks) {}

//---------------------------------------------------------------------------------
// Brainstorming API
//---------------------------------------------------------------------------------
// function create(pathToSpace) {
//   let repospace = path.join(process.cwd(), pathToSpace);
//   return new Promise((resolve, reject) => {
//     fs.ensureDir(repospace, err => {
//       if (err) {
//         reject(`Failed to create repospace. ${chalk.red(err)}`);
//       } else {
//         resolve(repospace);
//       }
//     });
//   });
// }
// function clone(repospaceToCloneInto) {
//   const git = require("simple-git/promise");
//   return new Promise((resolve, reject) => {
//     let flag = null;
//     repos.map(repo =>
//       git()
//         .clone(repo)
//         .then(() => {
//           `Cloned ${repo}`;
//         })
//         .catch(err => {
//           log(
//             `Failed to clone ${repo} into ${repospaceToCloneInto}. \n ${chalk.red(
//               err
//             )}`
//           );
//           flag = String(err);
//         })
//     );
//     if (typeof flag == "string") {
//       reject(flag);
//     } else {
//       resolve(repospaceToCloneInto);
//     }
//   });
// }
// function hidden(repospace) {
//   return new Promise((resolve, reject) => {
//     let hiddenDirectoryPath = `${repospace}/${hiddenDirectory}`;
//     fs.ensureDir(`${repospace}/${hiddenDirectory}`, err => {
//       if (err) {
//         let msg = `Failed to create ${hiddenDirectoryPath}. \n ${chalk.red(
//           err
//         )}`;
//         reject(msg);
//         log(msg);
//       } else {
//         let msg = `Created ${hiddenDirectoryPath}`;
//         resolve(msg);
//         log(msg);
//       }
//     });
//   });
// }

module.exports = {
  create
};
