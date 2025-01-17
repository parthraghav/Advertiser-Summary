// class name of div blocks where sniffed data is stored
const INTERCEPTED_RESPONSE_DOM_CLASSNAME = "__interceptedData";
// timeout for the idle callbacks
const SCRAPE_SNIFFER_RESPONSE_TIMEOUT = 10000;
// flag to scrape only until all div blocks are exhausted
const SCRAPE_UNTIL_EXHAUSTED = false;
// port name for connection between the content script and the background page
const PORT_NAME = "ad_summary_port";

export {
    INTERCEPTED_RESPONSE_DOM_CLASSNAME,
    SCRAPE_SNIFFER_RESPONSE_TIMEOUT,
    SCRAPE_UNTIL_EXHAUSTED,
    PORT_NAME,
};
