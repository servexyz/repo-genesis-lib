//this sample is based on real use case, but it's purposes are for testing

let server = "https://github.com/servexyz";
//input =>
const sample_repospace = {
  namespace: {
    singleRepoDir: {
      name: "baz",
      url: "github.com/xyz/baz"
    },
    multiRepoDir: [
      {
        name: "foo",
        url: "github.com/xyz/foo"
      },
      {
        name: "bar",
        url: "github.com/xyz/bar"
      }
    ]
  }
};

//output =>
/*
  ${namespace}/
    ${singleRepoDir}/
      ${baz}/
    ${multiRepoDir}/
      ${foo}/
      ${bar}/
*/
const genesis_repospace = {
  genesis: {
    file: [
      {
        name: "lib",
        url: `${server}/file-genesis-lib`
      },
      {
        name: "cli",
        url: `${server}/file-genesis-cli`
      }
    ],
    content: {
      name: "lib",
      url: `${server}/content-genesis-lib`
    },
    config: {
      name: "lib",
      url: `${server}/config-genesis-lib`
    },
    package: {
      name: "lib",
      url: `${server}/package-genesis-lib`
    },
    layout: {
      name: "lib",
      url: `${server}/layout-genesis-lib`
    },
    library: {
      name: "lib",
      url: `${server}/library-genesis-lib`
    }
  }
};

module.exports = {
  genesis: genesis_repospace
};
/*
  Sloppy implementation, but it should take care of test case.
  Naming everything lib/cli because going to use parent object keys as the directory name
*/
