const path = require("path");
const config = {
  provider: "alechp",
  repospacePath: path.join(__dirname, "../sandbox"),
  repositories: [
    {
      alechp: "bash"
    },
    {
      servexyz: "cli-starter"
    }
  ]
};
module.exports = { config };
