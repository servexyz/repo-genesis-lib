/**
 * @Author: Alec Hale-Pletka <alechp>
 * @Date:   2018-01-17T15:59:49-08:00
 * @Email:  alec@bubblegum.academy
 * @Last modified by:   alechp
 * @Last modified time: 2018-01-23T11:58:55-08:00
 */
const log = console.log;
const chalk = require("chalk");
const Promise = require("bluebird");
import Repospace from "./src/repospace.js";

export default async function init(respacePath, reposPath, repos) {
  let r = new Repospace(respacePath, reposPath);
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
