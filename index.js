/**
 * @Author: Alec Hale-Pletka <alechp>
 * @Date:   2018-01-17T15:59:49-08:00
 * @Email:  alec@bubblegum.academy
 * @Last modified by:   alechp
 * @Last modified time: 2018-02-11T17:02:31-08:00
 */
const log = console.log;
const chalk = require("chalk");
const Promise = require("bluebird");
const { Repospace } = require("./src/repospace.js");

async function init(respacePath, reposPath, repos, provider) {
  let r = new Repospace(respacePath, reposPath, provider);
  let directories = await r.createRootDirectories();
  let clones = await r.cloneFactory(repos);
  let clonedRepositories = Promise.all([directories, clones])
    .then(values => {
      return values[1];
    })
    .catch(err => {
      return err;
    });

  return clonedRepositories;
}

module.exports = { init };
