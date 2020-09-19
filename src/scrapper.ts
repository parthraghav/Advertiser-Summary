import * as config from "./config";
import "requestidlecallback-polyfill";

export default class Scrapper {
    constructor() {
        this.scrapeData();
    }

    scrapeData() {
        // get all response objects
        let responseEls: any = document.getElementsByClassName(
            config.INTERCEPTED_RESPONSE_DOM_CLASSNAME,
        );
        // if no response objects, then defer the execution to next idle state,
        if (!config.SCRAPE_UNTIL_EXHAUSTED || !responseEls.length) {
            window.requestIdleCallback(this.scrapeData.bind(this), {
                timeout: config.SCRAPE_SNIFFER_RESPONSE_TIMEOUT,
            });
        }
        for (let el of responseEls) {
            console.log(el.innerText);
            // remove after processing
            this.removeResponseBlock(el);
            console.log(el.innerText);
        }
    }

    removeResponseBlock(el: HTMLDivElement) {
        // cross browser function to remove a DIV element
        try {
            el.remove();
            console.log("remove succeded");
        } catch {
            el.parentNode?.removeChild(el);
            console.log("remove failed");
        }
    }
}
