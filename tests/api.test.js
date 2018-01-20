/**
 * @Author: Alec Hale-Pletka <alechp>
 * @Date:   2018-01-19T16:05:25-08:00
 * @Email:  alec@bubblegum.academy
 * @Last modified by:   alechp
 * @Last modified time: 2018-01-19T16:24:12-08:00
 */

require("dotenv").config();
const path = require("path");
const { create } = require(path.join(__dirname, "../src/api.js"));

test("Repospace is created", () => {
  let repos = [
    "https://github.com/servexyz/kisoro",
    "https://github.com/alechp/bash"
  ];
  let repospace = path.join(__dirname, ".sandbox");
  create(repos, repospace);
});
