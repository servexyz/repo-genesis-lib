/**
 * @Author: Alec Hale-Pletka <alechp>
 * @Date:   2018-01-17T17:39:25-08:00
 * @Email:  alec@bubblegum.academy
 * @Last modified by:   alechp
 * @Last modified time: 2018-01-18T15:14:14-08:00
 */

const Promise = require("bluebird");
const chalk = require("chalk");
const log = console.log;
const path = require("path");
const git = require("git-js");
/*

Excerpt from README
| Name                      | Params                | Description              |
| :------------------------ | :-------------------- | :----------------------- |
| [Create](#createrootpath) | String(`pathToSpace`) | Designate repospace root |
| [Clone](#clone)           | Array(`repos`)        | Clone all github repos   |
| [Hide](#hide)             | undefined             | Move repos to hidden dir |
| [Symlink](#symlink)       | String(`pathToRepos`) | Param implicit from hide |
| [Structure](#structure)   | Object(`structure`)   | Move syms to dirs        |

*/
function create(pathToSpace) {
  let rootPath = path.join(process.cwd(), pathToSpace);
  return new Promise((resolve, reject) => {});
}
function clone(repos) {
  return new Promise((resolve, reject) => {});
}
function hide() {
  return new Promise((resolve, reject) => {});
}
function symlink() {
  return new Promise((resolve, reject) => {});
}
function structure() {
  return new Promise((resolve, reject) => {});
}
