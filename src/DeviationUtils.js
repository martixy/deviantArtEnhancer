const DeviationUtils = function() {
}

DeviationUtils.getImageDimensions = function(deviation) {
    let a;
    if (typeof deviation === 'undefined') {
        a = $(".dev-page-download");
        if (a.length === 0) {
            a = $(".dev-content-full");
        }
    }
    else {
        a = $(deviation).find("a.thumb:not(.lit)");
    }

    if (a.length > 0) {
        //TODO: Examine this
        // if (!ajaxQueue2.has(a[0].href)) {
        //     ajaxQueue.push(deviation);
        //     ajaxQueue2.add(a[0].href);
        // }
        let [x, y] = [0, 0];
        if (a.data("download_width")) {
            x = parseInt(a.data("download_width"));
            y = parseInt(a.data("download_height"));
            return {
                width: x,
                height: y,
                total: x*y,
                source: "download",
                error: a.data("ajax_error")?a.data("ajax_error"):false,
            };
        }
        else if (a.attr("data-super-full-width")) {
            x = parseInt(a.attr("data-super-full-width"));
            y = parseInt(a.attr("data-super-full-height"));
            return {
                width: x,
                height: y,
                total: x*y,
                source: "expand",
                error: a.data("ajax_error")?a.data("ajax_error"):false,
            };
        }
        else if (a.attr("data-super-width")) {
                x = parseInt(a.attr("data-super-width"));
                y = parseInt(a.attr("data-super-height"));
            return {
                width: x,
                height: y,
                total: x*y,
                source: "no-expand",
                error: a.data("ajax_error")?a.data("ajax_error"):false,
            };
        }
        else if (a.is("img")) {
                x = parseInt(a.width());
                y = parseInt(a.height());
            return {
                width: x,
                height: y,
                total: x*y,
                source: "full",
                error: a.data("ajax_error")?a.data("ajax_error"):false,
            };
        }
        else return null;
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

export default DeviationUtils