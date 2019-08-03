import { pathsExist } from "paths-exist";
import { printMirror } from "tacker";
import is from "@sindresorhus/is";
import fs from "fs-extra";
import chalk from "chalk";

// ? What if I just created a script which marshalled old repogen config files to new ones?
export async function readConfig(szPath) {
  //TODO: Enable repogen.json
  //TODO: Enable .repogen.js
  //TODO: Enable package.json
  try {
    if (await pathsExist(szPath)) {
      return await fs.readJson(szPath);
    } else {
      throw new Error(`Could not ${chalk.underline("find")} config`);
    }
  } catch (e) {
    throw new Error(`Could not ${chalk.underline("read")} config`);
  }
}
export async function parse(oConfig) {
  let rootDir = oConfig.dir;
  return oConfig.repos
    .reduce((oNewConfig, oRepository) => {
      let {
        plat = "github.com",
        space,
        repo,
        dir = rootDir,
        sym = repo
      } = oRepository;
      printMirror({ sym }, "green", "grey");
      printMirror({ rootDir }, "cyan", "grey");
      let cloneRemoteString = getRemoteString(plat, space, repo);
      printMirror({ cloneRemoteString }, "yellow", "grey");
      Object.assign(oNewConfig, {
        uri: cloneRemoteString,
        sym,
        dir
      });
    }, {})
    .map(o => {
      printMirror({ o }, "blue", "grey");
      return o;
    });
}
function getRemoteString(szPlatform, szWorkspace, szRepository) {
  //TODO: Check whether provider is set
  if (is.nullOrUndefined(process.env.rgenHost)) {
    return `https://${szPlatform}/${szWorkspace}:${szRepository}`;
  } else {
    return `git@${process.env.rgenHost}:${szWorkspace}/${szRepository}`;
  }
}
// function getSymlinkCommand(szDirectory, szSymlink) {}
