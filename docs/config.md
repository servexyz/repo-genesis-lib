# Config

## Example

```js
const config = {
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
```

## Keys:

* **repospacePath** :: `<string>` :: required
  > Where everything is symlinked (cloned into repospacePath/.repositories)
* **repositories** :: `<[ {}, {} ]>` :: required
  > key == github.com/key
  > value == github.com/key/value
* **provider** :: `<string>` :: optional
  > Specify SSH by passing provider which matches with your config.

If the config has provider, SSH string is returned. If the config has no provider, HTTPS string is returned. Recommended to use config if you're trying to access private repositories.

### Sample SSH Config

##### Setup

* File Path

  > ~/.ssh/config

* Content

  > ```
  > Host myProviderAlias
  >  HostName github.com
  >  User git
  >  IdentityFile ~/.ssh/myPrivateKey
  > ```

##### Rendered by getRemoteString

* without provider

  > https://github.com/account/repository

* with `provider: myProviderAlias`

  > git@myProviderAlias:account/repository
