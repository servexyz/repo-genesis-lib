import test from "ava";
import { readConfig, parseConfig } from "../src/parse";
import path from "path";
import is from "@sindresorhus/is";
import { printMirror } from "tacker";

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
    printMirror({ parsed }, "magenta", "grey");
    let x = is.array(parsed);
    printMirror({ x }, "magenta", "grey");
    t.true(x);
  } catch (e) {
    t.fail(e);
  }
});

//TODO: Create a parse for when rgenHost is present (ie. private + public repos)
//TODO: Create a parse for when rgenHost is absent (ie. public repos)
//TODO: Rename rgenHost to rgAuthHost
