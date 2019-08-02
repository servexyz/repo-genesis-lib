import execa from "execa";

async function gitClone(szURI) {
  return await execa("git", ["clone", szURI]);
}
