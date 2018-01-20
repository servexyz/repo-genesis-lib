/**
 * @Author: Alec Hale-Pletka <alechp>
 * @Date:   2018-01-19T16:05:25-08:00
 * @Email:  alec@bubblegum.academy
 * @Last modified by:   alechp
 * @Last modified time: 2018-01-19T17:32:57-08:00
 */

require("dotenv").config();
const path = require("path");
const repospace = require(path.join(__dirname, "../src/repospace.js"));

test("Repospace is created", () => {
  let repos = [
    "https://github.com/servexyz/kisoro",
    "https://github.com/alechp/bash"
  ];

  let respace = ".sandbox";
  let respacePath = path.join(__dirname, respace);
  let hiddenReposPath = path.join(__dirname, respace, ".repos");

  repospace(respacePath, hiddenReposPath)
    .createDirectories()
    .cloneFactory(repos)
    .symlinkFactory();
});
