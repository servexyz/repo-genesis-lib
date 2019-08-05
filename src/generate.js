const log = console.log;
import execa from "execa";
import { printMirror, printLine } from "tacker";
import is from "tacker/node_modules/@sindresorhus/is/dist";

export async function rgGen(oWhat, szHow) {
  try {
    switch (szHow) {
      case "all":
        return await genAll(oWhat);
      case "repositories":
        return await genRepositories(oWhat);
      case "symlinks":
        return await genSymlinks(oWhat);
      case "dependencies":
        return await genDependencies(oWhat);
    }
  } catch (e) {
    return new Error(e);
  }
}
async function genAll(oWhatToGenerate) {
  try {
    for await (let what of oWhatToGenerate) {
      let { repoRemoteUri, symPath, repoPath } = what;
      // await genRepository(repoRemoteUri, repoPath);
      await genSymlink(repoPath, symPath);
      await genDependency(repoPath);
      // printMirror({ repoRemoteUri }, "cyan", "grey");
      // printMirror({ symPath }, "cyan", "grey");
      // printMirror({ repoPath }, "cyan", "grey");
    }
    return true;
  } catch (e) {
    return new Error(e);
  }
}
export async function genRepository(szRepoURIToClone) {
  printMirror({ szRepoURIToClone }, "red", "grey");
  try {
    await cloneRepository(szRepoURIToClone);
  } catch (e) {
    return new Error(e);
  }
}
function getStringAfterChar(szString, szCharacter) {
  return szString.substring(
    szString.lastIndexOf(szCharacter) + 1,
    szString.length
  );
}
export async function genSymlink(szRepoPath, szSymlinkPath) {
  let name;
  if (is.nullOrUndefined(szSymlinkPath)) {
    printLine("blue");
    log(`null or undefined`);
    printLine("blue");
    name = getStringAfterChar(szRepoPath, "/");
    printMirror({ name }, "yellow", "grey");
  } else {
    printMirror({ szSymlinkPath }, "yellow", "grey");
    printLine("blue");
    log(`else`);
    printLine("blue");
    name = getStringAfterChar(szSymlinkPath, "/");
    printMirror({ name }, "yellow", "grey");
  }
  printMirror({ name }, "red", "grey");
  printMirror({ szSymlinkPath }, "red", "grey");
  try {
    await execa("ln", ["-s", szRepoPath, szSymlinkPath]);
  } catch (e) {
    return new Error(e);
  }
}
export async function genDependency(szWhereToInstall) {
  //TODO: Add option to allow choosing package manager (npm, yarn, etc)
  try {
    await execa("npm", ["install"], { cwd: szWhereToInstall });
    return true;
  } catch (e) {
    return new Error(e);
  }
}

// async function genRepositories(oWhatToGenerate) {}
// async function genSymlinks(oWhatToGenerate) {}
// async function genDependencies(oWhatToGenerate) {}

async function cloneRepository(szURI) {
  return await execa("git", ["clone", szURI], {
    cwd: process.env.rgRepoRootDir
  });
}

// https://github.com/servexyz/node-starter
// https://github.com/servexyz/npm-starter-sample-module
// https://github.com/servexyz/file-genesis

export async function cloneRepositories(arrURIs) {
  // [ { uri, sym, dir }, { uri, sym, dir }]
  //TODO: Ensure .repositories directory
  let cloneRes = {};
  for await (let uri of arrURIs) {
    try {
      await cloneRepository(uri);
      Object.assign(cloneRes, { uri: true });
    } catch (e) {
      Object.assign(cloneRes, { uri: [false, e] });
    }
  }
}
