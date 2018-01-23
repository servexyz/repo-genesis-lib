/**
 * @Author: Alec Hale-Pletka <alechp>
 * @Date:   2018-01-17T15:59:49-08:00
 * @Email:  alec@bubblegum.academy
 * @Last modified by:   alechp
 * @Last modified time: 2018-01-23T11:36:50-08:00
 */
const log = console.log;
const chalk = require("chalk");
const Promise = require("bluebird");
import Repospace from "./src/repospace.js";

export default async function init(respacePath, reposPath, repos) {
  let r = new Repospace(respacePath, reposPath);
  await r.createRootDirectories();
  await r.cloneFactory(repos);
  // var flag = false;
  // Promise.all([directories, clones])
  //   .then(values => {
  //     log(`values: ${chalk.green(values)}`);
  //     //check to make sure directories and clones promises resolve to [true, true]
  //     if (values.every(val => val === true)) {
  //       log(`All values are true`);
  //       flag = true;
  //     }
  //   })
  //   .catch(err => {
  //     log(`Failed to resolve directories / clones. \n ${chalk.red(err)}`);
  //     flag = false;
  //   });
  // log(`Flag: ${chalk.yellow(flag)}`);
  // return flag;
  return true;
}
