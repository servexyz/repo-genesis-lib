import execa from "execa";
import * as nmr from "nommer";
import * as tkr from "tacker";
import execa from "execa";

export async function remove(oWhat, szHow) {
  switch (szHow) {
    case "all":
      return await remAll(oWhat);
    case "repositories":
      return await remRepositories(oWhat);
    case "symlinks":
      return await remSymlinks(oWhat);
    case "dependencies":
      return await remDependencies(oWhat);
  }
}

export async function remAll(oWhatToRemove) {}
export async function remRepository(szRepositoryPath) {}
export async function remRepositories(arrRepositoriesPaths) {}
export async function remSymlink(szSymlinkPath) {}
export async function remSymlinks(arrSymlinksPaths) {}
export async function remDependency(szDependencyPath) {
  try {
    return await nmr.nmRemove(szDependencyPath);
  } catch (err) {
    return printError(true, { fn: "remDependency", err });
  }
}
export async function remDependencies(arrDependenciesPaths) {
  return await Promise.all(
    arrDependenciesPaths.map(async dep => {
      return await nmr.nmRemove(dep);
    })
  );
}
