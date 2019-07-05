# Changelog

## Legend
&emsp;\+  New feature  
&emsp;\*  Bugfix  
&emsp;\~  Change  
&emsp;\-  Removal  
&emsp;\!  Security  
&emsp;\.  Comment  

### v1.3.0 [20190705]
&emsp;\* Fixed a small bug in the downloader when download token expired.  
&emsp;\~ Change how key presses are handled, now works with other languages (e.g. if you switch to a different language, the browser receives a character different than the bound one. Now works based on key pressed, rather than character received). It does however assume QWERTY layout (sorry QWERTZ/AZERTY/DVORAK folks).  
&emsp;\! Update jquery (and all other node packages) after github complained with a security advisory for jq<3.4.

### v1.2.1 [20190328]
&emsp;\* When download token was expired, page was reloading when it didn't need to.  
&emsp;\* Fall back to old downloader as workaround for Tampermonkey 'not_whitelisted' error.  
&emsp;\~ Unify name handling between named images (where the image URL contains a name) and unnamed images (i.e. where I have to generate a name from the page data). Previously it didn't follow the URL pattern, now it does(underscores everywhere). I left a minor difference: it preserves capitalization (URLs are all lowercase).  
&emsp;\~ Update node modules and rebuild.

### v1.2 [20190222]
&emsp;\~ Add da's new CDN domain to the allowed origins. Requires rebuild/copy to tampermonkey.  
&emsp;\~ Change file names to the new naming scheme (with _ instead of -).  
&emsp;\* Fix some edge cases with file naming - downloads could end up with the wrong extension.  
&emsp;\+ Now auto-reloads page if you try to download and the download token has expired. Won't reload if there is an unsubmitted comment. Timing based (10 minutes).

### v1.1.2 [20181116]
&emsp;\~ Handle filenames properly after dA's move to a new CDN  

### v1.1.1 [20180915]
&emsp;\* Fix an osbcure race condition between script and dA when flipping through deviations too fast(by checking if the deviation on the element matches the current address).  
&emsp;\* Fix a silly little bug that made gallery hotkeys trigger wrong.

### v1.1.0 [20180910]
&emsp;\~ Refactored downloader to do its job better(and only its job). Also promisify downloader.  
&emsp;\+ Added the ability to download deviations directly from the gallery using alt+click. Can also use alt+shift+click to download multiple.

### v1.0.1 [20180907]
&emsp;\* Async the DL button note (it wasn't showing when deviations loaded via dA's SPA functionality too slowly)  
&emsp;\+ Add a dev build script without watch.

### v1.0 [20180907]
&emsp;\+ Massive overhaul of the entire script, using modern JS, webpack as a build system, ES6, modules, etc. The whole shebang.  
&emsp;\+ First public release. YAY! 🎉🎉🎉  

## Unreleased

### v0.9 [20180902]
&emsp;\+ Switch to local file format for easy editing in external editors. (Gotta enable access to file URLs for the extension)  
&emsp;\+ Switch out the old download function for the MUCH faster native GM_download (old one is still there as fallback)  
&emsp;\+ New feature: Shift-click on a deviation in galleries opens it and the next 4 deviations in new tabs.  
&emsp;\* Minor code cleanup  

### v0.8.1 [20180701]
&emsp;\~ Reformat code  
&emsp;\* Fix some longstanding bugs on page navigation during notifications browsing and double download issues.  

### v0.8.0 [20170610]
&emsp;\+ Allow backgorund colors in overlay message.  
&emsp;\+ Allow filtering by artists, with custom message and per-artist removal.  

### v0.7.1
&emsp;\~ Fix the address match to the new (IMO, less friendly) URLs  

### v0.7
&emsp;\~ Ported processing to the new browse stream. As a result of changing the overlayMessage function, it no longer properly overlays on gallery pages.  
&emsp;\+ Remove the ad notice banner. Done via&emsp;\.remove(); while a click dismisses it on successive pages as well(and we can simulate it), they probably gather data from that and I don't want them to.  

### v0.6
&emsp;\+ Support for dA's own AJAX.  
&emsp;\* Fix download for old deviations. Decided against putting hashes on old-style deviations.  
&emsp;\~ On artist pages only filter the first deviation.  

### v0.5
&emsp;\~ Minor changes to various functions.  
&emsp;\* Download now timeouts based on image size.  
&emsp;\* Disable hotkeys when writing comments.  

### v0.4
&emsp;\+ Added keyboard shortcuts for saving images(and other things with a download button). Won't yet download text.  
&emsp;\+ Both single and multi-bind possible.  
&emsp;\. Right now it uses my own server for the external dependency. Which is as of now necessary for Chrome(may not be for other browsers or later versions of Chrome).  
&emsp;\. There's a github of it, plus the minified version is pretty small itself and could be simply inlined in the script.  
&emsp;\+ Also added shortcut for opening images(well, the download button link) in a new tab.  
&emsp;\. The one problem is that closing that tab puts you on the next tab, not the previous tab.  
&emsp;\. Though... perhaps it would be possible to refocus that tab: @grant window.focus and hooking GM_openInTab's onclose event.  

### v0.3
&emsp;\* I am a moron. (i.e. fixed delayed load condition)  
&emsp;\* Allow duplicates in the artist filter(by making sure the check happens only once).  

### v0.2
&emsp;\* Various small fixes. Global variables up top for now.  
&emsp;\+ Deviation pages display total pixel count on the download button.  

### v0.1 Initial version
&emsp;\+ Displays image dimensions where available(.gifs don't offer that)  
&emsp;\+ Filter by artist  
&emsp;\+ Filter by dimensions  
&emsp;\+ Overlay or remove filtered content.  

