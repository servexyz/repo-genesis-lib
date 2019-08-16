import execa from "execa";
import * as nmr from "nommer";
import * as tkr from "tacker";
import is from "@sindresorhus/is";
import trash from "trash";

export async function remove(oWhat, szHow) {
  if (is.nullOrUndefined(oWhat) || is.nullOrUndefined(szHow)) {
    return null;
  }
  try {
    switch (szHow) {
      case "all":
        return await remAll(oWhat);
      case "repositories":
        return await remRepositories(oWhat);
      case "symlinks":
        return await remSymlinks(oWhat);
      case "dependencies":
        return await remDependencies(oWhat);
      default:
        return tkr.printError(true, {
          fn: "remove()",
          msg: `${chalk.green("szHow")} param needs to be either: ${chalk.grey(
            "all"
          )}, ${chalk.grey("repositories")}, ${chalk.grey("symlinks")} `
        });
    }
  } catch (err) {
    return tkr.printError(true, { fn: "remove()", err });
  }
}

export async function remAll(oWhatToRemove) {
  if (is.nullOrUndefined(oWhatToRemove)) {
    return null;
  }
  try {
    for await (let what of oWhatToRemove) {
      const {
        arrRepositoriesPaths,
        arrSymlinksPaths,
        arrDependenciesPaths
      } = what;
      await Promise.all([
        remRepositories(arrRepositoriesPaths),
        remSymlinks(arrSymlinksPaths),
        remDependencies(arrDependenciesPaths)
      ]);
    }
    return true;
  } catch (err) {
    return tkr.printError(true, { fn: "remAll", err });
  }
}

export async function remRepositories(arrRepositoriesPaths) {
  try {
    await trash(arrRepositoriesPaths);
    return true;
  } catch (err) {
    return tkr.printError(true, { fn: "remRepositories", err });
  }
}

export async function remSymlinks(arrSymlinksPaths) {
  try {
    await Promise.all(
      Array.of(arrSymlinksPaths).map(async sym => {
        return await trash(sym);
      })
    );
    return true;
  } catch (err) {
    return tkr.printError(true, { fn: "remSymlinks", err });
  }
}

export async function remDependencies(arrDependenciesPaths) {
  try {
    await Promise.all(
      Array.of(arrDependenciesPaths).map(async dep => {
        return await nmr.nmRemove(dep);
      })
    );
    return true;
  } catch (err) {
    return tkr.printError(true, { fn: "remDependencies", err });
  }
}
