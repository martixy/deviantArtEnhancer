import Stream from '../Stream'
import config from '../../config/config'
import Downloader from '../Downloader';
import DeviationUtils from '../DeviationUtils';

const GalleryPage = function() {
    this.stream = new Stream();
    this.downloader = new Downloader();
}

GalleryPage.prototype.load = function() {
    let self = this;
    this.stream.process(deviations => {
        deviations.each(function() {
            $(this).on('click', function(ev) {
                if (hasModifiers(ev, 's', true)) { //Opens up x deviations in new tabs, starting with the clicked one.
                    ev.preventDefault();
                    let siblings = $(this).nextAll(`:lt(${config.shiftClickTabs-1})`).addBack();
                    siblings.reverse().each(function() {
                        GM_openInTab($(this).find('>a').attr('href'), {active: false, insert: true, setParent: true});
                    })
                }
                if (hasModifiers(ev, 'as', true)) {
                    ev.preventDefault();
                    let siblings = $(this).nextAll(`:lt(${config.shiftClickTabs-1})`).addBack();
                    siblings.each(function() {
                        downloadFromThumb(this, self.downloader);
                    })
                }
                if (hasModifiers(ev, 'a', true)) {
                    ev.preventDefault();
                    downloadFromThumb(this, self.downloader);
                }
            });

            //NOTE: This is a workaround for a stupid bug in chrome, where no events are dispatched when altKey is pressed.
            $(this).on('mousedown', function(ev) {
                if (ev.altKey) {
                    ev.preventDefault();
                }
            });
        });
    })
}

GalleryPage.prototype.unload = function() {
    this.stream.clear();
}

export default GalleryPage


//===========================================================================================================
//===========================================================================================================
function downloadFromThumb(deviation, downloader) {
    let el = $(deviation);
    const devURL = el.find('>a').attr('href');

    fetch(devURL, {credentials: 'include'}).then(async function(response) {
        let html = await response.text();
        let parser = new DOMParser();
        let doc = parser.parseFromString(html, "text/html");
        try {
            await downloader.saveDeviation(doc, true);
        } catch (err) {
            console.error(err);
            if (err.type === 'timeout') {
                alert(`Timeout (${err.error.timeout}) downloading\n"${err.error.name}"\n\n${err.error.url}`);
            }
        }
    })
}

function hasModifiers(event, modifiers, strict = false) {
    if (typeof event === 'string') {
        return [...modifiers].subsetOf([...event]) && (!strict || event.length === modifiers.length);
    } else {
        return hasModifiers(getModifiers(event), modifiers, strict);
    }
}

function getModifiers(event) {
    let modifiers = '';
    if (event.altKey) modifiers += 'a';
    if (event.ctrlKey) modifiers += 'c';
    if (event.metaKey) modifiers += 'm';
    if (event.shiftKey) modifiers += 's';
    return modifiers;
}
