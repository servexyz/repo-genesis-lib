import execa from "execa";

export async function gitClone(szURI, cwd) {
  return await execa("git", ["clone", szURI], { cwd });
}

// https://github.com/servexyz/node-starter
// https://github.com/servexyz/npm-starter-sample-module
// https://github.com/servexyz/file-genesis

export async function gitCloneAll(arrURIs) {
  let cloneRes = {};
  for await (let uri of arrURIs) {
    try {
      await gitClone(uri);
      Object.assign(cloneRes, { uri: true });
    } catch (e) {
      Object.assign(cloneRes, { uri: [false, e] });
    }
  }
}
