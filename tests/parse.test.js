const log = console.log;
import test from "ava";
import chalk from "chalk";
import { readConfig, parseConfig, modernizeOldConfig } from "../src/parse";
import path from "path";
import is from "@sindresorhus/is";
import { printMirror } from "tacker";

const configFile = path.resolve(__dirname, "../", "sandbox", ".repogen.json");

test.before(t => {
  process.env.rgAuthHost = undefined; // --> Will not work; "undefined" not undefined
  process.env.rgAuthHost = null; // --> Will not work; "null" not null
  process.env.rgAuthHost = "alechp"; // --> Proper config
  delete process.env.rgAuthHost; // --> Works as expected; use this to ensure rgAuthHost isn't set
});

test(`${chalk.cyan("parseConfig")} produces three strings: ${chalk.underline(
  "repoRemoteUri"
)}, ${chalk.underline("symPath")}, ${chalk.underline("repoPath")}`, async t => {
  try {
    let config = await readConfig(configFile);
    let parsed = await parseConfig(config);
    t.true(is.array(parsed));
    for await (let c of parsed) {
      let { repoRemoteUri, symPath, repoPath } = await c;
      t.true(is.string(repoRemoteUri));
      t.true(is.string(symPath));
      t.true(is.string(repoPath));
    }
  } catch (e) {
    t.fail(e);
  }
});

test(`${chalk.cyan("modernizeOldConfig")} sets ${chalk.underline.grey(
  "process.env.rgAuthHost"
)} and returns a JSON config`, async t => {
  t.plan(2);
  const oldConfig = {
    provider: "alechp",
    repospacePath: "sandbox",
    repositories: [
      { servexyz: "get-pkg-prop" },
      { servexyz: "tacker" },
      { servexyz: "node-starter" }
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
        servexyz: "node-starter"
      }
    ]
  };
  let modernizedConfig = modernizeOldConfig(oldConfig);
  t.is(process.env.rgAuthHost, oldConfig.provider);
  t.deepEqual(modernizedConfig, newConfig);
});

//TODO: Create a test for when rgAuthHost is present (ie. private + public repos)
//TODO: Create a test for when rgAuthHost is absent (ie. public repos)
