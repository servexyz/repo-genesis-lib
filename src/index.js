import { parse } from "./parse";
let inlineConfig = {
  dir: ".",
  repos: [
    {
      remote: "github.com",
      space: "servexyz",
      repo: "get-pkg-prop",
      dir: "modules",
      sym: "gpp"
    },
    {
      space: "servexyz",
      repo: "tacker",
      dir: "modules",
      sym: "tkr"
    },
    {
      servexyz: "node-starter"
    }
  ]
};

// dir === repospacePath (need to check both)
//repos[0] == all options
//repos[1] == some options
//repos[2] == retro options; backwards support

console.log(`Hello from node-starter!`);
parse(inlineConfig);
/*
 * Parse
 * Sync
 * Clone
 * Prune
 * Store (local config)
 */
