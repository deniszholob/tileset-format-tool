# To contribute

**If you are working on an existing issue, please claim it with your comment, so there is no duplicate work.**

## What you will need before you begin:

1. Ensure [NodeJS](https://nodejs.org/) version 18.12.1 LTS or later is installed on your system.
2. Install [VSCode](https://code.visualstudio.com/) v1.74 or later
3. Clone the repository using `git` cli or ui like github desktop/sourcetree/gitkraken etc...
4. Open the cloned folder using VSCode and `install recommended extensions` (make sure you have `ritwickdey.liveserver` to be able to hos the index.html)
5. Run `npm run i` in the folder that you've just cloned to ensure you have all dependencies that are needed for development.
6. Run `npm run copy:watch` to copy static files to public directory
7. Run `npm run ts:watch` to compile typescript into javascript and put into public directory
8. In vscode; right click on the [public/index.html](public/index.html) and `Open with Live Server` to open the app with hot reloading

## Hidden Files in VSCode

Some files are hidden in vscode by default, see the `files.exclude` option in the [settings file](.vscode/settings.json)

There is a [recommended extension](.vscode/extensions.json) `adrianwilczynski.toggle-hidden` that allows to easily toggle hidden files on and off

## Steps to follow when your work is ready:

When your work is done:

1. Run `npm run build:prod`.
2. After a successful build, make a commit and push your changes. If you're fixing a existing issue: be sure to link to that issue in the git commit message, like so: `Closes #issueNumberThatGetsFixed`.
3. Create a new Pull Request.
4. Write a good description of the changes this pull-request will make.
5. You must provide screenshots if there is a visual change.
