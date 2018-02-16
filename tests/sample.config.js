const path = require("path");
const config = {
  provider: "alechp",
  repospacePath: path.join(__dirname, "../sandbox"),
  repositories: [
    {
      servexyz: "npm-starter"
    },
    {
      servexyz: "cli-starter"
    }
  ]
};
module.exports = { config };
