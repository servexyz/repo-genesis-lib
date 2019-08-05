import { pathsExist } from "paths-exist";
import { printMirror } from "tacker";
import is from "@sindresorhus/is";
import fs from "fs-extra";
import chalk from "chalk";
import path from "path";

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

export async function parseConfig(oConfig, oCliOptions) {
  //TODO: Use options as if CLI was passing information
  let rootDir = path.join(process.cwd(), oConfig.dir);
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
        printMirror({ dir }, "red", "grey");
        printMirror({ rootDir }, "red", "grey");
        let cloneRemoteString = getRemoteString(plat, space, repo);
        let symlinkPath = getSymlinkPath(sym, dir);
        let repositoryPath = getRepositoryPath(repo);
        printMirror({ cloneRemoteString }, "green", "grey");
        printMirror({ symlinkPath }, "green", "grey");
        printMirror({ repositoryPath }, "green", "grey");
        return {
          repoRemoteUri: cloneRemoteString,
          symPath: symlinkPath,
          repoPath: repositoryPath
        };
      } else {
        // ? I think this is wrong.
        // ? Repos should be checking length for backwards compat
        let space = Object.keys(oRepository); //key
        let repo = oRepository[space]; //value
        printMirror({ space }, "yellow", "grey");
        printMirror({ repo }, "yellow", "grey");
        let cloneRemoteString = getRemoteString("github.com", space, repo);
        let symlinkPath = getSymlinkPath(repo);
        let repositoryPath = getSymlinkPath(repo);
        printMirror({ cloneRemoteString }, "cyan", "grey");
        printMirror({ symlinkPath }, "cyan", "grey");
        printMirror({ repositoryPath }, "cyan", "grey");
        return {
          repoRemoteUri: cloneRemoteString,
          symPath: symlinkPath,
          repoPath: repositoryPath
        };
      }
    })
    .map(o => {
      printMirror({ o }, "blue", "grey");
      return o;
    });
}

/*
TODO: Create a helper function to abstract the below
*  let cloneRemoteString = getRemoteString("github.com", space, repo);
*  let symlinkPath = getSymlinkPath(repo)
*  let repositoryPath = getSymlinkPath(repo)
*/

function getRemoteString(szPlatform, szWorkspace, szRepository) {
  if (
    is.nullOrUndefined(szPlatform) ||
    is.nullOrUndefined(szWorkspace) ||
    is.nullOrUndefined(szRepository)
  )
    return null;
  if (is.nullOrUndefined(process.env.rgenHost)) {
    return `https://${szPlatform}/${szWorkspace}/${szRepository}`;
  } else {
    return `git@${process.env.rgenHost}:${szWorkspace}/${szRepository}`;
  }
}
function getSymlinkPath(szNameOfSym, szOptionalSubdir = "") {
  if (is.nullOrUndefined(szNameOfSym)) return null;
  let rootPath = path.join(process.cwd(), szOptionalSubdir);
  return path.join(rootPath, szNameOfSym);
}
function getRepositoryPath(szNameOfRepo) {
  if (is.nullOrUndefined(szNameOfRepo)) return null;
  let repositoriesPath = path.join(process.cwd(), ".repositories");
  return path.join(repositoriesPath, szNameOfRepo);
}
// function getSymlinkCommand(szDirectory, szSymlink) {}
