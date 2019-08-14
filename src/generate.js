const log = console.log;
import execa from "execa";
import { printMirror, printLine } from "tacker";
import is from "@sindresorhus/is";

export async function generate(oWhat, szHow) {
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
export async function genAll(oWhatToGenerate) {
  try {
    for await (let what of oWhatToGenerate) {
      let { repoRemoteUri, symPath, repoPath } = what;
      await Promise.all([
        genRepository(repoRemoteUri),
        genSymlink(repoPath, symPath),
        genDependency(repoPath)
      ]);
    }
    return true;
  } catch (e) {
    return new Error(e);
  }
}
export async function genRepository(szRepoURIToClone) {
  // printMirror({ szRepoURIToClone }, "red", "grey");
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
  if (is.nullOrUndefined(szSymlinkPath)) {
    var name = getStringAfterChar(szRepoPath, "/");
  } else {
    name = getStringAfterChar(szSymlinkPath, "/");
  }
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

//TODO: async function genRepositories(oWhatToGenerate) {}
//TODO: async function genSymlinks(oWhatToGenerate) {}
//TODO: async function genDependencies(oWhatToGenerate) {}

async function cloneRepository(szURI) {
  return await execa("git", ["clone", szURI], {
    cwd: process.env.rgRepoRootDir
  });
}
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
