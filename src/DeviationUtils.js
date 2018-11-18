const DeviationUtils = function() {}

DeviationUtils.getImageDimensions = function(deviation, context) {
    let a;
    if (typeof deviation === 'undefined' || deviation === null) {
        a = $(".dev-page-download", context);
        if (a.length === 0) {
            a = $(".dev-content-full", context);
        }
    }
    else {
        a = $(deviation).find("a.thumb:not(.lit)");
    }

    if (a.length > 0) {
        let [x, y] = [0, 0];
        let source = '';
        if (a.data("download_width")) {
            x = parseInt(a.data("download_width"));
            y = parseInt(a.data("download_height"));
            source = "download";
        }
        else if (a.attr("data-super-full-width")) {
            x = parseInt(a.attr("data-super-full-width"));
            y = parseInt(a.attr("data-super-full-height"));
            source = "expand";
        }
        else if (a.attr("data-super-width")) {
            x = parseInt(a.attr("data-super-width"));
            y = parseInt(a.attr("data-super-height"));
            source = "no-expand";
        }
        else if (a.is("img")) {
            [x, y] = [a.get(0).width, a.get(0).height];
            // x = parseInt(a.width());
            // y = parseInt(a.height());
            source = "full";
        }
        else return null;

        return {
            width: x,
            height: y,
            total: x*y,
            source: source
        };
    }
}


DeviationUtils.overlayMessage = function (deviation, message, options) {
    const defaultOptions = {
        opacity: 0.25,
        bgColor: 'white'
    };
    options = { ...defaultOptions, ...options }; // jshint ignore:line

    let dev = $(deviation);
    // console.log(deviation);

    let temp = dev;
    let msgElement = dev.find(".mx-overlayMsg");

    if (msgElement.length === 0) {
        let el = $(`<div class='mx-overlayMsg' onclick='function(event) {console.log(event)}'>${message}</div>`);
        el.css({
            'position': 'absolute',
            'width': temp.width() + 'px',
            'text-align': 'center',
            'top': '35%',
            'font-family': '"Trebuchet MS",sans-serif',
            'font-size': '14px',
            'font-weight': 'bold',
            'z-index': '2000',
        });
        temp.append(el);
        temp.on("click", ".mx-overlayMsg", function(ev) {ev.stopPropagation()}); //This stops event bubbling, so that clicking the text doesn't trigger the link below.
        dev.find("a.torpedo-thumb-link").fadeTo(0, options.opacity);
        dev.find("span.info").fadeTo(0, options.opacity);
        dev.css("background-color", options.bgColor);
    }
    else {
        if (dev.find("a.torpedo-thumb-link").css("opacity") > options.opacity) {
            dev.find("a.torpedo-thumb-link").fadeTo(0, options.opacity);
            dev.find("span.info").fadeTo(0, options.opacity);
            dev.css("background-color", options.bgColor);
        }
        msgElement.html(msgElement.html() + "<br>" + message);
    }
}


DeviationUtils.getDeviationName = function(context = null) {
    let jq = $(document);
    if (context !== null) {
        jq = $(context);
    }
    const dlButton = jq.find(".dev-page-download");
    const reURL = /\/([^\/?]*)(?:\?|$).*$/; //Matches either ".../file.ext" or ".../file.ext?query=params"
    let name = "";
    let img = jq.find(".dev-content-full");
    if (img.length === 0) throw new Error('Expected img.dev-content-full.');
    img = img[0];
    if (~img.src.indexOf('https://images-wixmp')) {
        console.log('wixmp CDN');
        const reExternalNamed1 = /.*\/(.*)_(.*)-fullview(\..*)/;
        const reExternalNamed2 = /.*\/(.*)_(.*)-pre(\..*)/;
        let matches1 = reExternalNamed1.exec(img.src);
        let img2 = jq.find(".dev-content-normal")[0];
        let matches2 = reExternalNamed2.exec(img2.src);
        if (matches1 !== null) {
            name = `${matches1[1]}-${matches1[2]}${matches1[3]}`;
        } else if (matches2 !== null) {
            name = `${matches2[1]}-${matches2[2]}${matches2[3]}`;
        } else {
            let username = jq.find(".dev-title-container .username")[0].textContent;
            let devName = $(".dev-title-container h1 a")[0].textContent;
            const reIllegalCharacters = /[\\\/:*?"<>|]/g;
            const reHash = /.*\/(.*?)-.*/;
            devName = devName.replace(reIllegalCharacters, '_');
            let hash = reHash.exec(img.src)[1];
            name = devName + " by " + username + "-" + hash; //.ext automatic
        }
    } else {
        console.log('da CDN');
        if (dlButton.length > 0) {
            name = dlButton[0].href.match(reURL)[1];
        } else {
            let img = jq.find(".dev-content-full");
            let username = jq.find(".dev-title-container .username")[0].textContent;
            if (img.length > 0) {
                if (~img[0].src.indexOf(username.toLowerCase()) || ~img[0].src.indexOf("_by")) {
                    name = img[0].src.match(reURL)[1];
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
                    name = devName + " by " + username + hash;
                }
            }
        }
    }
    return name;
}

DeviationUtils.getDownloadButton = function(timeout = 20000) {
    return new Promise(function(resolve, reject) {
        setTimeout(reject, timeout);
        let interval = setInterval(() => {
            let dlButton = $(".dev-page-download");
            if (dlButton.length > 0) {
                clearInterval(interval);
                resolve(dlButton);
            }
        }, 200)
    })
}

export default DeviationUtils
