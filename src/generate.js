import execa from "execa";

export async function cloneRepository(szURI, cwd) {
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
