/**
 * @Author: Alec Hale-Pletka <alechp>
 * @Date:   2018-01-17T17:39:25-08:00
 * @Email:  alec@bubblegum.academy
 * @Last modified by:   alechp
 * @Last modified time: 2018-01-18T14:48:07-08:00
 */

const Promise = require("bluebird");
const chalk = require("chalk");
const log = console.log;
const path = require("path");
const git = require("git-js");

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
