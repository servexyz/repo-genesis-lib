# Todo

> Todos are bundled by release version

[Back to README](../README.md)

---

<!-- TOC START min:1 max:3 link:true update:true -->

* [Todo](#todo)
  * [v.0.5.0](#v050)
  * [v.1.0.0](#v100)
  * [Questions](#questions)

<!-- TOC END -->

---

### v.0.5.0

* [x] API Docs
  * [x] Seperate docs by concern
  * [ ] Update API docs
    * [x] Remove old
    * [ ] Add new
* [x] Questions, references and trail for v.0.5.0
* [x] Add jest config & tests directory
* [ ] Get repospace.test.js working

### v.1.0.0

* [ ] SymlinkLayoutFactory (right now symlinks all just dump into repospace)
* [ ] Replace dotenv require with https://www.npmjs.com/package/babel-plugin-dotenv

---

## Questions

3. What happens in the event that someone clones a repo in two locations ? Do branches persist across two locations?

4. Will there be pathing issues with relative repos in Windows environment ?

5. What's the most effective way to add a path to gitignore (ie. for the hidden repo that's generated / where all the repos are moved to?)

6. Is this best way to parse gitignore ? https://www.npmjs.com/package/parse-gitignore
7. Is there a babel-plugin for dotenv ? Yes: https://www.npmjs.com/package/babel-plugin-dotenv

---