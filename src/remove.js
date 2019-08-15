import execa from "execa";
import * as nmr from "nommer";
import * as tkr from "tacker";
import trash from "trash";

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

export async function remAll(oWhatToRemove) {
  const {
    arrRepositoriesPaths,
    arrSymlinksPaths,
    arrDependenciesPaths
  } = oWhatToRemove;
  try {
    await remRepositories(arrRepositoriesPaths);
    await remSymlinks(arrSymlinksPaths);
    await remDependencies(arrDependenciesPaths);
  } catch (err) {
    return printError(true, { fn: "remAll", err });
  }
}
export async function remRepositories(arrRepositoriesPaths) {
  try {
    await trash(arrRepositoriesPaths);
    return true;
  } catch (err) {
    return printError(true, { fn: "remRepositories", err });
  }
}
export async function remSymlinks(arrSymlinksPaths) {
  try {
    await trash(arrSymlinksPaths);
    return true;
  } catch (err) {
    return printError(true, { fn: "remSymlinks", err });
  }
}
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
