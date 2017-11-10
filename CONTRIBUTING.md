# Contributing

After cloning the repository, run `npm install` to install development dependencies and compile the project.
Then run `npm start` to start a static file server for viewing the site.

After editing any TypeScript files, run `npm run prepare` to compile TypeScript and create a new bundle for the site.

## Workflow to release a new version

Run `npm version [<newversion> | major | minor | patch]` to bump the package version and create a new version commit and tag.

Then run `npm publish` to build and publish the new version.

Finally, run `npm run gh-pages` and `git push --tags` to update the website and repository.
