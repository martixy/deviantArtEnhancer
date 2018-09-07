# Changelog

## Legend
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\+  New feature  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\*  Bugfix  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\~  Change  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\-  Removal  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\.  Comment  

### v1.0.1 [20180907]
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\* Async the DL button note (it wasn't showing when deviations loaded via dA's SPA functionality too slowly)  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\+ Add a dev build script without watch.

### v1.0 [20180907]
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\+ Massive overhaul of the entire script, using modern JS, webpack as a build system, ES6, modules, etc. The whole shebang.  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\+ First public release. YAY! 🎉🎉🎉  

## Unreleased

### v0.9 [20180902]
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\+ Switch to local file format for easy editing in external editors. (Gotta enable access to file URLs for the extension)  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\+ Switch out the old download function for the MUCH faster native GM_download (old one is still there as fallback)  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\+ New feature: Shift-click on a deviation in galleries opens it and the next 4 deviations in new tabs.  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\* Minor code cleanup  

### v0.8.1 [20180701]
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\~ Reformat code  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\* Fix some longstanding bugs on page navigation during notifications browsing and double download issues.  

### v0.8.0 [20170610]
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\+ Allow backgorund colors in overlay message.  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\+ Allow filtering by artists, with custom message and per-artist removal.  

### v0.7.1
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\~ Fix the address match to the new (IMO, less friendly) URLs  

### v0.7
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\~ Ported processing to the new browse stream. As a result of changing the overlayMessage function, it no longer properly overlays on gallery pages.  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\+ Remove the ad notice banner. Done via&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\.remove(); while a click dismisses it on successive pages as well(and we can simulate it), they probably gather data from that and I don't want them to.  

### v0.6
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\+ Support for dA's own AJAX.  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\* Fix download for old deviations. Decided against putting hashes on old-style deviations.  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\~ On artist pages only filter the first deviation.  

### v0.5
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\~ Minor changes to various functions.  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\* Download now timeouts based on image size.  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\* Disable hotkeys when writing comments.  

### v0.4
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\+ Added keyboard shortcuts for saving images(and other things with a download button). Won't yet download text.  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\+ Both single and multi-bind possible.  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\. Right now it uses my own server for the external dependency. Which is as of now necessary for Chrome(may not be for other browsers or later versions of Chrome).  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\. There's a github of it, plus the minified version is pretty small itself and could be simply inlined in the script.  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\+ Also added shortcut for opening images(well, the download button link) in a new tab.  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\. The one problem is that closing that tab puts you on the next tab, not the previous tab.  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\. Though... perhaps it would be possible to refocus that tab: @grant window.focus and hooking GM_openInTab's onclose event.  

### v0.3
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\* I am a moron. (i.e. fixed delayed load condition)  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\* Allow duplicates in the artist filter(by making sure the check happens only once).  

### v0.2
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\* Various small fixes. Global variables up top for now.  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\+ Deviation pages display total pixel count on the download button.  

### v0.1 Initial version
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\+ Displays image dimensions where available(.gifs don't offer that)  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\+ Filter by artist  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\+ Filter by dimensions  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\+ Overlay or remove filtered content.  

