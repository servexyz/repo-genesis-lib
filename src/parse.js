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
  let configDir = is.nullOrUndefined(oConfig.dir) ? "." : oConfig.dir;
  printMirror({ configDir }, "red", "yellow");
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
  printMirror({ oConfig }, "cyan", "red");
  if (oConfig.hasOwnProperty("repos")) {
    return oConfig.repos.map(oRepo => {
      if (Object.keys(oRepository).length > 1) {
        return parseNewRepoFormat(oRepository, rootDir);
      } else {
        printMirror({ oRepository }, "cyan", "yellow");
        return parseOldRepoFormat("github.com", oRepository, rootDir);
      }
    });
  } else if (oConfig.hasOwnProperty("repositories")) {
    return oConfig.repositories.map(oRepository => {
      printMirror({ oRepository }, "cyan", "green");
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
