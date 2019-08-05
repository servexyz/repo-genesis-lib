const log = console.log;
import test from "ava";
import { readConfig, parseConfig } from "../src/parse";
import path from "path";
import is from "@sindresorhus/is";
import { printMirror } from "tacker";

// repositoryPath: /Users/alechp/Code/servexyz/genesis/.repositories/repo-genesis/.repositories/repo-genesis-lib/sandbox/.repositories/get-pkg-prop
// c { repoRemoteUri: 'https://github.com/servexyz/get-pkg-prop',
//   symPath:
//    '/Users/alechp/Code/servexyz/genesis/.repositories/repo-genesis/.repositories/repo-genesis-lib/sandbox/modules/gpp',
//   repoPath:
//    '/Users/alechp/Code/servexyz/genesis/.repositories/repo-genesis/.repositories/repo-genesis-lib/sandbox/.repositories/get-pkg-prop' }
// c.is Object
const configFile = path.resolve(__dirname, "../", "sandbox", ".repogen.json");

test.before(t => {
  process.env.rgenHost = undefined; // --> Will not work; "undefined" not undefined
  process.env.rgenHost = null; // --> Will not work; "null" not null
  process.env.rgenHost = "alechp"; // --> Proper config
  delete process.env.rgenHost; // --> Works as expected; use this to ensure rgenHost isn't set
});

test(`parsing`, async t => {
  try {
    let config = await readConfig(configFile);
    printMirror({ config }, "magenta", "grey");
    let parsed = await parseConfig(config);
    t.true(is.array(parsed));
    for await (let c of parsed) {
      let { repoRemoteUri, symPath, repoPath } = await c;
      printMirror({ repoRemoteUri }, "magenta", "grey");
      printMirror({ symPath }, "magenta", "grey");
      printMirror({ repoPath }, "magenta", "grey");
      // log("c", await c);
      // log("c.is", is(c));
      log("is(repoRemoteUri)", is(repoRemoteUri));
      log("is(symPath)", is(symPath));
      log("is(repoPath)", is(repoPath));
      t.true(is.string(repoRemoteUri));
      t.true(is.string(symPath));
      t.true(is.string(repoPath));
    }
  } catch (e) {
    t.fail(e);
  }
});

//TODO: Create a parse for when rgenHost is present (ie. private + public repos)
//TODO: Create a parse for when rgenHost is absent (ie. public repos)
//TODO: Rename rgenHost to rgAuthHost
