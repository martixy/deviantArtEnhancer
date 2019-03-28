import KeyHandler from './KeyHandler'
import DeviationUtils from './DeviationUtils'

const Downloader = function () {
    this.keyHandler = new KeyHandler();
    this.keyBindings = {};
};

Downloader.prototype.saveDeviation = function(context = null, async = false) {
    let jq = $(document);
    if (context !== null) {
        jq = $(context);
    }
    let name = DeviationUtils.getDeviationName(context);
    let url = '';
    let dlButton = jq.find(".dev-page-download");
    if (dlButton.length > 0) {
        if (downloadTokenTimeoutCheck())
            url = dlButton[0].href;
        else return false
    } else {
        let img = jq.find(".dev-content-full");
        if (img.length > 0) {
            url = img[0].src;
        }
    }
    return this.downloadDeviation(url, name, {async})
}

Downloader.prototype.openInNewTab = function(context = null) {
    let jq = $(document);
    if (context !== null) {
        jq = $(context);
    }
    let dlButton = jq.find(".dev-page-download");
    if (dlButton.length > 0) {
        if (downloadTokenTimeoutCheck()) {
            GM_openInTab(dlButton[0].href, {
                active: true,
                insert: true,
                setParent: true,
            });
        } else {
            timeoutReload(true);
        }
    }
}

Downloader.prototype.downloadDeviation = function(url, name, options) {
    let defaultOptions = {
        timeout: 5000,
        async: false
    };
    options = { ...defaultOptions, ...options };

    // Note: Fetch doesn't work because images not same origin, and no CORS is sent.
    if (GM_info.downloadMode === 'native') { // Browser API does not remember folder!
        if (options.async) {
            console.log('download: GM_download_async');
            return GM_dl_async(url, name, options);
        } else {
            console.log('download: GM_download');
            GM_dl(url, name, options);
        }
    } else {
        if (options.async) {
            console.log('download: fallback async');
            return GM_download_emu_async(url, name, options);
        } else {
            console.log('download: fallback');
            GM_download_emu(url, name, options);
        }
    }
}

Downloader.prototype.bindKeys = function(keyBindings) {
    this.keyBindings = keyBindings;
    for (let action of this.keyBindings) {
        if (!Array.isArray(action.keys)) action.keys = [action.keys];
        for (let key of action.keys) {
            this.keyHandler.registerKey("keydown", key, action.method.bind(this));
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
function downloadTokenTimeoutCheck() {
    if (window.performance.now() > 1000 * 605) return false;
    else return true;
}

function timeoutReload(queueDL = false) {
    let writer = $('.writer');
    if (writer.text() !== '') {
        alert(`Download token has expired (download button won't work).\nTried to auto-reload, but you have unsubmitted comments.`)
    } else {
        if (queueDL) window.localStorage.setItem('dae_downloadOnReload', window.location.href)
        window.location.reload()
    }
}


// Notes on GM_download
// 1. Undocumented, but has "timeout" option
function GM_dl(url, name, options) {
    let defaultOptions = {
        saveAs: true,
        ontimeout: () => console.log("Timeout!"),
        onerror(err) {
            if (err.error === 'not_whitelisted') {
                console.log("Error: Buggy Tampermonkey, falling back to old downloader.");
                GM_download_emu(url, name, options);
            } else {
                alert("Error! (see console)");
                console.error(err);
            }
        },
        onload: () => {},
        onprogress: () => {},
    };
    options = { ...defaultOptions, ...options };

    GM_download({
        url: url,
        name: name,
        saveAs: options.saveAs,
        timeout: options.timeout,
        ontimeout: options.ontimeout,
        onerror: options.onerror,
        onload: options.onload,
        onprogress: options.onprogress,
    });
}

function GM_dl_async(url, name, options) {
    let defaultOptions = {
        saveAs: true,
        timeout: 5000,
        onprogress: () => {},
    };
    options = { ...defaultOptions, ...options };

    return new Promise(function(resolve, reject) {
        GM_download({
            url: url,
            name: name,
            saveAs: options.saveAs,
            timeout: options.timeout,
            ontimeout() {
                reject({type: 'timeout', error: {url, name, timeout: options.timeout}});
            },
            onerror(err, details) {
                reject({type: 'error', error: err, details: details})
            },
            onload: resolve,
            onprogress: options.onprogress,
        })
    })
}

//The normal download function does not preserve the directory(always asks to save in Downloads)
function GM_download_emu(url, name, options) {
    let defaultOptions = {
        onerror(err) { alert("Error: " + r.statusText); },
        ontimeout() { alert("Timeout!"); }
    };
    options = { ...defaultOptions, ...options };

    const size = DeviationUtils.getImageDimensions();
    if (size !== null && size.total > 4e+6) {
        options.timeout = Math.ceil(size.total / 800);
    }

    GM_xmlhttpRequest({
        method: 'GET',
        url: url,
        responseType: "blob",
        timeout: options.timeout,
        onload: function(r) {
            saveAs(r.response, name); //TODO: Move this from a userscript require to a webpack import
        },
        onerror: options.onerror,
        ontimeout: options.ontimeout,
    });
};

function GM_download_emu_async(url, name, options) {
    let defaultOptions = {
        onerror(err) { alert("Error: " + r.statusText); },
        ontimeout() { alert("Timeout!"); }
    };
    options = { ...defaultOptions, ...options };

    const size = DeviationUtils.getImageDimensions();
    if (size !== null && size.total > 4e+6) {
        options.timeout = Math.ceil(size.total / 800);
    }

    return new Promise(function(resolve, reject) {
        GM_xmlhttpRequest({
            method: 'GET',
            url: url,
            responseType: "blob",
            timeout: options.timeout,
            onload: function(r) {
                saveAs(r.response, name);
                resolve(r);
            },
            ontimeout() {
                reject({type: 'timeout', error: options.timeout});
            },
            onerror(err, details) {
                reject({type: 'error', error: err, details: details})
            },
        });
    })
};
