import DeviationUtils from '../DeviationUtils';
import Downloader from '../Downloader';
import config from '../../config/config';

const DeviationPage = function() {
    this.downloader = new Downloader();
}

DeviationPage.prototype.load = function() {
    new Promise(function(resolve, reject) {
        setTimeout(reject, 20000);
        let interval = setInterval(() => {
            let dlButton = $(".dev-page-download");
            if (dlButton.length > 0) {
                clearInterval(interval);
                resolve(dlButton);
            }
        }, 200)
    }).then(button => addDownloadSizeNote(button));

    let self = this;
    this.downloader.bindKeys([
        {
            keys: config.keyBindings.download,
            method(ev) {
                if (!$(":focus").hasClass("writer")) {
                    self.downloader.saveDeviation();
                }
            }
        },
        {
            keys: config.keyBindings.newTab,
            method(ev) {
                if (!$(":focus").hasClass("writer")) {
                    self.downloader.openInNewTab();
                }
            }
        }
    ]);
}


DeviationPage.prototype.unload = function() {
    this.downloader.unbindKeys();
}

export default DeviationPage


//===========================================================================================================
//===========================================================================================================
function addDownloadSizeNote(button) {
    const size = DeviationUtils.getImageDimensions();
    if (size) {
        let str = ", ";
        if (size.total > 1e+6)
            str += (size.total/1e+6).toLocaleString("en-US", { maximumFractionDigits: 2 }) + " MPx";
        else
            str += (size.total/1e+6).toLocaleString("en-US") + " MPx";
        let el = button.find(".text");
        el.text(el.text() + str);
    }
}
