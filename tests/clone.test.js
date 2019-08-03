import { gitClone, gitCloneAll } from "../src/clone";
let config = {
  dir: ".",
  repos: [
    {
      plat: "github.com",
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
let cloneArray = [
  {
    uri: "https://github.com/servexyz/node-starter",
    sym: "nstar"
  },
  {
    uri: "git@alechp:servexyz/npm-starter-sample-module",
    dir: "modules",
    sym: "npm-sample"
  }
];

let phases = { phase1: config, phase2: cloneArray };
