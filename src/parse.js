import { pathsExist } from "paths-exist";
import tacker from "tacker";

export async function parse(oConfig) {
  oConfig.repos.reduce((oNewConfig, oRepository) => {
    let { plat = "github.com", space, repo, dir, sym = repo } = oRepository;
    getRemoteString(remote, space, repo);
  }, {});
}
function getRemoteString(szRemote, szWorkspace, szRepository) {
  //TODO: Check whether provider is set
  return `https://${szRemote}/${szWorkspace}:${szRepository}`;
}
function getSymlinkCommand(szDirectory, szSymlink) {}
