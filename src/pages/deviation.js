import DeviationUtils from '../DeviationUtils';
import Downloader from '../Downloader';
import config from '../../config/config';

const DeviationPage = function() {
    this.downloader = new Downloader();
    this.sizeNoteAbort;
}

DeviationPage.prototype.load = function() {
    let self = this;

    // TODO: There is still some random race condition somewhere that puts the note twice on the same button. I have no idea what and how...
    this.sizeNoteAbort = new AbortController();
    let abortSig = this.sizeNoteAbort.signal;
    new Promise(function(resolve, reject) {
        let resolved = false;
        setTimeout(reject, 20000);
        let interval = setInterval(() => {
            let dlButton = $(".dev-page-download");
            if (dlButton.length > 0) {
                const regURL = /.*-(\d*)/;
                const regDL = /.*\/download\/(\d*)/;
                let id1 = window.location.href.match(regURL)[1];
                let id2 = dlButton.attr('href').match(regDL)[1];
                if (id1 !== id2) return; //Check if we have the right element, because of a race condition between my code and dA's js.
                clearInterval(interval);
                resolve(dlButton);
                resolved = true;
            }
        }, 200)
        abortSig.onabort = () => {
            if (!resolved) {
                clearInterval(interval);
                reject()
            }
        }
    }).then(button => addDownloadSizeNote(button));

    let isAutoDownload = window.localStorage.getItem('dae_downloadOnReload') === window.location.href;
    if (isAutoDownload) {
        window.localStorage.removeItem('dae_downloadOnReload');
        self.downloader.saveDeviation();
    }

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
    this.sizeNoteAbort.abort();
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
