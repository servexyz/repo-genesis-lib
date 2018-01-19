/**
 * @Author: Alec Hale-Pletka <alechp>
 * @Date:   2018-01-17T17:39:25-08:00
 * @Email:  alec@bubblegum.academy
 * @Last modified by:   alechp
 * @Last modified time: 2018-01-19T11:29:16-08:00
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
| [hidden](#hidden)             | undefined             | Move repos to hidden dir |
| [Symlink](#symlink)       | String(`pathToRepos`) | Param implicit from hidden |
| [Structure](#structure)   | Object(`structure`)   | Move syms to dirs        |

*/

// create() {
//   fs.ensureDir(pathToSpace)
//   .then() {
//     fs.ensureDir(hiddenRepo)
//   }
// }
// cloneFactory() {}
// symlinkFactory() { }
// symlinkLayoutFactory() {}

//---------------------------------------------------------------------------------
//---------------------------------------------------------------------------------
//brainstorming API:
function create(pathToSpace) {
  let repospace = path.join(process.cwd(), pathToSpace);
  return new Promise((resolve, reject) => {
    fs.ensureDir(repospace, err => {
      if (err) {
        reject(`Failed to create repospace. ${chalk.red(err)}`);
      } else {
        resolve(repospace);
      }
    });
  });
}
function clone(repospaceToCloneInto) {
  const git = require("simple-git/promise");
  return new Promise((resolve, reject) => {
    let flag = null;
    repos.map(repo =>
      git()
        .clone(repo)
        .then(() => {
          `Cloned ${repo}`;
        })
        .catch(err => {
          log(
            `Failed to clone ${repo} into ${repospaceToCloneInto}. \n ${chalk.red(
              err
            )}`
          );
          flag = String(err);
        })
    );
    if (typeof flag == "string") {
      reject(flag);
    } else {
      resolve(repospaceToCloneInto);
    }
  });
}
function hidden(repospace) {
  return new Promise((resolve, reject) => {
    let hiddenDirectory = ".repos";
    let hiddenDirectoryPath = `${repospace}/${hiddenDirectory}`;
    fs.ensureDir(`${repospace}/${hiddenDirectory}`, err => {
      if (err) {
        let msg = `Failed to create ${hiddenDirectoryPath}. \n ${chalk.red(
          err
        )}`;
        reject(msg);
        log(msg);
      } else {
        let msg = `Created ${hiddenDirectoryPath}`;
        resolve(msg);
        log(msg);
      }
    });
  });
}
