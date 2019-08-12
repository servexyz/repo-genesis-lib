const log = console.log;
import test from "ava";
import chalk from "chalk";
import {
  parse,
  readConfig,
  getConfigToParse,
  parseConfig,
  modernizeOldConfig
} from "../src/parse";
import path from "path";
import is from "@sindresorhus/is";
import { printMirror } from "tacker";

const sandboxDir = path.join(__dirname, "../", "sandbox");
const newConfigFile = path.join(sandboxDir, ".repogen.json");
const oldConfigFile = path.join(sandboxDir, ".repogen.js");
const oldConfig = {
  provider: "alechp",
  repospacePath: "sandbox",
  repositories: [
    { servexyz: "get-pkg-prop" },
    { servexyz: "tacker" },
    { servexyz: "paths-exist" }
  ]
};
const newConfig = {
  dir: "sandbox",
  repos: [
    {
      servexyz: "get-pkg-prop"
    },
    {
      servexyz: "tacker"
    },
    {
      servexyz: "paths-exist"
    }
  ]
};

test.before(t => {
  process.env.rgAuthHost = undefined; // --> Will not work; "undefined" not undefined
  process.env.rgAuthHost = null; // --> Will not work; "null" not null
  process.env.rgAuthHost = "alechp"; // --> Proper config
  // delete process.env.rgAuthHost; // --> Works as expected; use this to ensure rgAuthHost isn't set
});

test(`${chalk.cyan("readConfig")} reads both ${chalk.underline(
  ".repogen.js"
)} and ${chalk.underline(
  ".repogen.json"
)}; have identical repositories objects`, async t => {
  let cNew = await readConfig(newConfigFile);
  let cOld = await readConfig(oldConfigFile);
  let cNewRepos = cNew.repos[2];
  let cOldRepos = cOld.repositories[2];
  // printMirror({ cNewRepos }, "magenta", "grey");
  // printMirror({ cOldRepos }, "magenta", "grey");
  t.deepEqual(cNewRepos, cOldRepos);
});
test(`${chalk.cyan("getConfigToParse")} produces ${chalk.underline(
  "(1)"
)} object consisting of ${chalk.underline("(3)")} strings`, t => {
  let { repoRemoteUri, symPath, repoPath } = getConfigToParse(
    "github.com",
    "servexyz",
    "paths-exist",
    sandboxDir
  );
  if (is.nullOrUndefined(process.env.rgAuthHost)) {
    t.true(repoRemoteUri === "https://github.com/servexyz/paths-exist");
  } else {
    t.true(
      repoRemoteUri === `git@${process.env.rgAuthHost}:servexyz/paths-exist`
    );
  }
  t.true(symPath.endsWith("sandbox/paths-exist"));
  t.true(repoPath.endsWith("sandbox/.repositories/paths-exist"));
});
// test(`${chalk.cyan("parseConfig")} produces three strings: ${chalk.underline(
//   "repoRemoteUri"
// )}, ${chalk.underline("symPath")}, ${chalk.underline("repoPath")}`, async t => {
//   try {
//     let config = await readConfig(configFile);
//     let parsed = await parseConfig(config);
//     t.true(is.array(parsed));
//     for await (let c of parsed) {
//       let { repoRemoteUri, symPath, repoPath } = await c;
//       t.true(is.string(repoRemoteUri));
//       t.true(is.string(symPath));
//       t.true(is.string(repoPath));
//     }
//   } catch (e) {
//     t.fail(e);
//   }
// });

test(`${chalk.cyan("modernizeOldConfig")} sets ${chalk.underline.grey(
  "process.env.rgAuthHost"
)} and returns a JSON config`, async t => {
  t.plan(2);
  let modernizedConfig = modernizeOldConfig(oldConfig);
  t.is(process.env.rgAuthHost, oldConfig.provider);
  t.deepEqual(modernizedConfig, newConfig);
});
// //TODO: Write "chooseConfig" test
// test(`${chalk.cyan(
//   "parse"
// )} return is the same for new config & old config`, async t => {
//   let cOld = await parse(oldConfig);
//   let cNew = await parse(newConfig);
//   t.deepEqual(cOld, cNew);
// });
// test(`${chalk.cyan("parse")} `, async t => {
//   let cImplicitNew = await parse();
//   printMirror({ cImplicitNew }, "magenta", "grey");
// });

// //TODO: Create a test for when rgAuthHost is present (ie. private + public repos)
// //TODO: Create a test for when rgAuthHost is absent (ie. public repos)
