const log = console.log;
import fs from "fs-extra";
import path from "path";
import chalk from "chalk";
import is from "@sindresorhus/is";
import { pathsExist } from "paths-exist";
import { printError, printMirror } from "tacker";
import { getPkgProp } from "get-pkg-prop";

//TODO: Create (or add) chooseConfig
export async function parse(mConfig) {
  //TODO: Replace all ifs is() with 1 is call at top of fn and do simple str compare in ifs
  if (is.nullOrUndefined(mConfig)) {
    let config = await chooseConfig();
    printMirror({ config }, "blue", "green");
    return parseConfig(config[0]);
  } else if (is.string(mConfig)) {
    if (mConfig.endsWith(".json") || myConfig.endsWidth(".js")) {
      let cfg = await readConfig(mConfig);
      // printMirror({ cfg }, "cyan", "red");
      return parseConfig(cfg);
    } else {
      return printError(true, {
        fn: "parse",
        msg: `Unrecognized file type to parse. Expecting ${chalk.underline(
          ".js"
        )} or ${chalk.underline(".json")}`
      });
    }
  } else if (is.object(mConfig)) {
    return parseConfig(mConfig);
  } else {
    printError(true, {
      fn: "parse",
      msg: "Need to provide either a config object or path to a config file"
    });
  }
}

//TODO: Debug this selecting .js instead of .json when both are present
export async function chooseConfig(oConfig = undefined) {
  // let chosen;
  //TODO: Remove first is.nullOrDefined check. Unnecessary
  if (is.nullOrUndefined(oConfig)) {
    const { rgConfigPath } = process.env; // => Set by CLI
    const repogenJsonPath = path.join(process.cwd(), ".repogen.json");
    // printMirror({ repogenJsonPath }, "red", "blue");
    if (is.nullOrUndefined(rgConfigPath)) {
      // printMirror({ rgConfigPath }, "red", "yellow");
      if ((await pathsExist(repogenJsonPath)) === false) {
        // printMirror({ repogenJsonPath }, "red", "yellow");
        let repogenPkg = await getPkgProp("repogen");
        printMirror({ repogenPkg }, "yellow", "red");
        if ((await getPkgProp("repogen")) === false) {
          const repogenJsPath = path.join(process.cwd(), ".repogen.js");
          if (await pathsExist(repogenJsPath)) {
            const { config } = require(repogenJsPath);
            // printMirror({ config }, "red", "yellow");
            // chosen = "repogen.js in cwd";
            // printMirror({ chosen }, "red", "yellow");
            return [modernizeOldConfig(config), ".repogen.js"];
          } else {
            return printError({
              fn: "await pathsExist(repogenJsPath)",
              msg: "Path didn't exist or there was an error with require()"
            });
          }
        } else {
          // chosen = "package.json in pkgUp";
          // printMirror({ chosen }, "red", "yellow");
          return [await getPkgProp("repogen"), "package.json"];
        }
      } else {
        // printMirror({ repogenJsonPath }, "red", "green");
        // chosen = ".repogen.json in cwd";
        // printMirror({ chosen }, "red", "yellow");
        return [await readConfig(repogenJsonPath), ".repogen.json"];
      }
    } else {
      // printMirror({ rgConfigPath }, "red", "green");
      // chosen = "custom config at specified path";
      // printMirror({ chosen }, "red", "yellow");
      return [await readConfig(rgConfigPath), rgConfigPath];
    }
  } else {
    //TODO: Also unnecessary... Unless chooseConfig is being used on its own
    if (oConfig.hasOwnProperty("repositories")) {
      // chosen = "passed repogen.js style config";
      // printMirror({ chosen }, "red", "yellow");
      // printMirror({ oConfig }, "red", "blue");
      return [modernizeOldConfig(oConfig), ".repogen.js"];
    } else {
      // chosen = "passed .repogen.json style config";
      // printMirror({ chosen }, "red", "yellow");
      return [oConfig, ".repogen.json"];
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
TODO: Create a helper function to abstract the below
*  let cloneRemoteString = getRemoteString("github.com", space, repo);
*  let symlinkPath = getSymlinkPath(repo)
*  let repositoryPath = getSymlinkPath(repo)
*/

export function parseConfig(oConfig) {
  if (is.nullOrUndefined(oConfig)) {
    return null;
  } else {
    if (oConfig.hasOwnProperty("dir")) {
      configDir = oConfig.dir;
    } else {
      configDir = ".";
    }
  }
  if (oConfig.hasOwnProperty === true) {
    var configDir = oConfig.dir;
  } else {
    configDir = ".";
  }
  let rootDir = path.join(process.cwd(), configDir);
  process.env.rgRootDir = rootDir;
  let repoRootDir = path.join(rootDir, ".repositories");
  process.env.rgRepoRootDir = repoRootDir;
  //TODO: Move ensureDirectory to parseXRepoFormat
  (async () => {
    await fs.ensureDir(repoRootDir).catch(err =>
      printError(true, {
        fn: "parseConfig -> await fs.ensureDir",
        err,
        msg: "Directory could not be corrected"
      })
    );
  })();
  if (oConfig.hasOwnProperty("repos")) {
    return oConfig.repos.map(oRepository => {
      if (Object.keys(oRepository).length > 1) {
        return parseNewRepoFormat(oRepository, rootDir);
      } else {
        // printMirror({ oRepository }, "cyan", "yellow");
        return parseOldRepoFormat("github.com", oRepository, rootDir);
      }
    });
  } else if (oConfig.hasOwnProperty("repositories")) {
    return oConfig.repositories.map(oRepository => {
      // printMirror({ oRepository }, "cyan", "green");
      return parseOldRepoFormat("github.com", oRepository, rootDir);
    });
  }
}
export function parseNewRepoFormat(oRepository, szRootDir) {
  if (is.nullOrUndefined(oRepository) || is.nullOrUndefined(szRootDir)) {
    return null;
  }
  //TODO: Refactor test to address lack of Object.keys(oRepository).length > 1 check
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
  if (Object.keys(oRepository).length > 1) {
    return getTransformedConfig(plat, space, repo, szRootDir, dir, sym);
  } else {
    printError(true, {
      fn: "parseNewRepoFormat",
      msg: "parseNewRepoFormat was called against an old repo format"
    });
  }
}
export function parseOldRepoFormat(
  szPlatform = "github.com",
  oRepoKV,
  szRootDir,
  szSymlinkOptionalSubdir = ""
) {
  if (is.nullOrUndefined(oRepoKV) || is.nullOrUndefined(szRootDir)) {
    return null;
  }
  let space = Object.keys(oRepoKV);
  let repo = oRepoKV[space];
  return getTransformedConfig(
    szPlatform,
    space,
    repo,
    szRootDir,
    szSymlinkOptionalSubdir,
    repo
  );
}

export function printTransformedConfig(oConfig) {
  const { repoRemoteUri, symPath, repoPath } = oConfig;
  printMirror({ repoRemoteUri }, "magenta", "grey");
  printMirror({ symPath }, "magenta", "grey");
  printMirror({ repoPath }, "magenta", "grey");
}
export function getTransformedConfig(
  szPlatform = "github.com",
  szPlatformWorkspace,
  szRepositoryName,
  szRootDir,
  szSymlinkOptionalSubdir = "",
  szSymlinkName = szRepositoryName
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
    szSymlinkOptionalSubdir
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
    log(`process.env.rgAuthHost: ${chalk.red(process.env.rgAuthHost)}`);
  if (is.nullOrUndefined(process.env.rgAuthHost)) {
    let repoUri = `https://${szPlatform}/${szWorkspace}/${szRepository}`;
    // printMirror({ repoUri }, "magenta", "blue");
    return repoUri;
  } else {
    let repoUri = `git@${
      process.env.rgAuthHost
    }:${szWorkspace}/${szRepository}`;
    // printMirror({ repoUri }, "magenta", "green");
    return repoUri;
  }
}
function getSymlinkPath(szNameOfSym, szRootDir, szOptionalSubdir = "") {
  if (is.nullOrUndefined(szNameOfSym)) return null;
  let symlinkRootDir = path.join(szRootDir, szOptionalSubdir);
  (async () => {
    await fs.ensureDir(symlinkRootDir).catch(err =>
      printError(true, {
        fn: "getSymlinkPath -> await fs.ensureDir",
        err,
        msg: "Directory could not be created"
      })
    );
  })();
  let joinedSymlinkPath = path.join(symlinkRootDir, szNameOfSym);
  return joinedSymlinkPath;
}
function getRepositoryPath(szRootDir, szNameOfRepo) {
  if (is.nullOrUndefined(szNameOfRepo)) return null;
  let repositoriesPath = path.join(szRootDir, ".repositories", szNameOfRepo);
  return repositoriesPath;
}
