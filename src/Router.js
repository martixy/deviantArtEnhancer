import BrowsePage from "./pages/browse";
import DeviationPage from "./pages/deviation";
import GalleryPage from "./pages/gallery";


const Router = function() {
    this.currentPage;
    this.currentPageHandler;
    this.prevPage = null;

    this.routes = [
        {
            name: 'browse',
            test: () => ~window.location.href.indexOf("popular-") || window.location.pathname === "/",
            handler: BrowsePage
        },
        {
            name: 'deviation',
            test: () => ~window.location.href.indexOf("art/"),
            handler: DeviationPage
        },
        {
            name: 'gallery',
            test: () => ~window.location.href.indexOf("gallery/"),
            handler: GalleryPage
        }
    ]
    this.handlerRegistry = {};
}

Router.prototype.route = function() {
    this.currentPage = getPageWithoutQueryHash();
    if (this.prevPage !== this.currentPage) {
        // console.log("Unloading", this.prevPage);
        this.prevPage = this.currentPage;
        if (this.currentPageHandler) {
            this.currentPageHandler.unload();
            this.currentPageHandler = null;
        }
    }
    else return;


    for (let route of this.routes) {
        if (route.test()) {
            console.log(route.name);
            // console.log("Loading", this.currentPage);
            this.currentPageHandler = this.getCreatePageHandler(route);
            this.currentPageHandler.load();
            break;
        }
    }

    // console.log(window.location);
}

Router.prototype.getCreatePageHandler = function(route) {
    if (!this.handlerRegistry[route.name]) {
        this.handlerRegistry[route.name] = new route.handler();
    }
    return this.handlerRegistry[route.name];
}

export default Router

//===========================================================================================================
//===========================================================================================================

function getPageWithoutQueryHash() {
    return window.location.origin + window.location.pathname;
}