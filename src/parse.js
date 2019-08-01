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
async function parse(oConfig) {
  function getPlatform() {}
  function getNamespace() {}
  function getRepository() {}
  function getRemoteURI() {}
  function getSymlinkPath() {}
  function getRepositoryPath() {}
}
