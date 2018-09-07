const Stream = function() {
    this.currentInterval = null;
    this.lastDeviationProcessed = null;
}

Stream.prototype.process = function(callback, interval = 2500) {
    if (!this.currentInterval) {
        this.currentInterval = setInterval(() => {
            let nextDevs = [];
            if (this.lastDeviationProcessed === null) {
                nextDevs = $(".torpedo-container span.thumb");
            }
            else {
                nextDevs = $(".torpedo-container span.last-processed ~ span.thumb");
            }
            if (nextDevs.length > 0) {
                console.log('Processing ' + nextDevs.length + ' deviations');
            }
            callback(nextDevs);
            if (nextDevs.length > 0) {
                $(this.lastDeviationProcessed).removeClass('last-processed');
                this.lastDeviationProcessed = nextDevs[nextDevs.length-1];
                $(this.lastDeviationProcessed).addClass("last-processed");
            }
        }, interval);
    } else {
        console.error('Already processing another stream!');
    }
}

Stream.prototype.clear = function() {
    if (this.currentInterval) {
        console.log('clear stream interval');
        clearInterval(this.currentInterval);
        this.currentInterval = null;
    } else {
        console.warn('Attempted to clear non-existent stream.');
    }
}

export default Stream