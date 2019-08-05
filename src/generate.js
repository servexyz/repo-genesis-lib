import execa from "execa";
import { printMirror } from "tacker";

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
      await genRepository(repoRemoteUri, repoPath);
      await genSymlink(repoPath, symPath);
      await genDependency(repoPath);
      printMirror({ repoRemoteUri }, "cyan", "grey");
      printMirror({ symPath }, "cyan", "grey");
      printMirror({ repoPath }, "cyan", "grey");
    }
    return true;
  } catch (e) {
    return new Error(e);
  }
}
export async function genRepository(szRepoURIToClone, szWhereToCloneRepoTo) {
  try {
    await cloneRepository(szRepoURIToClone, szWhereToCloneRepoTo);
  } catch (e) {
    return new Error(e);
  }
}
export async function genSymlink(szRepoPath, szSymlinkPath) {
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

async function cloneRepository(szURI, cwd) {
  return await execa("git", ["clone", szURI], { cwd });
}

// https://github.com/servexyz/node-starter
// https://github.com/servexyz/npm-starter-sample-module
// https://github.com/servexyz/file-genesis

export async function cloneRepositories(arrURIs) {
  // [ { uri, sym, dir }, { uri, sym, dir }]
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
