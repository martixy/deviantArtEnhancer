import Stream from '../Stream'
import config from '../../config/config'

const GalleryPage = function() {
    this.stream = new Stream();
}

GalleryPage.prototype.load = function() {
    let self = this;
    this.stream.process(deviations => {
        deviations.each(function() {
            $(this).on('click', function(ev) {
                if (event.shiftKey) { //Opens up x deviations in new tabs, starting with the clicked one.
                    ev.preventDefault();
                    let siblings = $(this).nextAll(`:lt(${config.shiftClickTabs-1})`).addBack();
                    siblings.reverse().each(function() {
                        GM_openInTab($(this).find('>a').attr('href'), {active: false, insert: true, setParent: true});
                    })
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

