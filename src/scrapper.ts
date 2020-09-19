import * as config from "./config";
import "requestidlecallback-polyfill";
import { FacebookParser } from "@src/parsers";
import { Advertiser } from "@src/parsers/data";
import Messenger from "@src/messenger";

export default class Scrapper {
    messenger: Messenger;
    constructor() {
        this.scrapeData();
        this.messenger = new Messenger("Content");
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
            let data = el.innerText;
            let chunks = data.split("\n");
            for (let chunk of chunks) {
                let response = JSON.parse(chunk);
                let parsedObj = FacebookParser.parse(response);
                // verify if the parsed object is an Advertiser
                console.log(parsedObj);
                if (parsedObj instanceof Advertiser) {
                    // send the parsed data to the background script
                    this.messenger.sendNewAdvertiserData(parsedObj);
                }
            }
            // remove after processing
            this.removeResponseBlock(el);
        }
    }

    removeResponseBlock(el: HTMLDivElement) {
        // cross browser function to remove a DIV element
        try {
            el.remove();
        } catch {
            el.parentNode?.removeChild(el);
        }
    }
}
