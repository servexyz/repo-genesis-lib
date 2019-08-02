import { pathsExist } from "paths-exist";

/*

  ------------------------------------------------------
  Private Repo
  ------------------------------------------------------
  platform === "github"
  host === "alechp"
  namespace === "servexyz"
  repo === "myPrivateRepo"
  remoteURI === "git@alechp:servexyz/myPrivateRepo"
  dir === "foo"
  sym === "myPriv"

  Symlink: "sandbox/foo/myPriv"
  Repository: "sandbox/.repositories/myPrivateRepo"

  ------------------------------------------------------
  Public Repo
  ------------------------------------------------------
  platform === "github"
  namespace === "servexyz"
  repo === "myPublicRepo"
  remoteURI === "git@alechp:servexyz/myPublicRepo"
  dir === "bar"

  Symlink: "sandbox/bar/myPriv"
  Repository: "sandbox/.repositories/myPublicRepo"

  ------------------------------------------------------


  ? Need to use local config database. 
  ? Otherwise, when doing look ups there will be failures if the user changes their config
*/

export async function parse(oConfig) {
  oConfig.repos.map(oRepo => {
    let { remote, space, repo, dir, sym } = oRepo;
    getRemoteString(remote, space, repo);
  });
  function getRemoteString(szRemote, szWorkspace, szRepository) {
    //TODO: Check whether provider is set
    return `https://${szRemote}/${szWorkspace}:${szRepository}`;
  }
  function getSymlinkCommand(szDirectory, szSymlink) {}
}
