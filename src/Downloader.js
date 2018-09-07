import KeyHandler from './KeyHandler'
import DeviationUtils from './DeviationUtils'

const Downloader = function () {
    this.keyHandler = new KeyHandler();
    this.keyBindings = {};
};

Downloader.prototype.saveDeviation = function(ev) {
    if (!$(":focus").hasClass("writer")) {
        const size = DeviationUtils.getImageDimensions();
        let timeout = 5000;
        if (size.total > 4e+6) timeout = Math.ceil(size.total / 800);
        const dlButton = $(".dev-page-download");
        if (dlButton.length > 0) {
            this.downloadDeviation(dlButton[0].href, { timeout: timeout });
        }
        else {
            let img = $(".dev-content-full");
            let username = $(".dev-title-container .username")[0].textContent;
            if (img.length > 0) {
                if (img[0].src.indexOf(username.toLowerCase()) >= 0 || img[0].src.indexOf("_by") >= 0) {
                    this.downloadDeviation(img[0].src, { timeout: timeout });
                }
                else {
                    let devName = $(".dev-title-container h1 a")[0].textContent;
                    let reIllegalCharacters = /[\\\/:*?"<>|]/g;
                    let reNewDev = /\/[^\/]*(-.*)$/;
                    // var reOldDev = /\/[^\/]*([^\/]{7}\.[^\/]+)$/; //Last 7 chars
                    let reOldDev = /\/[^\/]*([^\/]*\.[^\/]+)$/; //Just extension
                    devName = devName.replace(reIllegalCharacters, '_');
                    let hash = img[0].src.match(reNewDev);
                    if (hash && hash.length > 1) {
                        hash = img[0].src.match(reNewDev)[1];
                    }
                    else {
                        hash = img[0].src.match(reOldDev)[1];
                    }
                    let fileName = devName + " by " + username + hash;
                    this.downloadDeviation(img[0].src, { timeout: timeout, overrideName: fileName });
                }
            }
        }
    }
}

Downloader.prototype.openInNewTab = function(ev) {
    if (!$(":focus").hasClass("writer")) {
        let dlButton = $(".dev-page-download");
        if (dlButton.length > 0) {
            GM_openInTab(dlButton[0].href, {
                active: true,
                insert: true,
                setParent: true,
            });
        }
    }
}

Downloader.prototype.downloadDeviation = function(url, options) {
    let defaultOptions = {
        timeout: 5000,
    };
    if (typeof options === 'object') {
        options = $.extend(defaultOptions, options);
    } else {
        options = defaultOptions;
    }

    if (GM_info.downloadMode === 'native') {
        console.log('download: GM_download');
        GM_dl(url, options);
    } else {
        console.log('download: fallback');
        GM_download_emu(url, options);
    }
    // Note: Fetch doesn't work because images not same origin, and no CORS is sent.
}

Downloader.prototype.bindKeys = function(keyBindings) {
    this.keyBindings = keyBindings;
    for (let action of this.keyBindings) {
        if (!Array.isArray(action.keys)) action.keys = [action.keys];
        for (let key of action.keys) {
            this.keyHandler.registerKey("keydown", key, action.method.bind(this)); //Bind, or we get some BS that I don't even know how it happens...
        }
    }
}

Downloader.prototype.unbindKeys = function() {
    for (let action of this.keyBindings) {
        if (!Array.isArray(action.keys)) action.keys = [action.keys];
        for (let key of action.keys) {
            this.keyHandler.unregisterKey("keydown", key, action.method.bind(this));
        }
    }
}

export default Downloader

//===========================================================================================================
//===========================================================================================================
function GM_dl(url, options) {
    let reURL = /\/([^\/?]*)(?:\?|$).*$/; //Matches either ".../file.ext" or ".../file.ext?query=params"
    let name = '';
    if (options.overrideName) {
        name = options.overrideName;
    } else {
        name = url.match(reURL)[1];
    }
    GM_download({
        url: url,
        name: name,
        saveAs: true,
        timeout: options.timeout,
        ontimeout: () => console.log('Timeout!'),
        onerror(err) {
            alert("Error: " + err.statusText);
            console.error(err);
        }
    });
}

//The normal download function does not preserve the directory(always asks to save in Downloads)
function GM_download_emu(url, options) {
    GM_xmlhttpRequest({
        method: 'GET',
        url: url,
        responseType: "blob",
        timeout: options.timeout,
        onload: function(r) {
            if (typeof options.overrideName !== 'undefined') {
                saveAs(r.response, options.overrideName);
            }
            else {
                var reURL = /\/([^\/]*$)/;
                var name = r.finalUrl.match(reURL)[1];
                saveAs(r.response, name); //TODO: Move this from a userscript require to a webpack import
            }
        },
        onerror: function(r) { alert("Error: " + r.statusText); },
        ontimeout: function(r) { alert("Timeout!"); },
    });
};
