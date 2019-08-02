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
      remote: "github.com",
      space: "servexyz",
      repo: "tacker",
      dir: "modules",
      sym: "tkr"
    },
    {
      remote: "github.com",
      servexyz: "node-starter"
    }
  ]
};

console.log(`Hello from node-starter!`);
parse(inlineConfig);
/*
 * Parse
 * Sync
 * Clone
 * Prune
 * Store (local config)
 */
