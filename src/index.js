import Router from './Router';


/* TODO:
1. Color-coding for the dimensions notes based on thresholds.
2. AJAXing all deviations for more reliable dimensions:
    - Currently the dimensions you get from the element are only the expandable dimensions. However a download option is OFTEN available with a larger size.
    - This works, but is SUPER-heavy, not cool to do to the site.
    - dA offers API access(https://www.deviantart.com/developers/).
    - The embed backend is publicly accessible(https://www.deviantart.com/developers/oembed).
    - The properties contain a "downloads" statistic. This can be used to reasonably tell if a download option exists. If the number is greater than 0, then it does exist, and is a good candidate for AJAXing.
    - Probably, if views is at least 10, it is reasonable to expect at least a single download. Or maybe something like if(views + faves*2 > 50 and downloads == 0) { //No download option exists }
4. NAN when download is an archive or TIFF.
5. Download things other than images and devs with a download button.
8. Sort by size? Seems trivially simple with jQ. [https://jsfiddle.net/CFYnE/]
9. Keyboard shortcut for downloading whatever is under the cursor.
    - Combine with shift-click to download batches, without opening the pages.
10. Proper download on a redirect back to deviation response. Should be easy, check if redirect is same address.
15. Dependency Injection and IoC? There's a couple of articles that say that the module system circumvents this.
*/

/*
API:
Use the full API, oEmbed does not offer the necessary functionality for scanning dimensions and download availability.
After some research:
The API is VERY fragmented when it comes to my purposes. For example, there are 2 IDs - a UUID, which the API works with, and an integer ID which goes in URLs, and page meta props and the like. There is no good way to link both.
The problems and most obvious approach I discovered is the following:
1. There is no obvious link between UUIDs and the integer IDs at the end of URLs
    - Solution: Make HEAD request for deviation URLs and get the <meta property="da:appurl" ...> That contains the UUID
2. The deviation endpoint does not offer the biggest available image size (e.g. in the 'content' prop of the response), but it does say whether it is downloadable.
3. The metadata endpoint, 'submission' prop offers the final downloadable size, but DOES NOT say if it's downloadable.

Possible approaches and problems:
1. Metadata does say how many times it has been downloaded, which will be 0 for devs that are not downloadable.
    - This however isn't conceptually reliable, as it may just be a new deviation that has not been downloaded yet. In practice it may be reliable most of the time. Especially given a high view/fav count.
    - Supports multiple deviations
2. Deviation endpoint says if its downloadable and lists file sizes
    - If 'content.filesize' === is_downloadable filesize, then you don't need to make a metadata request, since content contains the max dimensions already.
    - Supports only one deviations

This has you looking at 2 or 3 additional requests per deviation, just to determine the max dimensions.
Metadata will also contain things like tags, which is useful for filtering.

One additional consideration is rate limiting.

Another approach is the browse endpoint, which returns the same data as the deviation endpoint, but in batches of 24.
*/

$.fn.reverse = [].reverse;

main();
function main() {
    console.log("dA script loaded");
    $("#block-notice").remove();
    $(".ad-container.small").remove();
    const router = new Router();
    router.route();
    setInterval(router.route.bind(router), 800); // 800 is probably low enough
}



// TODO: Figure this bit out.
function filterByDimensions(deviation, pixelCount, options) {
    if (typeof options === 'undefined') options = {
        minWidth: 0,
        minHeight: 0,
        remove: false,
        fadeOpacity: 0.25,
    };
    else {
        if (typeof options.minWidth === 'undefined')
            options.minWidth = 0;
        if (typeof options.minHeight === 'undefined')
            options.minHeight = 0;
        if (typeof options.remove === 'undefined')
            options.remove = false;
        if (typeof options.fadeOpacity === 'undefined')
            options.fadeOpacity = false;
    }
    //Codeh
    var image = getImageDimensions(deviation);
    if (image) {
        if (typeof pixelCount === 'string' && pixelCount.toLowerCase().indexOf("mpx")) pixelCount = parseFloat(pixelCount) * 1e+6;
        if (pixelCount < 20) pixelCount *= 1e+6;
        if (image.total < pixelCount || image.width < options.minWidth || image.height < options.minHeight) {
            if (options.remove) {
                $(deviation).hide();
            }
            else {
                //TODO: Messages for min x/y dimensions
                var str = "";
                if (pixelCount > 1e+6)
                    str += (pixelCount/1e+6).toLocaleString("en-US", { maximumFractionDigits: 2 }) + "&nbsp;MPx";
                else
                    str += (pixelCount/1e+6).toLocaleString("en-US") + " MPx";
                overlayMessage(deviation, "Below size threshold (" + str + ")", options.fadeOpacity);
            }
        }
    }
}

function initAJAX() {
    setTimeout(getDownloadSize, 2000);
}


function getDownloadSize() {
    setTimeout(function() {
        var currentDeviation = ajaxQueue.shift();
        console.log("Checks remaining: " + ajaxQueue.length);
        if (currentDeviation) {
            var a = $(currentDeviation).find("a.thumb:not(.lit)");
            if (a.length > 0) {
                //TODO: Making a chainable deffered. Fetch maybe allows that?
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: a[0].href,
                    timeout: 5000,
                    onload: function(r) {
                        var button = $(r.responseText).find(".dev-page-download");
                        if (button.length > 0) {
                            a.data("download_width", button.attr("data-download_width"));
                            a.data("download_height", button.attr("data-download_height"));
                            addDimensionsNote(currentDeviation); //Closures are amazing.
                        }
                    },
                    onerror: function(r) {
                        a.data("download_width", "error");
                    },
                    ontimeout: function(r) {
                        a.data("download_width", "timeout");
                    },
                });
            }
        }
        getDownloadSize();
    }, 1500 + Math.floor(Math.random() * 2001));
}
