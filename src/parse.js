import { pathsExist } from "paths-exist";

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
