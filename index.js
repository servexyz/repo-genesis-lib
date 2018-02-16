const { init } = require("./src/repo.js");
module.exports = { init };
// const log = console.log;
// const chalk = require("chalk");
// const Promise = require("bluebird");
// const { Repospace } = require("./src/repospace.js");

// const path = require("path");
// // async function init(respacePath, reposPath, repos, provider) {
// // let r = new Repospace(respacePath, reposPath, provider);

// //TODO: Clean up ugly handoff code between Repospace and this init function
// async function init(repositories, options) {
//   //TODO: Confirm that default param of process.cwd works here instead of CLI
//   let respacePath = options.respacePath || process.cwd();
//   let reposPath = path.join(respacePath, ".respace");
//   let provider = options.provider || "github.com";
//   log(`repos: ${JSON.stringify(repositories)}`);
//   let r = new Repospace(respacePath, reposPath);
//   let directories = await r.createRootDirectories();
//   let clones = await r.cloneFactory(repositories);
//   let clonedRepositories = Promise.all([directories, clones])
//     .then(values => {
//       return values[1];
//     })
//     .catch(err => {
//       return err;
//     });

//   return clonedRepositories;
// }

// module.exports = { init };
