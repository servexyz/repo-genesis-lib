const log = console.log;
import fs from "fs-extra";
import path from "path";
import chalk from "chalk";
import is from "@sindresorhus/is";
import { pathsExist } from "paths-exist";
import { printError, printLine, printMirror } from "tacker";
import { getPkgProp } from "get-pkg-prop";

export async function parse(oConfig) {
  let config = await chooseConfig(oConfig);
  printMirror({ config }, "magenta", "grey");
  let finalConfig = [];
  for await (let cfg of await parseConfig(config)) {
    let { repoRemoteUri, symPath, repoPath } = await cfg;
    finalConfig.push({ repoRemoteUri, symPath, repoPath });
  }
  return finalConfig;
}

export async function chooseConfig(oConfig) {
  let chosen;
  if (is.nullOrUndefined(oConfig)) {
    const { rgConfigPath } = process.env; // => Set by CLI
    const repogenJsonPath = path.join(process.cwd(), "repogen.json");
    printMirror({ repogenJsonPath }, "red", "blue");
    if (is.nullOrUndefined(rgConfigPath)) {
      printMirror({ rgConfigPath }, "red", "yellow");
      if ((await pathsExist(repogenJsonPath)) === false) {
        printMirror({ repogenJsonPath }, "red", "yellow");
        let repogenPkg = await getPkgProp("repogen");
        printMirror({ repogenPkg }, "yellow", "red");
        if ((await getPkgProp("repogen")) === false) {
          const repogenJsPath = path.join(process.cwd(), ".repogen.js");
          if (await pathsExist(repogenJsPath)) {
            const { config } = require(repogenJsPath);
            printMirror({ config }, "red", "yellow");
            chosen = "repogen.js in cwd";
            printMirror({ chosen }, "red", "yellow");
            return modernizeOldConfig(config);
          } else {
            printError({
              fn: "await pathsExist(repogenJsPath)",
              msg: "Path didn't exist or there was an error with require()"
            });
            return false;
          }
        } else {
          chosen = "package.json in pkgUp";
          printMirror({ chosen }, "red", "yellow");
          return await getPkgProp("repogen");
        }
      } else {
        printMirror({ repogenJsonPath }, "red", "green");
        chosen = "repogen.json in cwd";

        printMirror({ chosen }, "red", "yellow");
        return await readConfig(repogenJsonPath);
      }
    } else {
      printMirror({ rgConfigPath }, "red", "green");
      chosen = "custom config at specified path";

      printMirror({ chosen }, "red", "yellow");
      return await readConfig(rgConfigPath);
    }
  } else {
    if (oConfig.hasOwnProperty("repositories")) {
      chosen = "passed repogen.js style config";
      printMirror({ chosen }, "red", "yellow");
      return modernizeOldConfig(oConfig);
    } else {
      chosen = "passed repogen.json style config";
      printMirror({ chosen }, "red", "yellow");
      return oConfig;
    }
  }
}
export function modernizeOldConfig(oOldConfig) {
  let oNewConfig = {};
  for (let [k, v] of Object.entries(oOldConfig)) {
    if (k === "provider") {
      process.env.rgAuthHost = v;
    }
    if (k === "repospacePath") {
      Object.assign(oNewConfig, { dir: v });
    }
    if (k === "repositories") {
      Object.assign(oNewConfig, { repos: v });
    }
  }
  if (oNewConfig.hasOwnProperty("dir") === false) {
    Object.assign(oNewConfig, { dir: "" });
  }
  return oNewConfig;
}

export async function readConfig(szPath) {
  //TODO: Enable .repogen.json --> monolith libs (ie. "container" monolith)
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

//TODO: Try to set process.env.rgAuthHost
// - .repogen.js: "provider"
// - .repogen.json: "provider"
// - .package.json: "provider"
// - directly via CLI flag (ie. options)

/*
TODO: Breakup return oConfig.repos.map into two functions:
? -- create parseOldConfig function (.js)
? -- create parseModernConfig function (.json)
*/

export async function parseConfig(oConfig, oCliOptions) {
  //TODO: Use options as if CLI was passing information
  let rootDir = path.join(process.cwd(), oConfig.dir);
  process.env.rgRootDir = rootDir;
  let repoRootDir = path.join(rootDir, ".repositories");
  process.env.rgRepoRootDir = repoRootDir;
  fs.ensureDir(repoRootDir);
  return oConfig.repos.map(async oRepository => {
    //TODO: Add regression check (ie. if only 1 key/value pair)
    if (Object.keys(oRepository).length > 1) {
      // * Modern config
      let {
        plat = "github.com",
        space,
        repo,
        dir = "",
        sym = repo
      } = oRepository;
      // printMirror({ sym }, "green", "grey");
      // printMirror({ dir }, "red", "grey");
      let cloneRemoteString = getRemoteString(plat, space, repo);
      let symlinkPath = await getSymlinkPath(sym, dir);
      let repositoryPath = getRepositoryPath(rootDir, repo);
      // printMirror({ cloneRemoteString }, "green", "grey");
      // printMirror({ symlinkPath }, "green", "grey");
      // printMirror({ repositoryPath }, "green", "grey");
      return {
        repoRemoteUri: cloneRemoteString,
        symPath: symlinkPath,
        repoPath: repositoryPath
      };
    } else {
      // * Backwards compatibility
      //TODO: Fix symlink path for this version
      let space = Object.keys(oRepository); //key
      let repo = oRepository[space]; //value
      // printMirror({ space }, "yellow", "grey");
      // printMirror({ repo }, "yellow", "grey");
      let cloneRemoteString = getRemoteString("github.com", space, repo);
      //TODO: use repositoryPath as arg in getSymlinkPath
      let symlinkPath = await getSymlinkPath(repo);
      let repositoryPath = getRepositoryPath(rootDir, repo);
      // printMirror({ cloneRemoteString }, "cyan", "grey");
      // printMirror({ symlinkPath }, "cyan", "grey");
      // printMirror({ repositoryPath }, "cyan", "grey");
      return {
        repoRemoteUri: cloneRemoteString,
        symPath: symlinkPath,
        repoPath: repositoryPath
      };
    }
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
  if (is.nullOrUndefined(process.env.rgAuthHost)) {
    return `https://${szPlatform}/${szWorkspace}/${szRepository}`;
  } else {
    return `git@${process.env.rgAuthHost}:${szWorkspace}/${szRepository}`;
  }
}
async function getSymlinkPath(szNameOfSym, szOptionalSubdir = "") {
  //TODO: Replace process.env.rgRootDir with param
  if (is.nullOrUndefined(szNameOfSym)) return null;
  let symlinkRootDir = path.join(process.env.rgRootDir, szOptionalSubdir);
  await fs.ensureDir(symlinkRootDir);
  let joinedSymlinkPath = path.join(symlinkRootDir, szNameOfSym);
  return joinedSymlinkPath;
}
function getRepositoryPath(szRootDir, szNameOfRepo) {
  if (is.nullOrUndefined(szNameOfRepo)) return null;
  let repositoriesPath = path.join(szRootDir, ".repositories", szNameOfRepo);
  return repositoriesPath;
}
