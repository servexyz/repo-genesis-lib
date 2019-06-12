const path = require("path");
const configPlural = {
  repospacePath: path.join(__dirname, "../sandbox"),
  repositories: [
    {
      servexyz: "node-starter"
    },
    {
      servexyz: "npm-starter-sample-module"
    }
  ]
};
const configSingular = {
  repospacePath: path.join(__dirname, "../sandbox"),
  repositories: [
    {
      servexyz: "npm-starter-sample-module"
    }
  ]
};
module.exports = { configSingular, configPlural };
