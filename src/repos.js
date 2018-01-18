/**
 * @Author: Alec Hale-Pletka <alechp>
 * @Date:   2018-01-18T14:58:10-08:00
 * @Email:  alec@bubblegum.academy
 * @Last modified by:   alechp
 * @Last modified time: 2018-01-18T15:12:47-08:00
 */

//this sample is based on real use case, but it's purposes are for testing

let server = "https://github.com/servexyz";
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
