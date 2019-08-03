import test from "ava";
import { readConfig, parse } from "../src/parse";
import path from "path";
import is from "@sindresorhus/is";
import { printMirror } from "tacker";

const configFile = path.resolve(__dirname, "../", "sandbox", ".repogen.json");

test.before(t => {
  process.env.rgenHost = "alechp";
});

test(`parsing`, async t => {
  try {
    let config = await readConfig(configFile);
    printMirror({ config }, "orange", "grey");
    let parsed = await parse(config);
    printMirror({ parsed }, "magenta", "grey");
    t.true(is.plainObject(parsed));
  } catch (e) {
    t.fail(e);
  }
});
