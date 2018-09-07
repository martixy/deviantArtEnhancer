import DeviationUtils from '../DeviationUtils';
import filterData from '../../config/filter';
import Stream from '../Stream'

const BrowsePage = function() {
    this.stream = new Stream();
    this.paywallFilter = createFilterMap(filterData.paywallFilter, 'artist');
    this.artistFilter = createFilterMap(filterData.artistFilter, 'artist');
}

BrowsePage.prototype.load = function() {
    let self = this;
    this.stream.process(deviations => {
        deviations.each(function() {
            filterPaywalledContent(this, self.paywallFilter);
            filterByArtist(this, self.artistFilter);
        });
    })
}

BrowsePage.prototype.unload = function() {
    this.stream.clear();
}

export default BrowsePage


//===========================================================================================================
//===========================================================================================================


function filterPaywalledContent(deviation, filterMap, options) {
    const defaultOptions = {
        filterOnlyNSFW: false,
        remove: false,
        fadeOpacity: 0.25
    };
    options = { ...defaultOptions, ...options };

    let username = $(deviation).find(".extra-info .username").text();
    if (filterMap.has(username) && (!options.filterOnlyNSFW || (options.filterOnlyNSFW && filterMap.get(username).nsfw))) {
        let entry = filterMap.get(username);
        if (entry.remove === 'undefined' ? options.remove : entry.remove) {
            $(deviation).hide();
        }
        else {
            DeviationUtils.overlayMessage(deviation, "Patreon Paywall artist", options.fadeOpacity);
        }
    }
}

function filterByArtist(deviation, filterMap, options) {
    const defaultOptions = {
        remove: false,
        fadeOpacity: 0.25,
        bgColor: 'peru'
    };
    options = { ...defaultOptions, ...options };

    let username = $(deviation).find(".extra-info .username").text();
    if (filterMap.has(username)) {
        let entry = filterMap.get(username);
        if (entry.remove === 'undefined' ? options.remove : entry.remove) {
            $(deviation).hide();
            console.log(`Removed '${deviation.dataset.superAlt}'${ `entry` in entry ? ` cuz ${entry.reason}`: `` }`);
        }
        else {
            DeviationUtils.overlayMessage(deviation, `Filtered ${ `reason` in entry ? `for ${entry.reason}` : `artist` }`, {opacity: options.fadeOpacity, bgColor: options.bgColor});
        }
    }
}

function createFilterMap(filters, key) {
    let map = new Map();

    for (let entry of filters) {
        map.set(entry[key], entry);
    }
    return map;
}