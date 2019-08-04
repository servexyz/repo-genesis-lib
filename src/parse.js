import { pathsExist } from "paths-exist";
import { printMirror } from "tacker";
import is from "@sindresorhus/is";
import fs from "fs-extra";
import chalk from "chalk";

// ? What if I just created a script which marshalled old repogen config files to new ones?
export async function readConfig(szPath) {
  //TODO: Enable repogen.json --> monolith libs (ie. "container" monolith)
  //TODO: Enable .repogen.js --> backwards compatability
  //TODO: Enable package.json --> disadvantage being requires npm; useful only for packages
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
//TODO: Determine which is the source of the config
/* 
? Order of priority:
1. Set via CLI flag
2. .repogen.json exists
3. package.json exists
4. e

*/
//TODO: Try to set process.env.rgenHost
// - .repogen.js: "provider"
// - .repogen.json: "provider"
// - .package.json: "provider"
// - directly via CLI flag (ie. options)

export async function parse(oConfig, oCliOptions) {
  //TODO: Use options as if CLI was passing information
  let rootDir = oConfig.dir;
  return oConfig.repos
    .map(oRepository => {
      //TODO: Add regression check (ie. if only 1 key/value pair)
      if (Object.keys(oRepository).length > 1) {
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
        return {
          uri: cloneRemoteString,
          sym,
          dir
        };
      } else {
        let space = Object.keys(oRepository); //key
        let repo = oRepository[space]; //value
        printMirror({ space }, "yellow", "grey");
        printMirror({ repo }, "yellow", "grey");
        let cloneRemoteString = getRemoteString("github.com", space, repo);
        return { uri: cloneRemoteString, sym: repo };
      }
    })
    .map(o => {
      printMirror({ o }, "blue", "grey");
      return o;
    });
}
function getRemoteString(szPlatform, szWorkspace, szRepository) {
  if (is.nullOrUndefined(process.env.rgenHost)) {
    return `https://${szPlatform}/${szWorkspace}/${szRepository}`;
  } else {
    return `git@${process.env.rgenHost}:${szWorkspace}/${szRepository}`;
  }
}
// function getSymlinkCommand(szDirectory, szSymlink) {}
