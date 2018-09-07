import DeviationUtils from '../DeviationUtils';
import Downloader from '../Downloader';
import config from '../../config/config';

const DeviationPage = function() {
    this.downloader = new Downloader();
}

DeviationPage.prototype.load = function() {
    new Promise(function(resolve, reject) {
        setTimeout(reject, 10000);
        let interval = setInterval(() => {
            let dlButton = $(".dev-page-download");
            if (dlButton.length > 0) {
                clearInterval(interval);
                resolve(dlButton);
            }
        }, 200)
    }).then(button => addDownloadSizeNote(button));

    this.downloader.bindKeys([
        {
            method: this.downloader.saveDeviation,
            keys: config.keyBindings.download
        },
        {
            method: this.downloader.openInNewTab,
            keys: config.keyBindings.newTab
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
