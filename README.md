# deviantArtEnhancer
A userscript that for enhancing browsing of deviantArt, based on a modern build system(i.e. webpack)

## Usage
1. The script can be configured to filter artists from browsing based on a range of criteria(either removing their deviations or fading them out).
2. It places dimensions on deviations' download buttons. Also enables a couple of keyboard shortcuts: `q` and Numpad `.` download the deviation, `e` opens downloadable deviations in a new tab.
3. On gallery pages `Shift+Click` on a deviation opens it and the next 4 deviations in new tabs automatically.

All of these can be configured in their respective config files (the script has to be rebuilt for the changes to be reflected).

## Installation

1. Clone repo, run "yarn/npm install"
2. Do your config, etc.
3. Run "yarn/npm run build".
4. The next steps depend on the type of installation: Local or remote.

#### Local
**IMPORTANT!** Keep in mind that a local installation is only possible for chrome, because only chrome currently has a setting that allows extensions access to local file URLs. To enable access, go to the menu -> More tools -> Extensions and find your userscript manager (e.g. Tampermonkey. Are there any others even?), click on Details and toggle the setting "Allow access to file URLs".
With that out of the way:

5. Go to dist/ and open `local.user.js`. Copy its contents into a new userscript and save.
This is a one-time step, unless you change something about the build or somehow cause the file path of the script to change(e.g. renaming the project folder or whatever)
6. You are good to go. Script is now working.

#### Remote
5. Go to dist/. Copy the file `main.js` to some location available on the web.
6. Go to dist/ and open `local.user.js`. Change the last require line to the location you hosted the script on. Copy these contents into a new userscript and save.
7. You are good to go. Script is now working.

## Development

Feel free to change the script as you wish. Local development is the easiest option. You don't need to juggle compiled assets, uploads or other such nonsense, or even touch the userscript metadata. Just do `npm/yarn run build-w` and start developing - the files are now being watched by webpack and any changes are reflected immediately(upon saving the files and reloading the page the script is running on anyway).
