import DeviationUtils from '../DeviationUtils';
import Downloader from '../Downloader';
import config from '../../config/config';

const DeviationPage = function() {
    this.downloader = new Downloader();
}

DeviationPage.prototype.load = function() {
    addDownloadSizeNote();

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
function addDownloadSizeNote() {
    let dlButton = $(".dev-page-download");
    if (dlButton.length > 0) {
        const size = DeviationUtils.getImageDimensions();
        if (size) {
            let str = ", ";
            if (size.total > 1e+6)
                str += (size.total/1e+6).toLocaleString("en-US", { maximumFractionDigits: 2 }) + " MPx";
            else
                str += (size.total/1e+6).toLocaleString("en-US") + " MPx";
            let el = dlButton.find(".text");
            el.text(el.text() + str);
        }
    }
}
