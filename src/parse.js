const log = console.log;
import fs from "fs-extra";
import path from "path";
import chalk from "chalk";
import is from "@sindresorhus/is";
import { pathsExist } from "paths-exist";
import { printError, printLine, printMirror } from "tacker";
import { getPkgProp } from "get-pkg-prop";

export async function parse(mConfig) {
  // ? mConfig == string || object
  let oConfig = {};
  if (is.nullOrUndefined(mConfig)) {
    return null;
  } else if (is.string(mConfig)) {
    if (mConfig.endsWith(".json")) {
    } else if (myConfig.endsWith(".js")) {
    } else {
      return printError(true, {
        fn: "parse",
        msg: `Unrecognized file type to parse. Expecting ${chalk.underline(
          ".js"
        )} or ${chalk.underline(".json")}`
      });
    }
  } else {
    is.string(mConfig);
  }
}
// export async function parse(oConfig = undefined) {
//   let config = await chooseConfig(oConfig);
//   printMirror({ config }, "magenta", "grey");
//   let finalConfig = [];
//   for await (let cfg of await parseConfig(config)) {
//     let { repoRemoteUri, symPath, repoPath } = await cfg;
//     finalConfig.push({ repoRemoteUri, symPath, repoPath });
//   }
//   return finalConfig;
// }

export async function chooseConfig(oConfig = undefined) {
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
      printMirror({ oConfig }, "red", "blue");
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
  if (await pathsExist(szPath)) {
    if (szPath.endsWith(".json")) {
      return await fs.readJson(szPath);
    } else if (szPath.endsWith(".js")) {
      const { config } = require(szPath);
      if (is.nullOrUndefined(config)) {
        return printError(true, {
          fn: "readConfig()->require()",
          msg: "Does your repogen.js config export a config object?"
        });
      } else {
        return config;
      }
    }
  } else {
    return printError(true, {
      fn: "readConfig()",
      msg: `Specified config file path doesn't exist:\n ${chalk.underline(
        szPath
      )}`
    });
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

export async function parseConfigOriginal(oConfig, oCliOptions) {
  //TODO: Use options as if CLI was passing information
  let configDir = is.nullOrUndefined(oConfig.dir) ? "." : oConfig.dir;
  printMirror({ configDir }, "red", "yellow");
  let rootDir = path.join(process.cwd(), configDir);
  process.env.rgRootDir = rootDir;
  let repoRootDir = path.join(rootDir, ".repositories");
  process.env.rgRepoRootDir = repoRootDir;
  fs.ensureDir(repoRootDir);
  if (oConfig.hasOwnProperty("repos")) {
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
        let cloneRemoteString = getRemoteUri(plat, space, repo);
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
        let cloneRemoteString = getRemoteUri("github.com", space, repo);
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
  } else {
    log("repogen.js");
    //TODO: Stop reusing entire function block. Convert to function
    return oConfig.repositories.map(async oRepository => {
      let space = Object.keys(oRepository); //key
      let repo = oRepository[space]; //value
      // printMirror({ space }, "yellow", "grey");
      // printMirror({ repo }, "yellow", "grey");
      let cloneRemoteString = getRemoteUri("github.com", space, repo);
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
    });
  }
}

/*
TODO: Create a helper function to abstract the below
*  let cloneRemoteString = getRemoteString("github.com", space, repo);
*  let symlinkPath = getSymlinkPath(repo)
*  let repositoryPath = getSymlinkPath(repo)
*/

export function parseTransformedConfig(oTransformedConfig) {
  if (oTransformedConfig.hasOwnProperty("repos")) {
    // Modern
  } else {
  }
}
export function parseNewRepoFormat(oRepository, szRootDir) {
  if (is.nullOrUndefined(oRepository) || is.nullOrUndefined(szRootDir)) {
    return null;
  }
  if (Object.keys(oRepository).length > 1) {
    const {
      plat = "github.com",
      space,
      repo,
      dir = "",
      sym = repo
    } = oRepository;
    if (is.nullOrUndefined(space) || is.nullOrUndefined(repo)) {
      return null;
    }
    return getConfigToParse(plat, space, repo, szRootDir, dir, sym);
  } else {
    return false;
  }
}
export function parseOldRepoFormat(
  szPlatform = "github.com",
  oRepoKV,
  szRootDir,
  szSymlinkOptionalSubdir = "",
  oOptions = { ensureDir: true }
) {
  if (is.nullOrUndefined(oRepoKV) || is.nullOrUndefined(szRootDir)) {
    return null;
  }
  let space = Object.keys(oRepoKV);
  let repo = oRepoKV[space];
  return getConfigToParse(
    szPlatform,
    space,
    repo,
    szRootDir,
    szSymlinkOptionalSubdir,
    repo,
    oOptions
  );
}

export function getConfigToParse(
  szPlatform = "github.com",
  szPlatformWorkspace,
  szRepositoryName,
  szRootDir,
  szSymlinkOptionalSubdir = "",
  szSymlinkName = szRepositoryName,
  oOptions = { ensureDir: true }
) {
  //TODO: Add null params
  //TODO: Add null param test
  let repoRemoteUri = getRemoteUri(
    szPlatform,
    szPlatformWorkspace,
    szRepositoryName
  );
  let symPath = getSymlinkPath(
    szSymlinkName,
    szRootDir,
    szSymlinkOptionalSubdir,
    oOptions
  );
  let repoPath = getRepositoryPath(szRootDir, szRepositoryName);
  return {
    repoRemoteUri,
    symPath,
    repoPath
  };
}
function getRemoteUri(szPlatform, szWorkspace, szRepository) {
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
function getSymlinkPath(
  szNameOfSym,
  szRootDir,
  szOptionalSubdir = "",
  oOptions = { ensureDir: true }
) {
  if (is.nullOrUndefined(szNameOfSym)) return null;
  let symlinkRootDir = path.join(szRootDir, szOptionalSubdir);
  if (oOptions.ensureDir === true) {
    (async () => {
      await fs.ensureDir(symlinkRootDir);
    })();
  }
  let joinedSymlinkPath = path.join(symlinkRootDir, szNameOfSym);
  return joinedSymlinkPath;
}
function getRepositoryPath(szRootDir, szNameOfRepo) {
  if (is.nullOrUndefined(szNameOfRepo)) return null;
  let repositoriesPath = path.join(szRootDir, ".repositories", szNameOfRepo);
  return repositoriesPath;
}
